import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { UserIdDto } from '@project/blog-post';
import { BlogUserService } from './blog-user.service';

@Controller('blog-user')
@ApiTags('blog-user')
export class BlogUserController {
  constructor(private readonly userService: BlogUserService) {}

  @Post('/incPostsCount')
  @HttpCode(HttpStatus.NO_CONTENT)
  public async incrementPostsCount(@Body() { userId }: UserIdDto) {
    this.userService.updatePostsCount(userId, 1);
  }

  @Post('/decPostsCount')
  @HttpCode(HttpStatus.NO_CONTENT)
  public async reducePostsCount(@Body() { userId }: UserIdDto) {
    this.userService.updatePostsCount(userId, -1);
  }
}
