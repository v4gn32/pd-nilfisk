import { useEffect, useState } from "react";
import api from "../utils/apiClient";
import { Document, DocumentType } from "../types";

interface Filters {
  type: DocumentType | "ALL";
  month: number | null;
  year: number | null;
}

export const useDocuments = (filters?: Filters) => {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 🔁 Função para buscar documentos
  const fetchDocuments = async () => {
    setLoading(true);
    setError(null);

    try {
      const params: any = {};

      if (filters) {
        if (filters.type !== "ALL") params.type = filters.type;
        if (filters.month) params.month = filters.month;
        if (filters.year) params.year = filters.year;
      }

      const response = await api.get("/documents/me", { params });
      setDocuments(response.data);
    } catch (err) {
      setError("Erro ao carregar documentos");
    } finally {
      setLoading(false);
    }
  };

  // 🔁 Atualiza ao carregar e ao mudar os filtros
  useEffect(() => {
    fetchDocuments();
  }, [JSON.stringify(filters)]); // importante para detectar mudanças

  return {
    documents,
    loading,
    error,
    reload: fetchDocuments, // permite reuso externo (ex: pós-upload)
  };
};
