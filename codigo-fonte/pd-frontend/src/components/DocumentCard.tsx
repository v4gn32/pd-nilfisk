import React from "react";
import {
  FileText,
  FileBadge,
  FileSpreadsheet,
  FileWarning,
  Download,
  Eye,
  Calendar,
  Clock,
} from "lucide-react";
import { Document, DocumentType } from "../types";
import { Card, CardContent } from "./ui/Card";
import Button from "./ui/Button";

interface DocumentCardProps {
  document: Document;
  onDownload: (document: Document) => void;
  onView?: (document: Document) => void;
}

const DocumentCard: React.FC<DocumentCardProps> = ({
  document,
  onDownload,
  onView,
}) => {
  const getDocumentIcon = (type: DocumentType) => {
    switch (type) {
      case "HOLERITE":
        return <FileText className="text-blue-500" size={24} />;
      case "FERIAS":
        return <FileBadge className="text-green-500" size={24} />;
      case "COMISSAO":
        return <FileSpreadsheet className="text-purple-500" size={24} />;
      case "INFORME_RENDIMENTO":
        return <FileWarning className="text-orange-500" size={24} />;
      default:
        return <FileText className="text-gray-500" size={24} />;
    }
  };

  const getDocumentTypeLabel = (type: DocumentType) => {
    switch (type) {
      case "HOLERITE":
        return "Holerite";
      case "FERIAS":
        return "Férias";
      case "COMISSAO":
        return "Comissão";
      case "INFORME_RENDIMENTO":
        return "Informe de Rendimentos";
      default:
        return "Documento";
    }
  };

  const getMonthName = (monthNumber: number) => {
    const months = [
      "Janeiro",
      "Fevereiro",
      "Março",
      "Abril",
      "Maio",
      "Junho",
      "Julho",
      "Agosto",
      "Setembro",
      "Outubro",
      "Novembro",
      "Dezembro",
    ];
    return months[monthNumber - 1] || "Desconhecido";
  };

  const getDocumentColor = (type: DocumentType) => {
    switch (type) {
      case "HOLERITE":
        return "bg-blue-50 border-blue-100";
      case "FERIAS":
        return "bg-green-50 border-green-100";
      case "COMISSAO":
        return "bg-purple-50 border-purple-100";
      case "INFORME_RENDIMENTO":
        return "bg-orange-50 border-orange-100";
      default:
        return "bg-gray-50 border-gray-100";
    }
  };

  return (
    <Card
      className={`hover:shadow-lg transition-all duration-300 border ${getDocumentColor(
        document.type
      )}`}
    >
      <CardContent className="p-6">
        <div className="flex items-start gap-4">
          <div
            className={`p-3 rounded-xl ${getDocumentColor(
              document.type
            )} shadow-sm`}
          >
            {getDocumentIcon(document.type)}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <h3 className="font-medium text-gray-900 truncate">
                {getDocumentTypeLabel(document.type)}
              </h3>
              <div className="flex gap-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onView?.(document)}
                  className="text-gray-500 hover:text-gray-700 hover:bg-gray-100"
                >
                  <Eye size={18} />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onDownload(document)}
                  className="text-gray-500 hover:text-gray-700 hover:bg-gray-100"
                >
                  <Download size={18} />
                </Button>
              </div>
            </div>

            <div className="mt-2 flex flex-col gap-1">
              <div className="flex items-center text-sm text-gray-600">
                <Calendar size={14} className="mr-1.5 flex-shrink-0" />
                <span className="truncate">
                  {getMonthName(document.month)} {document.year}
                </span>
              </div>
              <div className="flex items-center text-xs text-gray-500">
                <Clock size={12} className="mr-1.5 flex-shrink-0" />
                <span className="truncate">
                  Adicionado em{" "}
                  {new Date(document.createdAt).toLocaleDateString("pt-BR", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                  })}
                </span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DocumentCard;
