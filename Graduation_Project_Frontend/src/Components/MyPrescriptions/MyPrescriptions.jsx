import React, { useEffect, useState } from 'react';
import { Pill } from 'lucide-react';

const BASE_URL = "https://her-journey-1044023551709.us-central1.run.app";

export default function MyPrescriptions({ token }) {
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch_ = async () => {
      try {
        const res = await fetch(`${BASE_URL}/api/Patient/Prescriptions`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error();
        const data = await res.json();
        setPrescriptions(data);
        console.log(data);
      } catch {
        // silently fail
      } finally {
        setLoading(false);
      }
    };
    if (token) fetch_();
  }, [token]);

  return (
    <div className="bg-white rounded-2xl p-4 sm:p-6">
      <div className="flex items-center justify-between mb-4 sm:mb-5">
        <span className="text-base font-semibold text-gray-900">My Prescriptions</span>
      </div>

      {loading && (
        <div className="flex flex-col gap-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="flex items-center gap-3 border-t border-gray-200 pt-4 animate-pulse">
              <div className="w-9 h-9 rounded-full bg-gray-100 flex-shrink-0" />
              <div className="flex-1 space-y-2">
                <div className="h-3 bg-gray-100 rounded w-1/2" />
                <div className="h-2 bg-gray-100 rounded w-1/3" />
              </div>
              <div className="h-2 bg-gray-100 rounded w-16" />
            </div>
          ))}
        </div>
      )}

      {!loading && prescriptions.length === 0 && (
        <p className="text-xs text-gray-400 italic">No prescriptions found.</p>
      )}

      {!loading && prescriptions.length > 0 && (
        <div className="flex flex-col gap-3 sm:gap-4">
          {prescriptions.map(({ medicationName, dosage, duration, instructions }, i) => (
            <div key={i} className="flex items-center gap-3 border-t border-gray-200 pt-3 sm:pt-4">
              <div className="w-9 h-9 rounded-full bg-[#e8f0eb] flex items-center justify-center flex-shrink-0">
                <Pill className="w-4 h-4 text-[#4a7c59]" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-semibold text-gray-900 truncate">{medicationName}</div>
                <div className="text-xs text-gray-400 mt-0.5 truncate">{dosage}{duration ? ` • ${duration}` : ''}</div>
              </div>
              <div className="text-xs text-gray-400 text-right hidden sm:block shrink-0 max-w-[100px] truncate">
                {instructions}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}