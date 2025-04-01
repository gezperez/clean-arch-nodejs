import { IsNotEmpty, IsString } from 'class-validator';

export class CreateMovementDTO {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  amount: string;

  @IsNotEmpty()
  @IsString()
  date: string;

  @IsNotEmpty()
  @IsString()
  currency: string;

  @IsNotEmpty()
  @IsString()
  categoryId: string;

  @IsNotEmpty()
  @IsString()
  userId: string;

  @IsNotEmpty()
  @IsString()
  type: string;
}

export class UpdateMovementDTO extends CreateMovementDTO {
  @IsNotEmpty()
  @IsString()
  id: string;
}
