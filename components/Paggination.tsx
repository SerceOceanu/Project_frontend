import ReactPaginate from 'react-paginate';
import { GoArrowLeft, GoArrowRight } from "react-icons/go";

interface PaginationProps {
  currentPage: number;
  setCurrentPage: (page: number) => void;
  pageCount: number;
}

export default function Paggination({ currentPage, setCurrentPage, pageCount }: PaginationProps) {
  const handlePageChange = (selectedItem: { selected: number }) => {
    setCurrentPage(selectedItem.selected);
  };

  const goToPreviousPage = () => {
    if (currentPage > 0) setCurrentPage(currentPage - 1);
  };

  const goToNextPage = () => {
    if (currentPage < pageCount - 1) setCurrentPage(currentPage + 1);
  };

  return (
    <div className="flex items-center justify-between gap-4 w-full">
      <ReactPaginate
        breakLabel="....."
        nextLabel={null}
        previousLabel={null}
        onPageChange={handlePageChange}
        pageRangeDisplayed={2}
        marginPagesDisplayed={1}
        pageCount={pageCount}
        renderOnZeroPageCount={null}
        containerClassName="flex items-center font-light  bg-white px-5 py-2.5 rounded-[10px] shadow-sm cursor-pointer rubik flex-1 h-[44px]"
        pageClassName="text-lg rubik"
        pageLinkClassName=" px-2  rounded py-1  hover:bg-orange/10 transition-colors"
        activeClassName="text-orange font-semibold"
        breakClassName="rubik "
        breakLinkClassName="px-2"
        disabledClassName="opacity-50 cursor-not-allowed"
      />
      
      <div className='flex items-center gap-2'>
        <button
          onClick={goToPreviousPage}
          disabled={currentPage === 0}
          className="p-3 bg-white rounded-[10px] h-[44px] shadow hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <GoArrowLeft className="" />
        </button>
        
        <button
          onClick={goToNextPage}
          disabled={currentPage >= pageCount - 1}
          className="p-3 bg-white rounded-[10px] h-[44px] shadow hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <GoArrowRight className="" />
        </button>
      </div>
    </div>
  );
}