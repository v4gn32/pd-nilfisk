import React from "react";
import {
  Users,
  FileText,
  Upload,
  TrendingUp,
  Calendar,
  Activity,
  BarChart3,
  Clock,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/Card";
import { Document, User } from "../types";

interface DashboardProps {
  user: User;
  users: User[];
  documents: Document[];
}

const Dashboard: React.FC<DashboardProps> = ({ user, users, documents }) => {
  const navigate = useNavigate();
  const isAdmin = user.role === "ADMIN";

  const currentMonth = new Date().getMonth() + 1;
  const currentYear = new Date().getFullYear();

  const documentsThisMonth = documents.filter(
    (doc) => doc.month === currentMonth && doc.year === currentYear
  ).length;

  const documentsThisYear = documents.filter(
    (doc) => doc.year === currentYear
  ).length;

  const documentsByType = {
    HOLERITE: documents.filter((doc) => doc.type === "HOLERITE").length,
    FERIAS: documents.filter((doc) => doc.type === "FERIAS").length,
    COMISSAO: documents.filter((doc) => doc.type === "COMISSAO").length,
    INFORME_RENDIMENTO: documents.filter(
      (doc) => doc.type === "INFORME_RENDIMENTO"
    ).length,
  };

  const recentDocuments = [...documents]
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )
    .slice(0, 5);

  const getUserName = (userId: number) => {
    const found = users.find((u) => u.id === userId);
    return found?.name || "Usuário Desconhecido";
  };

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

  const getMonthName = (month: number) => {
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
    return months[month - 1] || "Desconhecido";
  };

  const latestDocument = documents.length
    ? documents.reduce((latest, current) =>
        new Date(current.createdAt) > new Date(latest.createdAt)
          ? current
          : latest
      )
    : null;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-[#28313F] mb-2">
        {isAdmin ? "Painel Administrativo" : "Painel"}
      </h1>
      <p className="text-gray-600 dark:text-gray-400 mb-6">
        {isAdmin
          ? "Visão geral do sistema e estatísticas"
          : "Resumo dos seus documentos e atualizações"}
      </p>

      {isAdmin ? (
        <>
          {/* Painel ADMIN (cards, documentos por tipo, ações rápidas) */}
          {/* ... (copiar a parte já existente do painel admin aqui como no seu código atual) */}
        </>
      ) : (
        <>
          {/* Painel USUÁRIO COMUM */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            {Object.entries(documentsByType).map(([type, count]) => (
              <Card key={type}>
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <div
                      className={`p-3 rounded-full ${
                        type === "HOLERITE"
                          ? "bg-blue-100 text-blue-500"
                          : type === "FERIAS"
                          ? "bg-green-100 text-green-500"
                          : type === "COMISSAO"
                          ? "bg-purple-100 text-purple-500"
                          : "bg-orange-100 text-orange-500"
                      }`}
                    >
                      <FileText size={24} />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm text-gray-500">
                        {getDocumentTypeLabel(type)}
                      </p>
                      <h3 className="text-2xl font-bold">{count}</h3>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Documentos Recentes */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Documentos Recentes</CardTitle>
              </CardHeader>
              <CardContent>
                {recentDocuments.length > 0 ? (
                  <div className="space-y-4">
                    {recentDocuments.map((doc) => (
                      <div
                        key={doc.id}
                        className="flex items-center p-3 rounded-md hover:bg-gray-50"
                      >
                        <div className="p-2 rounded-md bg-gray-100 mr-4">
                          <FileText className="text-blue-500" size={20} />
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
                          {new Date(doc.createdAt).toLocaleDateString("pt-BR")}
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

            {/* Resumo */}
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
                    <span className="font-bold">{documentsThisYear}</span>
                  </div>
                  {latestDocument && (
                    <div className="flex justify-between items-center pb-2 border-b border-gray-100">
                      <span className="text-gray-600">Último Documento</span>
                      <span className="font-bold text-[#38AFD9]">
                        {getDocumentTypeLabel(latestDocument.type)}
                      </span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </>
      )}
    </div>
  );
};

export default Dashboard;
