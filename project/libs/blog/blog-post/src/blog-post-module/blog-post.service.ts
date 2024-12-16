import { Injectable, NotFoundException } from '@nestjs/common';
import { PostState } from '@prisma/client';
import { Post } from '@project/shared/core';
import dayjs from 'dayjs';
import { CreatePostDto } from '../dto/create-post.dto';
import { UpdatePostDto } from '../dto/update-post.dto';
import { BlogPostEntity } from './blog-post.entity';
import { BlogPostRepository } from './blog-post.repository';

@Injectable()
export class BlogPostService {
  constructor(private readonly blogPostRepository: BlogPostRepository) {}

  public async create(dto: CreatePostDto): Promise<BlogPostEntity> {
    const post: Post = {
      postType: dto.postType,
      authorId: dto.authorId,
      isRepost: dto.isRepost,
      state: PostState.Published,
      createdAt: dayjs().toDate(),
      publicDate: dayjs().toDate(),
      likesCount: 0,
      commentsCount: 0,
      extraProperty: dto.extraProperty,
    };

    const postEntity = new BlogPostEntity(post);
    this.blogPostRepository.save(postEntity);
    return postEntity;
  }

  public async update(dto: UpdatePostDto): Promise<BlogPostEntity> {
    const { id } = dto;
    const existPost = await this.blogPostRepository.findById(id);
    if (!existPost) {
      throw new NotFoundException(`Post with ids ${id} not found.`);
    }

    const updatePost = new BlogPostEntity({ ...existPost, ...dto });
    this.blogPostRepository.update(updatePost);
    return updatePost;
  }
}
