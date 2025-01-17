import {
  GlobalOutlined,
  SettingOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Avatar, Button, Dropdown, Menu, message } from "antd";
import axios from "axios";
import React, { useEffect, useState } from "react";

import { server } from "../main.jsx";
import Notification from "./Notification.jsx";

const Navbar = ({ user, onLogout }) => {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const pollInterval = 5000;

    const fetchNotifications = async () => {
      const token = localStorage.getItem("authToken");

      if (token) {
        try {
          const response = await axios.get(`${server}/users/getNotifications`, {
            headers: { Authorization: `Bearer ${token}` },
            withCredentials: true,
          });

          setNotifications(response.data.notifications);
        } catch (error) {
          console.error("Error fetching notifications", error);
        }
      }
    };

    fetchNotifications();
    const intervalId = setInterval(fetchNotifications, pollInterval);

    return () => clearInterval(intervalId);
  }, []);

  const handleLogout = () => {
    console.log("Loged out...");
    localStorage.removeItem("authToken");
    onLogout();
    message.success("Logout successful!");
  };

  const languageMenu = (
    <Menu>
      <Menu.Item key="1">English</Menu.Item>
      <Menu.Item key="2">Spanish</Menu.Item>
      <Menu.Item key="3">French</Menu.Item>
      <Menu.Item key="4">German</Menu.Item>
    </Menu>
  );

  const userMenu = (
    <Menu>
      <Menu.Item key="1" icon={<UserOutlined />}>
        Profile
      </Menu.Item>
      <Menu.Item key="2" icon={<SettingOutlined />}>
        Settings
      </Menu.Item>
      <Menu.Item key="3" icon={<UserOutlined />} danger onClick={handleLogout}>
        Logout
      </Menu.Item>
    </Menu>
  );

  return (
    <header
      className="flex flex-wrap items-center justify-between p-4 bg-white shadow-md sticky top-0 z-10 w-full overflow-x-hidden"
    >
      <div className="flex items-center space-x-4 ml-auto">
        <Notification notifications={notifications} />

        <Dropdown overlay={languageMenu} trigger={["click"]} placement="bottomRight">
          <Button type="link" icon={<GlobalOutlined className="text-xl md:text-2xl" />} />
        </Dropdown>

        <Dropdown overlay={userMenu} trigger={["click"]} placement="bottomRight">
          <div className="flex items-center">
            <Avatar size="large" icon={<UserOutlined />} />
            <span className="ml-2 hidden md:block text-sm md:text-base">
              {user ? user.name : "User"}
            </span>
          </div>
        </Dropdown>
      </div>
    </header>
  );
};

export default Navbar;
