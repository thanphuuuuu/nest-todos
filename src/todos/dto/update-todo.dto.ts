import { PartialType } from '@nestjs/mapped-types';
import { CreateTodoDto } from './create-todo.dto';

// pnpm add @nestjs/mapped-types
// UpdateTodoDto sẽ kế thừa toàn bộ các trường trong CreateTodoDto và chuyển tất cả các trường thành không bắt buộc
export class UpdateTodoDto extends PartialType(CreateTodoDto) {}
