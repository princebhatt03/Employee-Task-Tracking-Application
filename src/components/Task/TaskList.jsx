import React from "react";
import TaskCard from "./TaskCard"; // Ensure this path is correct based on where you save TaskCard.jsx

const TaskList = () => {
  // Sample dynamic task data
  const tasks = [
    {
      id: "task-1",
      title: "Develop MERN Stack E-commerce Site",
      description:
        "Build a fully functional e-commerce platform using MERN stack, including user authentication, product catalog, shopping cart, and payment gateway integration.",
      priority: "High",
      status: "In Progress",
      dueDate: "15 July 2025",
      assignedTo: "Shrey Vats",
    },
    {
      id: "task-2",
      title: "Design Mobile App UI/UX Flow",
      description:
        "Create wireframes and high-fidelity mockups for the new mobile application, focusing on user experience and intuitive navigation for the onboarding process.",
      priority: "High",
      status: "Pending",
      dueDate: "25 June 2025",
      assignedTo: "User Design",
    },
    {
      id: "task-3",
      title: "Refactor Database Schema for Performance",
      description:
        "Optimize existing database schema to improve query performance and scalability. This includes indexing, normalization review, and potential denormalization strategies.",
      priority: "Medium",
      status: "Accepted",
      dueDate: "10 July 2025",
      assignedTo: "Database Admin",
    },
    {
      id: "task-4",
      title: "Prepare Q2 Financial Report",
      description:
        "Compile all financial data for the second quarter, prepare balance sheets, income statements, and cash flow reports for executive review.",
      priority: "High",
      status: "Completed",
      dueDate: "30 May 2025", // Past date, indicating completion
      assignedTo: "Finance Team",
    },
    {
      id: "task-5",
      title: "Onboard New Marketing Interns",
      description:
        "Conduct orientation sessions, provide necessary tools and access, and assign initial training tasks for the new marketing interns joining this week.",
      priority: "Low",
      status: "In Progress",
      dueDate: "10 June 2025",
      assignedTo: "HR Department",
    },
    {
      id: "task-6",
      title: "Fix Critical Bug in Authentication Module",
      description:
        "Address and resolve the reported critical bug in the user authentication module causing intermittent login failures for a subset of users.",
      priority: "High",
      status: "Failed", // Example of a failed task
      dueDate: "01 June 2025",
      assignedTo: "Dev Team",
    },
  ];

  return (
    <div
      id="tasklist"
      className="flex items-stretch gap-6 mt-10 pb-6 pr-2 overflow-x-auto custom-scrollbar" // Added custom-scrollbar for a sleeker scrollbar
    >
      {tasks.map((task) => (
        <TaskCard key={task.id} task={task} />
      ))}
    </div>
  );
};

export default TaskList;
