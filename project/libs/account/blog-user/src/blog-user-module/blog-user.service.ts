import { Injectable, NotFoundException } from '@nestjs/common';
import { BlogUserRepository } from './blog-user.repository';

@Injectable()
export class BlogUserService {
  constructor(private readonly blogUserRepository: BlogUserRepository) {}

  public async updatePostsCount(userId: string, diffValue: number) {
    const existUser = await this.blogUserRepository.findById(userId);
    if (!existUser) {
      throw new NotFoundException('User not found');
    }

    existUser.postsCount += diffValue;
    await this.blogUserRepository.update(existUser);
  }

  public async getUserInfo(userId: string) {
    const existUser = await this.blogUserRepository.findById(userId);
    if (!existUser) {
      throw new NotFoundException('User not found');
    }
    return existUser;
  }
}
