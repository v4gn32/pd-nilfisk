// frontend/src/pages/Dashboard.tsx
import React, { useEffect, useState } from "react";
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
import api from "../services/api"; // Certifique-se que esse arquivo adiciona o token JWT no header
import { Document, User } from "../types";

const Dashboard: React.FC = () => {
  const navigate = useNavigate();

  const [user, setUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);

  // Carregar dados ao montar
  useEffect(() => {
    const fetchData = async () => {
      try {
        // 🔄 Corrigido o endpoint para refletir o backend real
        const profile = await api.get("/auth/profile");
        setUser(profile.data);

        if (profile.data.role === "ADMIN") {
          const [usersRes, documentsRes] = await Promise.all([
            api.get("/users"),
            api.get("/documents"),
          ]);
          setUsers(usersRes.data);
          setDocuments(documentsRes.data);
        } else {
          const docsRes = await api.get("/documents/me");
          setDocuments(docsRes.data);
        }
      } catch (error) {
        console.error("Erro ao carregar dados:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">Carregando dados do painel...</p>
      </div>
    );
  }

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

  const getUserName = (userId: number) =>
    users.find((u) => u.id === userId)?.name || "Usuário Desconhecido";

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

    const uniqueRecentDocuments = documents.reduce((acc: Document[], doc) => {
      const exists = acc.find(
        (d) =>
          d.userId === doc.userId &&
          d.type === doc.type &&
          d.month === doc.month &&
          d.year === doc.year
      );
      if (!exists) acc.push(doc);
      return acc;
    }, []);

    const recentDocuments = [...uniqueRecentDocuments]
      .sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      )
      .slice(0, 5);

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
          <StatCard
            label="Total de Usuários"
            value={users.length}
            icon={<Users size={24} />}
            color="blue"
          />
          <StatCard
            label="Total de Documentos"
            value={documents.length}
            icon={<FileText size={24} />}
            color="green"
          />
          <StatCard
            label="Este Mês"
            value={documentsThisMonth}
            icon={<Calendar size={24} />}
            color="purple"
          />
          <StatCard
            label="Este Ano"
            value={documentsThisYear}
            icon={<TrendingUp size={24} />}
            color="orange"
          />
        </div>

        {/* Documentos por Tipo e Recentes */}
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

        {/* Ações Rápidas */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Ações Rápidas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <QuickAction
                label="Enviar Documentos"
                icon={<Upload />}
                onClick={() => navigate("/upload")}
              />
              <QuickAction
                label="Gerenciar Usuários"
                icon={<Users />}
                onClick={() => navigate("/users")}
              />
              <QuickAction
                label="Relatórios"
                icon={<BarChart3 />}
                onClick={() => navigate("/settings")}
              />
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // --- Painel do usuário comum ---
  const userDocs = documents;
  const currentYearDocs = userDocs.filter(
    (doc) => doc.year === new Date().getFullYear()
  );
  const latestDocument = [...userDocs].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  )[0];
  const getCount = (type: string) =>
    userDocs.filter((doc) => doc.type === type).length;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-[#28313F] mb-6">Painel</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        {["HOLERITE", "FERIAS", "COMISSAO", "INFORME_RENDIMENTO"].map(
          (type) => (
            <Card key={type}>
              <CardContent className="p-6 flex items-center">
                <div className="p-3 rounded-full bg-gray-100">
                  <FileText className="text-gray-600" size={24} />
                </div>
                <div className="ml-4">
                  <p className="text-sm text-gray-500">
                    {getDocumentTypeLabel(type)}
                  </p>
                  <h3 className="text-2xl font-bold">{getCount(type)}</h3>
                </div>
              </CardContent>
            </Card>
          )
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Documentos Recentes</CardTitle>
          </CardHeader>
          <CardContent>
            {userDocs.length > 0 ? (
              <div className="space-y-4">
                {userDocs.slice(0, 5).map((doc) => (
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

        <Card>
          <CardHeader>
            <CardTitle>Resumo</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Total</span>
              <span className="font-bold">{userDocs.length}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Este ano</span>
              <span className="font-bold">{currentYearDocs.length}</span>
            </div>
            {latestDocument && (
              <div className="flex justify-between">
                <span className="text-gray-600">Último</span>
                <span className="font-bold text-blue-600">
                  {getDocumentTypeLabel(latestDocument.type)}
                </span>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

// Reutilizáveis
const StatCard = ({
  label,
  value,
  icon,
  color,
}: {
  label: string;
  value: number;
  icon: JSX.Element;
  color: string;
}) => (
  <Card
    className={`bg-gradient-to-br from-${color}-50 to-${color}-100 border-${color}-200`}
  >
    <CardContent className="p-6">
      <div className="flex items-center">
        <div className={`p-3 rounded-full bg-${color}-500 text-white`}>
          {icon}
        </div>
        <div className="ml-4">
          <p className={`text-sm text-${color}-600 font-medium`}>{label}</p>
          <h3 className={`text-2xl font-bold text-${color}-900`}>{value}</h3>
        </div>
      </div>
    </CardContent>
  </Card>
);

const QuickAction = ({
  label,
  icon,
  onClick,
}: {
  label: string;
  icon: JSX.Element;
  onClick: () => void;
}) => (
  <div
    onClick={onClick}
    className="p-4 border rounded-lg hover:border-[#38AFD9] hover:bg-[#38AFD9]/5 cursor-pointer"
  >
    <div className="flex items-center gap-3">
      {icon}
      <div>
        <h3 className="font-medium">{label}</h3>
        <p className="text-sm text-gray-600">Clique para acessar</p>
      </div>
    </div>
  </div>
);

export default Dashboard;
