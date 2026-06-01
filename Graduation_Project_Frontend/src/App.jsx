import { createBrowserRouter, RouterProvider } from "react-router-dom";

import Layout from "./Components/Layout/Layout";
import UserProvider from "./Components/context/User.context";

import Login from "./Pages/Login/Login";
import CreatPass from "./Pages/CreatePass/CreatPass";

import Home from "./Pages/Home/Home";

import DoctorDashboard from "./Pages/DoctorDashboard/DoctorDashboard";
import DoctorViewAppointments from "./Pages/DoctorViewAppointments/DoctorViewAppointments";
import Prediction from "./Pages/Prediction/Prediction";

import PatientDashboard from "./Pages/PatientDashboard/PatientDashboard";
import PatientProfile from "./Pages/DoctorPatientProfile/DoctorPatientProfile";

import AdminDashboard from "./Pages/AdminDashboard/AdminDashboard";
import CreateUserAccount from "./Pages/CreateUserAccount/CreateUserAccount";

import ProtectedRoute from "./Components/ProtectedRoute/ProtectedRoute";
import PredictionHistory from "./Pages/PredictionHistory/PredictionHistory";
import DoctorProfile from "./Pages/DoctorProfile/DoctorProfile";
import DoctorViewAppointments from "./Pages/DoctorViewAppointments/DoctorViewAppointments";


function App() {
  const router = createBrowserRouter([
    {
      children: [
        { path: "/", element: <Login /> },
        { path: "/login", element: <Login /> },
        { path: "/createpass", element: <CreatPass /> },
      ],
    },

    {
      element: <ProtectedRoute allowedRoles={["Doctor", "Patient"]} />,
      children: [
      {
        element: <Layout />,
        children: [ 
          {
            element: <ProtectedRoute allowedRoles={["Doctor"]} />,
            children: [
              { path: "/doctor/dashboard", element: <DoctorDashboard /> },
              { path: "/doctor/appointments", element: <DoctorViewAppointments /> },
              { path: "/doctor/prediction/:id", element: <Prediction /> },
              { path: "/doctor/prediction-history", element: <PredictionHistory /> },
              { path: "/doctor/profile", element: <DoctorProfile /> },
              { path: "/doctor/appointments", element: <DoctorViewAppointments /> },
              { path: "/doctor/patient-profile", element: <DoctorPatientProfile /> }
            ],
          },


          {
            element: <ProtectedRoute allowedRoles={["Patient"]} />,
            children: [
              { path: "/patient/dashboard", element: <PatientDashboard /> },
            ],
          },


        ],
      },
      ]
    },

    {
      element: <ProtectedRoute allowedRoles={["Admin"]} />,
      children: [
        { path: "/admindashboard", element: <AdminDashboard /> },
        { path: "/createaccount", element: <CreateUserAccount /> },
      ],
    },
  ]);

  return (
    <UserProvider>
      <RouterProvider router={router} />
    </UserProvider>
  );
}

export default App;