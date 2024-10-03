import { UserUseCases } from './UserUseCases';

export class EmailUseCases {
  constructor(private userUseCases: UserUseCases) {}

  async validateEmail(email: string): Promise<boolean> {
    const userExists = await this.userUseCases.findByEmail(email);

    if (userExists) {
      return true;
    }

    return false;
  }
}
