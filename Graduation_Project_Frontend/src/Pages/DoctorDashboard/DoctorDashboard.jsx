import React, { useState, useEffect , useContext } from 'react'
import StatisticsCard from '../../Components/StatisticsCard/StatisticsCard'
import { UsersRound, Calendar, MessageSquare , TriangleAlert , Search , Grid2x2 , List , ChevronDown , Bell , ArrowUpDown } from "lucide-react";
import PatientDataCard from '../../Components/PatientDataCard/PatientDataCard';
import Pagination from '../../Components/Pagination/Pagination';
import img from "../../assets/doctor.png";
import DoctorAppointmentOverview from '../../Components/DoctorAppointmentOverview/DoctorAppointmentOverview';
import { UserContext } from "../../Components/context/User.context";
import axios from 'axios';
import DoctorDashboardFilter from '../../Components/DoctorDashboardFilter/DoctorDashboardFilter';

export default function DoctorDashboard() {

  const { token } = useContext(UserContext); 
  
  const [search, setSearch] = useState("");
  const [risk, setRisk] = useState("all");
  const [pregnancyStage, setPregnancyStage] = useState("all");
  const [sort, setSort] = useState("NextAppointmentAsc");
  const [view, setView] = useState("grid");

  const [patients, setPatients] = useState([]);
  const [totalItems, setTotalItems] = useState(0);
  const [page, setPage] = useState(1);
  const pageSize = 10;

  const [loading, setLoading] = useState(false);
  
  const [overviewData, setOverviewData] = useState(null);
  const [dateFilter, setDateFilter] = useState("ThisMonth");
  const [overviewLoading, setOverviewLoading] = useState(false);
  const [cardsData, setCardsData] = useState(null);

  const getAllPatients = async () => {
    try {
      setLoading(true);

      const params = {
        search,
        sort,
        pageNumber: page,
        PageSize: pageSize,
      };


    const query = new URLSearchParams(params);

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
      image:p.profileImageUrl,
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
      console.log(formattedPatients);

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
            params: {
                dateFilter: dateFilter
            }
        }
        );

        setOverviewData(data);

        console.log("overview:", data);
    } catch (error) {
        console.error("Failed to fetch overview:", error);
    } finally {
        setOverviewLoading(false);
    }
  };
  const getDashboardCardData = async () => {
    try {
      const { data } = await axios.get(
        "https://her-journey-1044023551709.us-central1.run.app/api/Doctor/dashboard/cards",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setCardsData(data);
      console.log("Dashboard Cards Data:", data);
    } catch (error) {
      console.error("Failed to fetch dashboard card data:", error);
    }
  };

  useEffect(() => {
    const delay = setTimeout(() => {
      getAllPatients();
    }, 500);

    return () => clearTimeout(delay);
  }, [search, risk, pregnancyStage, , sort, page, token]);

  useEffect(() => {
    getOverview();
  }, [token , dateFilter]);
 
  useEffect(() => {
    getDashboardCardData();
  }, [token]);


  const totalPages = Math.ceil(totalItems / pageSize);

  return (
    <div className='w-full' >

      <div className='bg-[#F7F9F7FF] w-full  px-8 py-4 flex-1'>
      <div className="flex items-center gap-3">
        <StatisticsCard icon={UsersRound} title="Total Patients" value={cardsData?.totalPatients} iconColor={'#667E68FF'} circleColor={'#F5FAF5FF'} />
        <StatisticsCard icon={Calendar} title="Appointments Today" value={cardsData?.appointmentsToday} iconColor={'#2196F3FF'} circleColor={'#E3F2FDFF'} />
        <StatisticsCard icon={TriangleAlert} title="GDM High Risk Cases" value={cardsData?.gdmHighRiskCases} iconColor={'#CA001EFF'} circleColor={'#F3E5F5FF'} />
        <StatisticsCard icon={TriangleAlert} title="Preeclampsia High Risk Cases" value={cardsData?.preeclampsiaHighRiskCases} iconColor={'#CA001EFF'} circleColor={'#F3E5F5FF'} />
      </div>

      <DoctorDashboardFilter
        search={search}
        setSearch={setSearch}
        risk={risk}
        setRisk={setRisk}
        pregnancyStage={pregnancyStage}
        setPregnancyStage={setPregnancyStage}
        view={view}
        setView={setView}
        setPage={setPage}
        sort={sort}
        setSort={setSort}
      />

      <div className="mt-2">
        <div className={view === "grid" ? "grid grid-cols-3 w-full gap-x-6  border-b pb-6" : "flex flex-col "}>
          {patients.map((p) => (
            <PatientDataCard key={p.id} view={view} patient={p} />
          ))}
        </div>
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

      <div className=' mt-5 '>
        <DoctorAppointmentOverview data={overviewData} loading={loading}   dateFilter={dateFilter} setDateFilter={setDateFilter} />
      </div>

      </div>
      
  

    </div>
  );
}