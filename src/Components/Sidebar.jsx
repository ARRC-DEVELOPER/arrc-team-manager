import React, { useEffect, useState } from "react";
import {
  MdDashboard,
  MdOutlinePendingActions,
  MdSettings,
  MdTaskAlt,
  MdLeaderboard,
} from "react-icons/md";
import {
  FaTasks,
  FaTicketAlt,
  FaTrashAlt,
  FaTrashRestore,
  FaUsers,
} from "react-icons/fa";
import { FcLeave } from "react-icons/fc";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Layout, Menu, Button } from "antd";
import { MenuOutlined } from "@ant-design/icons";
import mainlogo from "../assets/mainlogo.png";

const { Sider } = Layout;

const linkData = [
  {
    key: "dashboard",
    icon: <MdDashboard style={{ color: "#1890ff" }} />,
    label: "Dashboard",
    to: "/dashboard",
    permission: "Manage Status",
  },
  {
    key: "departments",
    icon: <MdOutlinePendingActions style={{ color: "#fa8c16" }} />,
    label: "Departments",
    to: "/departments",
    permission: "Manage Department",
  },
  {
    key: "clients",
    icon: <FaUsers style={{ color: "#52c41a" }} />,
    label: "Clients",
    to: "/clients",
    permission: "Manage Clients",
  },
  {
    key: "projects",
    icon: <FaTasks style={{ color: "#13c2c2" }} />,
    label: "Projects",
    to: "/projects",
    permission: "Manage Projects",
  },
  {
    key: "tasks",
    icon: <FaTasks style={{ color: "#eb2f96" }} />,
    label: "Tasks",
    to: "/tasks",
    permission: "Manage Tasks",
    children: [
      {
        key: "tasks",
        icon: <MdTaskAlt style={{ color: "#52c41a" }} />,
        label: "Tasks",
        to: "/tasks-data",
        permission: "Manage Tasks",
      },
      {
        key: "status",
        icon: <MdOutlinePendingActions style={{ color: "#faad14" }} />,
        label: "Status",
        to: "/tasks/status",
        permission: "Manage Status",
      },
    ],
  },
  // {
  //   key: "calendar",
  //   icon: <MdOutlinePendingActions style={{ color: "#722ed1" }} />,
  //   label: "Calendar",
  //   to: "/calendar",
  //   permission: "Manage Calendar View",
  // },
  // {
  //   key: "reports",
  //   icon: <MdTaskAlt style={{ color: "#eb2f96" }} />,
  //   label: "Reports",
  //   to: "/reports",
  //   permission: "Manage Reports",
  // },
  {
    key: "users",
    icon: <FaUsers style={{ color: "#13c2c2" }} />,
    label: "Users",
    to: "/users",
    permission: "Manage Users",
  },
  {
    key: "roles",
    icon: <MdSettings style={{ color: "#1890ff" }} />,
    label: "Roles",
    to: "/roles",
    permission: "Manage Roles",
  },
  {
    key: "leads",
    icon: <MdLeaderboard style={{ color: "#fa8c16" }} />,
    label: "Leads",
    to: "/leads",
    permission: "Manage Leads",
  },
  {
    key: "sales",
    icon: <MdOutlinePendingActions style={{ color: "#fa8c16" }} />,
    label: "Sales",
    to: "/sales",
    permission: "Manage Invoices",
  },
  {
    key: "activity-logs",
    icon: <MdSettings style={{ color: "#722ed1" }} />,
    label: "Activity Logs",
    to: "/activity-logs",
    permission: "Manage Activity Log",
  },
  // {
  //   key: "events",
  //   icon: <MdOutlinePendingActions style={{ color: "#52c41a" }} />,
  //   label: "Events",
  //   to: "/events",
  //   permission: "Manage Events",
  // },
  {
    key: "team",
    icon: <FaUsers style={{ color: "#fa541c" }} />,
    label: "Team",
    to: "/team",
    permission: "Manage Users",
  },
  {
    key: "tickets",
    icon: <FaTicketAlt style={{ color: "#13c2c2" }} />,
    label: "Tikckets",
    to: "/tickets",
    permission: "Manage Tickets",
  },
  {
    key: "notes",
    icon: <FaTicketAlt style={{ color: "#13c2c2" }} />,
    label: "Daily Notes",
    to: "/notes",
    permission: "Manage Tickets",
  },
  {
    key: "leave",
    icon: <FcLeave style={{ color: "#13c2c2" }} />,
    label: "Leaves",
    to: "/leaves",
    permission: "Manage Leaves",
  },
  {
    key: "archived-users",
    icon: <FaTrashRestore style={{ color: "#f5222d" }} />,
    label: "Archived Users",
    to: "/archived-users",
    permission: "Archived Users",
  },
  {
    key: "trashed",
    icon: <FaTrashAlt style={{ color: "#f5222d" }} />,
    label: "Trash",
    to: "/trashed",
    permission: "Manage Settings",
  },
  {
    key: "settings",
    icon: <FaTasks style={{ color: "#eb2f96" }} />,
    label: "Settings",
    to: "/settings",
    permission: "Manage Settings",
    children: [
      {
        key: "tags",
        icon: <MdTaskAlt style={{ color: "#52c41a" }} />,
        label: "Tags",
        to: "/tags",
        permission: "Manage Settings",
      },
      {
        key: "activityTypes",
        icon: <MdOutlinePendingActions style={{ color: "#faad14" }} />,
        label: "ActivityTypes",
        to: "/activity-types",
        permission: "Manage Settings",
      },
      {
        key: "taxes",
        icon: <MdOutlinePendingActions style={{ color: "#faad14" }} />,
        label: "Taxes ",
        to: "/taxes",
        permission: "Manage Tasks",
      },
      {
        key: "settings",
        icon: <MdOutlinePendingActions style={{ color: "#faad14" }} />,
        label: "Settings ",
        to: "/settings",
        permission: "Manage Tasks",
      },
    ],
  },
];

