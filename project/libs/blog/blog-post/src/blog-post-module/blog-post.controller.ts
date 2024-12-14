import { Body, Controller, HttpStatus, Post } from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';
import { fillDto } from '@project/helpers';
import { CreatePostDto } from '../dto/create-post.dto';
import { BlogPostRdo } from '../rdo/blog-post.rdo';
import { BlogPostResponse } from './blog-post.constant';
import { BlogPostService } from './blog-post.service';

@Controller('blog-post-controller')
export class BlogPostController {
  constructor(private readonly blogPostService: BlogPostService) {}

  @ApiResponse({
    type: BlogPostRdo,
    status: HttpStatus.CREATED,
    description: BlogPostResponse.PostCreated,
  })
  @Post('/')
  public async create(@Body() dto: CreatePostDto) {
    const newPost = await this.blogPostService.create(dto);
    return fillDto(BlogPostRdo, newPost.toPOJO());
  }
}
