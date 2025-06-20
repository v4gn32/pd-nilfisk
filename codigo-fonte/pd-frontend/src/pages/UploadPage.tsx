import React, { useEffect, useState } from "react";
import UploadDocument from "./UploadDocument";
import api from "../utils/apiClient";
import { User, DocumentType } from "../types";

const UploadPage: React.FC<{ onUploadSuccess?: () => void }> = ({
  onUploadSuccess,
}) => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await api.get("/users");
        setUsers(response.data);
      } catch (err) {
        console.error("Erro ao buscar usuários:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const handleUploadDocument = async (
    type: DocumentType,
    file: File,
    userId: number,
    month: number,
    year: number
  ) => {
    const formData = new FormData();
    formData.append("type", type);
    formData.append("file", file);
    formData.append("userId", userId.toString());
    formData.append("month", month.toString());
    formData.append("year", year.toString());

    await api.post("/documents/upload", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    if (onUploadSuccess) onUploadSuccess(); // ✅ dispara atualização
  };

  if (loading)
    return <p className="p-6 text-gray-600">Carregando usuários...</p>;

  return <UploadDocument users={users} onUpload={handleUploadDocument} />;
};

export default UploadPage;
