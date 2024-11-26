import { Injectable } from '@nestjs/common';
import { CreateTagDto } from '../dto/create-tag.dto';
import { BlogTagEntity } from './blog-tag.entity';
import { BlogTagRepository } from './blog-tag.repository';

@Injectable()
export class BlogTagService {
  constructor(private readonly blogTagRepository: BlogTagRepository) {}
  public async getTagById(id: string): Promise<BlogTagEntity | null> {
    return this.blogTagRepository.findById(id);
  }

  public async getTagByTitle(title: string): Promise<BlogTagEntity | null> {
    return this.blogTagRepository.findByTitle(title);
  }

  public async create(dto: CreateTagDto): Promise<BlogTagEntity> {
    const { title } = dto;
    const blogTagEntity = await this.blogTagRepository.findByTitle(title);
    if (blogTagEntity) {
      return blogTagEntity;
    }
    const newTag = new BlogTagEntity({ title });
    this.blogTagRepository.save(newTag);
    return newTag;
  }
}
