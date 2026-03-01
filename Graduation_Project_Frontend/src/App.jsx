import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Login from "./Pages/Login/Login";
import Layout from "./Components/Layout/Layout";
import CreatPass from "./Pages/CreatePass/CreatPass";

function App() {
let router = createBrowserRouter([
    {
      path: "/",
      element: <Layout />,
      children: [
      ],
    },
    { path: "/login", element: <Login /> },
    { path: "/createpass", element: <CreatPass/> },
  ]);

  return (
    <>
      <RouterProvider router={router} />
    </>
  )
}

export default App
