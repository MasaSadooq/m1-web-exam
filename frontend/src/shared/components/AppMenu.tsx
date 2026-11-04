import {
  ContactsOutlined,
  HomeOutlined,
  ShoppingOutlined,
} from "@ant-design/icons";
import { Link, useLocation } from "@tanstack/react-router";
import type { MenuProps } from "antd";
import { Menu } from "antd";

type MenuItem = Required<MenuProps>["items"][number];

const items: MenuItem[] = [
  {
    label: <Link to="/">Home</Link>,
    key: "home",
    icon: <HomeOutlined />,
  },
  {
    label: <Link to="/customers">Customers</Link>,
    key: "customers",
    icon: <ContactsOutlined />,
  },
  {
    label: <Link to="/bikes">Bikes</Link>,
    key: "bikes",
    icon: <ShoppingOutlined />,
  },
];

const getSelectedKey = (pathname: string) =>
  pathname.split("/")[1] || "home";

export function AppMenu() {
  const { pathname } = useLocation();

  return (
    <Menu
      selectedKeys={[getSelectedKey(pathname)]}
      mode="horizontal"
      items={items}
      style={{ backgroundColor: "transparent" }}
    />
  );
}