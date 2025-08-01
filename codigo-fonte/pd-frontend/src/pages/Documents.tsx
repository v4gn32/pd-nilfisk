import React, { useEffect, useState } from "react";
import { FileSearch } from "lucide-react";
import DocumentCard from "../components/DocumentCard";
import DocumentFilter from "../components/DocumentFilter";
import { Document, DocumentType } from "../types";
import api from "../services/api";

const Documents: React.FC = () => {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [filters, setFilters] = useState({
    type: "ALL" as DocumentType | "ALL",
    month: null as number | null,
    year: null as number | null,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        const response = await api.get("/documents/me");
        setDocuments(response.data);
      } catch (error) {
        console.error("Erro ao buscar documentos:", error);
        alert("Erro ao carregar documentos. Tente novamente.");
      } finally {
        setLoading(false);
      }
    };

    fetchDocuments();
  }, []);

  const filterDocuments = (docs: Document[]) => {
    return docs.filter((doc) => {
      if (filters.type !== "ALL" && doc.type !== filters.type) return false;
      if (filters.month !== null && doc.month !== filters.month) return false;
      if (filters.year !== null && doc.year !== filters.year) return false;
      return true;
    });
  };

  const filteredDocuments = filterDocuments(documents);

  // Função para baixar o documento
  const handleDownload = async (doc: Document) => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Token de autenticação não encontrado");
      return;
    }

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/documents/${doc.id}/download`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Falha ao baixar documento");
      }

      const blob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = downloadUrl;
      a.download = doc.filename || "documento.pdf";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(downloadUrl);
    } catch (error) {
      console.error("Erro ao baixar o documento:", error);
      alert("Não foi possível baixar o documento. Tente novamente.");
    }
  };

  // Função para visualizar o documento
  const handleView = (doc: Document) => {
    const token = localStorage.getItem("token");
    const url = `${import.meta.env.VITE_API_URL}/documents/${
      doc.id
    }/view?token=${token}`;
    window.open(url, "_blank");
  };

  if (loading) {
    return (
      <div className="p-6">
        <p className="text-gray-500">Carregando documentos...</p>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-[#28313F] mb-6">
        Meus Documentos
      </h1>

      <DocumentFilter onFilterChange={setFilters} />

      {filteredDocuments.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDocuments.map((document) => (
            <DocumentCard
              key={document.id}
              document={document}
              onDownload={handleDownload}
              onView={handleView}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
            <FileSearch size={24} className="text-gray-400" />
          </div>
          <h2 className="text-xl font-medium text-gray-700 mb-2">
            Nenhum documento encontrado
          </h2>
          <p className="text-gray-500 max-w-md mx-auto">
            Tente ajustar os filtros ou verifique mais tarde para novos
            documentos.
          </p>
        </div>
      )}
    </div>
  );
};

export default Documents;
