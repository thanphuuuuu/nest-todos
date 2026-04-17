import { NotFoundException } from '@nestjs/common';

export class TodoNotFoundException extends NotFoundException {
  constructor(id: number) {
    // nhận vào id của todo không tìm thấy
    // super() là cú pháp gọi constructor class cha
    super({
      message: `Không tìm thấy todo với id: ${id}`,
      errorCode: 'TODO_NOT_FOUND',
      filed: 'id',
    });
  }
}
