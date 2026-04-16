import { Module } from '@nestjs/common';
import { TodosController } from './todos.controller';
import { TodosService } from './todo.service';
import { TodosRepository } from './todos.repository';
import { CategoriesModule } from 'src/categories/categories.module';
import { UsersModule } from 'src/users/users.module';

@Module({
  controllers: [TodosController],
  providers: [TodosService, TodosRepository],
  imports: [CategoriesModule, UsersModule], // lúc exports thì export CategoriesService nhưng lúc import thì phải import cả CategoriesModule
})
export class TodosModule {}
