import { Injectable } from '@nestjs/common';
import { PostState } from '@prisma/client';
import { BlogTagEntity } from '@project/blog-tag';
import { EntityFactory, Post } from '@project/shared/core';
import dayjs from 'dayjs';
import { BlogPostEntity } from './blog-post.entity';
import { CreatePostDto } from './dto/create-post.dto';

@Injectable()
export class BlogPostFactory implements EntityFactory<BlogPostEntity> {
  create(entityPlainData: Post): BlogPostEntity {
    return new BlogPostEntity(entityPlainData);
  }

  public static createFromCreatePostDto(
    dto: CreatePostDto,
    tags: BlogTagEntity[]
  ): BlogPostEntity {
    const newPost = new BlogPostEntity();
    newPost.id = undefined;
    newPost.postType = dto.postType;
    newPost.authorId = dto.authorId;
    newPost.isRepost = false;
    newPost.state = PostState.Published;
    newPost.createdAt = dayjs().toDate();
    newPost.publicDate = dayjs().toDate();
    newPost.likesCount = 0;
    newPost.commentsCount = 0;
    newPost.extraProperty = dto.extraProperty;
    newPost.originAuthorId = null;
    newPost.originPostId = null;
    newPost.tags = tags;

    return newPost;
  }

  public static createRepost(
    originalPost: Post,
    userId: string
  ): BlogPostEntity {
    const newPost = new BlogPostEntity();
    for (const [key, value] of Object.entries(originalPost)) {
      newPost[key] = value;
    }

    newPost.id = undefined;
    newPost.isRepost = true;
    newPost.authorId = userId;
    newPost.originPostId = originalPost.id;
    newPost.originAuthorId = originalPost.authorId;
    newPost.createdAt = dayjs().toDate();
    newPost.publicDate = dayjs().toDate();
    newPost.likesCount = 0;
    newPost.commentsCount = 0;

    return newPost;
  }
}
