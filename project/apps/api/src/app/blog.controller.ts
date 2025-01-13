import { HttpService } from '@nestjs/axios';
import {
  Body,
  Controller,
  FileTypeValidator,
  Get,
  MaxFileSizeValidator,
  Param,
  ParseFilePipe,
  Post,
  Req,
  UploadedFile,
  UseFilters,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { CreatePostDto } from '@project/blog-post';
import { createUrlForFile } from '@project/helpers';
import { InjectUserIdInterceptor } from '@project/interceptors';
import { File } from '@project/shared/core';
import FormData from 'form-data';
import 'multer';
import * as url from 'node:url';
import { ApplicationServiceURL } from './app.config';
import { AxiosExceptionFilter } from './filters/axios-exception.filter';
import { CheckAuthGuard } from './guards/check-auth.guard';

@Controller('blog')
@UseFilters(AxiosExceptionFilter)
export class BlogController {
  constructor(private readonly httpService: HttpService) {}

  @UseGuards(CheckAuthGuard)
  @UseInterceptors(UseInterceptors)
  @UseInterceptors(InjectUserIdInterceptor)
  @UseInterceptors(FileInterceptor('file'))
  @Post('/')
  public async create(
    @Body() dto: CreatePostDto,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 1000000 }),
          new FileTypeValidator({ fileType: '.(png|jpeg|jpg)' }),
        ],
        fileIsRequired: false,
      })
    )
    file?: Express.Multer.File
  ) {
    if (file) {
      const formData = new FormData();
      formData.append('file', new Blob([file.buffer]), file.originalname);
      const { data: fileMetaData } = await this.httpService.axiosRef.post<File>(
        `${ApplicationServiceURL.File}/api/files/upload`,
        formData,
        {
          headers: formData.getHeaders(),
        }
      );
      dto.extraProperty.photo = createUrlForFile(
        fileMetaData,
        ApplicationServiceURL.File
      );
    }

    const { data } = await this.httpService.axiosRef.post(
      `${ApplicationServiceURL.Blog}/`,
      dto
    );
    await this.httpService.axiosRef.post(
      `${ApplicationServiceURL.Users}/incPostsCount`,
      dto.authorId
    );
    return data;
  }

  @Get('/')
  public async getPosts(@Req() req: Request) {
    const { data } = await this.httpService.axiosRef.get(
      `${ApplicationServiceURL.Blog}?${url.parse(req.url).query}`
    );

    return data;
  }

  @Get('/:id')
  public async getPost(@Param('id') id: string) {
    const { data } = await this.httpService.axiosRef.get(
      `${ApplicationServiceURL.Blog}/${id}`
    );

    return data;
  }
}
