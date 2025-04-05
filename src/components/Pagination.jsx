
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";



const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  // Create pagination controls with previous and next buttons
  return (
    <div className="flex justify-center items-center gap-2 mt-10">
      <Button
        variant="outline"
        size="icon"
        onClick={() => onPageChange(Math.max(1, currentPage - 1))}
        disabled={currentPage === 1}
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>
      
      {Array.from({ length: totalPages }, (_, i) => (
        <Button
          key={i + 1}
          variant={currentPage === i + 1 ? "default" : "outline"}
          onClick={() => onPageChange(i + 1)}
          className="h-10 w-10 p-0"
        >
          {i + 1}
        </Button>
      ))}
      
      <Button
        variant="outline"
        size="icon"
        onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
        disabled={currentPage === totalPages}
      >
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  );
};

export default Pagination;