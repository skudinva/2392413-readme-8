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
    newPost.userId = dto.userId;
    newPost.isRepost = false;
    newPost.state = PostState.Published;
    newPost.createdAt = dayjs().toDate();
    newPost.publicDate = dayjs().toDate();
    newPost.likesCount = 0;
    newPost.commentsCount = 0;
    newPost.extraProperty = dto.extraProperty;
    newPost.originUserId = null;
    newPost.originPostId = null;
    newPost.tags = tags;

    return newPost;
  }

  public static createRepost(
    originalPost: Post,
    userId: string
  ): BlogPostEntity {
    const newPost = new BlogPostEntity(originalPost);

    newPost.id = undefined;
    newPost.isRepost = true;
    newPost.userId = userId;
    newPost.originPostId = originalPost.id;
    newPost.originUserId = originalPost.userId;
    newPost.createdAt = dayjs().toDate();
    newPost.publicDate = dayjs().toDate();
    newPost.likesCount = 0;
    newPost.commentsCount = 0;

    return newPost;
  }
}
