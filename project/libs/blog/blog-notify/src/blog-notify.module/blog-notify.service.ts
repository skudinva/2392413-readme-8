import { AmqpConnection } from '@golevelup/nestjs-rabbitmq';
import { Inject, Injectable } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { rabbitConfig } from '@project/config';
import { Post, RabbitRouting } from '@project/shared/core';
import { BlogNotifyDto } from './dto/blog-notify.dto';

@Injectable()
export class BlogNotifyService {
  constructor(
    private readonly rabbitClient: AmqpConnection,
    @Inject(rabbitConfig.KEY)
    private readonly rabbitOptions: ConfigType<typeof rabbitConfig>
  ) {}

  public async sendNewPostNotify(posts: Post[], userId: string) {
    return this.rabbitClient.publish<BlogNotifyDto>(
      this.rabbitOptions.exchange,
      RabbitRouting.SendNewPostNotify,
      { userId, posts }
    );
  }
}
