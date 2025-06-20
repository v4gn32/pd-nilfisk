import React from "react";
import {
  FileText,
  FileBadge,
  FileSpreadsheet,
  FileWarning,
  Users,
  Calendar,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/Card";
import { User, Document } from "../types";

interface DashboardProps {
  user: User;
  documents: Document[];
  users: User[];
}

const Dashboard: React.FC<DashboardProps> = ({ user, documents, users }) => {
  const isAdmin = user.role === "ADMIN";

  const getDocumentCountByType = (type: string) =>
    documents.filter((doc) => doc.type.toUpperCase() === type).length;

  const getLatestDocument = () => {
    if (documents.length === 0) return null;
    return documents.reduce((latest, current) =>
      new Date(current.createdAt) > new Date(latest.createdAt)
        ? current
        : latest
    );
  };

  const getCurrentYearDocuments = () => {
    const currentYear = new Date().getFullYear();
    return documents.filter((doc) => doc.year === currentYear);
  };

  const getCommonUserCount = () =>
    users.filter((u) => u.role === "COMMON").length;

  const getDocumentTypeLabel = (type: string) => {
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

  const latestDocument = getLatestDocument();
  const currentYearDocs = getCurrentYearDocuments();

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-[#28313F] mb-6">Painel</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-blue-100">
                <FileText className="text-blue-500" size={24} />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-500">Holerites</p>
                <h3 className="text-2xl font-bold">
                  {getDocumentCountByType("HOLERITE")}
                </h3>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-green-100">
                <FileBadge className="text-green-500" size={24} />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-500">Férias</p>
                <h3 className="text-2xl font-bold">
                  {getDocumentCountByType("FERIAS")}
                </h3>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-purple-100">
                <FileSpreadsheet className="text-purple-500" size={24} />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-500">Comissões</p>
                <h3 className="text-2xl font-bold">
                  {getDocumentCountByType("COMISSAO")}
                </h3>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-orange-100">
                <FileWarning className="text-orange-500" size={24} />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-500">Informes</p>
                <h3 className="text-2xl font-bold">
                  {getDocumentCountByType("INFORME_RENDIMENTO")}
                </h3>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Documentos Recentes</CardTitle>
          </CardHeader>
          <CardContent>
            {documents.length > 0 ? (
              <div className="space-y-4">
                {documents.slice(0, 5).map((doc) => (
                  <div
                    key={doc.id}
                    className="flex items-center p-3 rounded-md hover:bg-gray-50"
                  >
                    <div className="p-2 rounded-md bg-gray-100 mr-4">
                      {doc.type === "HOLERITE" && (
                        <FileText className="text-blue-500" size={20} />
                      )}
                      {doc.type === "FERIAS" && (
                        <FileBadge className="text-green-500" size={20} />
                      )}
                      {doc.type === "COMISSAO" && (
                        <FileSpreadsheet
                          className="text-purple-500"
                          size={20}
                        />
                      )}
                      {doc.type === "INFORME_RENDIMENTO" && (
                        <FileWarning className="text-orange-500" size={20} />
                      )}
                    </div>
                    <div>
                      <h4 className="font-medium">
                        {getDocumentTypeLabel(doc.type)}
                      </h4>
                      <div className="flex items-center text-sm text-gray-500">
                        <Calendar size={14} className="mr-1" />
                        <span>
                          {getMonthName(doc.month)} {doc.year}
                        </span>
                      </div>
                    </div>
                    <div className="ml-auto text-xs text-gray-400">
                      {new Date(doc.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <p>Nenhum documento encontrado</p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Resumo</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center pb-2 border-b border-gray-100">
                <span className="text-gray-600">Total de Documentos</span>
                <span className="font-bold">{documents.length}</span>
              </div>
              <div className="flex justify-between items-center pb-2 border-b border-gray-100">
                <span className="text-gray-600">Este Ano</span>
                <span className="font-bold">{currentYearDocs.length}</span>
              </div>
              {latestDocument && (
                <div className="flex justify-between items-center pb-2 border-b border-gray-100">
                  <span className="text-gray-600">Último Documento</span>
                  <span className="font-bold text-[#38AFD9]">
                    {getDocumentTypeLabel(latestDocument.type)}
                  </span>
                </div>
              )}
              {isAdmin && (
                <div className="pt-4 space-y-3">
                  <h4 className="font-medium mb-2">Estatísticas de Admin</h4>

                  <div className="flex justify-between items-center pb-2 border-b border-gray-100">
                    <span className="text-gray-600">Usuários Comuns</span>
                    <span className="font-bold">{getCommonUserCount()}</span>
                  </div>

                  <div className="flex items-center p-3 bg-[#28313F]/5 rounded-md">
                    <Users size={18} className="text-[#28313F] mr-2" />
                    <span className="text-gray-600">
                      Gerenciar Usuários e Documentos
                    </span>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
