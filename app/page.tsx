"use client";

import { useEffect, useState } from "react";

type Task = {
  id: number;
  title: string;
  completed: boolean;
};

export default function Home() {
  const [tasks, setTasks] = useState<Task[]>([]);

  useEffect(() => {
    fetch("http://localhost:8080/api/tasks")
      .then((res) => res.json())
      .then((data) => {
        console.log("Fetched tasks:", data);
        setTasks(data);
      })
      .catch((err) => console.error("Error fetching tasks:", err));
  }, []);

  return (
    <main >
      <h1>Task List</h1>

      {tasks.length === 0 ? (
        <p>No tasks found</p>
      ) : (
        <ul>
          {tasks.map((task) => (
            <li key={task.id}>
              {task.title} — {task.completed ? "✅ Done" : "❌ Not Done"}
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}