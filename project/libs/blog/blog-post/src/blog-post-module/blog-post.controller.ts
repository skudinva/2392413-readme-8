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
import { ApiResponse } from '@nestjs/swagger';
import { BlogLikeService } from '@project/blog-like';
import { fillDto } from '@project/helpers';
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
    private readonly blogLikeService: BlogLikeService
  ) {}

  @Get('/:id')
  public async show(@Param('id') id: string) {
    const post = await this.blogPostService.getPost(id);
    return fillDto(BlogPostRdo, post.toPOJO());
  }

  @Get('/')
  public async index(@Query() query: BlogPostQuery) {
    const postsWithPagination = await this.blogPostService.getPosts(query);
    const result = {
      ...postsWithPagination,
      entities: postsWithPagination.entities.map((post) => post.toPOJO()),
    };
    return fillDto(BlogPostWithPaginationRdo, result);
  }

  @Post('/')
  public async create(@Body() dto: CreatePostDto) {
    const newPost = await this.blogPostService.createPost(dto);
    return fillDto(BlogPostRdo, newPost.toPOJO());
  }

  @Delete('/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  public async destroy(@Param('id') id: string) {
    await this.blogPostService.deletePost(id);
  }

  @Patch('/:id')
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
  @Post('addLike/:postId')
  @HttpCode(HttpStatus.NO_CONTENT)
  public async saveLike(
    @Param('postId') postId: string,
    @Body() { userId }: UserIdDto
  ) {
    await this.blogLikeService.like({ postId, userId });
  }

  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: BlogPostResponse.UnLike,
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: BlogPostResponse.Unauthorized,
  })
  @Post('removeLike/:postId')
  @HttpCode(HttpStatus.NO_CONTENT)
  public async deleteLike(
    @Param('postId') postId: string,
    @Body() { userId }: UserIdDto
  ) {
    await this.blogLikeService.unlike({ postId, userId });
  }
}
