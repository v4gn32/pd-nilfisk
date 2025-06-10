import { Document, User } from '../types';

// Mock users data
export const mockUsers: User[] = [
  {
    id: 1,
    name: 'Administrador',
    email: 'admin@nilfisk.com',
    role: 'ADMIN'
  },
  {
    id: 2,
    name: 'Usuário Comum',
    email: 'user@example.com',
    role: 'COMMON'
  },
  {
    id: 3,
    name: 'JOÃO SILVA',
    email: 'joao@example.com',
    role: 'COMMON'
  },
  {
    id: 4,
    name: 'MARIA SANTOS',
    email: 'maria@example.com',
    role: 'COMMON'
  }
];

// Generate random documents for users
const currentYear = new Date().getFullYear();
const generateDocuments = (): Document[] => {
  const documents: Document[] = [];
  const documentTypes: Array<'HOLERITE' | 'FERIAS' | 'COMISSAO' | 'INFORME_RENDIMENTO'> = [
    'HOLERITE', 'FERIAS', 'COMISSAO', 'INFORME_RENDIMENTO'
  ];
  
  // Generate payslips for each user for the last 12 months
  mockUsers.forEach(user => {
    // Add monthly payslips
    for (let i = 0; i < 12; i++) {
      const date = new Date();
      date.setMonth(date.getMonth() - i);
      documents.push({
        id: documents.length + 1,
        type: 'HOLERITE',
        fileUrl: `/documents/payslip-${user.id}-${date.getMonth() + 1}-${date.getFullYear()}.pdf`,
        userId: user.id,
        month: date.getMonth() + 1,
        year: date.getFullYear(),
        createdAt: date.toISOString()
      });
    }
    
    // Add vacation documents
    const vacationDate = new Date();
    vacationDate.setMonth(vacationDate.getMonth() - 2);
    documents.push({
      id: documents.length + 1,
      type: 'FERIAS',
      fileUrl: `/documents/vacation-${user.id}-${vacationDate.getMonth() + 1}-${vacationDate.getFullYear()}.pdf`,
      userId: user.id,
      month: vacationDate.getMonth() + 1,
      year: vacationDate.getFullYear(),
      createdAt: vacationDate.toISOString()
    });
    
    // Add commission documents (every quarter)
    for (let quarter = 0; quarter < 4; quarter++) {
      const month = quarter * 3 + 1;
      const commissionDate = new Date(currentYear, month - 1, 15);
      documents.push({
        id: documents.length + 1,
        type: 'COMISSAO',
        fileUrl: `/documents/commission-${user.id}-${month}-${currentYear}.pdf`,
        userId: user.id,
        month: month,
        year: currentYear,
        createdAt: commissionDate.toISOString()
      });
    }
    
    // Add income statement for previous year
    const incomeStatementDate = new Date(currentYear - 1, 1, 28);
    documents.push({
      id: documents.length + 1,
      type: 'INFORME_RENDIMENTO',
      fileUrl: `/documents/income-${user.id}-2-${currentYear - 1}.pdf`,
      userId: user.id,
      month: 2,
      year: currentYear - 1,
      createdAt: incomeStatementDate.toISOString()
    });
  });
  
  return documents;
};

export const mockDocuments = generateDocuments();

// Filter documents for a specific user
export const getUserDocuments = (userId: number): Document[] => {
  return mockDocuments.filter(doc => doc.userId === userId);
};