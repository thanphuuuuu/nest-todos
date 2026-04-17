import { Todo } from 'src/todos/entities/todo.entity';
import { CreateTodoDto } from './dto/create-todo.dto';
import { QueryParamsDto } from './dto/query-params.dto';
import { TodosRepository } from './todos.repository';
import { UpdateTodoDto } from './dto/update-todo.dto';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CategoriesService } from 'src/categories/categories.service';
import { UsersService } from 'src/users/users.service';
import { TodoNotFoundException } from './exceptions/todo-not-found.exception';

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
      throw new TodoNotFoundException(id);
    }

    return todo;
  }

  create(createTodoDto: CreateTodoDto): Todo {
    const user = this.usersService.findById(createTodoDto.userId);

    if (!user) {
      throw new NotFoundException({
        message: `Không tìm thấy user với id: ${createTodoDto.userId}`,
        errorCode: 'USER_NOT_FOUND',
        filed: 'id',
      });
    }

    if (createTodoDto.categoryId) {
      const category = this.categoriesService.findById(
        createTodoDto.categoryId,
      );

      if (!category) {
        throw new NotFoundException({
          message: `Không tìm thấy category với id: ${createTodoDto.categoryId}`,
          errorCode: 'CATEGORY_NOT_FOUND',
          filed: 'id',
        });
      }
    }

    const existingTodo = this.todosRepository.findByTitle(createTodoDto.title);

    if (existingTodo) {
      throw new BadRequestException({
        message: `Todo với title ${createTodoDto.title} đã tồn tại`,
        errorCode: 'TODO_TITLE_DUPLICATE',
        filed: 'title',
        statusCode: 400,
      });
    }

    return this.todosRepository.create(createTodoDto);
  }

  update(id: number, updateTodoDto: UpdateTodoDto) {
    const updatedTodo = this.todosRepository.update(id, updateTodoDto);

    if (!updatedTodo) {
      throw new TodoNotFoundException(id); // TodoNotFoundException đc gọi là Custom Exception
    }

    return updatedTodo;
  }

  delete(id: number) {
    const deleted = this.todosRepository.delete(id);

    if (!deleted) {
      throw new TodoNotFoundException(id);
    }
  }
}
