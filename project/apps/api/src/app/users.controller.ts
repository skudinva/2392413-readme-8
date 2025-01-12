import { HttpService } from '@nestjs/axios';
import {
  Body,
  Controller,
  FileTypeValidator,
  MaxFileSizeValidator,
  ParseFilePipe,
  Patch,
  Post,
  Req,
  UploadedFile,
  UseFilters,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  CreateUserDto,
  LoginUserDto,
  UpdateUserDto,
} from '@project/authentication';
import { createUrlForFile } from '@project/helpers';
import { File } from '@project/shared/core';
import FormData from 'form-data';
import { ApplicationServiceURL } from './app.config';
import { AxiosExceptionFilter } from './filters/axios-exception.filter';

const DEFAULT_AVATAR_PATH = `${ApplicationServiceURL.File}/static/default-avatar.jpg`;

@Controller('users')
@UseFilters(AxiosExceptionFilter)
export class UsersController {
  constructor(private readonly httpService: HttpService) {}

  @Post('register')
  @UseInterceptors(FileInterceptor('avatar'))
  public async create(
    @Body() dto: CreateUserDto,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 500000 }),
          new FileTypeValidator({ fileType: '.(jpg|jpeg|png)' }),
        ],
        fileIsRequired: false,
      })
    )
    avatar?: Express.Multer.File
  ) {
    dto.avatar = DEFAULT_AVATAR_PATH;

    if (avatar) {
      const formData = new FormData();
      formData.append('file', new Blob([avatar.buffer]), avatar.originalname);
      const { data: fileMetaData } = await this.httpService.axiosRef.post<File>(
        `${ApplicationServiceURL.File}/api/files/upload`,
        formData,
        {
          headers: formData.getHeaders(),
        }
      );
      dto.avatar = createUrlForFile(fileMetaData, ApplicationServiceURL.File);
    }

    const { data } = await this.httpService.axiosRef.post(
      `${ApplicationServiceURL.Users}/register`,
      dto
    );

    return data;
  }

  @Post('login')
  public async login(@Body() loginUserDto: LoginUserDto) {
    const { data } = await this.httpService.axiosRef.post(
      `${ApplicationServiceURL.Users}/login`,
      loginUserDto
    );
    return data;
  }

  @Patch('update')
  public async update(@Body() dto: UpdateUserDto, @Req() req: Request) {
    const { data } = await this.httpService.axiosRef.patch(
      `${ApplicationServiceURL.Users}/update`,
      dto,
      {
        headers: {
          Authorization: req.headers['authorization'],
        },
      }
    );

    return data;
  }

  @Post('refresh')
  public async refreshToken(@Req() req: Request) {
    const { data } = await this.httpService.axiosRef.post(
      `${ApplicationServiceURL.Users}/refresh`,
      null,
      {
        headers: {
          Authorization: req.headers['authorization'],
        },
      }
    );

    return data;
  }
}
