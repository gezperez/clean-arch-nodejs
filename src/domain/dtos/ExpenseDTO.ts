import { Type } from 'class-transformer';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateExpenseDTO {
  @IsNotEmpty()
  @IsString()
  categoryId: string;

  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  amount: string;

  @Type(() => Date)
  date: Date;
}

export class UpdateExpenseDTO extends CreateExpenseDTO {
  @IsNotEmpty()
  @IsString()
  id: string;
}
