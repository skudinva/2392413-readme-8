import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { BlogPostService } from '@project/blog-post';
import { PaginationResult } from '@project/shared/core';
import { BlogCommentEntity } from './blog-comment.entity';
import { BlogCommentFactory } from './blog-comment.factory';
import { BlogCommentQuery } from './blog-comment.query';
import { BlogCommentRepository } from './blog-comment.repository';
import { CreateCommentDto } from './dto/create-comment.dto';

@Injectable()
export class BlogCommentService {
  constructor(
    private readonly blogCommentRepository: BlogCommentRepository,
    private readonly blogCommentFactory: BlogCommentFactory,
    private readonly blogPostService: BlogPostService
  ) {}

  public async getComments(
    postId: string,
    query: BlogCommentQuery
  ): Promise<PaginationResult<ReturnType<BlogCommentEntity['toPOJO']>>> {
    const post = await this.blogPostService.getPost(postId, null);
    const commentsWithPagination =
      await this.blogCommentRepository.findByPostId(post.id, query);

    const comments = {
      ...commentsWithPagination,
      entities: commentsWithPagination.entities.map((comment) =>
        comment.toPOJO()
      ),
    };

    return comments;
  }

  public async addComment(
    postId: string,
    dto: CreateCommentDto
  ): Promise<BlogCommentEntity> {
    const existsComment = this.blogCommentRepository.findByUserAndPostId(
      postId,
      dto.userId
    );

    if (existsComment) {
      throw new ConflictException('User already comment this post');
    }

    const newComment = this.blogCommentFactory.createFromDto(dto, postId);
    await this.blogCommentRepository.save(newComment);
    await this.blogPostService.updateCommentCount(postId, 1);

    return newComment;
  }

  public async deleteComment(id: string, userId: string): Promise<void> {
    const existComment = await this.blogCommentRepository.findById(id);
    if (userId !== existComment.userId) {
      throw new ConflictException('You are not allowed to delete this comment');
    }

    try {
      await this.blogCommentRepository.deleteById(id);
      await this.blogPostService.updateCommentCount(existComment.postId, -1);
    } catch {
      throw new NotFoundException(`Comment with id ${id} not found`);
    }
  }
}
