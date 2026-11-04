import {
  IsBoolean,
  IsInt,
  IsNumber,
  IsString,
  Min,
  MinLength,
} from "class-validator";

export class CreateBikeDto {
  @IsString()
  @MinLength(1)
  brand: string;

  @IsString()
  @MinLength(1)
  model: string;

  @IsString()
  description: string;

  @IsString()
  @MinLength(1)
  category: string;

  @IsString()
  @MinLength(1)
  frameMaterial: string;

  @IsNumber()
  @Min(0.01)
  frameSizeCm: number;

  @IsNumber()
  @Min(0.01)
  wheelSizeInches: number;

  @IsInt()
  @Min(1)
  gearCount: number;

  @IsNumber()
  @Min(0.01)
  weightKg: number;

  @IsBoolean()
  electric: boolean;

  @IsInt()
  @Min(0)
  priceCents: number;
}