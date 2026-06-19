import {
  AlertCircle,
  CloudUpload,
  Stethoscope,
  X,
  FlaskConical,
  Loader2,
} from "lucide-react";
import React, { useState, useContext, useEffect } from "react";
import { UserContext } from "../../Components/context/User.context";
import axios from "axios";
import LabTestCard from "../../Components/LabTestCard/LabTestCard";
import FilePreviewModal from "../../Components/FilePreviewModal/FilePreviewModal";
import Loading from "../../Components/Loading/Loading";

export default function UploadTests() {
  const { token } = useContext(UserContext);

  const [selectedFiles, setSelectedFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [medicalTests, setMedicalTests] = useState([]);
  const [previewFile, setPreviewFile] = useState(null);
  const [loadingTests, setLoadingTests] = useState(true);
  const [uploading, setUploading] = useState(false);

  const handleFileChange = (event) => {
    const files = Array.from(event.target.files);
    setSelectedFiles(files);
  };

  const handleClearAll = () => setSelectedFiles([]);

  const handleDrop = (e) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files);
    setSelectedFiles((prev) => [...prev, ...files]);
  };

  const handleDragOver = (e) => e.preventDefault();

  const handleRemoveFile = (indexToRemove) => {
    setSelectedFiles((prev) =>
      prev.filter((_, index) => index !== indexToRemove)
    );
  };

  const handleUpload = async () => {
    if (!selectedFiles.length) return;

    try {
      setUploading(true);

      for (const file of selectedFiles) {
        const formData = new FormData();
        formData.append("File", file);

        await axios.post(
          "https://her-journey-1044023551709.us-central1.run.app/api/Patient/UploadMedicalTest",
          formData,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
      }

      await getMedicalTest();
      setSelectedFiles([]);
    } catch (error) {
      console.error(error);
    } finally {
      setUploading(false);
    }
  };

  const getMedicalTest = async () => {
    try {
      setLoadingTests(true);

      const { data } = await axios.get(
        "https://her-journey-1044023551709.us-central1.run.app/api/Patient/GetMyMedicalTests",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const list = Array.isArray(data)
        ? data
        : data.data || data.tests || [];

      setMedicalTests(
        list.map((t) => ({
          id: t.id,
          fileName: t.fileName,
          uploadedAt: t.uploadedAt,
        }))
      );
    } catch (error) {
      console.error(error);
    } finally {
      setLoadingTests(false);
    }
  };

  const handleOpenTest = async (id) => {
    try {
      const res = await axios.get(
        `https://her-journey-1044023551709.us-central1.run.app/api/Patient/ViewMedicalTest/${id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
          responseType: "blob",
        }
      );

      setPreviewFile({
        url: window.URL.createObjectURL(res.data),
        type: res.data.type,
      });
    } catch (error) {
      console.log(error);
    }
  };

  const handelDownloadTest = async (id, name) => {
    try {
      const res = await axios.get(
        `https://her-journey-1044023551709.us-central1.run.app/api/Patient/DownloadMedicalTest/${id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
          responseType: "blob",
        }
      );

      const url = window.URL.createObjectURL(res.data);
      const a = document.createElement("a");
      a.href = url;
      a.download = name;
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.log(error);
    }
  };

  const handelDeleteTest = async (id) => {
    try {
      await axios.delete(
        "https://her-journey-1044023551709.us-central1.run.app/api/Patient/DeleteMedicalTest",
        {
          params: { medicalTestId: id },
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setMedicalTests((prev) =>
        prev.filter((t) => t.id !== id)
      );
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getMedicalTest();
  }, []);

  return (
    <div className="px-4 lg:px-8 py-6 flex flex-col gap-6 w-full">

      {/* INFO */}
      <div className="bg-[#E3F2FD] border border-[#BBDEFB] rounded-xl px-4 py-3 flex items-center gap-2">
        <AlertCircle size={17} className="text-[#1976D2]" />
        <p className="text-sm text-[#1976D2]">
          Accepted formats: <span className="font-semibold">PDF, JPG, PNG</span>
        </p>
      </div>

      {/* UPLOAD BOX */}
      <div
        className="bg-white py-8 lg:py-10 px-4 lg:px-10 rounded-xl shadow w-full"
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >

        <div className="flex flex-col items-center justify-center bg-[#F5FAF5] border border-dashed border-[#C8E6C9] rounded-xl gap-3 py-6">

          <CloudUpload size={50} className="text-[#667E68]" />

          <p className="text-[#667E68] font-semibold text-center">
            Drag and drop your files here
          </p>

          <label className="px-5 py-2 border border-[#667E68] text-sm text-[#667E68] rounded-lg cursor-pointer">
            Browse Files
            <input type="file" multiple onChange={handleFileChange} className="hidden" />
          </label>
        </div>

        {/* FILES */}
        {selectedFiles.length > 0 && (
          <div className="mt-6 w-full">
            <div className="flex flex-wrap gap-2">
              {selectedFiles.map((file, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between border rounded-lg px-2 py-2 w-full lg:min-w-[200px]"
                >
                  <p className="text-[13px] truncate">{file.name}</p>
                  <X size={14} onClick={() => handleRemoveFile(i)} />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* BUTTONS RESPONSIVE ONLY */}
        <div className="flex flex-col lg:flex-row gap-3 w-full mt-6">

          <button
            onClick={handleUpload}
            disabled={!selectedFiles.length}
            className="px-5 py-2 w-full lg:w-10/12 text-sm rounded-lg bg-[#667E68] text-white flex items-center justify-center gap-2"
          >
            {uploading ? (
              <>
                <Loader2 className="animate-spin" size={16} />
                Uploading...
              </>
            ) : (
              <>
                <CloudUpload size={18} />
                Upload Tests
              </>
            )}
          </button>

          <button
            onClick={handleClearAll}
            disabled={!selectedFiles.length}
            className="px-5 py-2 w-full lg:w-2/12 border border-[#667E68] text-sm text-[#667E68] rounded-lg"
          >
            Clear All
          </button>
        </div>
      </div>

      {/* TESTS LIST */}
      <div className="bg-white p-5 rounded-xl shadow w-full">

        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3">
          <div className="flex items-center gap-2">
            <FlaskConical size={18} className="text-[#9B7CB6FF]" />
            <h2 className="text-[#C3E2FFF] font-bold">
              My Uploaded Tests
            </h2>
          </div>

          <div className="bg-[#F5F0FAFF] text-[#9B7CB6FF] px-4 py-1 rounded-2xl text-sm w-fit">
            {medicalTests.length} Total
          </div>
        </div>

        <div className="mt-5">
          {loadingTests ? (
            <Loading text="Loading medical tests..." />
          ) : medicalTests.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {medicalTests.map((test, i) => (
                <LabTestCard
                  key={i}
                  name={test.fileName}
                  date={test.uploadedAt}
                  mode="patientProfile"
                  download={() => handelDownloadTest(test.id, test.fileName)}
                  onClick={() => handleOpenTest(test.id)}
                  onDelete={() => handelDeleteTest(test.id)}
                />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center py-10 text-gray-400">
              <FlaskConical size={40} />
              <p className="mt-2">No medical tests uploaded yet</p>
            </div>
          )}
        </div>
      </div>

      <FilePreviewModal
        previewFile={previewFile}
        setPreviewFile={setPreviewFile}
      />
    </div>
  );
}