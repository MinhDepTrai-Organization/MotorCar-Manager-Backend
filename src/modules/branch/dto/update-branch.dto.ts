import { PartialType } from '@nestjs/mapped-types';
import { CreateBranchDto } from './create-branch.dto';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class UpdateBranchDto extends CreateBranchDto {
  // @IsString()
  // @IsNotEmpty()
  // name: string;
  // @IsString()
  // @IsNotEmpty()
  // address: string;
  // @IsString()
  // @IsNotEmpty()
  // managername: string;
  // @IsOptional()
  // @IsString()
  // logo: string;
}
