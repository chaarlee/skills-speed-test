import { getStats } from "@/clients/sst-client";
import { useEffect, useState } from "react";
import CompetitorName from "./components/competitorName";
import { CircleCheckBig, CircleX } from "lucide-react";

export default function TVPage() {
  const [stats, setStats] = useState(null);

  const loadStats = () => {
    getStats().then((data) => {
      // console.log("data", data);
      setStats(data);
    });
  };

  useEffect(() => {
    loadStats();
    window.setInterval(() => {
      loadStats();
    }, 5000);
  }, []);

  if (!stats || stats.competitors?.length === 0) return "loading...";

  const competitorsCnt = stats.competitors.length;

  return (
    <div className="flex flex-col h-screen w-full p-4">
      <div className={`grid grid-cols-${competitorsCnt + 2} gap-2 m-1`}>
        {/* <div className={`grid grid-cols-5 gap-2 m-1`}> */}
        <div className="col-span-2 bg-primary text-primary-foreground h-12 flex items-center justify-center font-bold">
          Task
        </div>
        {stats.competitors.map((competitor) => (
          <div
            key={competitor.id}
            className="col-span-1 bg-primary text-primary-foreground h-12 flex items-center justify-center"
          >
            <CompetitorName competitor={competitor} />
          </div>
        ))}
      </div>
      {stats.tasks.map((task) => (
        <div
          key={task.id}
          className={`grid grid-cols-${competitorsCnt + 2} gap-2 m-1`}
        >
          <div className="col-span-2 h-12 flex items-center justify-center font-bold border-gray-200 border-2">
            <div className="flex w-full justify-between mx-4 items-center">
              <div className="flex font-bold gap-2 items-center">
                <span className="text-muted-foreground">#{task.id}</span>
                <span>{task.name}</span>
              </div>
              <div>{task.point} pt</div>
            </div>
          </div>
          {stats.competitors.map((competitor) => (
            <div
              key={`${task.id}-${competitor.id}`}
              className="col-span-1 h-12 flex items-center justify-center border-gray-200 border-2"
            >
              {task.competitorsSubmission[competitor.id]?.totalSubmissions ===
              0 ? (
                "-"
              ) : (
                <div className="flex items-center gap-2">
                  {task.competitorsSubmission[competitor.id]?.isSuccessful ? (
                    <CircleCheckBig className="text-green-500 w-8 h-8" />
                  ) : (
                    <CircleX className="text-red-500 w-8 h-8" />
                  )}
                  <span className="text-muted-foreground">
                    (
                    {
                      task.competitorsSubmission[competitor.id]
                        ?.totalSubmissions
                    }
                    )
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>
      ))}
      <div className={`grid grid-cols-${competitorsCnt + 2} gap-2 m-1`}>
        <div className="col-span-2 h-12 flex items-center justify-end font-bold border-gray-200 border-2 pr-4 gap-2">
          <span>∑</span>
          <span>{stats.totalPoint} pt</span>
        </div>
        {stats.competitors.map((competitor) => (
          <div
            key={competitor.id}
            className="col-span-1 h-12 flex items-center justify-center border-gray-200 border-2 font-bold"
          >
            <span>{competitor.point} pt</span>
          </div>
        ))}
      </div>
      {/* <pre>{JSON.stringify(stats, null, 2)}</pre> */}
    </div>
  );
}
