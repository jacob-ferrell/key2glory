//import { useState } from "react";
import test1 from "./assets/test-strings/test1";
//import test2 from "./assets/test-strings/test2";
//import test3 from "./assets/test-strings/test3";
import testNumbers from "./assets/test-strings/testNumbers";
import "./App.css";
import Game from "./pages/Game/Game";
import Navbar from "./components/Navbar";
import { Outlet, RouterProvider, createBrowserRouter } from "react-router-dom";
import LandingPage from "./pages/LandingPage/LandingPage";
import testSpecial from "./assets/test-strings/testSpecial";

const HeaderLayout = () => (
  <>
    <header>
      <Navbar />
    </header>
    <Outlet />
  </>
);

const router = createBrowserRouter([
  {
    element: <HeaderLayout />,
    children: [
      {
        path: "/",
        element: <LandingPage />,
      },
      {
        path: '/test-basic',
        element: <Game text={test1} />,
      },
      {
        path: "/test-numbers",
        element : <Game text={testNumbers} />,
      },
      {
        path: "/test-special",
        element : <Game text={testSpecial} />,
      },
      {
        path: '/bar',
        element: <div>foo</div>,
      }
    ],
  },
]);

function App() {
  return (
    <div>
      <RouterProvider router={router} />
    </div>
  );
}

export default App;
