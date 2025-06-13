import { useEffect, useState } from 'react';
import api from '../utils/apiClient';
import { Document, DocumentType } from '../types';

interface Filters {
  type: DocumentType | 'ALL';
  month: number | null;
  year: number | null;
}

export const useDocuments = (filters: Filters) => {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDocuments = async () => {
      setLoading(true);
      setError(null);

      try {
        const params: any = {};
        if (filters.type !== 'ALL') params.type = filters.type;
        if (filters.month) params.month = filters.month;
        if (filters.year) params.year = filters.year;

        const response = await api.get('/documents/me', { params });
        setDocuments(response.data);
      } catch (err) {
        setError('Erro ao carregar documentos');
      } finally {
        setLoading(false);
      }
    };

    fetchDocuments();
  }, [filters]);

  return { documents, loading, error };
};
