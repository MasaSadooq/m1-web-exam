
import { useEffect, useState } from "react";
import {
  ArrowLeftOutlined,
  ShoppingOutlined,
} from "@ant-design/icons";
import {
  Button,
  Card,
  Col,
  Form,
  Input,
  InputNumber,
  message,
  Modal,
  Row,
  Skeleton,
  Space,
  Switch,
  Typography,
} from "antd";
import { ButtonLink } from "../../shared/components/ButtonLink";
import { useBikeDetailsProvider } from "../providers/useBikeDetailsProvider";
import type { UpdateBikeModel } from "../models/BikeModel";

const { Title, Text } = Typography;

interface BikeDetailsProps {
  bikeId: string;
}

export const BikeDetails = ({ bikeId }: BikeDetailsProps) => {
  const { bike, isLoading, load, updateBike } =
    useBikeDetailsProvider(bikeId);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();

  useEffect(() => {
    load();
  }, [bikeId]);

  const openEditModal = () => {
    if (!bike) return;

    form.setFieldsValue({
      brand: bike.brand,
      model: bike.model,
      description: bike.description,
      category: bike.category,
      frameMaterial: bike.frameMaterial,
      frameSizeCm: bike.frameSizeCm,
      wheelSizeInches: bike.wheelSizeInches,
      gearCount: bike.gearCount,
      weightKg: bike.weightKg,
      electric: bike.electric,
      priceCents: bike.priceCents,
    });

    setIsModalOpen(true);
  };

  const handleUpdateBike = async (values: UpdateBikeModel) => {
    try {
      await updateBike(values);
      message.success("Bike updated successfully!");
      setIsModalOpen(false);
    } catch {
      message.error("Could not update bike.");
    }
  };

  return (
    <div style={{ padding: 16 }}>
      <ButtonLink to="/bikes" icon={<ArrowLeftOutlined />}>
        Back to bikes
      </ButtonLink>

      <Space align="center" style={{ marginTop: 16, marginBottom: 16 }}>
        <ShoppingOutlined style={{ fontSize: "1.5rem" }} />

        {isLoading ? (
          <Skeleton.Input active size="large" />
        ) : (
          <Title level={2} style={{ margin: 0 }}>
            {bike ? `${bike.brand} ${bike.model}` : "Bike not found"}
          </Title>
        )}
      </Space>

      {isLoading ? (
        <Skeleton active />
      ) : bike ? (
        <>
          <Button
            type="primary"
            onClick={openEditModal}
            style={{ marginBottom: 16 }}
          >
            Edit bike
          </Button>

          <Row gutter={[16, 16]}>
            <Col xs={24} md={12}>
              <Card title="General information">
                <p><Text strong>Brand:</Text> {bike.brand}</p>
                <p><Text strong>Model:</Text> {bike.model}</p>
                <p><Text strong>Description:</Text> {bike.description}</p>
                <p><Text strong>Category:</Text> {bike.category}</p>
                <p><Text strong>Price:</Text> {(bike.priceCents / 100).toFixed(2)} €</p>
              </Card>
            </Col>

            <Col xs={24} md={12}>
              <Card title="Technical information">
                <p><Text strong>Frame material:</Text> {bike.frameMaterial}</p>
                <p><Text strong>Frame size:</Text> {bike.frameSizeCm} cm</p>
                <p><Text strong>Wheel size:</Text> {bike.wheelSizeInches} inches</p>
                <p><Text strong>Gears:</Text> {bike.gearCount}</p>
                <p><Text strong>Weight:</Text> {bike.weightKg} kg</p>
                <p><Text strong>Electric:</Text> {bike.electric ? "Yes" : "No"}</p>
              </Card>
            </Col>
          </Row>
        </>
      ) : (
        <Text type="danger">This bike could not be found.</Text>
      )}

      <Modal
        title="Edit bike"
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={null}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleUpdateBike}
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
            Save changes
          </Button>
        </Form>
      </Modal>
    </div>
  );
};
