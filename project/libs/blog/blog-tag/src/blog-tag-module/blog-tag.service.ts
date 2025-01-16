import { Injectable } from '@nestjs/common';
import { BlogTagEntity } from './blog-tag.entity';
import { BlogTagRepository } from './blog-tag.repository';
import { CreateTagDto } from './dto/create-tag.dto';

@Injectable()
export class BlogTagService {
  constructor(private readonly blogTagRepository: BlogTagRepository) {}
  public async getTagById(id: string): Promise<BlogTagEntity | null> {
    return this.blogTagRepository.findById(id);
  }

  public async getTagByTitle(title: string): Promise<BlogTagEntity | null> {
    return this.blogTagRepository.findByTitle(title);
  }

  public async findOrCreate(titles: string[]): Promise<BlogTagEntity[]> {
    return await this.blogTagRepository.findOrCreateByTitles(titles);
  }

  public async create(dto: CreateTagDto): Promise<BlogTagEntity> {
    const { title } = dto;
    return await this.blogTagRepository.findOrCreateByTitle(title);
  }
}
