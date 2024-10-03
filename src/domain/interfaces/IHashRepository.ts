export interface IHashRepository {
  hashPassword(password: string): Promise<string>;
  verifyPassword(userPassword: string, password: string): Promise<boolean>;
}
