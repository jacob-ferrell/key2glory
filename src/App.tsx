import { RouterProvider, createBrowserRouter } from "react-router-dom";
import HeaderLayout from "./components/HeaderLayout";
import Game from "./pages/Game/Game";
import LandingPage from "./pages/LandingPage/LandingPage";
import BrowseTests from "./pages/BrowseTests/BrowseTests";
import UserStats from "./pages/UserStats/UserStats";
import CreateTest from "./pages/CreateTest/CreateTest";
import Leaderboards from "./pages/Leaderboards/Leaderboards";
import NotFound from "./pages/NotFound/NotFound";

const router = createBrowserRouter([
  {
    element: <HeaderLayout />,
    children: [
      {
        path: "/",
        element: <LandingPage />,
      },
      {
        path: "/typing-test/:testId",
        element: <Game />,
      },
      {
        path: "/typing-test/browse",
        element: <BrowseTests />,
      },
      {
        path: "/leaderboards",
        element: <Leaderboards />,
      },
      {
        path: "/user/stats",
        element: <UserStats />,
      },
      {
        path: "/create/:testType",
        element: <CreateTest />,
      },
      {
        path: "*",
        element: <NotFound />,
      },
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
