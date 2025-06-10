import React, { useState } from 'react';
import { FileSearch } from 'lucide-react';
import DocumentCard from '../components/DocumentCard';
import DocumentFilter from '../components/DocumentFilter';
import { Document, DocumentType } from '../types';

interface DocumentsProps {
  documents: Document[];
  onDownload: (document: Document) => void;
}

const Documents: React.FC<DocumentsProps> = ({ documents, onDownload }) => {
  const [filters, setFilters] = useState({
    type: 'ALL' as DocumentType | 'ALL',
    month: null as number | null,
    year: null as number | null
  });
  
  const filterDocuments = (docs: Document[]) => {
    return docs.filter(doc => {
      // Filtrar por tipo
      if (filters.type !== 'ALL' && doc.type !== filters.type) {
        return false;
      }
      
      // Filtrar por mês
      if (filters.month !== null && doc.month !== filters.month) {
        return false;
      }
      
      // Filtrar por ano
      if (filters.year !== null && doc.year !== filters.year) {
        return false;
      }
      
      return true;
    });
  };
  
  const filteredDocuments = filterDocuments(documents);
  
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-[#28313F] mb-6">Meus Documentos</h1>
      
      <DocumentFilter onFilterChange={setFilters} />
      
      {filteredDocuments.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDocuments.map((document) => (
            <DocumentCard 
              key={document.id}
              document={document}
              onDownload={onDownload}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
            <FileSearch size={24} className="text-gray-400" />
          </div>
          <h2 className="text-xl font-medium text-gray-700 mb-2">Nenhum documento encontrado</h2>
          <p className="text-gray-500 max-w-md mx-auto">
            Tente ajustar os filtros ou verifique mais tarde para novos documentos.
          </p>
        </div>
      )}
    </div>
  );
};

export default Documents;