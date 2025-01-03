import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { TokenPayload } from '@project/shared/core';
import { BlogCommentEntity } from './blog-comment.entity';
import { BlogCommentFactory } from './blog-comment.factory';
import { BlogCommentRepository } from './blog-comment.repository';
import { CreateCommentDto } from './dto/create-comment.dto';

@Injectable()
export class BlogCommentService {
  constructor(
    private readonly blogCommentRepository: BlogCommentRepository,
    private readonly blogCommentFactory: BlogCommentFactory
  ) {}

  public async getComments(postId: string): Promise<BlogCommentEntity[]> {
    return this.blogCommentRepository.findByPostId(postId);
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
