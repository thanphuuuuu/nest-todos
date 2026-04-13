import {
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';
import { TodoPriority } from '../enums/todo-priority.enum';
import { TodoStatus } from '../enums/todo-status.enum';

export class CreateTodoDto {
  @IsString()
  @MinLength(1, { message: 'Title không được để trống' })
  title: string;

  @IsOptional()
  @IsString()
  desciption?: string;

  @IsOptional()
  @IsEnum(TodoStatus, {
    message: `Status phải là một trong: ${Object.values(TodoStatus).join(', ')}`,
  })
  status?: TodoStatus;

  @IsOptional()
  @IsEnum(TodoPriority, {
    message: `Priority phải là một trong: ${Object.values(TodoPriority).join(', ')}`,
  })
  priority?: TodoPriority;

  @IsOptional()
  @IsInt({ message: 'categoryId phải là số nguyên' })
  categoryId?: number;
}
