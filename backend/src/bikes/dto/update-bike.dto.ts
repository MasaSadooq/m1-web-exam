import {
  IsBoolean,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  Min,
  MinLength,
} from "class-validator";

export class UpdateBikeDto {
  @IsOptional()
  @IsString()
  @MinLength(1)
  brand?: string;

  @IsOptional()
  @IsString()
  @MinLength(1)
  model?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  @MinLength(1)
  category?: string;

  @IsOptional()
  @IsString()
  @MinLength(1)
  frameMaterial?: string;

  @IsOptional()
  @IsNumber()
  @Min(0.01)
  frameSizeCm?: number;

  @IsOptional()
  @IsNumber()
  @Min(0.01)
  wheelSizeInches?: number;

  @IsOptional()
  @IsInt()
  @Min(1)
  gearCount?: number;

  @IsOptional()
  @IsNumber()
  @Min(0.01)
  weightKg?: number;

  @IsOptional()
  @IsBoolean()
  electric?: boolean;

  @IsOptional()
  @IsInt()
  @Min(0)
  priceCents?: number;
}