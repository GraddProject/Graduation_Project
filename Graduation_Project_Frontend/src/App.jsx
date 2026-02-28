import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Login from "./Pages/Login/Login";
import Layout from "./Components/Layout/Layout";

function App() {
let router = createBrowserRouter([
    {
      path: "/",
      element: <Layout />,
      children: [
      ],
    },
    { path: "/login", element: <Login /> },
  ]);

  return (
    <>
      <RouterProvider router={router} />
    </>
  )
}

export default App
