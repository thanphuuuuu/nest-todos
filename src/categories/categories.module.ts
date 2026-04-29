import { Module } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CategoriesController } from './categories.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Category } from './entities/category.entity';

@Module({
  controllers: [CategoriesController],
  providers: [CategoriesService], // Dependency Injection
  exports: [CategoriesService], // công khai cho mượn CategoriesService
  imports: [TypeOrmModule.forFeature([Category])],
})
export class CategoriesModule {}
