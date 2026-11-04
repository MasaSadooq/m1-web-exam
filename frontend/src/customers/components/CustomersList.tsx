import { Button, Skeleton, Space, Typography } from "antd";
import { useEffect } from "react";
import { useCustomersProvider } from "../providers/useCustomersProvider";
import { AddCustomerButton } from "./AddCustomerButton";
import { CustomerListItem } from "./CustomerListItem";

export const CustomersList = () => {
  const {
    customers,
    totalCount,
    page,
    limit,
    deleteCustomer,
    createCustomer,
    isLoading,
    load,
  } = useCustomersProvider();

  useEffect(() => {
    load(1);
  }, []);

  const totalPages = Math.ceil(totalCount / limit);

  return (
    <Space orientation="vertical" style={{ padding: ".25rem .5rem" }}>
      <AddCustomerButton createCustomer={createCustomer} />

      {isLoading ? (
        <Skeleton />
      ) : (
        <>
          {customers.map((customer) => (
            <CustomerListItem
              key={customer.id}
              customer={customer}
              deleteCustomer={deleteCustomer}
            />
          ))}

          <Typography.Text>
            Page {page} of {totalPages} — {totalCount} customers
          </Typography.Text>

          <Space>
            <Button
              disabled={page <= 1}
              onClick={() => load(page - 1)}
            >
              Previous
            </Button>

            <Button
              disabled={page >= totalPages}
              onClick={() => load(page + 1)}
            >
              Next
            </Button>
          </Space>
        </>
      )}
    </Space>
  );
};