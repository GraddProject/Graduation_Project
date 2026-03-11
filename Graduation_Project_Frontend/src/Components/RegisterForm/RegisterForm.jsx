import React, { useState } from 'react'
import RoleCard from '../RoleCard/RoleCard'
import { User , Stethoscope } from 'lucide-react'

export default function RegisterForm() {
  const [role , setRole] = useState("patient");

  return (
    <div className='flex items-center justify-center flex-col mt-14 py-4 px-6 mx-auto w-fit bg-white rounded-[11px] shadow-[0_10px_40px_#00000014,0_0_0_#171a1f00]'>
        <h1 className='text-[12px] font-bold text-[#2C3E2FFF] uppercase'>Select User Role</h1>
        <div className="roles flex gap-4 mt-4">
      <RoleCard
        title="Patient"
        description="Regular medical user"
        icon={User}
        active={role === "patient"}
        onClick={() => setRole("patient")}
      />

      <RoleCard
        title="Doctor"
        description="Medical practitioner"
        icon={Stethoscope}
        active={role === "doctor"}
        onClick={() => setRole("doctor")}
      />
        </div>
    </div>
  )
}
