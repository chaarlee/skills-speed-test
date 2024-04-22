import useCookie, { setCookie } from "react-use-cookie";
import LoginPage from "./loginPage";
import { Rabbit } from "lucide-react";
import LogoutButton from "./components/logoutButton";
import CompetitorName from "./components/competitorName";

export default function HomePage() {
  const [secret, setSecret] = useCookie("secret", "");
  if (!secret) {
    // return redirect("/login");
    return <LoginPage />;
  }

  return (
    <div className="grid grid-cols-4">
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
      <div className="col-span-1">Sidebar</div>
      <div className="col-span-3">Main</div>
    </div>
  );
}
