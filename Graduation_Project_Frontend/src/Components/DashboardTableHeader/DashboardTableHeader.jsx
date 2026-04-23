
export default function DashboardTableHeader() {
  return (
    <div className="hidden md:block w-full pt-6 pb-3 px-1 mt-5 ">
      <div className="users-info-nav px-2 grid grid-cols-[0.5fr_1.5fr_2fr_1fr_1.5fr_1fr_100px] uppercase text-[13px] text-[#2C3E2FFF] font-bold">
        <div></div>
        <div>User Name</div>
        <div>Email Address</div>
        <div>Role</div>
        <div>Phone</div>
        <div>Reg. Date</div>
        <div className="text-end mr-3">Actions</div>
      </div>
    </div>
  );
}