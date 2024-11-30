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
                permission: "Manage Tasks",
            },
        ],
    },
    {
        key: "calendar",
        icon: <MdOutlinePendingActions style={{ color: "#722ed1" }} />,
        label: "Calendar",
        to: "/calendar",
        permission: "Manage Calendar View",
    },
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