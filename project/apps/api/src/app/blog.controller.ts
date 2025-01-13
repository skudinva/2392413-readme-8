import { HttpService } from '@nestjs/axios';
import {
  Body,
  Controller,
  Delete,
  FileTypeValidator,
  Get,
  HttpCode,
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
import { RequestWithTokenPayload } from '@project/authentication';
import { CreatePostDto, UpdatePostDto, UserIdDto } from '@project/blog-post';
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
  public async createPost(
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

  @Post('/repost/:postId')
  @UseGuards(CheckAuthGuard)
  @UseInterceptors(InjectUserIdInterceptor)
  public async createRepost(
    @Param('postId') postId: string,
    @Body() dto: UserIdDto
  ) {
    const { data } = await this.httpService.axiosRef.post(
      `${ApplicationServiceURL.Blog}/repost/${postId}`,
      dto
    );

    await this.httpService.axiosRef.post(
      `${ApplicationServiceURL.Users}/incPostsCount`,
      dto.userId
    );

    return data;
  }

  @Patch('/:id')
  @UseGuards(CheckAuthGuard)
  @UseInterceptors(InjectUserIdInterceptor)
  public async updatePost(@Param('id') id: string, @Body() dto: UpdatePostDto) {
    const { data } = await this.httpService.axiosRef.patch(
      `${ApplicationServiceURL.Blog}/${id}`,
      dto
    );

    return data;
  }

  @Delete('/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(CheckAuthGuard)
  public async deletePost(
    @Param('id') id: string,
    @Req() req: RequestWithTokenPayload
  ) {
    const userId = req.user.sub;
    const { data } = await this.httpService.axiosRef.delete(
      `${ApplicationServiceURL.Blog}/${id}/${userId}`
    );

    await this.httpService.axiosRef.post(
      `${ApplicationServiceURL.Users}/decPostsCount`,
      userId
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

  @Post('/like/:postId')
  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(CheckAuthGuard)
  @UseInterceptors(InjectUserIdInterceptor)
  public async addLike(
    @Param('postId') postId: string,
    @Body() dto: UserIdDto
  ) {
    const { data } = await this.httpService.axiosRef.post(
      `${ApplicationServiceURL.Blog}/like/${postId}`,
      dto
    );

    return data;
  }

  @Post('/unlike/:postId')
  @UseGuards(CheckAuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  @UseInterceptors(InjectUserIdInterceptor)
  public async deleteLike(
    @Param('postId') postId: string,
    @Body() dto: UserIdDto
  ) {
    const { data } = await this.httpService.axiosRef.post(
      `${ApplicationServiceURL.Blog}/unlike/${postId}`,
      dto
    );

    return data;
  }
}
