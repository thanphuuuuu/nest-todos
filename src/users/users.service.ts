import { Injectable } from '@nestjs/common';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  private users: User[] = [
    { id: 1, name: 'An' },
    { id: 2, name: 'Bình' },
  ];

  findById(id: number) {
    return this.users.find((user) => user.id === id);
  }
}
