import { Button } from "@/components/ui/button";

export default function tasksWithSubmissions({ tasks, setSelectedTask }) {
  if (!tasks.length) return "loading...";

  return (
    <div className="flex-col space-y-2 ml-4">
      {tasks.map((task) => (
        <div key={task.id} className="w-full">
          <Button
            variant={"outline"}
            className={`w-full flex justify-between opacity-70 ${
              task.submissions.length === 0
                ? ""
                : task.isSolved
                ? "bg-green-300"
                : "bg-red-300"
            }`}
            onClick={() => {
              setSelectedTask(task);
            }}
          >
            <div className="flex font-bold gap-2 items-center">
              <span className="text-muted-foreground text-xs">#{task.id}</span>
              <span>{task.name}</span>
            </div>
            <div>{task.point} pt</div>
          </Button>
        </div>
      ))}
    </div>
  );
}
