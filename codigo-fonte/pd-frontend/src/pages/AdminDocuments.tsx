import React, { useEffect, useState } from "react";
import {
  FileText,
  Trash2,
  Download,
  Calendar,
  Clock,
  User,
  Filter,
  ChevronDown,
  AlertTriangle,
  Eye,
  X,
  Search,
} from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "../components/ui/Card";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import api from "../services/api";
import { Document, DocumentType, User as UserType } from "../types";

interface FilterState {
  type: DocumentType | "ALL";
  month: number | null;
  year: number | null;
  userId: number | null;
  searchTerm: string;
}

const AdminDocuments: React.FC = () => {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [users, setUsers] = useState<UserType[]>([]);
  const [filters, setFilters] = useState<FilterState>({
    type: "ALL",
    month: null,
    year: null,
    userId: null,
    searchTerm: "",
  });
  const [showFilters, setShowFilters] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  // 📥 Carrega documentos e usuários ao iniciar
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [docRes, userRes] = await Promise.all([
          api.get("/documents"),
          api.get("/users"),
        ]);
        setDocuments(docRes.data);
        setUsers(userRes.data);
      } catch (err) {
        console.error("Erro ao carregar documentos ou usuários", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // 📑 Tipos de documentos
  const documentTypes = [
    { value: "ALL", label: "Todos os Documentos" },
    { value: "HOLERITE", label: "Holerites" },
    { value: "FERIAS", label: "Férias" },
    { value: "COMISSAO", label: "Comissões" },
    { value: "INFORME_RENDIMENTO", label: "Informes de Rendimentos" },
  ];

  // 📆 Meses e anos
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

  // 🔧 Helpers para exibição
  const getDocumentTypeLabel = (type: DocumentType) =>
    documentTypes.find((t) => t.value === type)?.label || "Documento";

  const getMonthName = (month: number) =>
    months.find((m) => m.value === month)?.label || "Mês desconhecido";

  const getUserName = (userId: number) =>
    users.find((u) => u.id === userId)?.name || "Usuário Desconhecido";

  const getDocumentIcon = (type: DocumentType) => {
    const iconClass = "w-5 h-5";
    const colors = {
      HOLERITE: "text-blue-500",
      FERIAS: "text-green-500",
      COMISSAO: "text-purple-500",
      INFORME_RENDIMENTO: "text-orange-500",
      default: "text-gray-500",
    };
    return (
      <FileText className={`${iconClass} ${colors[type] || colors.default}`} />
    );
  };

  // 🔍 Aplica os filtros selecionados
  const filterDocuments = (docs: Document[]) =>
    docs.filter((doc) => {
      if (filters.type !== "ALL" && doc.type !== filters.type) return false;
      if (filters.month && doc.month !== filters.month) return false;
      if (filters.year && doc.year !== filters.year) return false;
      if (filters.userId && doc.userId !== filters.userId) return false;
      if (filters.searchTerm) {
        const term = filters.searchTerm.toLowerCase();
        return (
          getUserName(doc.userId).toLowerCase().includes(term) ||
          getDocumentTypeLabel(doc.type).toLowerCase().includes(term)
        );
      }
      return true;
    });

  // 👁️ Visualiza documento no navegador com token no header
  const handleView = async (doc: Document) => {
    try {
      const res = await api.get(`/documents/${doc.id}/view`, {
        responseType: "blob",
      });
      const blob = new Blob([res.data], { type: "application/pdf" });
      const url = window.URL.createObjectURL(blob);
      window.open(url, "_blank");
    } catch (error) {
      console.error("Erro ao visualizar documento", error);
    }
  };

  // 📥 Baixa documento com nome padrão
  const handleDownload = async (doc: Document) => {
    try {
      const res = await api.get(`/documents/${doc.id}/download`, {
        responseType: "blob",
      });
      const blob = new Blob([res.data], { type: "application/pdf" });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${doc.type}-${doc.month}-${doc.year}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Erro ao baixar documento", error);
    }
  };

  // 🗑️ Exclui documento com confirmação temporária
  const handleDelete = async (id: number) => {
    if (deleteConfirm === id) {
      try {
        await api.delete(`/documents/${id}`);
        setDocuments((prev) => prev.filter((doc) => doc.id !== id));
      } catch (err) {
        console.error("Erro ao excluir documento", err);
      }
      setDeleteConfirm(null);
    } else {
      setDeleteConfirm(id);
      setTimeout(() => setDeleteConfirm(null), 3000);
    }
  };

  // 🧼 Atualiza filtros
  const handleFilterChange = (key: keyof FilterState, value: any) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilters({
      type: "ALL",
      month: null,
      year: null,
      userId: null,
      searchTerm: "",
    });
  };

  const filteredDocuments = filterDocuments(documents);
  const activeFilterCount = Object.values(filters).filter(
    (v) => v !== null && v !== "" && v !== "ALL"
  ).length;

  if (loading) return <div className="p-6">Carregando documentos...</div>;

  return (
    <div className="p-6 bg-gray-50 dark:bg-gray-900 min-h-screen">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
        Gerenciar Documentos
      </h1>

      {/* 🔍 Filtro de busca e filtros avançados */}
      <Card className="mb-6 bg-white dark:bg-gray-800">
        <CardContent className="p-4">
          <div className="mb-4 relative">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              size={20}
            />
            <Input
              placeholder="Buscar por nome ou tipo..."
              value={filters.searchTerm}
              onChange={(e) => handleFilterChange("searchTerm", e.target.value)}
              className="pl-10 w-full"
            />
          </div>

          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Filter size={18} className="text-gray-600" />
              <h3 className="font-medium text-gray-900 dark:text-white">
                Filtros Avançados
              </h3>
              {activeFilterCount > 0 && (
                <span className="ml-2 px-2 py-0.5 text-xs bg-[#38AFD9] text-white rounded-full">
                  {activeFilterCount}
                </span>
              )}
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center text-gray-600"
            >
              <span className="mr-1">
                {showFilters ? "Ocultar" : "Mostrar"}
              </span>
              <ChevronDown
                size={16}
                className={`transition-transform ${
                  showFilters ? "rotate-180" : ""
                }`}
              />
            </Button>
          </div>

          {showFilters && (
            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <select
                value={filters.type}
                onChange={(e) => handleFilterChange("type", e.target.value)}
                className="p-2 border rounded"
              >
                {documentTypes.map((t) => (
                  <option key={t.value} value={t.value}>
                    {t.label}
                  </option>
                ))}
              </select>

              <select
                value={filters.userId || ""}
                onChange={(e) =>
                  handleFilterChange(
                    "userId",
                    e.target.value ? parseInt(e.target.value) : null
                  )
                }
                className="p-2 border rounded"
              >
                <option value="">Todos os Usuários</option>
                {users.map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.name}
                  </option>
                ))}
              </select>

              <select
                value={filters.month || ""}
                onChange={(e) =>
                  handleFilterChange(
                    "month",
                    e.target.value ? parseInt(e.target.value) : null
                  )
                }
                className="p-2 border rounded"
              >
                <option value="">Todos os Meses</option>
                {months.map((m) => (
                  <option key={m.value} value={m.value}>
                    {m.label}
                  </option>
                ))}
              </select>

              <select
                value={filters.year || ""}
                onChange={(e) =>
                  handleFilterChange(
                    "year",
                    e.target.value ? parseInt(e.target.value) : null
                  )
                }
                className="p-2 border rounded"
              >
                <option value="">Todos os Anos</option>
                {years.map((y) => (
                  <option key={y} value={y}>
                    {y}
                  </option>
                ))}
              </select>
            </div>
          )}
        </CardContent>
      </Card>

      {/* 📂 Lista de documentos */}
      <Card className="bg-white dark:bg-gray-800">
        <CardHeader>
          <CardTitle className="text-gray-900 dark:text-white">
            Documentos ({filteredDocuments.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {filteredDocuments.length > 0 ? (
            <div className="space-y-3">
              {filteredDocuments.map((doc) => (
                <div
                  key={doc.id}
                  className="flex justify-between items-center p-4 rounded bg-gray-50 dark:bg-gray-700"
                >
                  <div className="flex items-center gap-3">
                    {getDocumentIcon(doc.type)}
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">
                        {getDocumentTypeLabel(doc.type)}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {getUserName(doc.userId)} – {getMonthName(doc.month)}{" "}
                        {doc.year}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={() =>
                        window.open(`/api/documents/${doc.id}/view`, "_blank")
                      }
                      className="text-green-600"
                      title="Visualizar"
                    >
                      <Eye size={18} />
                    </Button>

                    <Button
                      type="button" // 🔥 ESSA LINHA É A CHAVE!
                      variant="ghost"
                      onClick={() =>
                        (window.location.href = `/api/documents/${doc.id}/download`)
                      }
                      className="text-blue-600"
                      title="Baixar"
                    >
                      <Download size={18} />
                    </Button>

                    <Button
                      variant="ghost"
                      onClick={() => handleDelete(doc.id)}
                      className="text-red-600"
                      title="Excluir"
                    >
                      {deleteConfirm === doc.id ? (
                        <AlertTriangle size={18} />
                      ) : (
                        <Trash2 size={18} />
                      )}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center text-gray-500 py-10">
              Nenhum documento encontrado.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminDocuments;
