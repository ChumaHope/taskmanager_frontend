"use client";

import { useEffect, useState } from "react";
import { api } from "./lib/api";
import { Task } from "./types/task";

export default function Home() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [taskTitle, setTaskTitle] = useState<string>("");
  const [filter, setFilter] = useState<"ALL" | "COMPLETED" | "PENDING">("ALL");
  const [loading, setLoading] = useState<boolean>(true);

  const fetchTasks = async () => {
    try {
      const data = await api<Task[]>("/api/tasks");
      setTasks(data);
    } catch (err: any) {
      if (err.message.includes("401") || err.message.includes("403")) {
        window.location.href = "/login";
      } else {
        console.error(err);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleAddTask = async () => {
    if (!taskTitle.trim()) return;

    await api("/api/tasks", {
      method: "POST",
      body: JSON.stringify({
        title: taskTitle,
        completed: false,
      }),
    });

    setTaskTitle("");
    fetchTasks();
  };

  const toggleTask = async (id: number) => {
    await api(`/api/tasks/${id}`, { method: "PUT" });
    fetchTasks();
  };

  const deleteTask = async (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    await api(`/api/tasks/${id}`, { method: "DELETE" });
    fetchTasks();
  };

  const completedCount = tasks.filter((t) => t.completed).length;

  const filteredTasks = tasks.filter((task) => {
    if (filter === "COMPLETED") return task.completed;
    if (filter === "PENDING") return !task.completed;
    return true;
  });

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen text-lg">
        Loading...
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gray-100 flex justify-center items-start py-10">
      <div className="w-full max-w-xl bg-white shadow-xl rounded-2xl p-6">

        {/* Title */}
        <h1 className="text-3xl font-bold mb-4 text-center">
          Task Manager
        </h1>

        {/* Counter */}
        <p className="text-center text-gray-500 mb-6">
          {completedCount} / {tasks.length} completed
        </p>

        {/* Filters */}
        <div className="flex justify-center gap-2 mb-4">
          {["ALL", "COMPLETED", "PENDING"].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f as any)}
              className={`px-3 py-1 rounded-full text-sm ${
                filter === f
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 text-gray-700"
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        {/* Input */}
        <div className="flex gap-2 mb-6">
          <input
            type="text"
            placeholder="Enter task..."
            value={taskTitle}
            onChange={(e) => setTaskTitle(e.target.value)}
            className="flex-1 border rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-blue-400"
          />
          <button
            onClick={handleAddTask}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
          >
            Add
          </button>
        </div>

        {/* Task List */}
        <ul className="space-y-2">
          {filteredTasks.map((task) => (
            <li
              key={task.id}
              onClick={() => toggleTask(task.id)}
              className={`flex justify-between items-center p-3 rounded-lg cursor-pointer transition ${
                task.completed
                  ? "bg-green-100 line-through text-gray-500"
                  : "bg-gray-50 hover:bg-gray-100"
              }`}
            >
              <span>{task.title}</span>

              <button
                onClick={(e) => deleteTask(task.id, e)}
                className="text-red-500 hover:text-red-700 text-sm"
              >
                Delete
              </button>
            </li>
          ))}
        </ul>

      </div>
    </main>
  );
}