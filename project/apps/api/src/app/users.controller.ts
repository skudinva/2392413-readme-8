import { HttpService } from '@nestjs/axios';
import {
  Body,
  Controller,
  FileTypeValidator,
  Get,
  MaxFileSizeValidator,
  Param,
  ParseFilePipe,
  Patch,
  Post,
  Req,
  UploadedFile,
  UseFilters,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiConsumes, ApiTags } from '@nestjs/swagger';
import {
  CreateUserDto,
  LoginUserDto,
  RegisterUserDto,
  UpdateUserDto,
} from '@project/authentication';
import { createUrlForFile } from '@project/helpers';
import { File } from '@project/shared/core';
import FormData from 'form-data';
import 'multer';
import { ApplicationServiceURL } from './app.config';
import { AxiosExceptionFilter } from './filters/axios-exception.filter';

const DEFAULT_AVATAR_PATH = `${ApplicationServiceURL.File}/static/default-avatar.jpg`;

@Controller('users')
@UseFilters(AxiosExceptionFilter)
@ApiTags('User API')
export class UsersController {
  constructor(private readonly httpService: HttpService) {}

  @Post('register')
  @UseInterceptors(FileInterceptor('avatar'))
  @ApiConsumes('multipart/form-data')
  public async create(
    @Body() dto: RegisterUserDto,
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
    const newUserDto: CreateUserDto = {
      name: dto.name,
      avatar: DEFAULT_AVATAR_PATH,
      email: dto.email,
      password: dto.password,
    };

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
      newUserDto.avatar = createUrlForFile(
        fileMetaData,
        ApplicationServiceURL.File
      );
    }

    const { data } = await this.httpService.axiosRef.post(
      `${ApplicationServiceURL.Users}/register`,
      newUserDto
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

  @Get(':id')
  public async show(@Param('id') id: string, @Req() req: Request) {
    const { data } = await this.httpService.axiosRef.get(
      `${ApplicationServiceURL.Users}/${id}`,
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
