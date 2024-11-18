import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Button,
  Dropdown,
  Menu,
  Avatar,
  message,
  Badge,
  Modal,
  List,
} from "antd";
import {
  MenuOutlined,
  CloseOutlined,
  UserOutlined,
  MoonOutlined,
  SunOutlined,
  BellOutlined,
  SettingOutlined,
  GlobalOutlined,
} from "@ant-design/icons";

import Notification from "./Notification.jsx";
import { server } from "../main.jsx";

const Navbar = ({ user, onLogout }) => {
  // const [isDarkMode, setIsDarkMode] = useState(false);
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

    // Cleanup interval on component unmount
    return () => clearInterval(intervalId);
  }, []);

  const handleLogout = () => {
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
    <header className="flex items-center justify-between p-4 bg-white shadow-md sticky top-0 z-10">
      <div className="flex items-center space-x-4 ml-auto">
        {/* Notifications */}
        <Notification notifications={notifications} />

        {/* Language Selector */}
        <Dropdown
          overlay={languageMenu}
          trigger={["click"]}
          placement="bottomRight"
        >
          <Button type="link" icon={<GlobalOutlined />} />
        </Dropdown>

        {/* User Profile Dropdown */}
        <Dropdown
          overlay={userMenu}
          trigger={["click"]}
          placement="bottomRight"
        >
          <div className="flex items-center">
            <Avatar size="large" icon={<UserOutlined />} />
            <span className="ml-2">{user ? user.name : "User"}</span>{" "}
          </div>
        </Dropdown>
      </div>
    </header>
  );
};

export default Navbar;
