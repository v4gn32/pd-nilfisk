import React, { useState, useRef, useEffect } from "react";
import { Upload, AlertCircle, CheckCircle2, FileText, X } from "lucide-react";
import Button from "../components/ui/Button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/Card";
import { DocumentType, User } from "../types";

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
  const [documentType, setDocumentType] = useState<DocumentType>("HOLERITE");
  const [userId, setUserId] = useState<number | "">("");
  const [month, setMonth] = useState<number | "">("");
  const [year, setYear] = useState<number>(new Date().getFullYear());
  const [file, setFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [processedCount, setProcessedCount] = useState<number>(0);
  const [isDragOver, setIsDragOver] = useState(false);
  const [dragCounter, setDragCounter] = useState(0);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 6 }, (_, i) => currentYear - i);
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

  const documentTypes: Array<{ value: DocumentType; label: string }> = [
    { value: "HOLERITE", label: "Holerite" },
    { value: "FERIAS", label: "Férias" },
    { value: "COMISSAO", label: "Comissão" },
    { value: "INFORME_RENDIMENTO", label: "Informe de Rendimentos" },
  ];

  useEffect(() => {
    setIsDragOver(dragCounter > 0);
  }, [dragCounter]);

  const validateFile = (file: File): boolean => {
    if (file.type !== "application/pdf") {
      setError("Por favor, selecione apenas arquivos PDF");
      return false;
    }
    if (file.size > 10 * 1024 * 1024) {
      setError("O arquivo deve ter no máximo 10MB");
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

  const handleDragEvents = (e: React.DragEvent, type: string) => {
    e.preventDefault();
    e.stopPropagation();

    if (type === "enter") setDragCounter((c) => c + 1);
    if (type === "leave") setDragCounter((c) => c - 1);
    if (type === "drop") {
      setDragCounter(0);
      if (e.dataTransfer.files.length) {
        handleFileChange(e.dataTransfer.files[0]);
        e.dataTransfer.clearData();
      }
    }
  };

  const openFileDialog = () => fileInputRef.current?.click();

  const removeFile = () => {
    setFile(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setProcessedCount(0);

    if (!file) return setError("Por favor, selecione um arquivo para enviar");
    if (documentType !== "HOLERITE" && userId === "")
      return setError("Por favor, selecione um funcionário");
    if (month === "") return setError("Por favor, selecione um mês");

    try {
      setIsLoading(true);

      if (documentType === "HOLERITE") {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("month", String(month));
        formData.append("year", String(year));

        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/documents/bulk-holerites`,
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
            },
            body: formData,
          }
        );

        if (!response.ok) throw new Error("Erro ao processar holerites");
        const result = await response.json();
        const qtd = parseInt(result.message?.match(/\d+/)?.[0] || "0");
        setProcessedCount(qtd);
        setSuccess(result.message || "Holerites processados com sucesso");
      } else {
        await onUpload(documentType, file, Number(userId), Number(month), year);
        setSuccess("Documento enviado com sucesso");
        setProcessedCount(1);
      }

      // Reset
      setFile(null);
      setDocumentType("HOLERITE");
      setUserId("");
      setMonth("");
      setYear(currentYear);
      if (fileInputRef.current) fileInputRef.current.value = "";
      setDragCounter(0);
    } catch (err) {
      console.error(err);
      setError("Falha ao enviar documento. Por favor, tente novamente.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-[#28313F] mb-6">
        Enviar Documento
      </h1>
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Enviar Documento do Funcionário</CardTitle>
        </CardHeader>
        <CardContent>
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md flex items-start">
              <AlertCircle
                className="text-red-500 mr-2 flex-shrink-0 mt-0.5"
                size={16}
              />
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}
          {success && (
            <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-md flex items-start">
              <CheckCircle2
                className="text-green-500 mr-2 flex-shrink-0 mt-0.5"
                size={16}
              />
              <p className="text-sm text-green-700">{success}</p>
            </div>
          )}
          {processedCount > 0 && (
            <p className="text-sm text-gray-600 mt-1">
              {processedCount} documento{processedCount > 1 ? "s" : ""}{" "}
              processado{processedCount > 1 ? "s" : ""}
            </p>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="docType"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Tipo de Documento
              </label>
              <select
                id="docType"
                value={documentType}
                onChange={(e) =>
                  setDocumentType(e.target.value as DocumentType)
                }
                className="w-full border p-2 rounded-md"
              >
                {documentTypes.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>

            {documentType !== "HOLERITE" && (
              <div>
                <label
                  htmlFor="userId"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Funcionário
                </label>
                <select
                  id="userId"
                  value={userId}
                  onChange={(e) =>
                    setUserId(e.target.value ? Number(e.target.value) : "")
                  }
                  className="w-full border p-2 rounded-md"
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
                <label
                  htmlFor="month"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Mês
                </label>
                <select
                  id="month"
                  value={month}
                  onChange={(e) =>
                    setMonth(e.target.value ? Number(e.target.value) : "")
                  }
                  className="w-full border p-2 rounded-md"
                >
                  <option value="">Selecione o mês</option>
                  {months.map((m, i) => (
                    <option key={i + 1} value={i + 1}>
                      {m}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label
                  htmlFor="year"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Ano
                </label>
                <select
                  id="year"
                  value={year}
                  onChange={(e) => setYear(Number(e.target.value))}
                  className="w-full border p-2 rounded-md"
                >
                  {years.map((y) => (
                    <option key={y} value={y}>
                      {y}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label
                htmlFor="pdfFile"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Arquivo PDF
              </label>
              <div
                className={`mt-1 p-6 text-center border-2 border-dashed rounded-md cursor-pointer transition-all duration-200
                ${
                  isDragOver
                    ? "border-[#38AFD9] bg-[#38AFD9]/5"
                    : "border-gray-300 hover:border-[#38AFD9] hover:bg-gray-50"
                }`}
                onDragEnter={(e) => handleDragEvents(e, "enter")}
                onDragLeave={(e) => handleDragEvents(e, "leave")}
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => handleDragEvents(e, "drop")}
                onClick={openFileDialog}
              >
                {!file ? (
                  <>
                    <Upload className="mx-auto h-10 w-10 text-gray-400" />
                    <p className="text-sm text-gray-600 mt-2">
                      Clique ou arraste o arquivo PDF
                    </p>
                    <p className="text-xs text-gray-400">
                      Tamanho máximo: 10MB
                    </p>
                  </>
                ) : (
                  <div className="flex justify-center items-center gap-3">
                    <FileText className="text-green-500 h-8 w-8" />
                    <div className="text-left">
                      <p className="text-sm font-medium text-gray-900">
                        {file.name}
                      </p>
                      <p className="text-xs text-gray-500">
                        {formatFileSize(file.size)}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        removeFile();
                      }}
                      className="text-red-500 hover:text-red-700"
                      aria-label="Remover arquivo"
                    >
                      <X size={18} />
                    </button>
                  </div>
                )}
              </div>
              <input
                id="pdfFile"
                ref={fileInputRef}
                type="file"
                accept="application/pdf"
                className="hidden"
                aria-label="Selecionar arquivo PDF"
                onChange={(e) => {
                  if (e.target.files && e.target.files[0])
                    handleFileChange(e.target.files[0]);
                }}
              />
            </div>

            <div className="mt-4">
              <Button
                type="submit"
                isLoading={isLoading}
                fullWidth
                disabled={!file}
              >
                {documentType === "HOLERITE"
                  ? "Processar e Distribuir Holerites"
                  : "Enviar Documento"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default UploadDocument;
