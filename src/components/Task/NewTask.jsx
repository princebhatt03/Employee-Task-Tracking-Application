// src/components/Task/NewTask.jsx
import React from "react";

// This component now accepts 'tasks' and 'updateTask' as props
const NewTask = ({ tasks, updateTask }) => {
  // --- IMPORTANT: REMOVE ALL MOCK DATA FROM HERE ---
  // The 'tasks' prop already contains the filtered data.
  // --- END REMOVAL ---

  const getStatusClasses = (status) => {
    switch (status?.toLowerCase()) {
      case "pending":
        return "bg-blue-600";
      case "new":
        return "bg-blue-600";
      default:
        return "bg-gray-500";
    }
  };

  const getPriorityClasses = (priority) => {
    switch (priority?.toLowerCase()) {
      case "high":
        return "bg-red-700";
      case "medium":
        return "bg-yellow-500 text-black";
      case "low":
        return "bg-green-600";
      default:
        return "bg-gray-600";
    }
  };

  const handleAction = async (action, taskId) => {
    try {
      if (action === "Accept") {
        // Calls the updateTask function from props to change status
        await updateTask(taskId, { status: "accepted" });
        alert("Task accepted successfully!");
      } else if (action === "Reject") {
        // Calls the updateTask function from props to change status
        await updateTask(taskId, { status: "rejected" });
        alert("Task rejected!");
      }
    } catch (error) {
      alert(`Action failed: ${error.message}`);
    }
  };

  return (
    <div className="bg-gray-800 p-8 rounded-2xl shadow-xl border border-gray-700 text-white h-[500px] flex flex-col">
      <h2 className="text-3xl font-bold mb-6 text-center text-white">
        New/Pending Tasks
      </h2>

      <div className="hidden md:grid grid-cols-[2.5fr_1fr_1fr_1.5fr] gap-4 py-3 px-4 mb-2 bg-gray-700 rounded-lg font-semibold text-gray-300 border-b border-gray-600">
        <h4 className="text-left">Task Title</h4>
        <h4 className="text-center">Status</h4>
        <h4 className="text-center">Priority</h4>
        <h4 className="text-center">Actions</h4>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar pr-2">
        {tasks && tasks.length > 0 ? (
          tasks.map((task) => (
            <div
              key={task.id}
              className="grid grid-cols-1 md:grid-cols-[2.5fr_1fr_1fr_1.5fr] gap-4 items-center py-4 px-4 mb-3 bg-gray-700 rounded-lg
                         hover:bg-gray-600 transition-colors duration-200 ease-in-out
                         border-b border-gray-600 last:border-b-0"
            >
              <div className="col-span-full md:col-auto text-base font-semibold truncate text-left">
                <span className="md:hidden font-semibold text-gray-400">
                  Task:{" "}
                </span>
                {task.title}
              </div>

              <div className="col-span-full md:col-auto flex justify-center md:justify-start">
                <span
                  className={`text-xs font-semibold px-3 py-1 rounded-full text-white ${getStatusClasses(
                    task.status
                  )}`}
                >
                  {task.status}
                </span>
              </div>

              <div className="col-span-full md:col-auto flex justify-center md:justify-start">
                <span
                  className={`text-xs font-semibold px-3 py-1 rounded-full text-white ${getPriorityClasses(
                    task.priority
                  )}`}
                >
                  {task.priority}
                </span>
              </div>

              <div className="col-span-full md:col-auto flex justify-center gap-2 mt-3 md:mt-0">
                <button
                  onClick={() => handleAction("Accept", task.id)}
                  className="p-2 rounded-full bg-green-500 hover:bg-green-600 transition-colors duration-200"
                  title="Accept Task"
                >
                  {/* Checkmark icon SVG */}
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                    stroke="currentColor"
                    className="w-5 h-5"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </button>
                <button
                  onClick={() => handleAction("Reject", task.id)}
                  className="p-2 rounded-full bg-red-500 hover:bg-red-600 transition-colors duration-200"
                  title="Reject Task"
                >
                  {/* X icon SVG */}
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                    stroke="currentColor"
                    className="w-5 h-5"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-400 py-8">
            No new tasks to display.
          </p>
        )}
      </div>
    </div>
  );
};

export default NewTask;
