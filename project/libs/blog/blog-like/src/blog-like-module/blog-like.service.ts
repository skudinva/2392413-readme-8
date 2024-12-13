import { Injectable, NotFoundException } from '@nestjs/common';
import { Like } from '@project/shared/core';
import { CreateLikeDto } from '../dto/create-like.dto';
import { DeleteLikeDto } from '../dto/delete-like.dto';
import { BlogLikeEntity } from './blog-like.entity';
import { BlogLikeRepository } from './blog-like.repository';

@Injectable()
export class BlogLikeService {
  constructor(private readonly blogLikeRepository: BlogLikeRepository) {}

  public async create(dto: CreateLikeDto): Promise<BlogLikeEntity> {
    const like: Like = {
      userId: dto.userId,
      postId: dto.postId,
    };

    const likeEntity = new BlogLikeEntity(like);
    this.blogLikeRepository.save(likeEntity);
    return likeEntity;
  }

  public async delete(dto: DeleteLikeDto): Promise<BlogLikeEntity> {
    const { userId, postId } = dto;
    const existLike = await this.blogLikeRepository.findByPostId(
      userId,
      postId
    );
    if (!existLike) {
      throw new NotFoundException(
        `Like with postId ${postId} not found for user.`
      );
    }

    const deleteLike = new BlogLikeEntity({ ...existLike, ...dto });
    this.blogLikeRepository.deleteById(deleteLike.id);
    return deleteLike;
  }
}
