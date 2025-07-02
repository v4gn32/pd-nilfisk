export type User = {
  id: number;
  name: string;
  email: string;
  role: "ADMIN" | "COMMON";
};

export type DocumentType =
  | "HOLERITE"
  | "FERIAS"
  | "COMISSAO"
  | "INFORME_RENDIMENTO";

export type Document = {
  id: number;
  type: DocumentType;
  fileUrl: string;
  filename: string;
  userId: number;
  month: number;
  year: number;
  createdAt: string;
};

export type AuthState = {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
};
