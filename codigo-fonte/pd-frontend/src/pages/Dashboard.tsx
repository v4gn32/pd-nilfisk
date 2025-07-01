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

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[#28313F]">
          Painel Administrativo
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Visão geral do sistema e estatísticas
        </p>
      </div>

      {isAdmin && (
        <>
          {/* Estatísticas principais */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900 dark:to-blue-800 border-blue-200">
              <CardContent className="p-6">
                <div className="flex items-center">
                  <div className="p-3 rounded-full bg-blue-500">
                    <Users className="text-white" size={24} />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm text-blue-600 font-medium">
                      Total de Usuários
                    </p>
                    <h3 className="text-2xl font-bold text-blue-900 dark:text-white">
                      {users.length}
                    </h3>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900 dark:to-green-800 border-green-200">
              <CardContent className="p-6">
                <div className="flex items-center">
                  <div className="p-3 rounded-full bg-green-500">
                    <FileText className="text-white" size={24} />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm text-green-600 font-medium">
                      Total de Documentos
                    </p>
                    <h3 className="text-2xl font-bold text-green-900 dark:text-white">
                      {documents.length}
                    </h3>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900 dark:to-purple-800 border-purple-200">
              <CardContent className="p-6">
                <div className="flex items-center">
                  <div className="p-3 rounded-full bg-purple-500">
                    <Calendar className="text-white" size={24} />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm text-purple-600 font-medium">
                      Este Mês
                    </p>
                    <h3 className="text-2xl font-bold text-purple-900 dark:text-white">
                      {documentsThisMonth}
                    </h3>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900 dark:to-orange-800 border-orange-200">
              <CardContent className="p-6">
                <div className="flex items-center">
                  <div className="p-3 rounded-full bg-orange-500">
                    <TrendingUp className="text-white" size={24} />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm text-orange-600 font-medium">
                      Este Ano
                    </p>
                    <h3 className="text-2xl font-bold text-orange-900 dark:text-white">
                      {documentsThisYear}
                    </h3>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Documentos por tipo + recentes */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 size={20} />
                  Documentos por Tipo
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {Object.entries(documentsByType).map(([type, count]) => (
                    <div
                      key={type}
                      className={`flex justify-between items-center p-3 rounded-lg
                        ${
                          type === "HOLERITE"
                            ? "bg-blue-50 text-blue-700 dark:bg-blue-900"
                            : type === "FERIAS"
                            ? "bg-green-50 text-green-700 dark:bg-green-900"
                            : type === "COMISSAO"
                            ? "bg-purple-50 text-purple-700 dark:bg-purple-900"
                            : "bg-orange-50 text-orange-700 dark:bg-orange-900"
                        }`}
                    >
                      <span className="font-medium">
                        {getDocumentTypeLabel(type)}
                      </span>
                      <span className="font-bold">{count}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity size={20} />
                  Documentos Recentes
                </CardTitle>
              </CardHeader>
              <CardContent>
                {recentDocuments.length > 0 ? (
                  <div className="space-y-3">
                    {recentDocuments.map((doc) => (
                      <div
                        key={doc.id}
                        className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <div className="p-2 rounded-md bg-[#38AFD9]/10">
                            <FileText className="text-[#38AFD9]" size={16} />
                          </div>
                          <div>
                            <h4 className="font-medium">
                              {getDocumentTypeLabel(doc.type)}
                            </h4>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              {getUserName(doc.userId)}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="flex items-center text-sm text-gray-500 dark:text-gray-300 mb-1">
                            <Calendar size={12} className="mr-1" />
                            <span>
                              {getMonthName(doc.month)} {doc.year}
                            </span>
                          </div>
                          <div className="flex items-center text-xs text-gray-400">
                            <Clock size={10} className="mr-1" />
                            <span>
                              {new Date(doc.createdAt).toLocaleDateString(
                                "pt-BR"
                              )}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                    <FileText className="mx-auto mb-2" size={32} />
                    <p>Nenhum documento encontrado</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Ações rápidas com navegação */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Ações Rápidas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div
                  onClick={() => navigate("/upload")}
                  className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:border-[#38AFD9] hover:bg-[#38AFD9]/5 transition-all cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <Upload className="text-[#38AFD9]" size={20} />
                    <div>
                      <h3 className="font-medium">Enviar Documentos</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Fazer upload de novos documentos
                      </p>
                    </div>
                  </div>
                </div>

                <div
                  onClick={() => navigate("/users")}
                  className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:border-[#38AFD9] hover:bg-[#38AFD9]/5 transition-all cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <Users className="text-[#38AFD9]" size={20} />
                    <div>
                      <h3 className="font-medium">Gerenciar Usuários</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Adicionar ou editar usuários
                      </p>
                    </div>
                  </div>
                </div>

                <div
                  onClick={() => navigate("/settings")}
                  className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:border-[#38AFD9] hover:bg-[#38AFD9]/5 transition-all cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <BarChart3 className="text-[#38AFD9]" size={20} />
                    <div>
                      <h3 className="font-medium">Relatórios</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Visualizar estatísticas detalhadas
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
};

export default Dashboard;
