// src/components/TaskUser/MyTasks.jsx
import React from 'react';

// This component now accepts 'tasks' and 'updateTask' as props
const MyTasks = ({ tasks, updateTask }) => {
  const getStatusClasses = status => {
    switch (status?.toLowerCase()) {
      case 'pending':
      case 'new':
        return 'bg-blue-600';
      case 'accepted':
        return 'bg-indigo-600';
      case 'in progress':
        return 'bg-purple-600';
      case 'completed':
        return 'bg-lime-600';
      case 'failed':
        return 'bg-red-600';
      case 'rejected':
        return 'bg-orange-600';
      default:
        return 'bg-gray-500';
    }
  };

  const getPriorityClasses = priority => {
    switch (priority?.toLowerCase()) {
      case 'high':
        return 'bg-red-700';
      case 'medium':
        return 'bg-yellow-500 text-black';
      case 'low':
        return 'bg-green-600';
      default:
        return 'bg-gray-600';
    }
  };

  const handleAction = async (action, taskId, newStatus = null) => {
    try {
      if (action === 'UpdateStatus' && newStatus) {
        await updateTask(taskId, { status: newStatus });
        alert(`Task status updated to '${newStatus}'!`);
      } else if (action === 'View') {
        alert(`Viewing details for task: ${taskId}`);
      }
    } catch (error) {
      alert(`Action failed: ${error.message}`);
    }
  };

  return (
    <div className="bg-gray-800 p-8 rounded-2xl shadow-xl border border-gray-700 text-white h-[500px] flex flex-col">
      <h2 className="text-3xl font-bold mb-6 text-center text-white">
        My All Tasks
      </h2>

      <div className="hidden md:grid grid-cols-[2.5fr_1fr_1fr_1.5fr] gap-4 py-3 px-4 mb-2 bg-gray-700 rounded-lg font-semibold text-gray-300 border-b border-gray-600">
        <h4 className="text-left">Task Title</h4>
        <h4 className="text-center">Status</h4>
        <h4 className="text-center">Priority</h4>
        <h4 className="text-center">Actions</h4>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar pr-2">
        {tasks && tasks.length > 0 ? (
          tasks.map(task => (
            <div
              key={task._id}
              className="grid grid-cols-1 md:grid-cols-[2.5fr_1fr_1fr_1.5fr] gap-4 items-center py-4 px-4 mb-3 bg-gray-700 rounded-lg
                         hover:bg-gray-600 transition-colors duration-200 ease-in-out
                         border-b border-gray-600 last:border-b-0">
              <div className="col-span-full md:col-auto text-base font-semibold truncate text-left">
                <span className="md:hidden font-semibold text-gray-400">
                  Task:{' '}
                </span>
                {task.title}
              </div>

              <div className="col-span-full md:col-auto flex justify-center md:justify-start">
                <span
                  className={`text-xs font-semibold px-3 py-1 rounded-full text-white ${getStatusClasses(
                    task.status
                  )}`}>
                  {task.status}
                </span>
              </div>

              <div className="col-span-full md:col-auto flex justify-center md:justify-start">
                <span
                  className={`text-xs font-semibold px-3 py-1 rounded-full text-white ${getPriorityClasses(
                    task.priority
                  )}`}>
                  {task.priority}
                </span>
              </div>

              {/* Employee Actions for MyTasks */}
              <div className="col-span-full md:col-auto flex justify-center gap-2 mt-3 md:mt-0">
                <button
                  onClick={() => handleAction('View', task._id)}
                  className="p-2 rounded-full bg-blue-500 hover:bg-blue-600 transition-colors duration-200"
                  title="View Details">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                    stroke="currentColor"
                    className="w-5 h-5">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                </button>

                {(task.status.toLowerCase() === 'new' ||
                  task.status.toLowerCase() === 'pending') && (
                  <button
                    onClick={() =>
                      handleAction('UpdateStatus', task._id, 'in progress')
                    }
                    className="p-2 rounded-full bg-purple-500 hover:bg-purple-600 transition-colors duration-200"
                    title="Start Task">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={2}
                      stroke="currentColor"
                      className="w-5 h-5">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M5.25 5.653c0-.856.917-1.359 1.636-.936l10.05 5.654a1.5 1.5 0 010 2.672l-10.05 5.654c-.719.423-1.636-.08-1.636-.936V5.653z"
                      />
                    </svg>
                  </button>
                )}

                {(task.status.toLowerCase() === 'in progress' ||
                  task.status.toLowerCase() === 'accepted') && (
                  <button
                    onClick={() =>
                      handleAction('UpdateStatus', task._id, 'completed')
                    }
                    className="p-2 rounded-full bg-lime-600 hover:bg-lime-700 transition-colors duration-200"
                    title="Mark Complete">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={2}
                      stroke="currentColor"
                      className="w-5 h-5">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </button>
                )}

                {task.status.toLowerCase() !== 'completed' &&
                  task.status.toLowerCase() !== 'failed' &&
                  task.status.toLowerCase() !== 'rejected' && (
                    <button
                      onClick={() =>
                        handleAction('UpdateStatus', task._id, 'failed')
                      }
                      className="p-2 rounded-full bg-red-600 hover:bg-red-700 transition-colors duration-200"
                      title="Report Issue / Mark Failed">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={2}
                        stroke="currentColor"
                        className="w-5 h-5">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M12 9v3.75m-9.303 3.376c-.866 1.5.38 3.375 2.07 3.375h14.006c1.69 0 2.936-1.875 2.07-3.375L12.72 4.5C12.381 3.829 11.619 3.829 11.28 4.5L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
                        />
                      </svg>
                    </button>
                  )}
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-400 py-8">
            You have no tasks assigned.
          </p>
        )}
      </div>
    </div>
  );
};

export default MyTasks;
