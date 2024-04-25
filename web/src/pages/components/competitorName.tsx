import { Avatar, AvatarImage } from "@/components/ui/avatar";

export default function CompetitorName({ competitor }) {
  if (!competitor) return "loading...";

  return (
    <div className="flex gap-2 items-center">
      <Avatar className="h-16 w-16 border-4 border-white">
        <AvatarImage src={competitor.photoUrl} />
      </Avatar>

      <span className="text-sm font-bold">{competitor.name}</span>
      {competitor.workstation?.length > 0 && (
        <span className="text-xs text-gray-300">
          ({competitor.workstation})
        </span>
      )}
      <span className={`fi fi-${competitor.nationality}`} />
    </div>
  );
}
