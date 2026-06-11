import "./Pagination.css";

import { FiChevronLeft } from "react-icons/fi";
import { FiChevronRight } from "react-icons/fi";

interface PaginationProps {
    currentPage: number;
    totalPages: number;

    onPageChange: (
        page: number
    ) => void;
}

function Pagination({
    currentPage,
    totalPages,
    onPageChange,
}: PaginationProps) {
    const pages = Array.from(
        { length: totalPages },
        (_, index) => index + 1
    );

    const isFirstPage = currentPage === 1;
    const isLastPage = currentPage === totalPages;

    return (
        <div className="pagination">
            <button
                className="pagination-nav"
                disabled={isFirstPage}
                onClick={() =>
                    onPageChange(currentPage - 1)
                }
            >
                <FiChevronLeft />

                <span>
                    Previous
                </span>
            </button>

            <div className="pagination-pages">
                {pages.map((page) => {
                    const isActive = page === currentPage;

                    return (
                        <button
                            key={page}
                            className={`
                                pagination-page
                                ${
                                    isActive
                                        ? "active"
                                        : ""
                                }
                            `}
                            onClick={() =>
                                onPageChange(page)
                            }
                        >
                            {page}
                        </button>
                    );
                })}
            </div>

            <button
                className="pagination-nav"
                disabled={isLastPage}
                onClick={() =>
                    onPageChange(currentPage + 1)
                }
            >
                <span>
                    Next
                </span>

                <FiChevronRight />
            </button>
        </div>
    );
}

export default Pagination;