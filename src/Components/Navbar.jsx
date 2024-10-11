import React, { useState } from "react";
import { Button, Dropdown, Menu, Avatar, message } from "antd";
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

const Navbar = ({ collapsed, setCollapsed, user, onLogout }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  const toggleCollapsed = () => {
    setCollapsed(!collapsed);
  };

  const handleModeSwitch = () => {
    setIsDarkMode(!isDarkMode);
    console.log(
      isDarkMode ? "Switching to light mode" : "Switching to dark mode"
    );
  };

  const handleLogout = () => {
    localStorage.removeItem("authToken"); // Remove the token from local storage
    onLogout(); // Call the logout handler passed from App component
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

  const notificationMenu = (
    <Menu>
      <Menu.Item key="1">You have no new notifications</Menu.Item>
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
    <header className="flex items-center justify-between p-4 bg-white shadow-md sticky top-0 z-50">
      {/* Toggle Button */}
      {/* <Button type="link" onClick={toggleCollapsed}>
        {collapsed ? <MenuOutlined style={{ fontSize: '1.5rem' }} /> : <CloseOutlined style={{ fontSize: '1.5rem' }} />}
      </Button> */}

      {/* Right Section: Notifications, Language, User Profile */}
      <div className="flex items-center space-x-4 ml-auto">
        {/* Dark/Light Mode Button */}
        {/* <Button type="link" onClick={handleModeSwitch} icon={isDarkMode ? <SunOutlined /> : <MoonOutlined />} /> */}

        {/* Notifications */}
        <Dropdown
          overlay={notificationMenu}
          trigger={["click"]}
          placement="bottomRight"
        >
          <Button type="link" icon={<BellOutlined />} />
        </Dropdown>

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
            {/* Show user name */}
          </div>
        </Dropdown>
      </div>
    </header>
  );
};

export default Navbar;
