import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
} from "@nestjs/common";
import { BikesService } from "./bikes.service";
import { CreateBikeDto } from "./dto/create-bike.dto";
import { UpdateBikeDto } from "./dto/update-bike.dto";

@Controller("bikes")
export class BikesController {
  constructor(private readonly service: BikesService) {}

  @Get()
  async findAll(
    @Query("page") pageQuery?: string,
    @Query("limit") limitQuery?: string,
  ) {
    const pageValue = pageQuery ?? "1";
    const limitValue = limitQuery ?? "10";

    if (!/^[1-9]\d*$/.test(pageValue)) {
      throw new BadRequestException("page must be a positive integer");
    }

    if (!/^[1-9]\d*$/.test(limitValue)) {
      throw new BadRequestException("limit must be a positive integer");
    }

    const page = Number(pageValue);
    const limit = Number(limitValue);

    if (limit > 50) {
      throw new BadRequestException("limit cannot be greater than 50");
    }

    return this.service.findAll(page, limit);
  }

  @Get(":id")
  findById(@Param("id", ParseUUIDPipe) id: string) {
    return this.service.findById(id);
  }

  @Post()
  create(@Body() input: CreateBikeDto) {
    return this.service.create(input);
  }

  @Patch(":id")
  update(
    @Param("id", ParseUUIDPipe) id: string,
    @Body() input: UpdateBikeDto,
  ) {
    return this.service.update(id, input);
  }

  @Delete(":id")
  delete(@Param("id", ParseUUIDPipe) id: string) {
    return this.service.delete(id);
  }
}