import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar as CalendarIcon, Filter, Search, X } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface FilterSectionProps {
  startDate: Date | undefined;
  endDate: Date | undefined;
  searchTerm: string;
  professionalFilter: string;
  onStartDateChange: (date: Date | undefined) => void;
  onEndDateChange: (date: Date | undefined) => void;
  onSearchTermChange: (term: string) => void;
  onProfessionalFilterChange: (filter: string) => void;
  onResetFilters: () => void;
}

export const FilterSection = ({
  startDate,
  endDate,
  searchTerm,
  professionalFilter,
  onStartDateChange,
  onEndDateChange,
  onSearchTermChange,
  onProfessionalFilterChange,
  onResetFilters,
}: FilterSectionProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
      <div className="flex gap-2">
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="w-full justify-start text-left font-normal">
              <CalendarIcon className="mr-2 h-4 w-4" />
              {startDate ? format(startDate, "dd/MM/yyyy") : "Data inicial"}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar
              mode="single"
              selected={startDate}
              onSelect={onStartDateChange}
              locale={ptBR}
            />
          </PopoverContent>
        </Popover>
      </div>

      <div className="flex gap-2">
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="w-full justify-start text-left font-normal">
              <CalendarIcon className="mr-2 h-4 w-4" />
              {endDate ? format(endDate, "dd/MM/yyyy") : "Data final"}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar
              mode="single"
              selected={endDate}
              onSelect={onEndDateChange}
              locale={ptBR}
            />
          </PopoverContent>
        </Popover>
      </div>

      <div className="relative">
        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Buscar por ID..."
          value={searchTerm}
          onChange={(e) => onSearchTermChange(e.target.value)}
          className="pl-8"
        />
      </div>

      <div className="relative">
        <Filter className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Filtrar por profissional..."
          value={professionalFilter}
          onChange={(e) => onProfessionalFilterChange(e.target.value)}
          className="pl-8"
        />
      </div>

      <Button 
        onClick={onResetFilters} 
        variant="outline" 
        className="flex items-center gap-2"
      >
        <X className="h-4 w-4" />
        Limpar Filtros
      </Button>
    </div>
  );
};