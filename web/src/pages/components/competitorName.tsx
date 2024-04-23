import { Avatar, AvatarImage } from "@/components/ui/avatar";

export default function CompetitorName({ competitor }) {
  if (!competitor) return "loading...";

  return (
    <div className="flex gap-2 items-center">
      <Avatar className="h-8 w-8">
        <AvatarImage src={competitor.photoUrl} />
      </Avatar>

      <span className="text-sm font-bold">{competitor.name}</span>
      {competitor.workstation?.length > 0 && (
        <span className="text-xs text-gray-300">
          ({competitor.workstation})
        </span>
      )}
    </div>
  );
}
