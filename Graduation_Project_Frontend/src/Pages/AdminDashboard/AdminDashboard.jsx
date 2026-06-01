import img from "../../assets/download.png";
import { useState, useEffect, useContext } from "react";
import axios from "axios";

import AdminDashboardFilter from "../../Components/AdminDashboardFilter/AdminDashboardFilter";
import AdminInterfaceNavbar from "../../Components/AdminInterfaceNavbar/AdminInterfaceNavbar";
import DashboardUserRow from "../../Components/DashboardUserRow/DashboardUserRow";
import DashboardTableHeader from "../../Components/DashboardTableHeader/DashboardTableHeader";
import Pagination from "../../Components/Pagination/Pagination";
import UpdateUserData from "../../Components/UpdateUserData/UpdateUserData";
import DeleteUser from "../../Components/DeleteUser/DeleteUser";
import { UserContext } from "../../Components/context/User.context";


export default function Dashboard() {
  const { token } = useContext(UserContext); 
  const [search, setSearch] = useState("");
  const [role, setRole] = useState("all");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [sort, setSort] = useState("DateDesc");

  const [users, setUsers] = useState([]);
  const [totalItems, setTotalItems] = useState(0);

  const [page, setPage] = useState(1);
  const pageSize = 10;

  const [loading, setLoading] = useState(false);

  const [showUpdate, setShowUpdate] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showDelete, setShowDelete] = useState(false);

  const openUpdate = (user) => { setSelectedUser(user); setShowUpdate(true); };
  const openDelete = (user) => { setSelectedUser(user); setShowDelete(true); };

  const getUsers = async () => {
    try {
      setLoading(true);

      const params = {
        search,
        FromDate: fromDate || "",
        ToDate: toDate || "",
        sort,
        pageNumber: page,
        PageSize: pageSize,
        };

    if (role !== "all") {
      params.Role = role;
    }

    const query = new URLSearchParams(params);

    const { data } = await axios.get(
      `https://her-journey-669913381811.us-central1.run.app/api/Admin/DashBoard?${query.toString()}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const list = Array.isArray(data)
      ? data
      : data.data || data.users || data.items || [];

    const formattedUsers = list.map((u) => ({
      id: u.id,
      name: u.displayName,
      email: u.email,
      role: u.role,
      phone: u.phoneNumber || "",
      avatar: img,
      registered: u.createdAt
        ? new Date(u.createdAt).toLocaleDateString()
        : "",
      actived: u.actived,
    }));

    setUsers(formattedUsers);
    setTotalItems(data.totalCount || data.total || list.length);

  } catch (error) {
    console.error("Failed to fetch users:", error);
  } finally {
    setLoading(false);
  }
};

  // debounce
  useEffect(() => {
    const delay = setTimeout(() => {
      getUsers();
    }, 500);

    return () => clearTimeout(delay);
  }, [search, role, fromDate, toDate, sort, page, token]);

  const handleReset = () => {
    setSearch("");
    setRole("all");
    setFromDate("");
    setToDate("");
    setSort("DateDesc");
    setPage(1);
  };

  const totalPages = Math.ceil(totalItems / pageSize);

  return (
    <>
      <AdminInterfaceNavbar />
      <div className="px-6 lg:px-16 py-8 bg-gradient-to-br from-primary-50 to-primary-100 min-h-screen">
        <AdminDashboardFilter
          search={search} setSearch={setSearch}
          role={role} setRole={setRole}
          fromDate={fromDate} setFromDate={setFromDate}
          toDate={toDate} setToDate={setToDate}
          sort={sort} setSort={setSort}
          setPage={setPage}
          handleReset={handleReset}
        />

        <div className="bg-white rounded-lg shadow-[0px_2px_4px_#00000012]">
          <DashboardTableHeader />

          {loading ? (
            <p className="p-4 text-center">Loading...</p>
          ) : users.length > 0 ? (
            users.map((user) => (
              <DashboardUserRow
                key={user.id}
                role={user.role}
                user={user}
                onEdit={openUpdate}
                onDelete={openDelete}
              />
            ))
          ) : (
            <p className="p-4 text-center text-gray-500">
              No users found.
            </p>
          )}

          <Pagination
            currentPage={page}
            totalPages={totalPages}
            totalItems={totalItems}
            itemsPerPage={pageSize}
            onPageChange={setPage}
          />
        </div>

        {showUpdate && selectedUser && (
          <UpdateUserData user={selectedUser}
            onClose={(updated) => {
              setShowUpdate(false);
              if (updated) getUsers();
            }}
          />
        )}

        {showDelete && selectedUser && (

          <DeleteUser user={selectedUser}
            onClose={(deleted) => {
              setShowDelete(false);
              if (deleted) getUsers();
            }}
          />
        )}
      </div>
    </>
  );
}