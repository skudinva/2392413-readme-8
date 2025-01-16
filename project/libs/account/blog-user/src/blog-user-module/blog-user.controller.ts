import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
} from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { UserIdDto } from '@project/blog-post';
import { fillDto } from '@project/helpers';
import { MongoIdValidationPipe } from '@project/pipes';
import { BlogUserService } from './blog-user.service';
import { UserInfoRdo } from './rdo/user-info.rdo';

@Controller('user')
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

  @ApiResponse({
    type: UserInfoRdo,
    status: HttpStatus.OK,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
  })
  @Get(':id')
  public async show(@Param('id', MongoIdValidationPipe) id: string) {
    const existUser = await this.userService.getUserInfo(id);
    return fillDto(UserInfoRdo, existUser.toPOJO());
  }
}
