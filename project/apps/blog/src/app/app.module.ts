import { Module } from '@nestjs/common';
import { BlogTagModule } from '@project/blog-tag';

@Module({
  imports: [BlogTagModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
