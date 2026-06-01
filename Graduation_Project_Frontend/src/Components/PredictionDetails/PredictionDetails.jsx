import React, { useState , useEffect } from 'react'
import { X , Calendar ,FlaskConical , FileText } from 'lucide-react'
import { getInitials } from '../../helpers/getInitials'
import { formatDate } from '../../helpers/formatDate'
import ProgressBar from '../ProgressBar/ProgressBar'
import ClinicalDataCard from '../ClinicalDataCard/ClinicalDataCard'
import RiskFactorCard from '../RiskFactorCard/RiskFactorCard'
import { useContext } from 'react'
import { UserContext } from '../context/User.context'
import axios from 'axios'
export default function PredictionDetails({predictionId , onClose}) {

    const {token} = useContext(UserContext);
    const [prediction , setPrediction] = useState(null);

    const getPredictionById = async (predictionId) => {
  try {
    const res = await axios.get(
      `https://her-journey-1044023551709.us-central1.run.app/api/Doctor/predictions/${predictionId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const data = res.data;

    const formattedPrediction = {
      id: data.predictionRecordId,
      patientName: data.patientName,
      image: data.profileImageUrl,
      type: data.type,
      date: data.date,
      result: data.result,
      confidence: data.confidence,
      clinicalData: data.inputJson ? JSON.parse(data.inputJson) : {},
      rawResponse: data.rawResponseJson ? JSON.parse(data.rawResponseJson) : {},
    };

    setPrediction(formattedPrediction);
  } catch (error) {
    console.error("Failed to fetch prediction:", error);
  }
};

    const [image , setImage] = useState(null)
    const getConfidenceColor = (value) => {
        if (value >= 70) return "#C97272FF"; 
        if (value >= 50) return "#DAA520";
        return "#4A6B4E"; 
    };
    
    useEffect(() => {
        if (!predictionId) return;
        getPredictionById(predictionId);
    }, [predictionId]);

    const confidence = 40;
    const color = getConfidenceColor(prediction?.confidence);
    const data = prediction?.clinicalData;

    return <>
    <div className='fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-c  z-50 p-4'>
       <div className='bg-white rounded-2xl shadow-[0px_2px_4px_#00000012] w-full max-w-5xl px-4 mt-16  h-fit  pb-5 pt-4  overflow-y-auto'>
            <div className="flex justify-end" onClick={onClose}>
                <X size={20} className="text-[#8A9A8AFF] cursor-pointer" />
            </div>

            <div className="flex bg-white rounded-xl shadow overflow-hidden  mt-2">
                <div className="w-[4px] bg-gradient-to-b from-[#4A5F4E] to-[#667E68]"></div>
                <div className="flex px-3 py-3 justify-between items-center w-full">
                    <div className='flex flex-row items-center gap-4'>
                        <div className=" cursor-pointer relative"  >
                                {image ? (
                                <img
                                    src={prediction?.image}
                                    alt="User Avatar"
                                    onError={() => setImageError(true)}
                                    className="w-14 h-14 rounded-full object-cover cursor-pointer"
                                />
                                ) : (
                    
                                <div className="w-16 h-16 rounded-full bg-[#4A6B4E] flex items-center justify-center text-lg text-white font-bold">
                                    {getInitials(prediction?.patientName)}
                                </div>
                                )}
            
                                <div className='w-3 h-3 rounded-full bg-[#3ac654] absolute bottom-0 right-1 z-10 border-[2px] border-white'></div>
                
                        </div>
                        <div className='flex flex-col  justify-center gap-1 '>
                                <div className='flex flex-col  gap-1'>
                                    <div className='flex flex-row gap-2 items-center'>
                                        <h1 className="font-bold text-[#191B18FF] text-lg cursor-pointer ">
                                            {prediction?.patientName}
                                        </h1>
                                        <div className='bg-[#EAF6EAFF] text-[#667E68FF] font-semibold flex flex-row items-center py-1 px-2 text-xs rounded-3xl'>
                                            {prediction?.type} Assessment
                                        </div>
                                    </div>
                            
                                    <div className='flex flex-row items-center gap-1'>
                                        <Calendar size={12} className="text-[#566454]" />
                                        <span className="text-[#a3a79f] text-xs">
                                        Predication Date:  {formatDate(prediction?.date)}
                                        </span>
                                    </div>
                                </div>
                        </div>
                    </div>
                        <div className='flex flex-col gap-1 px-3 py-2 w-4/12'>
                            <div className='flex flex-row items-center justify-between gap-6'>
                                <p className=' font-semibold text-xs ' style={{ color }}>{prediction?.result} Detected</p>
                            </div>
                            <div className='flex flex-row  items-center gap-2'>
                                <ProgressBar  value={prediction?.confidence} />
                                <p className='text-xs font-bold' > {prediction?.confidence}%</p>
                            </div>
                        </div>
                </div>
            </div>
            <div className="flex flex-col px-3 py-4 bg-white rounded-xl shadow overflow-hidden  mt-4">
                <div className='flex w-full flex-row items-center justify-between border-b pb-3'>
                    <div className='flex flex-row items-center gap-2'>
                        <FlaskConical size={19} className='text-[#667E68FF]' />
                        <h2 className='font-bold text-[#191B18FF] text-sm'>Clinical Data Used For Prediction</h2>
                    </div>
                    <div className='flex flex-row items-center py-1 px-2 text-xs  rounded-3xl bg-[#526654FF] text-white'>
                        12 Parameters
                    </div>

                </div>
                
                <div className='w-full grid grid-cols-5 gap-3 mt-4 border-b pb-6'>

                    {data && ( <>
                        <ClinicalDataCard feature="Age" value={data.Age} unit="years" />
                        <ClinicalDataCard feature="No_of_Pregnancy" value={data.No_of_Pregnancy} unit="count" />
                        <ClinicalDataCard feature="Prev. Gestation" value={data.Gestation_in_previous_Pregnancy} unit="count" />
                        <ClinicalDataCard feature="BMI" value={data.BMI} unit="kg/m²" />
                        <ClinicalDataCard feature="HDL" value={data.HDL} unit="mg/dL" />
                        <ClinicalDataCard feature="Systolic BP" value={data.Sys} unit="mmHg" />
                        <ClinicalDataCard feature="Diastolic BP" value={data.dia} unit="mmHg" />
                        <ClinicalDataCard feature="Hemoglobin" value={data.Hemoglobin} unit="g/dL" />
                        <ClinicalDataCard feature="OGTT" value={data.OGTT} unit="mg/dL" />
                    </>
                    )}

                </div>

                <div className='mt-3'>
                     <h2 className='font-bold text-[#191B18FF] text-sm'>Identified Risk Factors</h2>
                     <div className='flex items-center gap-3 mt-3 w-full'>

                        {data && ( <>
                            <RiskFactorCard label="Family History" flag={data.Family_History} />
                            <RiskFactorCard label="PCOS History" flag={data.PCOS} />
                            <RiskFactorCard label="Unexplained Loss" flag={data.unexplained_prenetal_loss} />
                            <RiskFactorCard label="Previous GDM" flag={data.Prediabetes} />
                            <RiskFactorCard label="Sedentary Lifestyle" flag={data.Sedentary_Lifestyle} />
                            <RiskFactorCard label="Large Child/Birth Defect" flag={data.Large_Child_or_Birth_Default} />
                            
                        </>
                        )}

                     </div>
                </div>
            </div>

       </div>
    </div>
  
  
  </>
}