const Sidebar = ({ user }) => {
  const [visible, setVisible] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const toggleSidebar = () => setVisible(!visible);

  // Update `isMobile` based on screen size
  const handleResize = () => {
    setIsMobile(window.innerWidth < 768);
  };

  useEffect(() => {
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const filteredLinks = linkData
    .filter((item) => user.role.permissions.includes(item.permission))
    .map((item) => {
      if (item.children) {
        const filteredChildren = item.children.filter((child) =>
          user.role.permissions.includes(child.permission)
        );
        return filteredChildren.length > 0
          ? { ...item, children: filteredChildren }
          : null;
      }
      return item;
    })
    .filter(Boolean);


  // Close sidebar on route change
  useEffect(() => {
    if (isMobile) {
      setVisible(false);
    }
  }, [location, isMobile]);

  return (
    <>
      {/* Toggle Button */}
      <Button
        onClick={toggleSidebar}
        style={{
          position: "fixed",
          top: 16,
          left: 16,
          zIndex: 20,
          color: "gray",
        }}
        icon={<MenuOutlined />}
      />

      {/* Sidebar */}
      <Sider
        width={250}
        trigger={null}
        collapsible
        collapsed={!visible}
        style={{
          backgroundColor: "#fff",
          borderRight: "1px solid #f0f0f0",
          display: visible ? "block" : "none",
        }}
      >
        {/* Logo */}
        <div
          className={`flex flex-col justify-center items-center h-16 ${visible ? "block" : "hidden"
            } transition-all duration-300`}
        >
          <img src={mainlogo} className="w-[60%] mt-2 h-auto" alt="Logo" />
        </div>

        {/* Menu */}
        <Menu
          theme="light"
          mode="inline"
          defaultSelectedKeys={["dashboard"]}
          inlineCollapsed={!visible}
          style={{ backgroundColor: "#fff", fontWeight: "600" }}
        >
          {filteredLinks.map((item) =>
            item.children ? (
              <Menu.SubMenu key={item.key} icon={item.icon} title={item.label}>
                {item.children.map((child) => (
                  <Menu.Item key={child.key}>
                    <Link to={child.to} className="hover:text-blue-500">
                      {child.label}
                    </Link>
                  </Menu.Item>
                ))}
              </Menu.SubMenu>
            ) : (
              <Menu.Item
                key={item.key}
                icon={item.icon}
                onClick={() => navigate(item.to)}
              >
                <Link to={item.to} className="hover:text-blue-500">
                  {item.label}
                </Link>
              </Menu.Item>
            )
          )}
        </Menu>
      </Sider>
    </>
  );
};

export default Sidebar;
