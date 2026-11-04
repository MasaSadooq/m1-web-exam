import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Inject,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
} from "@nestjs/common";
import { CustomersService } from "./customers.service";
import {
  BikeSellResponseDto,
  PurchasedBikeSellResponseDto,
} from "./dto/bike-sell-response.dto";
import { CreateBikeSellDto } from "./dto/create-bike-sell.dto";
import { CreateCustomerDto } from "./dto/create-customer.dto";
import { CustomerResponseDto } from "./dto/customer-response.dto";
import { UpdateCustomerDto } from "./dto/update-customer.dto";
import type {
  CreateCustomerModel,
  UpdateCustomerModel,
} from "./models/customer.model";

@Controller("customers")
export class CustomersController {
  constructor(
    @Inject(CustomersService) private readonly service: CustomersService,
  ) {}

    @Get()
  async findAll(
    @Query("page") pageQuery?: string,
    @Query("limit") limitQuery?: string,
  ): Promise<{ totalCount: number; customers: CustomerResponseDto[] }> {
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

    const result = await this.service.findAll(page, limit);

    return {
      totalCount: result.totalCount,
      customers: result.customers.map((model) =>
        CustomerResponseDto.fromModel(model),
      ),
    };
  }

  @Post()
  async create(@Body() dto: CreateCustomerDto): Promise<CustomerResponseDto> {
    const input: CreateCustomerModel = {
      firstName: dto.firstName,
      lastName: dto.lastName,
      email: dto.email,
      phone: dto.phone,
      birthDate: dto.birthDate,
      address: dto.address,
      postalCode: dto.postalCode,
      city: dto.city,
      country: dto.country,
    };
    return CustomerResponseDto.fromModel(await this.service.create(input));
  }

  @Get(":id")
  async findById(
    @Param("id", ParseUUIDPipe) id: string,
  ): Promise<CustomerResponseDto> {
    return CustomerResponseDto.fromModel(await this.service.findById(id));
  }

  @Patch(":id")
  async update(
    @Param("id", ParseUUIDPipe) id: string,
    @Body() dto: UpdateCustomerDto,
  ): Promise<CustomerResponseDto> {
    const input: UpdateCustomerModel = {
      firstName: dto.firstName,
      lastName: dto.lastName,
      email: dto.email,
      phone: dto.phone,
      birthDate: dto.birthDate,
      address: dto.address,
      postalCode: dto.postalCode,
      city: dto.city,
      country: dto.country,
    };
    return CustomerResponseDto.fromModel(await this.service.update(id, input));
  }

  @Delete(":id")
  @HttpCode(204)
  async delete(@Param("id", ParseUUIDPipe) id: string): Promise<void> {
    await this.service.delete(id);
  }

  @Get(":id/bikes")
  async findPurchases(
    @Param("id", ParseUUIDPipe) id: string,
  ): Promise<PurchasedBikeSellResponseDto[]> {
    return (await this.service.findPurchases(id)).map((model) =>
      PurchasedBikeSellResponseDto.fromModel(model),
    );
  }

  @Post(":id/bikes")
  async createSale(
    @Param("id", ParseUUIDPipe) id: string,
    @Body() dto: CreateBikeSellDto,
  ): Promise<BikeSellResponseDto> {
    return BikeSellResponseDto.fromModel(
      await this.service.createSale(id, {
        bikeId: dto.bikeId,
        quantity: dto.quantity,
      }),
    );
  }
}
