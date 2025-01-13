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
import {
  ApiBearerAuth,
  ApiConsumes,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { RequestWithTokenPayload } from '@project/authentication';
import {
  BlogCommentRdo,
  BlogCommentResponse,
  BlogCommentWithPaginationRdo,
  CreateCommentDto,
} from '@project/blog-comment';
import {
  BlogPostRdo,
  BlogPostResponse,
  BlogPostWithPaginationRdo,
  CreatePostFileDto,
  UpdatePostDto,
  UserIdDto,
} from '@project/blog-post';
import { createUrlForFile } from '@project/helpers';
import { InjectUserIdInterceptor } from '@project/interceptors';
import { File, SortDirection, SortType } from '@project/shared/core';
import FormData from 'form-data';
import 'multer';
import * as url from 'node:url';
import { ApplicationServiceURL } from './app.config';
import { AxiosExceptionFilter } from './filters/axios-exception.filter';
import { CheckAuthGuard } from './guards/check-auth.guard';

@Controller('blog')
@UseFilters(AxiosExceptionFilter)
@ApiTags('Blog API')
export class BlogController {
  constructor(private readonly httpService: HttpService) {}

  @UseGuards(CheckAuthGuard)
  @ApiBearerAuth('accessToken')
  @UseInterceptors(UseInterceptors)
  @UseInterceptors(InjectUserIdInterceptor)
  @UseInterceptors(FileInterceptor('file'))
  @ApiConsumes('multipart/form-data')
  @ApiResponse({
    type: BlogPostRdo,
    status: HttpStatus.OK,
    description: BlogPostResponse.PostFound,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: BlogPostResponse.PostNotFound,
  })
  @Post('/')
  public async createPost(
    @Body() dto: CreatePostFileDto,
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
  @ApiBearerAuth('accessToken')
  @UseInterceptors(InjectUserIdInterceptor)
  @ApiResponse({
    type: BlogPostRdo,
    status: HttpStatus.CREATED,
    description: BlogPostResponse.PostCreated,
  })
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
  @ApiResponse({
    type: BlogPostRdo,
    status: HttpStatus.ACCEPTED,
    description: BlogPostResponse.PostUpdated,
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: BlogPostResponse.Unauthorized,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: BlogPostResponse.PostNotFound,
  })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: BlogPostResponse.AccessDeny,
  })
  @UseGuards(CheckAuthGuard)
  @ApiBearerAuth('accessToken')
  @UseInterceptors(InjectUserIdInterceptor)
  ///////////////////////////////
  public async updatePost(@Param('id') id: string, @Body() dto: UpdatePostDto) {
    const { data } = await this.httpService.axiosRef.patch(
      `${ApplicationServiceURL.Blog}/${id}`,
      dto
    );

    return data;
  }

  @Delete('/:id')
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: BlogPostResponse.PostDeleted,
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: BlogPostResponse.Unauthorized,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: BlogPostResponse.PostNotFound,
  })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: BlogPostResponse.AccessDeny,
  })
  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(CheckAuthGuard)
  @ApiBearerAuth('accessToken')
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

  @ApiResponse({
    type: BlogPostWithPaginationRdo,
    status: HttpStatus.OK,
    description: BlogPostResponse.PostsFound,
  })
  @ApiQuery({
    name: 'limit',
    required: true,
    type: Number,
    description: 'Limit post count',
  })
  @ApiQuery({
    name: 'tags',
    required: false,
    type: [String],
    description: 'Tags',
  })
  @ApiQuery({
    name: 'sortDirection',
    required: true,
    enum: SortDirection,
    description: 'Sort direction',
  })
  @ApiQuery({
    name: 'sortBy',
    required: true,
    enum: SortType,
    description: 'Sort by',
  })
  @ApiQuery({
    name: 'page',
    required: true,
    type: Number,
    description: 'Page number',
  })
  @ApiQuery({
    name: 'search',
    required: false,
    type: String,
    description: 'Search term',
  })
  @Get('/')
  public async getPosts(@Req() req: Request) {
    const { data } = await this.httpService.axiosRef.get(
      `${ApplicationServiceURL.Blog}?${url.parse(req.url).query}`
    );

    return data;
  }

  @ApiResponse({
    type: BlogPostRdo,
    status: HttpStatus.OK,
    description: BlogPostResponse.PostFound,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: BlogPostResponse.PostNotFound,
  })
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
  @ApiBearerAuth('accessToken')
  @UseInterceptors(InjectUserIdInterceptor)
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: BlogPostResponse.Like,
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: BlogPostResponse.Unauthorized,
  })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: BlogPostResponse.LikeAlreadyExists,
  })
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
  @ApiBearerAuth('accessToken')
  @HttpCode(HttpStatus.NO_CONTENT)
  @UseInterceptors(InjectUserIdInterceptor)
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: BlogPostResponse.UnLike,
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: BlogPostResponse.Unauthorized,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: BlogPostResponse.LikeNotExists,
  })
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

  @ApiResponse({
    type: BlogCommentWithPaginationRdo,
    status: HttpStatus.OK,
    description: BlogCommentResponse.CommentsFound,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: BlogCommentResponse.PostNotFound,
  })
  @ApiQuery({
    name: 'limit',
    required: true,
    type: Number,
    description: 'Limit comment count',
  })
  @ApiQuery({
    name: 'sortDirection',
    required: true,
    enum: SortDirection,
    description: 'Sort direction',
  })
  @ApiQuery({
    name: 'page',
    required: true,
    type: Number,
    description: 'Page number',
  })
  @Get('/comments/:postId')
  public async show(@Param('postId') postId: string, @Req() req: Request) {
    const { data } = await this.httpService.axiosRef.get(
      `${ApplicationServiceURL.Comments}/${postId}?${url.parse(req.url).query}`
    );

    return data;
  }

  @Post('/comments/:postId')
  @UseGuards(CheckAuthGuard)
  @ApiBearerAuth('accessToken')
  @UseInterceptors(InjectUserIdInterceptor)
  @ApiResponse({
    type: BlogCommentRdo,
    status: HttpStatus.CREATED,
    description: BlogCommentResponse.CommentCreated,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: BlogCommentResponse.PostNotFound,
  })
  public async create(
    @Param('postId') postId: string,
    @Body() dto: CreateCommentDto
  ) {
    const { data } = await this.httpService.axiosRef.post(
      `${ApplicationServiceURL.Comments}/${postId}`,
      dto
    );

    return data;
  }

  @Delete('/comments/:commentId')
  @UseGuards(CheckAuthGuard)
  @ApiBearerAuth('accessToken')
  @UseInterceptors(InjectUserIdInterceptor)
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: BlogCommentResponse.CommentDeleted,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: BlogCommentResponse.CommentNotFound,
  })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: BlogCommentResponse.NotAllowed,
  })
  public async delete(@Param('commentId') commentId: string) {
    const { data } = await this.httpService.axiosRef.delete(
      `${ApplicationServiceURL.Comments}/${commentId}`
    );

    return data;
  }
}
