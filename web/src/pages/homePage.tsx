import useCookie, { setCookie } from "react-use-cookie";
import LoginPage from "./loginPage";
import { Rabbit } from "lucide-react";
import LogoutButton from "./components/logoutButton";
import CompetitorName from "./components/competitorName";
import TasksWithSubmissions from "./components/tasksWithSubmissions";
import { useEffect, useState } from "react";
import TaskWithSubmissions from "./components/taskWithSubmissions";
import { getCompetitor, getTasksWithSubmissions } from "@/clients/sst-client";

export default function HomePage() {
  const [secret, setSecret] = useCookie("secret", "");
  const [tasks, setTasks] = useState([]);
  const [selectedTask, setSelectedTask] = useState(null);
  const [competitor, setCompetitor] = useState(null);

  useEffect(() => {
    getCompetitor().then((data) => {
      // console.log("data", data);
      setCompetitor(data);
    });
  }, []);

  const loadTasks = () => {
    if (!secret) return;
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
    <div className="flex flex-col h-screen w-full gap-4">
      <header className="w-full sticky top-0 z-50 border-b-white border-b-2">
        <div className="flex justify-between items-center h-16 px-4 bg-skills text-white">
          <div className="flex gap-4 items-center">
            <Rabbit className="h-8 w-8" />
            <span className="font-bold">Skills - Speed Test</span>
          </div>
          <div className="flex gap-4 items-center">
            <CompetitorName competitor={competitor} />
            <LogoutButton />
          </div>
        </div>
      </header>
      <main className="flex h-full gap-4 overflow-auto">
        <div className="w-[25%] h-full">
          <TasksWithSubmissions
            tasks={tasks}
            setSelectedTask={setSelectedTask}
          />
          <div className="sticky bottom-0">
            <button className="w-full h-12 bg-white font-bold mt-2 pr-4 justify-end items-center gap-2 flex">
              <span>Total:</span>
              <span>
                {tasks.reduce((acc, t) => {
                  return acc + t.point * (t.isSolved ? 1 : 0);
                }, 0)}{" "}
                pt
              </span>
            </button>
          </div>
        </div>
        {selectedTask && (
          <div className="w-[75%] h-full overflow-auto">
            <TaskWithSubmissions task={selectedTask} reloadTasks={loadTasks} />
          </div>
        )}
      </main>
    </div>
  );
}
