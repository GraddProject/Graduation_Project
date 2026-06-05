import { AlertCircle, CloudUpload , Stethoscope, X , FlaskConical } from "lucide-react";
import React, { useState, useContext, useEffect } from "react";
import { UserContext } from "../../Components/context/User.context";
import axios from "axios";
import LabTestCard from "../../Components/LabTestCard/LabTestCard";

export default function UploadTests() {
  const { token } = useContext(UserContext);

  const [selectedFiles, setSelectedFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [medicalTests, setMedicalTests] = useState([]);
  const [previewFile, setPreviewFile] = useState(null);

  const handleFileChange = (event) => {
    const files = Array.from(event.target.files);
    setSelectedFiles(files);
  };

  const handleClearAll = () => {
    setSelectedFiles([]);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files);
    setSelectedFiles((prev) => [...prev, ...files]);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleRemoveFile = (indexToRemove) => {
    setSelectedFiles((prev) =>
      prev.filter((_, index) => index !== indexToRemove)
    );
  };

  const handleUpload = async () => {
    if (!selectedFiles.length) return;

    try {
      setLoading(true);

      for (const file of selectedFiles) {
        const formData = new FormData();
        formData.append("File", file);

        const options = {
          url: "https://her-journey-1044023551709.us-central1.run.app/api/Patient/UploadMedicalTest",
          method: "POST",
          data: formData,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };

        const { data } = await axios.request(options);
        console.log(data);
      }
      
      await getMedicalTest();
      setSelectedFiles([]);
    } catch (error) {
      console.error("Upload error:", error);

    } finally {
      setLoading(false);
    }
  };

  const getMedicalTest = async () => {
    try {
      setLoading(true);
      const {data} = await axios.get("https://her-journey-1044023551709.us-central1.run.app/api/Patient/GetMyMedicalTests", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const list = Array.isArray(data)
      ? data
      : data.data || data.tests || [];

      const formattedMedicalTests = list.map((t) => ({
      id: t.id,
      fileName: t.fileName,
      uploadedAt: t.uploadedAt,
      }));
     
      setMedicalTests(formattedMedicalTests);
    
    } catch (error) {
      console.error("Error fetching medical tests:", error);
    } finally {
      setLoading(false);
    }

  }

  const handleOpenTest = async (medicalTestId) => {
    try {
      const response = await axios.get(
        `https://her-journey-1044023551709.us-central1.run.app/api/Patient/ViewMedicalTest/${medicalTestId}`,
        {

          headers: {
            Authorization: `Bearer ${token}`,
          },
          responseType: "blob",
        }
      );

      const fileURL = window.URL.createObjectURL(response.data);

      const fileType = response.data.type || response.headers["content-type"];

      setPreviewFile({
        url: fileURL,
        type: fileType,
      });

      } catch (error) {
        console.log(error);
      }
  };
  
  const handelDownloadTest = async (medicalTestId, fileName) => {
    try {
      const response = await axios.get(
        `https://her-journey-1044023551709.us-central1.run.app/api/Patient/DownloadMedicalTest/${medicalTestId}`,
        {

          headers: {
            Authorization: `Bearer ${token}`,
          },
          responseType: "blob",
        }
      );

      const blob = new Blob([response.data], {
        type: response.data.type || "application/octet-stream",
      });

      const url = window.URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", fileName);

      document.body.appendChild(link);
      link.click();

      link.remove();
      window.URL.revokeObjectURL(url);
     } catch (error) {
      console.log(error);
    }
  };

  const handelDeleteTest = async (medicalTestId) => {
    try {
      await axios.delete(
        "https://her-journey-1044023551709.us-central1.run.app/api/Patient/DeleteMedicalTest",
        {
          params: {
            medicalTestId,
          },
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setMedicalTests((prev) =>
        prev.filter((test) => test.id !== medicalTestId)
      );

    } catch (error) {
      console.log(data)
    }
  };

  useEffect(() => {
    getMedicalTest();
  }, []);

  

  return (
    <div className="px-8 py-6 flex flex-col gap-6 w-full">

      <div className="bg-[#E3F2FD] border border-[#BBDEFB] rounded-xl px-4 py-3 flex items-center gap-2">
        <AlertCircle size={17} className="text-[#1976D2]" />

        <p className="text-sm text-[#1976D2]">
          Accepted formats: <span className="font-semibold">PDF, JPG, PNG</span> | Please ensure files are clear and readable.
        </p>
      </div>

      <div
        className="bg-white py-10 px-10 rounded-xl shadow-[0px_4px_7px_#171a1f21,0px_0px_2px_#171a1f14] w-full"
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >

        <div className="flex flex-col py-8 items-center justify-center bg-[#F5FAF5] border border-dashed border-[#C8E6C9] rounded-xl gap-3">

          <CloudUpload size={50} className="text-[#667E68]" />

          <p className="text-[#667E68] font-semibold">
            Drag and drop your files here
          </p>

          <span className="text-[#9CA3AF]">or</span>

          <label className="px-5 py-2 border border-[#667E68] text-sm text-[#667E68] rounded-lg cursor-pointer">
            Browse Files

            <input
              type="file"
              multiple
              onChange={handleFileChange}
              className="hidden"
            />
          </label>

          <span className="text-[#A8B9AA] text-xs">
            Accepted formats: PDF, JPG, PNG
          </span>
        </div>

        {selectedFiles.length > 0 && (
          <div className="mt-6 w-full">

            <h3 className="font-semibold text-[#667E68] mb-3">
              Selected Files
            </h3>

            <div className="flex flex-row items-center gap-2 w-full flex-wrap">

              {selectedFiles.map((file, index) => (
                <div
                  key={index}
                  className="flex flex-row items-center gap-5 justify-between border border-[#E5E7EB] rounded-lg px-2 py-2 min-w-[200px]"
                >
                
                    <p className="text-[13px] text-[#516453] font-medium"> {file.name} </p>

                    <X size={14} className="text-[#C97272FF] cursor-pointer" onClick={() => handleRemoveFile(index)} />
                  
                </div>
              ))}

            </div>
          </div>
        )}

        <div className="flex gap-3 w-full mt-6">

          <button
            disabled={!selectedFiles.length || loading}
            onClick={handleUpload}
            className={`px-5 py-2 border text-sm rounded-lg w-10/12 flex items-center justify-center gap-2  transition-all duration-300 ${ selectedFiles.length ? "bg-[#667E68] text-white border-[#667E68] hover:opacity-90" : "bg-[#F5FAF5] text-[#667E68] border-[#C8E6C9]" }`}
          >
            <CloudUpload size={18} />
            {loading ? "Uploading..." : "Upload Tests"}
          </button>

          <button
            disabled= {!selectedFiles.length}
            onClick={handleClearAll}
            className="px-5 py-2 w-2/12 border border-[#667E68] text-sm text-[#667E68] rounded-lg"
          >
            Clear All
          </button>

        </div>

      </div>

      <div className="bg-white p-5  rounded-xl shadow-[0px_4px_7px_#171a1f21,0px_0px_2px_#171a1f14] w-full">
        <div className="flex flex-row items-center justify-between ">
          <div className="flex flex-row items-center gap-2">
            <FlaskConical size={18} className="text-[#9B7CB6FF]" />
            <h2 className='text-[#C3E2FFF] font-bold text-base'>My Uploaded Tests</h2>
          </div>
          <div className="bg-[#F5F0FAFF] px-4 py-1 rounded-2xl text-sm text-[#9B7CB6FF]">
            {medicalTests.length} Total
          </div>
        </div>

        <div className="mt-5 grid grid-cols-3 gap-4 flex-wrap">
          {medicalTests.map((test, index) => (
            <LabTestCard
              key={index}
              name={test.fileName}
              date={test.uploadedAt}
              mode={"patientProfile"}
              download={() => handelDownloadTest(test.id , test.fileName)}
              onClick={() => handleOpenTest(test.id)}
              onDelete = {() => handelDeleteTest(test.id)}
            />
          ))}
          </div>


      </div>
      {previewFile && ( 
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <button
            className="absolute top-3 right-3 bg-[#2d2d2d] text-white px-3 py-1 rounded"
            onClick={() => setPreviewFile(null)}
          >
            <X/>
          </button>
                      
          <div className="bg-white w-[80%] h-[85%] rounded-xl relative overflow-hidden">
            <div className="w-full h-full">
      
              {previewFile.type === "application/pdf" ? (
                <iframe
                  src={previewFile.url}
                  className="w-full h-full"
                />
                ) : (
                <img
                  src={previewFile.url}
                  className="w-full h-full object-contain"
                />
                )}
            </div>
      
          </div>
        </div>
      )}
    </div>
  );
}