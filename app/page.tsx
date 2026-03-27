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

  // ✅ Fetch all tasks
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

  // ✅ POST - Add Task
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

  // ✅ PUT - Toggle Task
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

  return (
    <main >
      <h1>Task Manager</h1>

      {/* ✅ Input */}
      <div >
        <input
          type="text"
          placeholder="Enter task..."
          value={taskTitle}
          onChange={(e) => setTaskTitle(e.target.value)}
          
        />
        <button onClick={handleAddTask}>Add Task</button>
      </div>

      {/* ✅ Task List */}
      <ul>
        {tasks.map((task) => (
          <li
            key={task.id}
            onClick={() => toggleTask(task.id)}
         
          >
            {task.title}
          </li>
        ))}
      </ul>
    </main>
  );
}