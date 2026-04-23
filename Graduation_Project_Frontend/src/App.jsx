import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Login from "./Pages/Login/Login";
import Layout from "./Components/Layout/Layout";
import CreatPass from "./Pages/CreatePass/CreatPass";
import UserProvider from "./Components/context/User.context";
import CreateUserAccount from "./Pages/CreateUserAccount/CreateUserAccount";
import Home from "./Pages/Home/Home";
import DoctorDashboard from "./Pages/DoctorDashboard/DoctorDashboard";
import PatientDashboard from "./Pages/PatientDashboard/PatientDashboard";
import DoctorViewAppointments from "./Pages/DoctorViewAppointments/DoctorViewAppointments";
import AdminDashboard from "./Pages/AdminDashboard/AdminDashboard";

function App() {
  let router = createBrowserRouter([
    {
      path: "/",
      element: <Layout />,
      children: [
        { index: true, element: <Home /> },
        { path: "/admin", element: <CreateUserAccount /> },
        { path: "/doctor/dashboard", element: <DoctorDashboard /> },
        { path: "/patient", element: <PatientDashboard /> },
        { path: "/doctor/appointments", element: <DoctorViewAppointments /> },
        { path: "/admindashboard", element: <AdminDashboard /> },
      ],
    },
    { path: "/login", element: <Login /> },
    { path: "/createpass", element: <CreatPass /> },
    { path: "/createaccount", element: <CreateUserAccount /> },
  ]);

  return (
    <UserProvider>
      <RouterProvider router={router} />
    </UserProvider>
  );
}

export default App;