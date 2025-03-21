import { Injectable } from '@nestjs/common';

export type User = any;
@Injectable()
export class UsersService {
  private readonly users = [
    {
      userId: 1,
      username: 'John',
      password: '12341234',
    },
    {
      userId: 2,
      username: 'Kamran',
      password: '12341234',
    },
  ];

  async findOne(username: string): Promise<User> {
    return this.users.find((user) => user.username === username);
  }
}
