import React, { useState } from "react";
import { Filter, ChevronDown, XCircle } from "lucide-react";
import Button from "./ui/Button";
import { DocumentType } from "../types";

// Novo tipo incluindo a string literal "ALL"
type DocumentTypeWithAll = DocumentType | "ALL";

interface DocumentFilterProps {
  onFilterChange: (filters: FilterState) => void;
}

interface FilterState {
  type: DocumentTypeWithAll;
  month: number | null;
  year: number | null;
}

const DocumentFilter: React.FC<DocumentFilterProps> = ({ onFilterChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [filters, setFilters] = useState<FilterState>({
    type: "ALL",
    month: null,
    year: null,
  });

  const documentTypes: Array<{ value: DocumentTypeWithAll; label: string }> = [
    { value: "ALL", label: "Todos os Documentos" },
    { value: "HOLERITE", label: "Holerites" },
    { value: "FERIAS", label: "Férias" },
    { value: "COMISSAO", label: "Comissões" },
    { value: "INFORME_RENDIMENTO", label: "Informes de Rendimentos" },
  ];

  const months = [
    { value: 1, label: "Janeiro" },
    { value: 2, label: "Fevereiro" },
    { value: 3, label: "Março" },
    { value: 4, label: "Abril" },
    { value: 5, label: "Maio" },
    { value: 6, label: "Junho" },
    { value: 7, label: "Julho" },
    { value: 8, label: "Agosto" },
    { value: 9, label: "Setembro" },
    { value: 10, label: "Outubro" },
    { value: 11, label: "Novembro" },
    { value: 12, label: "Dezembro" },
  ];

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 6 }, (_, i) => currentYear - i);

  const handleFilterChange = (key: keyof FilterState, value: any) => {
    const updatedFilters = { ...filters, [key]: value };
    setFilters(updatedFilters);
    onFilterChange(updatedFilters);
  };

  const clearFilters = () => {
    const clearedFilters: FilterState = {
      type: "ALL",
      month: null,
      year: null,
    };
    setFilters(clearedFilters);
    onFilterChange(clearedFilters);
  };

  const toggleFilters = () => setIsOpen(!isOpen);

  const activeFilterCount =
    (filters.type !== "ALL" ? 1 : 0) +
    (filters.month !== null ? 1 : 0) +
    (filters.year !== null ? 1 : 0);

  return (
    <div className="mb-6 bg-white rounded-xl shadow-sm p-4 border border-gray-100">
      <div className="flex justify-between items-center">
        <div className="flex items-center">
          <Filter size={18} className="text-[#28313F] mr-2" />
          <h3 className="font-semibold text-gray-800">Filtros</h3>
          {activeFilterCount > 0 && (
            <div className="flex items-center ml-2 space-x-2">
              <span className="px-2 py-0.5 text-xs bg-[#38AFD9] text-white rounded-full">
                {activeFilterCount}
              </span>
              <button
                onClick={clearFilters}
                className="text-red-500 hover:text-red-600 text-xs flex items-center"
              >
                <XCircle size={14} className="mr-1" />
                Limpar
              </button>
            </div>
          )}
        </div>

        <Button
          variant="ghost"
          size="sm"
          onClick={toggleFilters}
          className="flex items-center text-sm"
        >
          <span className="mr-1">{isOpen ? "Ocultar" : "Mostrar"}</span>
          <ChevronDown
            size={16}
            className={`transition-transform duration-300 ${
              isOpen ? "rotate-180" : ""
            }`}
          />
        </Button>
      </div>

      <div
        className={`transition-all duration-300 overflow-hidden ${
          isOpen
            ? "max-h-[500px] mt-4 pt-4 border-t border-gray-100"
            : "max-h-0"
        }`}
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Tipo de Documento */}
          <div>
            <label
              htmlFor="type-select"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Tipo de Documento
            </label>
            <select
              id="type-select"
              value={filters.type}
              onChange={(e) =>
                handleFilterChange(
                  "type",
                  e.target.value as DocumentTypeWithAll
                )
              }
              className="w-full rounded-md border border-gray-300 bg-[#F9FAFB] p-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#38AFD9]"
            >
              {documentTypes.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>

          {/* Mês */}
          <div>
            <label
              htmlFor="month-select"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Mês
            </label>
            <select
              id="month-select"
              value={filters.month || ""}
              onChange={(e) =>
                handleFilterChange(
                  "month",
                  e.target.value ? parseInt(e.target.value) : null
                )
              }
              className="w-full rounded-md border border-gray-300 bg-[#F9FAFB] p-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#38AFD9]"
            >
              <option value="">Todos os Meses</option>
              {months.map((month) => (
                <option key={month.value} value={month.value}>
                  {month.label}
                </option>
              ))}
            </select>
          </div>

          {/* Ano */}
          <div>
            <label
              htmlFor="year-select"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Ano
            </label>
            <select
              id="year-select"
              value={filters.year || ""}
              onChange={(e) =>
                handleFilterChange(
                  "year",
                  e.target.value ? parseInt(e.target.value) : null
                )
              }
              className="w-full rounded-md border border-gray-300 bg-[#F9FAFB] p-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#38AFD9]"
            >
              <option value="">Todos os Anos</option>
              {years.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DocumentFilter;
