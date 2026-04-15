import { Module } from '@nestjs/common';
import { TodosController } from './todos.controller';
import { TodosService } from './todo.service';
import { TodosRepository } from './todos.repository';

@Module({
  controllers: [TodosController],
  providers: [TodosService, TodosRepository],
})
export class TodosModule {}
