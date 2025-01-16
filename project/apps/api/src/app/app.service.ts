import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { BlogPostRdo } from '@project/blog-post';
import { UserInfoRdo } from '@project/blog-user';
import { createUrlForFile } from '@project/helpers';
import { File } from '@project/shared/core';
import FormData from 'form-data';
import 'multer';
import { ApplicationServiceURL } from './app.config';

@Injectable()
export class AppService {
  constructor(private readonly httpService: HttpService) {}

  public async appendUserInfo(posts: BlogPostRdo[]): Promise<void> {
    const uniqueUserIds = new Set<string>();
    const usersInfo = new Map<string, UserInfoRdo>();

    posts.forEach((post) => {
      uniqueUserIds.add(post.userId);
    });

    for (const userId of uniqueUserIds) {
      const { data } = await this.httpService.axiosRef.get<UserInfoRdo>(
        `${ApplicationServiceURL.Users}/${userId}`
      );

      usersInfo.set(data.id, data);
    }

    posts.forEach((post) => {
      post['userInfo'] = usersInfo.get(post.userId);
    });
  }

  public async uploadFile(file: Express.Multer.File) {
    const formData = new FormData();
    formData.append('file', file.buffer, file.originalname);
    const { data: fileMetaData } = await this.httpService.axiosRef.post<File>(
      `${ApplicationServiceURL.File}/api/files/upload`,
      formData,
      {
        headers: formData.getHeaders(),
      }
    );
    return createUrlForFile(fileMetaData, ApplicationServiceURL.File);
  }
}
