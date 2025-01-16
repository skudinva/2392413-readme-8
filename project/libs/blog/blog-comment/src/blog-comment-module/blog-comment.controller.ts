import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { fillDto } from '@project/helpers';
import { BlogCommentResponse } from './blog-comment.constant';
import { BlogCommentQuery } from './blog-comment.query';
import { BlogCommentService } from './blog-comment.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { BlogCommentWithPaginationRdo } from './rdo/blog-comment-with-pagination';
import { BlogCommentRdo } from './rdo/blog-comment.rdo';

@ApiTags('blog comment')
@Controller('comments')
export class BlogCommentController {
  constructor(private readonly blogCommentService: BlogCommentService) {}

  @ApiResponse({
    type: BlogCommentWithPaginationRdo,
    status: HttpStatus.OK,
    description: BlogCommentResponse.CommentsFound,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: BlogCommentResponse.PostNotFound,
  })
  @Get('/:postId')
  public async show(
    @Param('postId') postId: string,
    @Query() query: BlogCommentQuery
  ) {
    const comments = await this.blogCommentService.getComments(postId, query);
    return fillDto(BlogCommentWithPaginationRdo, comments);
  }

  @ApiResponse({
    type: BlogCommentRdo,
    status: HttpStatus.CREATED,
    description: BlogCommentResponse.CommentCreated,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: BlogCommentResponse.PostNotFound,
  })
  @Post('/:postId')
  public async create(
    @Param('postId') postId: string,
    @Body() dto: CreateCommentDto
  ) {
    const newComment = await this.blogCommentService.addComment(postId, dto);
    return fillDto(BlogCommentRdo, newComment.toPOJO());
  }

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
  @Delete('/:commentId/:userId')
  public async delete(
    @Param('commentId') commentId: string,
    @Param('userId') userId: string
  ) {
    await this.blogCommentService.deleteComment(commentId, userId);
  }
}
