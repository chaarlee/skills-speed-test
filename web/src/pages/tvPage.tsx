import { getStats } from "@/clients/sst-client";
import { useEffect, useState } from "react";
import { CircleCheckBig, CircleX, Rabbit } from "lucide-react";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import "/node_modules/flag-icons/css/flag-icons.min.css";

const pad = (num, size) => {
  num = num.toString();
  while (num.length < size) num = "0" + num;
  return num;
};

const timeFormatter = (time) => {
  // const hours = Math.floor(time / 3600);
  // const minutes = Math.floor((time % 3600) / 60);
  const minutes = Math.floor(time / 60);
  const seconds = time % 60;
  // return `${pad(hours, 2)}:${pad(minutes, 2)}:${pad(seconds, 2)}`;
  return `${pad(minutes, 2)}:${pad(seconds, 2)}`;
};

export default function TVPage() {
  const [stats, setStats] = useState(null);
  const [remainingTime, setRemainingTime] = useState(-1);
  const [timer, setTimer] = useState(null);

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

  const resetTimer = () => {
    const _timer = stats.general.mins * 60;
    setRemainingTime(_timer);
  };

  const startTimer = () => {
    if (stats.general.mins) {
      const _timer = setInterval(() => {
        setRemainingTime((remainingTime) => {
          if (remainingTime === 0) {
            stopTimer();
            clearInterval(_timer);
            return 0;
          }
          return remainingTime - 1;
        });
      }, 1000);
      setTimer(_timer);
    }
  };

  const stopTimer = () => {
    clearInterval(timer);
    setTimer(null);
  };

  const clickTimer = () => {
    if (!timer) {
      if (remainingTime === -1) {
        resetTimer();
      }
      startTimer();
    } else {
      stopTimer();
    }
  };

  if (!stats || stats.competitors?.length === 0) return "loading...";

  const competitorsCnt = stats.competitors.length;

  return (
    <div className="flex flex-col h-screen w-full justify-between p-2">
      <div className={`grid grid-cols-${competitorsCnt + 2} gap-2 m-1 h-24`}>
        {/* <div className={`grid grid-cols-5 gap-2 m-1`}> */}
        <div className="col-span-2 bg-skills text-primary-foreground h-24 flex items-center justify-between pl-4">
          <div
            className="w-[66%] flex flex-nowrap items-center hover:cursor-pointer"
            onClick={resetTimer}
          >
            <Rabbit className="h-16 w-16" />
            <span className="font-bold pl-4 text-4xl">Skills - Speed Test</span>
          </div>
          <div
            className="text-5xl pr-4 font-bold font-mono hover:cursor-pointer"
            onClick={clickTimer}
          >
            <span>
              {remainingTime !== -1
                ? timeFormatter(remainingTime)
                : `${stats.general.mins}:00`}
            </span>
          </div>
        </div>
        {stats.competitors.map((competitor) => (
          <div
            key={competitor.id}
            className="col-span-1 bg-skills text-primary-foreground h-24 flex items-center justify-start"
          >
            <div className="flex gap-2 items-center ml-4 relative">
              <Avatar className="h-32 w-32 border-4 border-white">
                <AvatarImage src={competitor.photoUrl} />
              </Avatar>
              <div className="absolute bottom-2 left-24 border-2 border-white">
                <span className={`fi fi-${competitor.nationality} text-3xl`} />
              </div>
              <span className="text-xl font-bold ml-4 w-full text-center">
                {competitor.name}
              </span>
            </div>
          </div>
        ))}
      </div>
      <div className="h-full flex flex-col justify-between">
        {stats.tasks.map((task) => (
          <div
            key={task.id}
            className={`grid grid-cols-${competitorsCnt + 2} gap-2 m-1 h-full`}
          >
            <div className="col-span-2 h-full flex items-center justify-center font-bold border-gray-200 border-2">
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
                className={`col-span-1 h-full flex items-center justify-center ${
                  task.competitorsSubmission[competitor.id]
                    ?.totalSubmissions === 0
                    ? "bg-gray-50"
                    : task.competitorsSubmission[competitor.id]?.isSuccessful
                    ? "bg-green-200"
                    : "bg-red-200"
                }`}
              >
                {task.competitorsSubmission[competitor.id]?.totalSubmissions ===
                0 ? (
                  "-"
                ) : (
                  <div className={`flex items-center gap-2`}>
                    {task.competitorsSubmission[competitor.id]?.isSuccessful ? (
                      <CircleCheckBig className="text-green-500 w-8 h-8" />
                    ) : (
                      <CircleX className="text-red-500 w-8 h-8" />
                    )}
                    {/* <span className="text-muted-foreground">
                    (
                    {
                      task.competitorsSubmission[competitor.id]
                        ?.totalSubmissions
                    }
                    )
                  </span> */}
                  </div>
                )}
              </div>
            ))}
          </div>
        ))}
      </div>
      <div className={`grid grid-cols-${competitorsCnt + 2} gap-2 m-1 h-20`}>
        <div className="col-span-2 h-20 flex items-center justify-end font-bold pr-4 gap-2 text-4xl">
          <span>∑</span>
          <span>{stats.totalPoint} pt</span>
        </div>
        {stats.competitors.map((competitor) => (
          <div
            key={competitor.id}
            className="col-span-1 h-20 flex items-center justify-center font-bold text-4xl"
          >
            <span>{competitor.point} pt</span>
          </div>
        ))}
      </div>
      {/* <pre>{JSON.stringify(stats, null, 2)}</pre> */}
    </div>
  );
}
