import React, { useState, useEffect, useContext } from 'react'
import StatisticsCard from '../../Components/StatisticsCard/StatisticsCard'
import { UsersRound, Calendar, TriangleAlert } from "lucide-react";
import PatientDataCard from '../../Components/PatientDataCard/PatientDataCard';
import Pagination from '../../Components/Pagination/Pagination';
import DoctorAppointmentOverview from '../../Components/DoctorAppointmentOverview/DoctorAppointmentOverview';
import { UserContext } from "../../Components/context/User.context";
import axios from 'axios';
import DoctorDashboardFilter from '../../Components/DoctorDashboardFilter/DoctorDashboardFilter';
import Loading from '../../Components/Loading/Loading';

export default function DoctorDashboard() {

  const { token } = useContext(UserContext);

  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("NextAppointmentAsc");
  const [view, setView] = useState("grid");

  const [patients, setPatients] = useState([]);
  const [totalItems, setTotalItems] = useState(0);
  const [page, setPage] = useState(1);
  const pageSize = 10;

  const [loading, setLoading] = useState(true);

  const [overviewData, setOverviewData] = useState(null);
  const [dateFilter, setDateFilter] = useState("ThisMonth");
  const [overviewLoading, setOverviewLoading] = useState(false);
  const [cardsData, setCardsData] = useState(null);

  const [initialPatientsLoaded, setInitialPatientsLoaded] = useState(false);

  const getAllPatients = async () => {
    try {
      setLoading(true);

      const params = {
        search,
        sort,
        pageNumber: page,
        PageSize: pageSize,
      };

      const { data } = await axios.get(
        "https://her-journey-1044023551709.us-central1.run.app/api/Doctor/patients",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          params: params
        }
      );

      const list = Array.isArray(data)
        ? data
        : data.data || data.patients || data.items || [];

      const formattedPatients = list.map((p) => ({
        id: p.patientId,
        name: p.displayName,
        image: p.profileImageUrl,
        email: p.email,
        phone: p.phoneNumber || "",
        pregnancyWeek: p.pregnancyWeek,
        trimester: p.trimester,
        RiskLevel: p.riskLevel,
        lastAppointmentDate: p.lastAppointmentAt,
        nextAppointmentDate: p.nextAppointmentAt,
        createdDate: p.createdAt
      }));

      setPatients(formattedPatients);
      setTotalItems(data.totalCount || data.total || list.length);

      if (!initialPatientsLoaded) {
        setInitialPatientsLoaded(true);
      }

    } catch (error) {
      console.error("Failed to fetch patients:", error);
    } finally {
      setLoading(false);
    }
  };

  const getOverview = async () => {
    try {
      setOverviewLoading(true);

      const { data } = await axios.get(
        "https://her-journey-1044023551709.us-central1.run.app/api/Doctor/DashboardAppointmentAndAvailabiltyOverviewOnThisMonth",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          params: { dateFilter }
        }
      );

      setOverviewData(data);

    } catch (error) {
      console.error("Failed to fetch overview:", error);
    } finally {
      setOverviewLoading(false);
    }
  };

  const getDashboardCardData = async () => {
    try {
      setLoading(true);

      const { data } = await axios.get(
        "https://her-journey-1044023551709.us-central1.run.app/api/Doctor/dashboard/cards",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setCardsData(data);

    } catch (error) {
      console.error("Failed to fetch dashboard card data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const delay = setTimeout(() => {
      getAllPatients();
    }, 500);

    return () => clearTimeout(delay);
  }, [search, sort, page, token]);

  useEffect(() => {
    getOverview();
  }, [token, dateFilter]);

  useEffect(() => {
    getDashboardCardData();
  }, [token]);

  useEffect(() => {
  console.log("SORT CHANGED:", sort);
}, [sort]);

  const statisticsCards = [
    {
      icon: UsersRound,
      title: "Total Patients",
      value: cardsData?.totalPatients,
      iconColor: "#667E68FF",
      circleColor: "#F5FAF5FF",
    },
    {
      icon: Calendar,
      title: "Appointments Today",
      value: cardsData?.appointmentsToday,
      iconColor: "#2196F3FF",
      circleColor: "#E3F2FDFF",
    },
    {
      icon: TriangleAlert,
      title: "GDM High Risk Cases",
      value: cardsData?.gdmHighRiskCases,
      iconColor: "#CA001EFF",
      circleColor: "#F3E5F5FF",
    },
    {
      icon: TriangleAlert,
      title: "Preeclampsia High Risk Cases",
      value: cardsData?.preeclampsiaHighRiskCases,
      iconColor: "#CA001EFF",
      circleColor: "#F3E5F5FF",
    },
  ];

  const totalPages = Math.ceil(totalItems / pageSize);

  if (!initialPatientsLoaded) {
    return (
      <Loading text='Loading dashbboard data.....'/>
    );
  }

  return (
    <div className='bg-[#F7F9F7FF] w-full flex flex-col px-3 lg:px-8 py-4 flex-1'>

      <div className="grid grid-cols-2  lg:grid-cols-4 gap-3">
        {statisticsCards.map((card, index) => (
          <StatisticsCard key={index} {...card} />
        ))}
      </div>

      <DoctorDashboardFilter
        search={search}
        setSearch={setSearch}
        view={view}
        setView={setView}
        setPage={setPage}
        sort={sort}
        setSort={setSort}
      />

      <div className={
    view === "grid"
      ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 w-full gap-x-6 gap-y-4 border-b pb-6 mt-5"
      : "flex flex-col gap-2 mt-5"
      }>
        {patients.map((p) => (
          <PatientDataCard key={p.id} view={view} patient={p} />
        ))}
      </div>

      <div className='border-b'>
        {totalItems > 0 && (
          <Pagination
            currentPage={page}
            totalPages={totalPages}
            totalItems={totalItems}
            itemsPerPage={pageSize}
            onPageChange={setPage}
          />
        )}
      </div>

      <DoctorAppointmentOverview
        data={overviewData}
        loading={overviewLoading}
        dateFilter={dateFilter}
        setDateFilter={setDateFilter}
      />

    </div>
  );
}