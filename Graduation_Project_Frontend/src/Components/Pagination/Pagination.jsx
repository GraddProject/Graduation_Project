import { useState, useEffect } from "react";

export default function Pagination({
  currentPage,
  totalPages,
  totalItems,
  itemsPerPage,
  onPageChange
}) {
  const [startPage, setStartPage] = useState(1);
  const visiblePages = 3;
  const endPage = Math.min(startPage + visiblePages - 1, totalPages);

  useEffect(() => {
    if (currentPage < startPage) setStartPage(Math.max(currentPage, 1));
    else if (currentPage > endPage) setStartPage(Math.max(currentPage - visiblePages + 1, 1));
  }, [currentPage, startPage, endPage]);

  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  return (
    <div className="flex flex-col sm:flex-row items-center justify-center sm:justify-between gap-3 px-4 sm:px-6 py-4 rounded-lg">

      {/* TEXT */}
      <p className="text-[13px] sm:text-sm text-center sm:text-left text-[#7A8F7CFF]">
        Showing <span className="font-bold text-[#2e392f]">{startItem}-{endItem}</span> of{" "}
        <span className="font-bold text-[#2e392f]">{totalItems}</span> users
      </p>

      {/* BUTTONS */}
      <div className="flex items-center justify-center gap-2 flex-wrap">
        
        {/* Previous */}
        <button
          onClick={() => onPageChange(Math.max(currentPage - 1, 1))}
          disabled={currentPage === 1}
          className={`px-3 py-1 text-[13px] sm:text-sm rounded-md ${
            currentPage === 1
              ? "text-gray-300 bg-[#FAFAF9FF] cursor-not-allowed"
              : "text-[#7A8F7CFF] bg-[#FAFAF9FF]"
          }`}
        >
          Previous
        </button>

        {/* Pages */}
        {Array.from({ length: Math.min(endPage - startPage + 1, totalPages - startPage + 1) }).map((_, i) => {
          const page = startPage + i;
          return (
            <button
              key={page}
              onClick={() => onPageChange(page)}
              className={`w-9 h-9 sm:w-8 sm:h-8 rounded-md text-[13px] sm:text-sm font-bold border ${
                currentPage === page
                  ? "border-[#667E68] text-[#667E68FF] bg-[#F5FAF5FF]"
                  : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
              }`}
            >
              {page}
            </button>
          );
        })}

        {/* Next */}
        <button
          onClick={() => onPageChange(Math.min(currentPage + 1, totalPages))}
          disabled={currentPage === totalPages}
          className={`px-3 py-1 text-[13px] sm:text-sm rounded-md ${
            currentPage === totalPages
              ? "text-gray-300 bg-[#FAFAF9FF] cursor-not-allowed"
              : "text-[#7A8F7CFF] bg-[#FAFAF9FF]"
          }`}
        >
          Next
        </button>

      </div>
    </div>
  );
}