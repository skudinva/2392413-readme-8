import { Injectable } from '@nestjs/common';
import { BlogCommentEntity } from './blog-comment.entity';
import { BlogCommentRepository } from './blog-comment.repository';

@Injectable()
export class BlogCommentService {
  constructor(private readonly blogCommentRepository: BlogCommentRepository) {}

  public async getComments(postId: string): Promise<BlogCommentEntity[]> {
    return this.blogCommentRepository.findByPostId(postId);
  }
}
