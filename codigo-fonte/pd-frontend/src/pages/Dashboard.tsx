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

  if (isAdmin) {
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

    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold text-[#28313F]">
          Painel Administrativo
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          Visão geral do sistema e estatísticas
        </p>

        {/* Cards principais */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-blue-500">
                  <Users className="text-white" size={24} />
                </div>
                <div className="ml-4">
                  <p className="text-sm text-blue-600 font-medium">
                    Total de Usuários
                  </p>
                  <h3 className="text-2xl font-bold text-blue-900">
                    {users.length}
                  </h3>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-green-500">
                  <FileText className="text-white" size={24} />
                </div>
                <div className="ml-4">
                  <p className="text-sm text-green-600 font-medium">
                    Total de Documentos
                  </p>
                  <h3 className="text-2xl font-bold text-green-900">
                    {documents.length}
                  </h3>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-purple-500">
                  <Calendar className="text-white" size={24} />
                </div>
                <div className="ml-4">
                  <p className="text-sm text-purple-600 font-medium">
                    Este Mês
                  </p>
                  <h3 className="text-2xl font-bold text-purple-900">
                    {documentsThisMonth}
                  </h3>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-orange-500">
                  <TrendingUp className="text-white" size={24} />
                </div>
                <div className="ml-4">
                  <p className="text-sm text-orange-600 font-medium">
                    Este Ano
                  </p>
                  <h3 className="text-2xl font-bold text-orange-900">
                    {documentsThisYear}
                  </h3>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Documentos por tipo e recentes */}
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
                    className={`flex justify-between items-center p-3 rounded-lg ${
                      type === "HOLERITE"
                        ? "bg-blue-50 text-blue-700"
                        : type === "FERIAS"
                        ? "bg-green-50 text-green-700"
                        : type === "COMISSAO"
                        ? "bg-purple-50 text-purple-700"
                        : "bg-orange-50 text-orange-700"
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
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-md bg-[#38AFD9]/10">
                          <FileText className="text-[#38AFD9]" size={16} />
                        </div>
                        <div>
                          <h4 className="font-medium">
                            {getDocumentTypeLabel(doc.type)}
                          </h4>
                          <p className="text-sm text-gray-600">
                            {getUserName(doc.userId)}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center text-sm text-gray-500 mb-1">
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
                <div className="text-center py-8 text-gray-500">
                  <FileText className="mx-auto mb-2" size={32} />
                  <p>Nenhum documento encontrado</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Ações rápidas */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Ações Rápidas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div
                onClick={() => navigate("/upload")}
                className="p-4 border rounded-lg hover:border-[#38AFD9] hover:bg-[#38AFD9]/5 cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <Upload className="text-[#38AFD9]" size={20} />
                  <div>
                    <h3 className="font-medium">Enviar Documentos</h3>
                    <p className="text-sm text-gray-600">
                      Fazer upload de novos documentos
                    </p>
                  </div>
                </div>
              </div>

              <div
                onClick={() => navigate("/users")}
                className="p-4 border rounded-lg hover:border-[#38AFD9] hover:bg-[#38AFD9]/5 cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <Users className="text-[#38AFD9]" size={20} />
                  <div>
                    <h3 className="font-medium">Gerenciar Usuários</h3>
                    <p className="text-sm text-gray-600">
                      Adicionar ou editar usuários
                    </p>
                  </div>
                </div>
              </div>

              <div
                onClick={() => navigate("/settings")}
                className="p-4 border rounded-lg hover:border-[#38AFD9] hover:bg-[#38AFD9]/5 cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <BarChart3 className="text-[#38AFD9]" size={20} />
                  <div>
                    <h3 className="font-medium">Relatórios</h3>
                    <p className="text-sm text-gray-600">
                      Visualizar estatísticas detalhadas
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Layout para usuário comum
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-[#28313F] mb-6">Painel</h1>

      {/* ... layout do usuário comum aqui, como no modelo que você já criou ... */}
      {/* Caso queira, posso gerar o bloco final do usuário comum novamente com os cards, documentos e resumo. */}
    </div>
  );
};

export default Dashboard;
