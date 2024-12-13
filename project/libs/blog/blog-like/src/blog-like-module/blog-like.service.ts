import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Like } from '@project/shared/core';
import { BlogLikeEntity } from './blog-like.entity';
import { BlogLikeRepository } from './blog-like.repository';

@Injectable()
export class BlogLikeService {
  constructor(private readonly blogLikeRepository: BlogLikeRepository) {}

  public async like(like: Like): Promise<void> {
    const isLikeExists = await this.blogLikeRepository.isLikeExists(like);
    if (isLikeExists) {
      throw new ConflictException(
        `Like already exist with postId ${like.postId} `
      );
    }

    const newLike = new BlogLikeEntity(like);
    await this.blogLikeRepository.save(newLike);
  }

  public async unlike(like: Like): Promise<void> {
    const isLikeExists = await this.blogLikeRepository.isLikeExists(like);
    if (!isLikeExists) {
      throw new NotFoundException(
        `Like with postId ${like.postId} not found for user.`
      );
    }

    await this.blogLikeRepository.deleteByIds(like);
  }
}
