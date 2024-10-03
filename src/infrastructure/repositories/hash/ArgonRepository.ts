import * as argon2 from 'argon2';
import { IHashRepository } from '../../../domain/interfaces/IHashRepository';

export class ArgonRepository implements IHashRepository {
  hashPassword(password: string): Promise<string> {
    return argon2.hash(password);
  }
  verifyPassword(userPassword: string, password: string): Promise<boolean> {
    return argon2.verify(userPassword, password);
  }
}
