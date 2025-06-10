import React, { useState, useRef, useCallback } from 'react';
import { Upload, AlertCircle, CheckCircle2, FileText, X } from 'lucide-react';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '../components/ui/Card';
import { DocumentType, User } from '../types';
import { processBulkPayslips, ProcessedPayslip } from '../utils/pdfProcessor';

interface UploadDocumentProps {
  users: User[];
  onUpload: (
    type: DocumentType, 
    file: File, 
    userId: number, 
    month: number, 
    year: number
  ) => Promise<void>;
}

const UploadDocument: React.FC<UploadDocumentProps> = ({ users, onUpload }) => {
  const [documentType, setDocumentType] = useState<DocumentType>('HOLERITE');
  const [userId, setUserId] = useState<number | ''>('');
  const [month, setMonth] = useState<number | ''>('');
  const [year, setYear] = useState<number>(new Date().getFullYear());
  const [file, setFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [processedCount, setProcessedCount] = useState<number>(0);
  const [isDragOver, setIsDragOver] = useState(false);
  const [dragCounter, setDragCounter] = useState(0);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const documentTypes: Array<{ value: DocumentType, label: string }> = [
    { value: 'HOLERITE', label: 'Holerite' },
    { value: 'FERIAS', label: 'Férias' },
    { value: 'COMISSAO', label: 'Comissão' },
    { value: 'INFORME_RENDIMENTO', label: 'Informe de Rendimentos' }
  ];
  
  const months = [
    { value: 1, label: 'Janeiro' },
    { value: 2, label: 'Fevereiro' },
    { value: 3, label: 'Março' },
    { value: 4, label: 'Abril' },
    { value: 5, label: 'Maio' },
    { value: 6, label: 'Junho' },
    { value: 7, label: 'Julho' },
    { value: 8, label: 'Agosto' },
    { value: 9, label: 'Setembro' },
    { value: 10, label: 'Outubro' },
    { value: 11, label: 'Novembro' },
    { value: 12, label: 'Dezembro' }
  ];
  
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 6 }, (_, i) => currentYear - i);
  
  const validateFile = (file: File): boolean => {
    if (file.type !== 'application/pdf') {
      setError('Por favor, selecione apenas arquivos PDF');
      return false;
    }
    
    if (file.size > 10 * 1024 * 1024) { // 10MB
      setError('O arquivo deve ter no máximo 10MB');
      return false;
    }
    
    return true;
  };
  
  const handleFileChange = (selectedFile: File | null) => {
    if (selectedFile && validateFile(selectedFile)) {
      setFile(selectedFile);
      setError(null);
    }
  };
  
  const handleInputFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFileChange(e.target.files[0]);
    }
  };
  
  const handleDragEnter = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragCounter(prev => prev + 1);
    
    if (e.dataTransfer.items && e.dataTransfer.items.length > 0) {
      setIsDragOver(true);
    }
  }, []);
  
  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragCounter(prev => prev - 1);
    
    if (dragCounter <= 1) {
      setIsDragOver(false);
    }
  }, [dragCounter]);
  
  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);
  
  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
    setDragCounter(0);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const droppedFile = e.dataTransfer.files[0];
      handleFileChange(droppedFile);
      e.dataTransfer.clearData();
    }
  }, []);
  
  const removeFile = () => {
    setFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };
  
  const openFileDialog = () => {
    fileInputRef.current?.click();
  };
  
  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setProcessedCount(0);
    
    if (!file) {
      setError('Por favor, selecione um arquivo para enviar');
      return;
    }
    
    if (documentType !== 'HOLERITE' && userId === '') {
      setError('Por favor, selecione um funcionário');
      return;
    }
    
    if (month === '') {
      setError('Por favor, selecione um mês');
      return;
    }
    
    try {
      setIsLoading(true);
      
      if (documentType === 'HOLERITE') {
        // Process bulk payslips
        const processedPayslips = await processBulkPayslips(file);
        let successCount = 0;
        
        for (const payslip of processedPayslips) {
          // Find user by name (case insensitive)
          const user = users.find(u => 
            u.name.toUpperCase() === payslip.name.toUpperCase() || 
            u.name.toUpperCase().includes(payslip.name.toUpperCase()) ||
            payslip.name.toUpperCase().includes(u.name.toUpperCase())
          );
          
          if (user) {
            const payslipFile = new File(
              [payslip.pdfBytes], 
              `holerite-${user.name}-${month}-${year}.pdf`,
              { type: 'application/pdf' }
            );
            
            await onUpload(
              'HOLERITE',
              payslipFile,
              user.id,
              Number(month),
              year
            );
            
            successCount++;
          }
        }
        
        setProcessedCount(successCount);
        setSuccess(`${successCount} holerites processados e distribuídos com sucesso`);
      } else {
        // Handle single document upload
        await onUpload(
          documentType,
          file,
          Number(userId),
          Number(month),
          year
        );
        setSuccess('Documento enviado com sucesso');
      }
      
      // Reset form
      setFile(null);
      setDocumentType('HOLERITE');
      setUserId('');
      setMonth('');
      setYear(currentYear);
      
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (err) {
      setError('Falha ao enviar documento. Por favor, tente novamente.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-[#28313F] mb-6">Enviar Documento</h1>
      
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Enviar Documento do Funcionário</CardTitle>
        </CardHeader>
        
        <CardContent>
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md flex items-start">
              <AlertCircle className="text-red-500 mr-2 flex-shrink-0 mt-0.5" size={16} />
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}
          
          {success && (
            <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-md flex items-start">
              <CheckCircle2 className="text-green-500 mr-2 flex-shrink-0 mt-0.5" size={16} />
              <p className="text-sm text-green-700">{success}</p>
            </div>
          )}
          
          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tipo de Documento
                </label>
                <select
                  value={documentType}
                  onChange={(e) => setDocumentType(e.target.value as DocumentType)}
                  className="w-full rounded-md border border-gray-300 p-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#38AFD9]"
                >
                  {documentTypes.map((type) => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>
              
              {documentType !== 'HOLERITE' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Funcionário
                  </label>
                  <select
                    value={userId}
                    onChange={(e) => setUserId(e.target.value ? Number(e.target.value) : '')}
                    className="w-full rounded-md border border-gray-300 p-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#38AFD9]"
                  >
                    <option value="">Selecione um funcionário</option>
                    {users.map((user) => (
                      <option key={user.id} value={user.id}>
                        {user.name} ({user.email})
                      </option>
                    ))}
                  </select>
                </div>
              )}
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Mês
                  </label>
                  <select
                    value={month}
                    onChange={(e) => setMonth(e.target.value ? Number(e.target.value) : '')}
                    className="w-full rounded-md border border-gray-300 p-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#38AFD9]"
                  >
                    <option value="">Selecione o mês</option>
                    {months.map((m) => (
                      <option key={m.value} value={m.value}>
                        {m.label}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Ano
                  </label>
                  <select
                    value={year}
                    onChange={(e) => setYear(Number(e.target.value))}
                    className="w-full rounded-md border border-gray-300 p-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#38AFD9]"
                  >
                    {years.map((y) => (
                      <option key={y} value={y}>
                        {y}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              
              {/* Drag and Drop File Upload Area */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {documentType === 'HOLERITE' 
                    ? 'Arquivo de Holerites (PDF com múltiplas páginas)' 
                    : 'Arquivo do Documento'}
                </label>
                
                <div
                  className={`
                    mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-dashed rounded-md transition-all duration-200 cursor-pointer
                    ${isDragOver 
                      ? 'border-[#38AFD9] bg-[#38AFD9]/5 scale-[1.02]' 
                      : 'border-gray-300 hover:border-[#38AFD9] hover:bg-gray-50'
                    }
                    ${file ? 'border-green-300 bg-green-50' : ''}
                  `}
                  onDragEnter={handleDragEnter}
                  onDragLeave={handleDragLeave}
                  onDragOver={handleDragOver}
                  onDrop={handleDrop}
                  onClick={openFileDialog}
                >
                  <div className="space-y-1 text-center">
                    {!file ? (
                      <>
                        <Upload 
                          className={`mx-auto h-12 w-12 transition-colors ${
                            isDragOver ? 'text-[#38AFD9]' : 'text-gray-400'
                          }`} 
                        />
                        <div className="flex text-sm text-gray-600">
                          <span className="relative cursor-pointer rounded-md font-medium text-[#38AFD9] hover:text-[#28313F]">
                            {isDragOver ? 'Solte o arquivo aqui' : 'Clique para enviar'}
                          </span>
                          {!isDragOver && <p className="pl-1">ou arraste e solte</p>}
                        </div>
                        <p className="text-xs text-gray-500">PDF até 10MB</p>
                      </>
                    ) : (
                      <div className="flex items-center justify-center space-x-3">
                        <FileText className="h-8 w-8 text-green-500" />
                        <div className="text-left">
                          <p className="text-sm font-medium text-gray-900">{file.name}</p>
                          <p className="text-xs text-gray-500">{formatFileSize(file.size)}</p>
                        </div>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            removeFile();
                          }}
                          className="p-1 rounded-full hover:bg-red-100 text-red-500 hover:text-red-700 transition-colors"
                        >
                          <X size={16} />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
                
                <input
                  ref={fileInputRef}
                  type="file"
                  className="hidden"
                  accept="application/pdf,.pdf"
                  onChange={handleInputFileChange}
                />
              </div>
            </div>
            
            <div className="mt-6">
              <Button
                type="submit"
                isLoading={isLoading}
                fullWidth
                disabled={!file}
              >
                {documentType === 'HOLERITE' 
                  ? 'Processar e Distribuir Holerites' 
                  : 'Enviar Documento'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default UploadDocument;