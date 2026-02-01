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
    <div className="flex items-center justify-between w-full mt-auto">
      <ReactPaginate
        breakLabel="....."
        nextLabel={null}
        previousLabel={null}
        onPageChange={handlePageChange}
        pageRangeDisplayed={2}
        marginPagesDisplayed={1}
        pageCount={pageCount}
        forcePage={currentPage}
        renderOnZeroPageCount={null}
        containerClassName="flex items-center font-light bg-white px-5 py-0 rounded-l-[10px]  rubik flex-1 h-14"
        pageClassName="text-2xl rubik !min-w-14 hover:bg-gray-50 flex items-center justify-center"
        pageLinkClassName=" px-2 py-2.5 w-full text-center rounded py-1  transition-colors cursor-pointer"
        activeClassName="text-orange  font-semibold"
        breakClassName="rubik "
        breakLinkClassName="px-2"
        disabledClassName="opacity-50 cursor-not-allowed"
      />
      
      <div className='flex items-center text-2xl'>
        <button
          onClick={goToPreviousPage}
          disabled={currentPage === 0}
          className=" bg-white size-14 flex items-center justify-center hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <GoArrowLeft  />
        </button>
        
        <button
          onClick={goToNextPage}
          disabled={currentPage >= pageCount - 1}
          className=" bg-white rounded-r-[10px] size-14 flex items-center justify-center hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <GoArrowRight  />
        </button>
      </div>
    </div>
  );
}