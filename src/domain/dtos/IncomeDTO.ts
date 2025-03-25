import { Type } from 'class-transformer';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateIncomeDTO {
  @IsNotEmpty()
  @IsString()
  userId: string;

  @Type(() => Date)
  date: Date;

  @IsNotEmpty()
  @IsString()
  currency: string;

  @IsNotEmpty()
  @IsString()
  categoryId: string;

  @IsNotEmpty()
  @IsString()
  categoryName: string;

  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  amount: string;

  @IsNotEmpty()
  @IsString()
  recurrence: string;

  description: string;
}

export class UpdateIncomeDTO extends CreateIncomeDTO {
  @IsNotEmpty()
  @IsString()
  id: string;
}
