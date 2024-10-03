import { validate } from 'class-validator';
import { UserUseCases } from '../../use-cases/UserUseCases';
import { Request, Response } from 'express';
import { CreateUserDTO } from '../../domain/dtos/UserDTO';
import { EmailUseCases } from '../../use-cases/EmailUseCases';

export class UserController {
  private emailUseCases: EmailUseCases;

  constructor(private userUseCases: UserUseCases) {
    this.emailUseCases = new EmailUseCases(userUseCases);
  }

  async getAll(req: Request, res: Response) {
    const users = await this.userUseCases.findAll();
    res.json(users);
  }

  async getById(req: Request, res: Response) {
    const user = await this.userUseCases.findById(req.params.id);
    if (user) {
      res.json(user);
    } else {
      res.status(404).json({
        errorCode: 404,
        message: 'User not found',
      });
    }
  }

  async create(req: Request, res: Response) {
    const dto = Object.assign(new CreateUserDTO(), req.body);
    const errors = await validate(dto);

    if (errors.length > 0) {
      res.status(400).json({
        errorCode: 400,
        message: { errors },
      });
      return;
    }

    const userExists = await this.emailUseCases.validateEmail(dto.email);

    if (userExists) {
      res.status(409).json({
        errorCode: 409,
        message: 'User already exists',
      });
      return;
    }

    const user = await this.userUseCases.create(req.body);
    res.status(201).json(user);
  }

  async update(req: Request, res: Response) {
    const user = await this.userUseCases.update(req.params.id, req.body);
    if (user) {
      res.json(user);
    } else {
      res.status(404).json({
        errorCode: 404,
        message: 'User not found',
      });
    }
  }

  async delete(req: Request, res: Response) {
    await this.userUseCases.delete(req.params.id);
    res.sendStatus(204);
  }
}
