import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { BlogLikeService } from '@project/blog-like';
import { BlogNotifyService } from '@project/blog-notify';
import { fillDto } from '@project/helpers';
import { SortDirection, SortType } from '@project/shared/core';
import { BlogPostResponse } from './blog-post.constant';
import { BlogPostQuery } from './blog-post.query';
import { BlogPostService } from './blog-post.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { UserIdDto } from './dto/user-id.dto';
import { BlogPostWithPaginationRdo } from './rdo/blog-post-with-pagination.rdo';
import { BlogPostRdo } from './rdo/blog-post.rdo';

@Controller('posts')
export class BlogPostController {
  constructor(
    private readonly blogPostService: BlogPostService,
    private readonly blogLikeService: BlogLikeService,
    private readonly notifyService: BlogNotifyService
  ) {}

  @Get('/:id/:userId')
  @ApiResponse({
    type: BlogPostRdo,
    status: HttpStatus.OK,
    description: BlogPostResponse.PostFound,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: BlogPostResponse.PostNotFound,
  })
  @ApiTags('blog post')
  public async show(@Param('id') id: string, @Param('userId') userId: string) {
    const post = await this.blogPostService.getPost(id, userId);
    return fillDto(BlogPostRdo, post.toPOJO());
  }

  @Get('/')
  @ApiResponse({
    type: BlogPostWithPaginationRdo,
    status: HttpStatus.OK,
    description: BlogPostResponse.PostsFound,
  })
  @ApiTags('blog post')
  public async index(@Query() query: BlogPostQuery) {
    const postsWithPagination = await this.blogPostService.getPosts(query);
    const result = {
      ...postsWithPagination,
      entities: postsWithPagination.entities.map((post) => post.toPOJO()),
    };
    return fillDto(BlogPostWithPaginationRdo, result);
  }

  @ApiResponse({
    type: BlogPostRdo,
    status: HttpStatus.CREATED,
    description: BlogPostResponse.PostCreated,
  })
  @Post('/')
  @ApiTags('blog post')
  public async create(@Body() dto: CreatePostDto) {
    const newPost = await this.blogPostService.createPost(dto);
    return fillDto(BlogPostRdo, newPost.toPOJO());
  }

  @ApiResponse({
    type: BlogPostRdo,
    status: HttpStatus.CREATED,
    description: BlogPostResponse.PostCreated,
  })
  @Post('/repost/:postId')
  @ApiTags('blog post')
  public async createRepost(
    @Param('postId') postId: string,
    @Body() { userId }: UserIdDto
  ) {
    const newPost = await this.blogPostService.createRepost(postId, userId);

    return fillDto(BlogPostRdo, newPost.toPOJO());
  }

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
  @Delete('/:postId/:userId')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiTags('blog post')
  public async destroy(
    @Param('postId') postId: string,
    @Param('userId') userId: string
  ) {
    await this.blogPostService.deletePost(postId, userId);
  }

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
  @Patch('/:id')
  @ApiTags('blog post')
  public async update(@Param('id') id: string, @Body() dto: UpdatePostDto) {
    const updatedPost = await this.blogPostService.updatePost(id, dto);
    return fillDto(BlogPostRdo, updatedPost.toPOJO());
  }

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
  @Post('like/:postId')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiTags('blog like')
  public async addLike(
    @Param('postId') postId: string,
    @Body() { userId }: UserIdDto
  ) {
    await this.blogLikeService.like({ postId, userId });
    await this.blogPostService.updateCommentCount(postId, 1);
  }

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
  @Post('unlike/:postId')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiTags('blog like')
  public async deleteLike(
    @Param('postId') postId: string,
    @Body() { userId }: UserIdDto
  ) {
    await this.blogLikeService.unlike({ postId, userId });
    await this.blogPostService.updateCommentCount(postId, -1);
  }

  @Post('sendNewPostNotify')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiTags('blog post')
  public async sendNewPostNotify(@Body() dto: UserIdDto) {
    const query = new BlogPostQuery();
    query.userId = dto.userId;
    query.sortBy = SortType.DATE;
    query.sortDirection = SortDirection.Desc;
    const { entities } = await this.blogPostService.getPosts(query);

    this.notifyService.sendNewPostNotify(
      entities.map((post) => post.toPOJO()),
      dto.userId
    );
  }
}
