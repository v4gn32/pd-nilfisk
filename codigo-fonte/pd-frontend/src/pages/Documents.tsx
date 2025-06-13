import React, { useState } from 'react';
import { FileSearch } from 'lucide-react';
import DocumentCard from '../components/DocumentCard';
import DocumentFilter from '../components/DocumentFilter';
import { Document, DocumentType } from '../types';
import { useDocuments } from '../hooks/useDocuments';

const Documents: React.FC = () => {
  // 🎯 Estado dos filtros
  const [filters, setFilters] = useState({
    type: 'ALL' as DocumentType | 'ALL',
    month: null,
    year: null,
  });

  // 📦 Busca de documentos com hook customizado
  const { documents, loading, error } = useDocuments(filters);

  // 🔽 Baixar documento com autenticação
  const handleDownload = async (document: Document) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        alert('Usuário não autenticado');
        return;
      }

      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/documents/${document.id}/download`,
        {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error('Erro ao baixar o documento');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);

      const link = document.createElement('a');
      link.href = url;
      link.download = `${document.type}-${document.month}-${document.year}.pdf`;
      link.click();

      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Erro no download:', error);
      alert('Erro ao baixar documento');
    }
  };

  // 🗑️ Excluir documento (somente ADMIN)
  const handleDelete = async (document: Document) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/documents/${document.id}`,
        {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error('Erro ao excluir documento');
      }

      alert('Documento excluído com sucesso');
      window.location.reload(); // ou use estado para remover da lista

    } catch (error) {
      console.error('Erro ao excluir documento:', error);
      alert('Erro ao excluir documento');
    }
  };

  return (
    <div className="p-6">
      {/* Título da página */}
      <h1 className="text-2xl font-bold text-[#28313F] mb-6">Meus Documentos</h1>

      {/* Filtros */}
      <DocumentFilter onFilterChange={setFilters} />

      {/* Estado de carregamento */}
      {loading && (
        <p className="text-center text-gray-500">Carregando documentos...</p>
      )}

      {/* Erro de carregamento */}
      {error && (
        <p className="text-center text-red-500">{error}</p>
      )}

      {/* Lista de documentos */}
      {!loading && documents.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {documents.map((document) => (
            <DocumentCard
              key={document.id}
              document={document}
              onDownload={handleDownload}
              onDelete={handleDelete} // opcional, só visível se ADMIN
            />
          ))}
        </div>
      ) : (
        // Mensagem de "nenhum documento encontrado"
        !loading && (
          <div className="text-center py-16">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
              <FileSearch size={24} className="text-gray-400" />
            </div>
            <h2 className="text-xl font-medium text-gray-700 mb-2">
              Nenhum documento encontrado
            </h2>
            <p className="text-gray-500 max-w-md mx-auto">
              Tente ajustar os filtros ou verifique mais tarde para novos documentos.
            </p>
          </div>
        )
      )}
    </div>
  );
};

export default Documents;
