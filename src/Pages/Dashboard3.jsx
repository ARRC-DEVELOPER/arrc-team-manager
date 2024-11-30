<div className="min-h-screen bg-gray-100 p-6">
    {/* Header */}
    <header className="flex justify-between items-center bg-white p-4 rounded shadow">
        <h1 className="text-2xl font-bold text-gray-700">
            Task Manager Dashboard
        </h1>
        <button
            onClick={handleCreateTask}
            className="bg-blue-600 text-white px-4 py-2 rounded"
        >
            Create Task
        </button>
    </header>

    {/* Main Content */}
    <div className="mt-6 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        {/* Summary Cards */}
        <div className="bg-white p-4 rounded shadow">
            <h2 className="text-xl font-bold">Total Tasks</h2>
            <p className="text-4xl font-semibold mt-2">
                {overallStats.totalTasks}
            </p>
        </div>
        <div className="bg-white p-4 rounded shadow">
            <h2 className="text-xl font-bold">Completed Tasks</h2>
            <p className="text-4xl font-semibold mt-2">
                {overallStats.completedTasks}
            </p>
        </div>
        <div className="bg-white p-4 rounded shadow">
            <h2 className="text-xl font-bold">Pending Tasks</h2>
            <p className="text-4xl font-semibold mt-2">
                {overallStats.pendingTasks}
            </p>
        </div>
        <div className="bg-white p-4 rounded shadow">
            <h2 className="text-xl font-bold">Overdue Tasks</h2>
            <p className="text-4xl font-semibold mt-2">
                {overallStats.overdueTasks}
            </p>
        </div>
    </div>

    {/* Charts Section */}
    <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Bar Chart */}
        <div className="bg-white p-4 rounded shadow">
            <h3 className="text-lg font-bold mb-4">Task Status Overview</h3>
            <Bar data={barData} />
        </div>

        {/* Doughnut Chart */}
        <div className="bg-white p-4 rounded shadow">
            <h3 className="text-lg font-bold mb-4">Task Priority Breakdown</h3>
            <Doughnut data={doughnutData} />
        </div>
    </div>

    {/* Line Chart for User Performance */}
    <div className="bg-white mt-5 p-4 rounded shadow">
        <h3 className="text-lg font-bold mb-4">User Performance Over Time</h3>
        <Line data={lineData} />
    </div>

    {/* Recent Activities */}
    <div className="mt-6 bg-white p-4 md:p-6 rounded shadow">
        <h3 className="text-lg md:text-xl font-bold mb-4">Recent Activities</h3>
        <ul className="space-y-2">
            {recentActivities &&
                recentActivities.map((item, index) => (
                    <li
                        key={index}
                        className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-1 md:space-y-0"
                    >
                        <span className="text-sm md:text-base">{item.message}</span>
                        <span className="text-xs md:text-sm text-gray-500">{item.timeAgo}</span>
                    </li>
                ))}
        </ul>
    </div>

</div>