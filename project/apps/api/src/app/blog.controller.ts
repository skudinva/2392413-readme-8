import { HttpService } from '@nestjs/axios';
import {
  Body,
  Controller,
  Post,
  UseFilters,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { CreatePostDto } from '@project/blog-post';
import { ApplicationServiceURL } from './app.config';
import { AxiosExceptionFilter } from './filters/axios-exception.filter';
import { CheckAuthGuard } from './guards/check-auth.guard';

@Controller('blog')
@UseFilters(AxiosExceptionFilter)
export class BlogController {
  constructor(private readonly httpService: HttpService) {}

  @UseGuards(CheckAuthGuard)
  @UseInterceptors(UseInterceptors)
  @Post('/')
  public async create(@Body() dto: CreatePostDto) {
    const { data } = await this.httpService.axiosRef.post(
      `${ApplicationServiceURL.Blog}/`,
      dto
    );
    return data;
  }
}
