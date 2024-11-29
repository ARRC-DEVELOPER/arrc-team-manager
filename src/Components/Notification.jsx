import React, { useState } from "react";
import { Modal, List, Button, Badge } from "antd";
import { BellOutlined } from "@ant-design/icons";
import { server } from "../main.jsx";
import axios from "axios";

const Notification = ({ notifications }) => {
  const [isModalVisible, setIsModalVisible] = useState(false);

  const markNotificationsAsRead = async () => {
    const token = localStorage.getItem("authToken");

    if (token) {
      try {
        await axios.put(
          `${server}/users/markAllAsRead`,
          {},
          {
            headers: { Authorization: `Bearer ${token}` },
            withCredentials: true,
          }
        );
      } catch (error) {
        console.error("Error marking notifications as read", error);
      }
    }
  };

  const showNotificationModal = () => {
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    markNotificationsAsRead();
    setIsModalVisible(false);
  };

  const unreadNotificationsCount = notifications.filter(
    (n) => !n.isRead
  ).length;

  const unreadNotifications = notifications.filter((n) => !n.isRead);

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? "PM" : "AM";
    const formattedHours = hours % 12 || 12;
    const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
    return `${formattedHours}:${formattedMinutes} ${ampm}`;
  };

  return (
    <>
      <Badge count={unreadNotificationsCount}>
        <Button
          type="link"
          icon={<BellOutlined />}
          onClick={showNotificationModal}
        />
      </Badge>

      <Modal
        title="Notifications"
        visible={isModalVisible}
        onCancel={handleCancel}
        footer={null}
      >
        <List
          itemLayout="horizontal"
          dataSource={unreadNotifications}
          renderItem={(notification) => (
            <List.Item>
              <div className="flex justify-between w-full">
                <a href="#!">{notification.message}</a>
                <span className="ml-auto text-gray-500">
                  {formatTime(notification.createdAt)}
                </span>
              </div>
            </List.Item>
          )}
        />
      </Modal>
    </>
  );
};

export default Notification;
