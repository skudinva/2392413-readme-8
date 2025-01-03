import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { BlogPostService } from '@project/blog-post';
import { TokenPayload } from '@project/shared/core';
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
  ): Promise<BlogCommentEntity[]> {
    const post = await this.blogPostService.getPost(postId);
    const commentsWithPagination =
      await this.blogCommentRepository.findByPostId(postId, query);
  }

  public async addComment(
    postId: string,
    dto: CreateCommentDto
  ): Promise<BlogCommentEntity> {
    const newComment = this.blogCommentFactory.createFromDto(dto, postId);
    await this.blogCommentRepository.save(newComment);

    return newComment;
  }

  public async deleteComment(id: string, user: TokenPayload): Promise<void> {
    const existComment = await this.blogCommentRepository.findById(id);
    if (user.sub !== existComment.id) {
      throw new ConflictException('You are not allowed to delete this comment');
    }

    try {
      await this.blogCommentRepository.deleteById(id);
    } catch {
      throw new NotFoundException(`Comment with id ${id} not found`);
    }
  }
}
