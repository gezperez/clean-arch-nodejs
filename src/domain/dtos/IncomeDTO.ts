import { Type } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateIncomeDTO {
  @IsNotEmpty()
  @IsString()
  categoryId: string;

  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsNumber()
  amount: number;

  @Type(() => Date)
  date: Date;
}

export class UpdateIncomeDTO extends CreateIncomeDTO {
  @IsNotEmpty()
  @IsString()
  id: string;
}
