import { Injectable, NotFoundException } from '@nestjs/common';
import { Post, PostState, PostType } from '@project/shared/core';
import dayjs from 'dayjs';
import { CreatePostDto } from '../dto/create-post.dto';
import { UpdatePostDto } from '../dto/update-post.dto';
import { BlogPostEntity } from './blog-post.entity';
import { BlogPostRepository } from './blog-post.repository';

@Injectable()
export class BlogPostService<T extends PostType> {
  constructor(private readonly blogPostRepository: BlogPostRepository<T>) {}

  public async create(dto: CreatePostDto<T>): Promise<BlogPostEntity<T>> {
    const post: Post<T> = {
      postType: dto.postType,
      authorId: dto.authorId,
      isRepost: dto.isRepost,
      state: PostState.Published,
      createDate: dayjs().toDate(),
      publicDate: dayjs().toDate(),
      likesCount: 0,
      commentsCount: 0,
    };

    const postEntity = new BlogPostEntity<T>(post);
    this.blogPostRepository.save(postEntity);
    return postEntity;
  }

  public async update(dto: UpdatePostDto<T>): Promise<BlogPostEntity<T>> {
    const { id } = dto;
    const existPost = await this.blogPostRepository.findById(id);
    if (!existPost) {
      throw new NotFoundException(`Post with ids ${id} not found.`);
    }

    const updatePost = new BlogPostEntity<T>({ ...existPost, ...dto });
    this.blogPostRepository.update(updatePost);
    return updatePost;
  }
}
