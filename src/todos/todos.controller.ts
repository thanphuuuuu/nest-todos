import {
  Body,
  Controller,
  Delete,
  Get,
  Headers,
  HttpCode,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';
import { QueryParamsDto } from './dto/query-params.dto';

@Controller('todos')
export class TodosController {
  @Get()
  findAll(@Query() queryParamsDto: QueryParamsDto) {
    return `lấy tất cả todos: ${queryParamsDto.priority}, ${queryParamsDto.limit}, ${queryParamsDto.page}`;
  }

  @Get(':id')
  getTodoById(@Param('id', ParseIntPipe) id: number) {
    return id;
  }

  @Post()
  create(
    @Body() createTodoDto: CreateTodoDto,
    @Headers('authorization') auth: string,
  ) {
    if (auth) {
      return 'đã tạo todo: ' + JSON.stringify(createTodoDto);
    }

    return 'bạn chưa đăng nhập';
  }

  @Patch(':id')
  update(
    @Param(':id', ParseIntPipe) id: number,
    @Body() updateTodoDto: UpdateTodoDto,
  ) {
    return `update todo ${id} với body ${JSON.stringify(updateTodoDto)}`;
  }

  @HttpCode(204)
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return `delete todo` + id;
  }
}
