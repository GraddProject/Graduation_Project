import AdminInterfaceNavbar from "../../Components/AdminInterfaceNavbar/AdminInterfaceNavbar";
import RegisterForm from "../../Components/RegisterForm/RegisterForm";


export default function CreateUserAccount() {


  return (
    <div className="bg-gradient-to-br from-primary-50 to-primary-100 min-h-screen min-w-screen">
      <AdminInterfaceNavbar/>
      <RegisterForm/>
      
    </div>
  );
}