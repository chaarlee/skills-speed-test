import useCookie, { setCookie } from "react-use-cookie";
import LoginPage from "./loginPage";
import { Rabbit } from "lucide-react";
import LogoutButton from "./components/logoutButton";
import CompetitorName from "./components/competitorName";
import TasksWithSubmissions from "./components/tasksWithSubmissions";
import { useEffect, useState } from "react";
import TaskWithSubmissions from "./components/taskWithSubmissions";
import { getTasksWithSubmissions } from "@/clients/sst-client";

export default function HomePage() {
  const [secret, setSecret] = useCookie("secret", "");
  const [tasks, setTasks] = useState([]);
  const [selectedTask, setSelectedTask] = useState(null);

  const loadTasks = () => {
    getTasksWithSubmissions().then((data) => {
      // console.log("data", data);
      setTasks(data);
    });
  };

  useEffect(() => {
    loadTasks();
  }, []);

  useEffect(() => {
    if (selectedTask) {
      const newSelectedTask = tasks.find((task) => task.id === selectedTask.id);
      if (newSelectedTask) {
        setSelectedTask(newSelectedTask);
      }
    }
  }, [tasks]);

  if (!secret) {
    // return redirect("/login");
    return <LoginPage />;
  }

  return (
    <div className="grid grid-cols-4 w-full gap-4">
      <header className="col-span-4">
        <div className="flex justify-between items-center h-16 px-4 bg-skills text-white">
          <div className="flex gap-4 items-center">
            <Rabbit className="h-8 w-8" />
            <span className="font-bold">Skills - Speed Test</span>
          </div>
          <div className="flex gap-4 items-center">
            <CompetitorName />
            <LogoutButton />
          </div>
        </div>
      </header>
      <div className="col-span-1">
        <TasksWithSubmissions tasks={tasks} setSelectedTask={setSelectedTask} />
      </div>
      {selectedTask && (
        <div className="col-span-3">
          <TaskWithSubmissions task={selectedTask} reloadTasks={loadTasks} />
        </div>
      )}
    </div>
  );
}
