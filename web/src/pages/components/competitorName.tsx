import { getCompetitor } from "@/clients/sst-client";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { useEffect, useState } from "react";

export default function CompetitorName() {
  const [competitor, setCompetitor] = useState(null);

  useEffect(() => {
    getCompetitor().then((data) => {
      // console.log("data", data);
      setCompetitor(data);
    });
  }, []);

  if (!competitor) return "loading...";

  return (
    <>
      <Avatar className="h-8 w-8">
        <AvatarImage src={competitor.photoUrl} />
      </Avatar>

      <span className="text-sm font-bold">{competitor.name}</span>
    </>
  );
}
