"use client";

import { useEffect, useState } from "react";

type Task = {
  id: number;
  title: string;
  completed: boolean;
};

export default function Home() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [taskTitle, setTaskTitle] = useState("");
  const [filter, setFilter] = useState("ALL");

  //  Fetch all tasks
  const fetchTasks = async () => {
    try {
      const res = await fetch("http://localhost:8080/api/tasks");
      const data = await res.json();
      setTasks(data);
    } catch (err) {
      console.error("Error fetching tasks:", err);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  //  POST - Add Task
  const handleAddTask = async () => {
    if (!taskTitle.trim()) return;

    try {
      await fetch("http://localhost:8080/api/tasks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: taskTitle,
          completed: false,
        }),
      });

      setTaskTitle("");
      fetchTasks(); // refresh list
    } catch (err) {
      console.error("Error adding task:", err);
    }
  };

  //  PUT - Toggle Task
  const toggleTask = async (id: number) => {
    try {
      await fetch(`http://localhost:8080/api/tasks/${id}`, {
        method: "PUT",
      });

      // Refresh after toggle
      fetchTasks();
    } catch (err) {
      console.error("Error toggling task:", err);
    }
  };

  // DELETE - Delete Task
  const deleteTask = async (id: number, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent triggering toggleTask when clicking delete button
    
    try {
      await fetch(`http://localhost:8080/api/tasks/${id}`, {
        method: "DELETE",
      });
      fetchTasks(); // refresh list after deletion
    } catch (err) {
      console.error("Error deleting task:", err);
    }
  };

  // Calculate completed tasks count
  const completedCount = tasks.filter(t => t.completed).length;

  // Filter tasks based on selected filter
  const filteredTasks = tasks.filter(task => {
    if (filter === "COMPLETED") return task.completed;
    if (filter === "PENDING") return !task.completed;
    return true; // "ALL" - return all tasks
  });

  return (
    <main>
      <h1>Task Manager</h1>

      {/* Task Counter */}
      <p>
        {completedCount} / {tasks.length} completed
      </p>

      {/* Filter Buttons */}
      <div>
        <button onClick={() => setFilter("ALL")}>All</button>
        <button onClick={() => setFilter("COMPLETED")}>Completed</button>
        <button onClick={() => setFilter("PENDING")}>Pending</button>
      </div>

      {/*  Input */}
      <div>
        <input
          type="text"
          placeholder="Enter task..."
          value={taskTitle}
          onChange={(e) => setTaskTitle(e.target.value)}
        />
        <button onClick={handleAddTask}>Add Task</button>
      </div>

      {/*  Task List */}
      <ul>
        {filteredTasks.map((task) => (
          <li key={task.id} onClick={() => toggleTask(task.id)}>
            {task.title}
            <button onClick={(e) => deleteTask(task.id, e)}>Delete</button>
          </li>
        ))}
      </ul>
    </main>
  );
}