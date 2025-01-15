import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PostState } from '@prisma/client';
import { BlogTagService } from '@project/blog-tag';
import { PaginationResult } from '@project/shared/core';
import { BlogPostResponse } from './blog-post.constant';
import { BlogPostEntity } from './blog-post.entity';
import { BlogPostFactory } from './blog-post.factory';
import { BlogPostQuery } from './blog-post.query';
import { BlogPostRepository } from './blog-post.repository';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';

@Injectable()
export class BlogPostService {
  constructor(
    private readonly blogPostRepository: BlogPostRepository,
    private readonly blogTagService: BlogTagService
  ) {}

  public async createPost(dto: CreatePostDto): Promise<BlogPostEntity> {
    const tags = dto.tags
      ? await this.blogTagService.findOrCreate(dto.tags)
      : [];

    const newPost = BlogPostFactory.createFromCreatePostDto(dto, tags);
    await this.blogPostRepository.save(newPost);

    return newPost;
  }

  public async updatePost(
    id: string,
    dto: UpdatePostDto
  ): Promise<BlogPostEntity> {
    const existPost = await this.getPost(id, dto.userId);

    for (const [key] of Object.entries(existPost.extraProperty)) {
      existPost.extraProperty[key] =
        key === 'id' || key === 'postId'
          ? existPost[key]
          : dto.extraProperty[key] ?? null;
    }

    for (const [key, value] of Object.entries(dto)) {
      if (
        value !== undefined &&
        key !== 'extraProperty' &&
        key !== 'tags' &&
        existPost[key] !== value
      ) {
        existPost[key] = value;
      }
      if (key === 'tags' && value) {
        existPost.tags = await this.blogTagService.findOrCreate(dto.tags);
      }
    }

    await this.blogPostRepository.update(existPost);
    return existPost;
  }

  public async deletePost(id: string, userId: string): Promise<void> {
    const post = await this.getPost(id, null);
    if (!post) {
      return;
    }

    if (userId !== post.userId) {
      throw new ConflictException('You are not allowed to delete post');
    }

    await this.blogPostRepository.deleteById(id);
  }

  public async getPost(
    id: string,
    userId: string | null | undefined
  ): Promise<BlogPostEntity> {
    const existPost = await this.blogPostRepository.findById(id);
    if (!existPost) {
      throw new NotFoundException(BlogPostResponse.PostNotFound);
    }

    if (
      userId !== null &&
      userId !== existPost.userId &&
      existPost.state === PostState.Draft
    ) {
      throw new NotFoundException(BlogPostResponse.PostNotFound);
    }

    return existPost;
  }

  public async getPosts(
    query?: BlogPostQuery
  ): Promise<PaginationResult<BlogPostEntity | null>> {
    return this.blogPostRepository.find(query);
  }

  public async createRepost(
    postId: string,
    userId: string
  ): Promise<BlogPostEntity> {
    const existsPost = await this.getPost(postId, userId);

    const existRepost = await this.blogPostRepository.findRepost(
      postId,
      userId
    );

    if (existRepost) {
      throw new ConflictException(
        `You already make repost of postId ${postId}`
      );
    }

    const newPost = BlogPostFactory.createRepost(existsPost.toPOJO(), userId);
    await this.blogPostRepository.save(newPost);

    return newPost;
  }

  public async updateCommentCount(
    postId: string,
    diffValue: number
  ): Promise<void> {
    const existPost = await this.getPost(postId, null);
    existPost.commentsCount += diffValue;
    await this.blogPostRepository.update(existPost);
  }

  public async updateLikeCount(
    postId: string,
    diffValue: number
  ): Promise<void> {
    const existPost = await this.getPost(postId, null);
    existPost.likesCount += diffValue;
    await this.blogPostRepository.update(existPost);
  }
}
