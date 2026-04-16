import { Todo } from 'src/todos/entities/todo.entity';
import { CreateTodoDto } from './dto/create-todo.dto';
import { QueryParamsDto } from './dto/query-params.dto';
import { TodosRepository } from './todos.repository';
import { UpdateTodoDto } from './dto/update-todo.dto';
import { Injectable } from '@nestjs/common';
import { CategoriesService } from 'src/categories/categories.service';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class TodosService {
  constructor(
    private todosRepository: TodosRepository,
    private readonly usersService: UsersService,
    private readonly categoriesService: CategoriesService,
  ) {}

  findAll(queryParamsDto: QueryParamsDto): Todo[] {
    let todos = this.todosRepository.findAll();

    if (queryParamsDto.priority) {
      todos = todos.filter((todo) => todo.priority === queryParamsDto.priority);
    }

    const page = queryParamsDto.page ?? 1;
    const limit = queryParamsDto.limit ?? 10;

    const start = (page - 1) * limit;
    return todos.slice(start, start + limit);
  }

  findByID(id: number) {
    const todo = this.todosRepository.findByID(id);

    if (!todo) {
      throw new Error(`Không tìm thấy todo với id: ${id}`);
    }

    return todo;
  }

  create(createTodoDto: CreateTodoDto): Todo {
    const user = this.usersService.findById(createTodoDto.userId);

    if (!user) {
      throw new Error(`Không tìm thấy user với id: ${createTodoDto.userId}`);
    }

    if (createTodoDto.categoryId) {
      const category = this.categoriesService.findById(
        createTodoDto.categoryId,
      );

      if (!category) {
        throw new Error(
          `Không tìm thấy category với id: ${createTodoDto.categoryId}`,
        );
      }
    }

    return this.todosRepository.create(createTodoDto);
  }

  update(id: number, updateTodoDto: UpdateTodoDto) {
    const updatedTodo = this.todosRepository.update(id, updateTodoDto);

    if (!updatedTodo) {
      throw new Error(`Không tìm thấy todo với id: ${id}`);
    }

    return updatedTodo;
  }

  delete(id: number) {
    const deleted = this.todosRepository.delete(id);

    if (!deleted) {
      throw new Error(`Không tìm thấy todo với id: ${id}`);
    }
  }
}
