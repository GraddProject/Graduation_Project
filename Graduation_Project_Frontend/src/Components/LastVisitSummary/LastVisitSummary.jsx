import React, { useEffect, useState } from "react";

const BASE_URL = "https://her-journey-1044023551709.us-central1.run.app";

export default function LastVisitSummary({ token }) {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const res = await fetch(`${BASE_URL}/api/Patient/last-visit-summary`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error(await res.text());
        const data = await res.json();
        setSummary(data);
      } catch (e) {
        setError(e.message || "Failed to load summary.");
      } finally {
        setLoading(false);
      }
    };
    if (token) fetchSummary();
  }, [token]);

  if (loading)
    return (
      <div className="bg-white rounded-2xl p-4 sm:p-6 animate-pulse">
        <div className="h-4 bg-gray-100 rounded w-1/2 mb-4" />
        <div className="h-3 bg-gray-100 rounded w-1/3 mb-6" />
        <div className="flex gap-2 mb-4 flex-wrap">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-6 bg-gray-100 rounded-full w-24" />
          ))}
        </div>
        <div className="h-3 bg-gray-100 rounded w-full mb-2" />
        <div className="h-3 bg-gray-100 rounded w-3/4" />
      </div>
    );

  if (error)
    return (
      <div className="bg-white rounded-2xl p-4 sm:p-6">
        <h3 className="font-semibold text-gray-700 mb-2">Last Visit Summary</h3>
        <p className="text-sm text-gray-400 italic">
          No medical history is available for your last visit yet.
        </p>
      </div>
    );

  if (!summary) return null;

  const vitals = summary.vitalSigns
    ? summary.vitalSigns.split(",").map((v) => v.trim())
    : [];

  const formattedDate = summary.date
    ? new Date(summary.date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
    : "";

  return (
    <div className="bg-white rounded-2xl p-4 sm:p-6">

      <div className="flex items-center justify-between mb-3 sm:mb-4 gap-2">
        <span className="text-base font-extrabold text-gray-900">Last Visit Summary</span>
        <span className="text-xs text-gray-400 shrink-0">{formattedDate}</span>
      </div>

      <div className="text-sm font-bold text-gray-900 mb-3">{summary.diagnosis}</div>

      {vitals.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-3 sm:mb-4">
          {vitals.map((tag) => (
            <span
              key={tag}
              className="border border-gray-200 rounded-full px-3 py-1 text-xs text-textColor/90 bg-primary-100/20"
            >
              {tag}
            </span>
          ))}
        </div>
      )}

      {summary.notes && (
        <p className="text-xs text-gray-500 italic mb-4 sm:mb-6">"{summary.notes}"</p>
      )}

      <hr className="border-gray-200 my-3 sm:my-4" />
      <div className="flex items-center justify-between mt-1">
        <span className="text-xs text-textColor/60">Record #{summary.medicalHistoryId}</span>
        <span className="text-xs font-bold text-textColor/80 cursor-pointer">View Full Record →</span>
      </div>
    </div>
  );
}