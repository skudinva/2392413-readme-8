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
import { PostType } from '@prisma/client';
import {
  RequestWithTokenPayload,
  RequestWithTokenPayloadUrl,
} from '@project/authentication';
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
  CreatePostDto,
  CreatePostFileDto,
  UpdatePostDto,
  UpdatePostFileDto,
  UserIdDto,
} from '@project/blog-post';
import { InjectUserIdInterceptor } from '@project/interceptors';
import { FieldValidate, SortDirection, SortType } from '@project/shared/core';
import { plainToInstance } from 'class-transformer';
import 'multer';
import * as url from 'node:url';
import { ApiSection, ApplicationServiceURL } from './app.config';
import { AppService } from './app.service';
import { AxiosExceptionFilter } from './filters/axios-exception.filter';
import { CheckAuthForceGuard } from './guards/check-auth-force.guard';
import { CheckAuthGuard } from './guards/check-auth.guard';

@Controller('blog')
@UseFilters(AxiosExceptionFilter)
export class BlogController {
  constructor(
    private readonly httpService: HttpService,
    private readonly appService: AppService
  ) {}

  @UseGuards(CheckAuthGuard)
  @ApiBearerAuth('accessToken')
  @UseInterceptors(UseInterceptors)
  @UseInterceptors(InjectUserIdInterceptor)
  @UseInterceptors(FileInterceptor('file'))
  @ApiConsumes('multipart/form-data')
  @ApiResponse({
    type: BlogPostRdo,
    status: HttpStatus.CREATED,
    description: BlogPostResponse.PostFound,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: BlogPostResponse.PostNotFound,
  })
  @Post('/')
  @ApiTags(ApiSection.Post)
  public async createPost(
    @Body() dto: CreatePostFileDto,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({
            maxSize: FieldValidate.MaxFileSizeForPost,
          }),
          new FileTypeValidator({
            fileType: FieldValidate.AllowedImageFileType,
          }),
        ],
        fileIsRequired: false,
      })
    )
    file?: Express.Multer.File
  ) {
    const postDto = plainToInstance(
      CreatePostDto,
      JSON.parse(String(dto.post))
    );

    if (file) {
      postDto.extraProperty.photo = await this.appService.uploadFile(file);
    }

    const { data } = await this.httpService.axiosRef.post(
      `${ApplicationServiceURL.Blog}/`,
      postDto
    );

    await this.httpService.axiosRef.post(
      `${ApplicationServiceURL.Users}/incPostsCount`,
      { userId: postDto.userId }
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
  @ApiTags(ApiSection.Post)
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
      { userId: dto.userId }
    );

    return data;
  }

  @Patch('/:id')
  @ApiResponse({
    type: BlogPostRdo,
    status: HttpStatus.OK,
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
  @UseInterceptors(UseInterceptors)
  @UseInterceptors(InjectUserIdInterceptor)
  @UseInterceptors(FileInterceptor('file'))
  @ApiConsumes('multipart/form-data')
  @ApiTags(ApiSection.Post)
  public async updatePost(
    @Param('id') id: string,
    @Body() dto: UpdatePostFileDto,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({
            maxSize: FieldValidate.MaxFileSizeForPost,
          }),
          new FileTypeValidator({
            fileType: FieldValidate.AllowedImageFileType,
          }),
        ],
        fileIsRequired: false,
      })
    )
    file?: Express.Multer.File
  ) {
    const postDto = plainToInstance(
      UpdatePostDto,
      JSON.parse(String(dto.post))
    );

    if (file) {
      postDto.extraProperty.photo = await this.appService.uploadFile(file);
    }

    const { data } = await this.httpService.axiosRef.patch(
      `${ApplicationServiceURL.Blog}/${id}`,
      postDto
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
  @ApiTags(ApiSection.Post)
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
      { userId }
    );
    return data;
  }

  @ApiResponse({
    type: BlogPostWithPaginationRdo,
    status: HttpStatus.OK,
    description: BlogPostResponse.PostsFound,
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
    example: 1,
    description: 'Page number',
  })
  @ApiQuery({
    name: 'search',
    required: false,
    type: String,
    description: 'Search term',
  })
  @ApiQuery({
    name: 'postUserId',
    required: false,
    type: String,
    example: '677cd8d75ff92067f1de5911',
    description: 'Author id of the post',
  })
  @ApiQuery({
    name: 'postType',
    required: false,
    enum: PostType,
    description: 'Post type',
  })
  @Get('/')
  @ApiBearerAuth('accessToken')
  @UseGuards(CheckAuthForceGuard)
  @ApiTags(ApiSection.Post)
  public async getPosts(@Req() req: RequestWithTokenPayloadUrl) {
    const userId = req.user?.sub;
    const requestUrl = userId ? `${req.url}&userId=${userId}` : req.url;
    const query = url.parse(requestUrl).query;

    const { data } =
      await this.httpService.axiosRef.get<BlogPostWithPaginationRdo>(
        `${ApplicationServiceURL.Blog}?${query}`
      );
    await this.appService.appendUserInfo(data.entities);
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
  @ApiBearerAuth('accessToken')
  @UseGuards(CheckAuthForceGuard)
  @Get('/:id')
  @ApiTags(ApiSection.Post)
  public async getPost(
    @Param('id') id: string,
    @Req() req: RequestWithTokenPayload
  ) {
    const userId = req.user?.sub;
    const { data } = await this.httpService.axiosRef.get<BlogPostRdo>(
      `${ApplicationServiceURL.Blog}/${id}/${userId}`
    );
    await this.appService.appendUserInfo([data]);

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
  @ApiTags(ApiSection.Like)
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
  @ApiTags(ApiSection.Like)
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
    example: 1,
  })
  @Get('/comments/:postId')
  @ApiTags(ApiSection.Comment)
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
  @ApiTags(ApiSection.Comment)
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
  @ApiTags(ApiSection.Comment)
  public async delete(
    @Param('commentId') commentId: string,
    @Req() req: RequestWithTokenPayload
  ) {
    const userId = req.user.sub;
    const { data } = await this.httpService.axiosRef.delete(
      `${ApplicationServiceURL.Comments}/${commentId}/${userId}`
    );

    return data;
  }

  @Post('/sendNewPostNotify')
  @UseGuards(CheckAuthGuard)
  @UseInterceptors(InjectUserIdInterceptor)
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiBearerAuth('accessToken')
  @ApiTags(ApiSection.Post)
  public async sendNewPostNotify(@Body() dto: UserIdDto) {
    await this.httpService.axiosRef.post(
      `${ApplicationServiceURL.Blog}/sendNewPostNotify`,
      dto
    );
  }
}
