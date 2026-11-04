import axios from "axios";
import { useState } from "react";
import type {
  BikeModel,
  CreateBikeModel,
  UpdateBikeModel,
} from "../models/BikeModel";

const API_URL = "http://localhost:3000/bikes";
const LIMIT = 10;

export const useBikesProvider = () => {
  const [bikes, setBikes] = useState<BikeModel[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const load = (requestedPage = 1) => {
    setIsLoading(true);

    axios
      .get(API_URL, {
        params: {
          page: requestedPage,
          limit: LIMIT,
        },
      })
      .then((result) => {
        setBikes(result.data.bikes);
        setTotalCount(result.data.totalCount);
        setPage(requestedPage);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const createBike = (input: CreateBikeModel) =>
    axios.post<BikeModel>(API_URL, input).then(() => load(page));

  const updateBike = (id: string, input: UpdateBikeModel) =>
    axios.patch<BikeModel>(`${API_URL}/${id}`, input).then(() => load(page));

  const deleteBike = (id: string) =>
    axios.delete(`${API_URL}/${id}`).then(() => {
      const nextPage = bikes.length === 1 && page > 1 ? page - 1 : page;
      load(nextPage);
    });

  return {
    bikes,
    totalCount,
    page,
    limit: LIMIT,
    load,
    isLoading,
    createBike,
    updateBike,
    deleteBike,
  };
};