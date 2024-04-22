import { createBrowserRouter } from "react-router-dom";
import HomePage from "@/pages/homePage";
import TVPage from "@/pages/tvPage";
import LoginPage from "@/pages/loginPage";

export default createBrowserRouter([
  {
    path: "/",
    element: <HomePage />,
  },
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/tv",
    element: <TVPage />,
  },
]);
