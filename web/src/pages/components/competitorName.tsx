import { getCompetitor } from "@/clients/sst-client";
import { useEffect, useState } from "react";

export default function CompetitorName() {
  const [competitor, setCompetitor] = useState(null);

  useEffect(() => {
    getCompetitor().then((data) => {
      console.log("data", data);
      setCompetitor(data);
    });
  }, []);

  if (!competitor) return "loading...";

  return <span className="text-sm font-bold">{competitor.name}</span>;
}
