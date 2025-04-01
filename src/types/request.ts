import { Request } from 'express';
import { JWTPayload } from '../domain/entities/JWT';

export interface AuthenticatedRequest extends Request {
  user: JWTPayload;
}
