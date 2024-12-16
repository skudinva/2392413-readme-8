import { Injectable, NotImplementedException } from '@nestjs/common';
import { BlogCommentEntity } from './blog-comment.entity';
import { BlogCommentRepository } from './blog-comment.repository';
import { CreateCommentDto } from './dto/create-comment.dto';

@Injectable()
export class BlogCommentService {
  constructor(private readonly blogCommentRepository: BlogCommentRepository) {}

  public async getComments(postId: string): Promise<BlogCommentEntity[]> {
    return this.blogCommentRepository.findByPostId(postId);
  }

  public async createComment(
    postId: string,
    dto: CreateCommentDto
  ): Promise<BlogCommentEntity> {
    throw new NotImplementedException();
  }
}
