export const uploadDocumentToBackend = async (
  type: DocumentType,
  file: File,
  userId: number,
  month: number,
  year: number
): Promise<void> => {
  const token = localStorage.getItem('token');
  if (!token) throw new Error('Usuário não autenticado');

  const formData = new FormData();
  formData.append('file', file);
  formData.append('type', type);
  formData.append('userId', String(userId));
  formData.append('month', String(month));
  formData.append('year', String(year));

  const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/documents/upload`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Erro ao enviar documento: ${errorText}`);
  }
};
