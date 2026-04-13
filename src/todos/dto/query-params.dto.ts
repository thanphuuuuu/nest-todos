import { IsEnum, IsInt, IsOptional, Max, Min } from 'class-validator';
import { TodoPriority } from '../enums/todo-priority.enum';
import { Type } from 'class-transformer';

export class QueryParamsDto {
  @IsOptional()
  @IsInt()
  @Min(1) // đảm bảo giá trị nhỏ nhất của page là 1
  @Type(() => Number)
  page?: number = 1;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(100)
  limit?: number = 10;

  @IsOptional()
  @IsEnum(TodoPriority, {
    message: `Priority phải là một trong ${Object.values(TodoPriority).join(', ')}`,
  })
  priority?: TodoPriority = TodoPriority.MEDIUM;
}
