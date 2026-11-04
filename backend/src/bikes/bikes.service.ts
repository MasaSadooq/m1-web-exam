import { Injectable, NotFoundException, ConflictException } from "@nestjs/common";
import { BikesRepository } from "./bikes.repository";
import type {
  BikeModel,
  CreateBikeModel,
  UpdateBikeModel,
} from "./models/bike.model";

@Injectable()
export class BikesService {
  constructor(private readonly repository: BikesRepository) {}

  findAll(
    page: number,
    limit: number,
  ): Promise<{ totalCount: number; bikes: BikeModel[] }> {
    return this.repository.findAll(page, limit);
  }

  async findById(id: string): Promise<BikeModel> {
    const bike = await this.repository.findById(id);

    if (!bike) {
      throw new NotFoundException("Bike not found");
    }

    return bike;
  }

  create(input: CreateBikeModel): Promise<BikeModel> {
    return this.repository.create(input);
  }

  async update(id: string, input: UpdateBikeModel): Promise<BikeModel> {
    const bike = await this.repository.update(id, input);

    if (!bike) {
      throw new NotFoundException("Bike not found");
    }

    return bike;
  }

  async delete(id: string): Promise<void> {
    try {
      const deleted = await this.repository.delete(id);

      if (!deleted) {
        throw new NotFoundException("Bike not found");
      }
    } catch (error) {
      if (error instanceof Error && error.message === "BIKE_HAS_SALES") {
        throw new ConflictException("Cannot delete a bike that has sales");
      }

      throw error;
    }
  }
}