import { Type } from 'class-transformer';
import { IsDateString, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateExpenseDTO {
  @IsNotEmpty()
  @IsString()
  categoryId: string;

  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsNumber()
  amount: number;

  @IsNotEmpty()
  @IsDateString()
  @Type(() => Date)
  date: Date;
}

export class UpdateExpenseDTO extends CreateExpenseDTO {
  @IsNotEmpty()
  @IsString()
  id: string;
}
