import { Todo } from 'src/todos/entities/todo.entity';
import { CreateTodoDto } from './dto/create-todo.dto';
import { QueryParamsDto } from './dto/query-params.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CategoriesService } from 'src/categories/categories.service';
import { UsersService } from 'src/users/users.service';
import { TodoNotFoundException } from './exceptions/todo-not-found.exception';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class TodosService {
  constructor(
    @InjectRepository(Todo)
    private readonly todosRepository: Repository<Todo>,
    private readonly usersService: UsersService,
    private readonly categoriesService: CategoriesService,
  ) {}

  async findAll(queryParamsDto: QueryParamsDto): Promise<Todo[]> {
    const page = queryParamsDto.page ?? 1;
    const limit = queryParamsDto.limit ?? 10;
    const start = (page - 1) * limit;

    const where = queryParamsDto.priority
      ? { priority: queryParamsDto.priority }
      : {};

    const todos = await this.todosRepository.find({
      where,
      take: limit,
      skip: start,
    });

    return todos;
  }

  async findByID(id: number) {
    const todo = await this.todosRepository.findOne({ where: { id } });

    if (!todo) {
      throw new TodoNotFoundException(id);
    }

    return todo;
  }

  async create(createTodoDto: CreateTodoDto): Promise<Todo> {
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

    const existingTodo = await this.todosRepository.findOne({
      where: { title: createTodoDto.title },
    });

    if (existingTodo) {
      throw new BadRequestException({
        message: `Todo với title ${createTodoDto.title} đã tồn tại`,
        errorCode: 'TODO_TITLE_DUPLICATE',
        filed: 'title',
        statusCode: 400,
      });
    }

    return this.todosRepository.save(createTodoDto);
  }

  async update(id: number, updateTodoDto: UpdateTodoDto) {
    const todo = await this.todosRepository.findOne({ where: { id } });

    if (!todo) {
      throw new TodoNotFoundException(id); // TodoNotFoundException đc gọi là Custom Exception
    }

    Object.assign(todo, updateTodoDto);

    return this.todosRepository.save(todo);
  }

  async delete(id: number) {
    const deleted = await this.todosRepository.delete(id);

    if (!deleted.affected) {
      throw new TodoNotFoundException(id);
    }
  }
}
