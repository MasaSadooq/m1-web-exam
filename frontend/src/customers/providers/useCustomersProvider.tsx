import axios from "axios";
import { useState } from "react";
import type {
  CreateCustomerModel,
  CustomerModel,
} from "../models/CustomerModel";

const API_URL = "http://localhost:3000/customers";
const LIMIT = 10;

export const useCustomersProvider = () => {
  const [customers, setCustomers] = useState<CustomerModel[]>([]);
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
        setCustomers(result.data.customers);
        setTotalCount(result.data.totalCount);
        setPage(requestedPage);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const deleteCustomer = (id: string) => {
    axios.delete(`${API_URL}/${id}`).then(() => {
      const nextPage =
        customers.length === 1 && page > 1 ? page - 1 : page;

      load(nextPage);
    });
  };

  const createCustomer = (input: CreateCustomerModel) =>
    axios.post<CustomerModel>(API_URL, input).then(() => {
      load(page);
    });

  return {
    customers,
    totalCount,
    page,
    limit: LIMIT,
    load,
    isLoading,
    deleteCustomer,
    createCustomer,
  };
};