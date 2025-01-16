import { HttpService } from '@nestjs/axios';
import {
  Body,
  Controller,
  FileTypeValidator,
  Get,
  HttpStatus,
  MaxFileSizeValidator,
  Param,
  ParseFilePipe,
  Patch,
  Post,
  Req,
  UploadedFile,
  UseFilters,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiBearerAuth,
  ApiConsumes,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import {
  AuthenticationResponseMessage,
  CreateUserDto,
  LoggedUserRdo,
  LoginUserDto,
  RegisterUserDto,
  UpdateUserDto,
  UserRdo,
} from '@project/authentication';
import { FieldValidate, SERVE_ROOT } from '@project/shared/core';
import { plainToInstance } from 'class-transformer';
import 'multer';
import { ApiSection, ApplicationServiceURL } from './app.config';
import { AppService } from './app.service';
import { AxiosExceptionFilter } from './filters/axios-exception.filter';
import { CheckAuthGuard } from './guards/check-auth.guard';

const DEFAULT_AVATAR_PATH = `${ApplicationServiceURL.File}/${SERVE_ROOT}/default-avatar.jpg`;

@Controller('users')
@UseFilters(AxiosExceptionFilter)
@ApiTags(ApiSection.User)
export class UsersController {
  constructor(
    private readonly httpService: HttpService,
    private readonly appService: AppService
  ) {}

  @Post('register')
  @UseInterceptors(FileInterceptor('avatar'))
  @ApiConsumes('multipart/form-data')
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: AuthenticationResponseMessage.UserCreated,
  })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: AuthenticationResponseMessage.UserExist,
  })
  public async create(
    @Body() dto: RegisterUserDto,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({
            maxSize: FieldValidate.MaxFileSizeForAvatar,
          }),
          new FileTypeValidator({
            fileType: FieldValidate.AllowedImageFileType,
          }),
        ],
        fileIsRequired: false,
      })
    )
    avatar?: Express.Multer.File
  ) {
    const newUserDto = plainToInstance(CreateUserDto, {
      name: dto.name,
      avatar: DEFAULT_AVATAR_PATH,
      email: dto.email,
      password: dto.password,
    });

    if (avatar) {
      newUserDto.avatar = await this.appService.uploadFile(avatar);
    }

    const { data } = await this.httpService.axiosRef.post(
      `${ApplicationServiceURL.Auth}/register`,
      newUserDto
    );

    return data;
  }

  @Post('login')
  @ApiResponse({
    type: LoggedUserRdo,
    status: HttpStatus.OK,
    description: AuthenticationResponseMessage.LoggedSuccess,
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: AuthenticationResponseMessage.LoggedError,
  })
  public async login(@Body() loginUserDto: LoginUserDto) {
    const { data } = await this.httpService.axiosRef.post(
      `${ApplicationServiceURL.Auth}/login`,
      loginUserDto
    );
    return data;
  }

  @Patch('update')
  @ApiResponse({
    status: HttpStatus.OK,
    description: AuthenticationResponseMessage.PasswordUpdated,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: AuthenticationResponseMessage.UserNotFound,
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: AuthenticationResponseMessage.Unauthorized,
  })
  @UseGuards(CheckAuthGuard)
  @ApiBearerAuth('accessToken')
  public async update(@Body() dto: UpdateUserDto, @Req() req: Request) {
    const { data } = await this.httpService.axiosRef.patch(
      `${ApplicationServiceURL.Auth}/update`,
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
  @UseGuards(CheckAuthGuard)
  @ApiBearerAuth('accessToken')
  @ApiResponse({
    type: UserRdo,
    status: HttpStatus.OK,
    description: AuthenticationResponseMessage.UserFound,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: AuthenticationResponseMessage.UserNotFound,
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: AuthenticationResponseMessage.Unauthorized,
  })
  public async show(@Param('id') id: string, @Req() req: Request) {
    const { data } = await this.httpService.axiosRef.get(
      `${ApplicationServiceURL.Auth}/${id}`,
      {
        headers: {
          Authorization: req.headers['authorization'],
        },
      }
    );

    return data;
  }

  @Post('refresh')
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Get a new access/refresh tokens',
  })
  @ApiBearerAuth('refreshToken')
  public async refreshToken(@Req() req: Request) {
    const { data } = await this.httpService.axiosRef.post(
      `${ApplicationServiceURL.Auth}/refresh`,
      null,
      {
        headers: {
          Authorization: req.headers['authorization'],
        },
      }
    );

    return data;
  }

  @UseGuards(CheckAuthGuard)
  @ApiBearerAuth('accessToken')
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: AuthenticationResponseMessage.UserFound,
  })
  @Post('check')
  public async checkToken(@Req() req: Request) {
    const { data } = await this.httpService.axiosRef.post(
      `${ApplicationServiceURL.Auth}/check`,
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
