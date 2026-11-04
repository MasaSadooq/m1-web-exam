
import { useEffect, useState } from "react";
import {
  Button,
  Card,
  Col,
  Row,
  Spin,
  Typography,
  Modal,
  Form,
  Input,
  InputNumber,
  Switch,
  message,
  Popconfirm,
} from "antd";
import { useBikesProvider } from "../providers/useBikesProvider";
import type { CreateBikeModel } from "../models/BikeModel";

const { Title, Text } = Typography;

export const BikesList = () => {
  const {
    bikes,
    totalCount,
    page,
    limit,
    load,
    isLoading,
    createBike,
    deleteBike,
  } = useBikesProvider();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();

  useEffect(() => {
    load(1);
  }, []);

  const totalPages = Math.ceil(totalCount / limit);

  const handleCreateBike = async (values: CreateBikeModel) => {
    try {
      await createBike(values);
      message.success("Bike created successfully!");
      form.resetFields();
      setIsModalOpen(false);
    } catch {
      message.error("Could not create bike.");
    }
  };

  const handleDeleteBike = async (id: string) => {
    try {
      await deleteBike(id);
      message.success("Bike deleted successfully!");
    } catch (error: any) {
      if (error.response?.status === 409) {
        message.error("This bike cannot be deleted because it has sales.");
      } else {
        message.error("Could not delete bike.");
      }
    }
  };

  return (
    <div style={{ padding: 24 }}>
      <Title level={2}>Bikes Catalog</Title>

      <Button
        type="primary"
        onClick={() => setIsModalOpen(true)}
        style={{ marginBottom: 16 }}
      >
        Create bike
      </Button>

      {isLoading ? (
        <Spin />
      ) : (
        <>
          <Text>Total bikes: {totalCount}</Text>

          <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
            {bikes.map((bike) => (
              <Col xs={24} sm={12} md={8} key={bike.id}>
                <Card
                  title={`${bike.brand} ${bike.model}`}
                  hoverable
                  onClick={() => {
                    window.location.href = `/bikes/${bike.id}`;
                  }}
                >
                  <p>Category: {bike.category}</p>
                  <p>Material: {bike.frameMaterial}</p>
                  <p>Frame size: {bike.frameSizeCm} cm</p>
                  <p>Gears: {bike.gearCount}</p>
                  <p>Electric: {bike.electric ? "Yes" : "No"}</p>
                  <p>Price: {(bike.priceCents / 100).toFixed(2)} €</p>

                  <Popconfirm
                    title="Delete this bike?"
                    description="Are you sure you want to delete this bike?"
                    onConfirm={(event) => {
                      event?.stopPropagation();
                      void handleDeleteBike(bike.id);
                    }}
                    onCancel={(event) => event?.stopPropagation()}
                    okText="Yes"
                    cancelText="No"
                  >
                    <Button
                      danger
                      block
                      onClick={(event) => event.stopPropagation()}
                    >
                      Delete
                    </Button>
                  </Popconfirm>
                </Card>
              </Col>
            ))}
          </Row>

          <div style={{ marginTop: 24 }}>
            <Button
              disabled={page <= 1}
              onClick={() => load(page - 1)}
            >
              Previous
            </Button>

            <Text style={{ margin: "0 16px" }}>
              Page {page} of {totalPages}
            </Text>

            <Button
              disabled={page >= totalPages}
              onClick={() => load(page + 1)}
            >
              Next
            </Button>
          </div>
        </>
      )}

      <Modal
        title="Create a new bike"
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={null}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleCreateBike}
          initialValues={{ electric: false }}
        >
          <Form.Item name="brand" label="Brand" rules={[{ required: true }]}>
            <Input />
          </Form.Item>

          <Form.Item name="model" label="Model" rules={[{ required: true }]}>
            <Input />
          </Form.Item>

          <Form.Item name="description" label="Description" rules={[{ required: true }]}>
            <Input />
          </Form.Item>

          <Form.Item name="category" label="Category" rules={[{ required: true }]}>
            <Input />
          </Form.Item>

          <Form.Item name="frameMaterial" label="Frame material" rules={[{ required: true }]}>
            <Input />
          </Form.Item>

          <Form.Item name="frameSizeCm" label="Frame size (cm)" rules={[{ required: true }]}>
            <InputNumber min={0.01} style={{ width: "100%" }} />
          </Form.Item>

          <Form.Item name="wheelSizeInches" label="Wheel size (inches)" rules={[{ required: true }]}>
            <InputNumber min={0.01} style={{ width: "100%" }} />
          </Form.Item>

          <Form.Item name="gearCount" label="Number of gears" rules={[{ required: true }]}>
            <InputNumber min={1} step={1} style={{ width: "100%" }} />
          </Form.Item>

          <Form.Item name="weightKg" label="Weight (kg)" rules={[{ required: true }]}>
            <InputNumber min={0.01} style={{ width: "100%" }} />
          </Form.Item>

          <Form.Item name="electric" label="Electric bike" valuePropName="checked">
            <Switch />
          </Form.Item>

          <Form.Item name="priceCents" label="Price (in cents)" rules={[{ required: true }]}>
            <InputNumber min={0} step={1} style={{ width: "100%" }} />
          </Form.Item>

          <Button type="primary" htmlType="submit" block>
            Create bike
          </Button>
        </Form>
      </Modal>
    </div>
  );
};
