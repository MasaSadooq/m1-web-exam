import { Injectable } from "@nestjs/common";
import { InjectDataSource } from "@nestjs/typeorm";
import { DataSource, QueryFailedError } from "typeorm";
import { BikeEntity } from "./entities/bike.entity";
import type {
  BikeModel,
  CreateBikeModel,
  UpdateBikeModel,
} from "./models/bike.model";

@Injectable()
export class BikesRepository {
  constructor(@InjectDataSource() private readonly dataSource: DataSource) {}

  async findAll(
    page: number,
    limit: number,
  ): Promise<{ totalCount: number; bikes: BikeModel[] }> {
    const repository = this.dataSource.getRepository(BikeEntity);

    const [entities, totalCount] = await repository.findAndCount({
      order: { brand: "ASC", model: "ASC", id: "ASC" },
      skip: (page - 1) * limit,
      take: limit,
    });

    return {
      totalCount,
      bikes: entities.map((entity) => this.toBikeModel(entity)),
    };
  }

  async findById(id: string): Promise<BikeModel | null> {
    const entity = await this.dataSource
      .getRepository(BikeEntity)
      .findOneBy({ id });

    return entity ? this.toBikeModel(entity) : null;
  }

  async create(input: CreateBikeModel): Promise<BikeModel> {
    const repository = this.dataSource.getRepository(BikeEntity);
    const entity = repository.create(input);

    return this.toBikeModel(await repository.save(entity));
  }

  async update(
    id: string,
    input: UpdateBikeModel,
  ): Promise<BikeModel | null> {
    const repository = this.dataSource.getRepository(BikeEntity);
    const entity = await repository.findOneBy({ id });

    if (!entity) return null;

    repository.merge(entity, input);

    return this.toBikeModel(await repository.save(entity));
  }

  async delete(id: string): Promise<boolean> {
    try {
      const result = await this.dataSource
        .getRepository(BikeEntity)
        .delete(id);

      return (result.affected ?? 0) > 0;
    } catch (error) {
      if (
        error instanceof QueryFailedError &&
        error.message.includes("FOREIGN KEY constraint failed")
      ) {
        throw new Error("BIKE_HAS_SALES");
      }

      throw error;
    }
  }

  private toBikeModel(entity: BikeEntity): BikeModel {
    return {
      id: entity.id,
      brand: entity.brand,
      model: entity.model,
      description: entity.description,
      category: entity.category,
      frameMaterial: entity.frameMaterial,
      frameSizeCm: entity.frameSizeCm,
      wheelSizeInches: entity.wheelSizeInches,
      gearCount: entity.gearCount,
      weightKg: entity.weightKg,
      electric: entity.electric,
      priceCents: entity.priceCents,
    };
  }
}