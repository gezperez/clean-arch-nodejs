import { IsBoolean, IsNotEmpty, IsString } from 'class-validator';

export class CreateCategoryDTO {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  iconName: string;

  @IsNotEmpty()
  @IsString()
  color: string;

  @IsBoolean()
  isIncome: boolean = false;
}

export class UpdateCategoryDTO extends CreateCategoryDTO {
  @IsNotEmpty()
  @IsString()
  id: string;
}
