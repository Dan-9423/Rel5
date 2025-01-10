import React, { createContext, useContext, useState, useEffect } from 'react';
import { Customer } from '../types/customer';

interface CustomerContextType {
  customers: Customer[];
  setCustomers: React.Dispatch<React.SetStateAction<Customer[]>>;
  addNewCustomer: (customer: Omit<Customer, 'id'>) => void;
  updateCustomer: (id: string, customer: Partial<Customer>) => void;
  deleteCustomer: (id: string) => void;
}

const CustomerContext = createContext<CustomerContextType | undefined>(undefined);

// Sample customers data
const initialCustomers: Customer[] = [
  {
    id: '1',
    razaoSocial: 'Tech Solutions Ltda',
    nomeFantasia: 'TechSol',
    cnpj: '12.345.678/0001-01',
    email: 'contato@techsol.com.br',
    telefone: '(11) 98765-4321',
    endereco: {
      logradouro: 'Rua da Tecnologia',
      numero: '100',
      bairro: 'Centro',
      cidade: 'São Paulo',
      estado: 'SP',
      cep: '01234-567'
    }
  },
  {
    id: '2',
    razaoSocial: 'Indústria ABC S.A.',
    nomeFantasia: 'ABC Industries',
    cnpj: '23.456.789/0001-02',
    email: 'contato@abcindustries.com.br',
    telefone: '(11) 97654-3210',
    endereco: {
      logradouro: 'Avenida Industrial',
      numero: '200',
      bairro: 'Distrito Industrial',
      cidade: 'São Paulo',
      estado: 'SP',
      cep: '04567-890'
    }
  },
  {
    id: '3',
    razaoSocial: 'Comércio XYZ Eireli',
    nomeFantasia: 'XYZ Store',
    cnpj: '34.567.890/0001-03',
    email: 'contato@xyzstore.com.br',
    telefone: '(11) 96543-2109',
    endereco: {
      logradouro: 'Rua do Comércio',
      numero: '300',
      bairro: 'Centro',
      cidade: 'São Paulo',
      estado: 'SP',
      cep: '01234-567'
    }
  },
  {
    id: '4',
    razaoSocial: 'Global Trade Ltda',
    nomeFantasia: 'Global',
    cnpj: '45.678.901/0001-04',
    email: 'contato@globaltrade.com.br',
    telefone: '(11) 95432-1098',
    endereco: {
      logradouro: 'Avenida do Comércio',
      numero: '400',
      bairro: 'Vila Empresarial',
      cidade: 'São Paulo',
      estado: 'SP',
      cep: '05678-901'
    }
  },
  {
    id: '5',
    razaoSocial: 'Indústria Delta S.A.',
    nomeFantasia: 'Delta Ind',
    cnpj: '56.789.012/0001-05',
    email: 'comercial@deltaindustria.com.br',
    telefone: '(21) 94321-0987',
    endereco: {
      logradouro: 'Rua Industrial',
      numero: '500',
      bairro: 'Zona Industrial',
      cidade: 'Rio de Janeiro',
      estado: 'RJ',
      cep: '20000-000'
    }
  },
  {
    id: '6',
    razaoSocial: 'Omega Comércio Ltda',
    nomeFantasia: 'Omega',
    cnpj: '67.890.123/0001-06',
    email: 'vendas@omega.com.br',
    telefone: '(31) 93210-8765',
    endereco: {
      logradouro: 'Avenida Principal',
      numero: '600',
      bairro: 'Centro',
      cidade: 'Belo Horizonte',
      estado: 'MG',
      cep: '30000-000'
    }
  },
  {
    id: '7',
    razaoSocial: 'Sigma Serviços Eireli',
    nomeFantasia: 'Sigma',
    cnpj: '78.901.234/0001-07',
    email: 'contato@sigmaservicos.com.br',
    telefone: '(41) 92109-7654',
    endereco: {
      logradouro: 'Rua dos Negócios',
      numero: '700',
      bairro: 'Empresarial',
      cidade: 'Curitiba',
      estado: 'PR',
      cep: '80000-000'
    }
  },
  {
    id: '8',
    razaoSocial: 'Alpha Tecnologia S.A.',
    nomeFantasia: 'Alpha Tech',
    cnpj: '89.012.345/0001-08',
    email: 'suporte@alphatech.com.br',
    telefone: '(51) 90987-6543',
    endereco: {
      logradouro: 'Avenida da Inovação',
      numero: '800',
      bairro: 'Parque Tecnológico',
      cidade: 'Porto Alegre',
      estado: 'RS',
      cep: '90000-000'
    }
  },
  {
    id: '9',
    razaoSocial: 'Beta Distribuidora Ltda',
    nomeFantasia: 'Beta Dist',
    cnpj: '90.123.456/0001-09',
    email: 'comercial@betadist.com.br',
    telefone: '(48) 89876-5432',
    endereco: {
      logradouro: 'Rua da Distribuição',
      numero: '900',
      bairro: 'Área Industrial',
      cidade: 'Florianópolis',
      estado: 'SC',
      cep: '88000-000'
    }
  },
  {
    id: '10',
    razaoSocial: 'Gamma Indústria e Comércio Ltda',
    nomeFantasia: 'Gamma',
    cnpj: '01.234.567/0001-10',
    email: 'vendas@gamma.com.br',
    telefone: '(81) 87654-3210',
    endereco: {
      logradouro: 'Avenida Industrial',
      numero: '1000',
      bairro: 'Distrito Industrial',
      cidade: 'Recife',
      estado: 'PE',
      cep: '50000-000'
    }
  },
  {
    id: '11',
    razaoSocial: 'Delta Logística S.A.',
    nomeFantasia: 'Delta Log',
    cnpj: '12.345.678/0001-11',
    email: 'operacoes@deltalog.com.br',
    telefone: '(71) 76543-2109',
    endereco: {
      logradouro: 'Rua dos Transportes',
      numero: '1100',
      bairro: 'Centro Logístico',
      cidade: 'Salvador',
      estado: 'BA',
      cep: '40000-000'
    }
  },
  {
    id: '12',
    razaoSocial: 'Epsilon Materiais de Construção Ltda',
    nomeFantasia: 'Epsilon Mat',
    cnpj: '23.456.789/0001-12',
    email: 'vendas@epsilonmat.com.br',
    telefone: '(85) 65432-1098',
    endereco: {
      logradouro: 'Avenida dos Materiais',
      numero: '1200',
      bairro: 'Setor Comercial',
      cidade: 'Fortaleza',
      estado: 'CE',
      cep: '60000-000'
    }
  },
  {
    id: '13',
    razaoSocial: 'Zeta Alimentos S.A.',
    nomeFantasia: 'Zeta Foods',
    cnpj: '34.567.890/0001-13',
    email: 'comercial@zetafoods.com.br',
    telefone: '(91) 54321-0987',
    endereco: {
      logradouro: 'Rua da Alimentação',
      numero: '1300',
      bairro: 'Setor Industrial',
      cidade: 'Belém',
      estado: 'PA',
      cep: '66000-000'
    }
  },
  {
    id: '14',
    razaoSocial: 'Eta Farmacêutica Ltda',
    nomeFantasia: 'Eta Pharma',
    cnpj: '45.678.901/0001-14',
    email: 'contato@etapharma.com.br',
    telefone: '(92) 43210-9876',
    endereco: {
      logradouro: 'Avenida da Saúde',
      numero: '1400',
      bairro: 'Centro',
      cidade: 'Manaus',
      estado: 'AM',
      cep: '69000-000'
    }
  },
  {
    id: '15',
    razaoSocial: 'Theta Eletrônicos Eireli',
    nomeFantasia: 'Theta Tech',
    cnpj: '56.789.012/0001-15',
    email: 'suporte@thetatech.com.br',
    telefone: '(84) 32109-8765',
    endereco: {
      logradouro: 'Rua da Tecnologia',
      numero: '1500',
      bairro: 'Zona Leste',
      cidade: 'Natal',
      estado: 'RN',
      cep: '59000-000'
    }
  },
  {
    id: '16',
    razaoSocial: 'Iota Móveis e Decorações S.A.',
    nomeFantasia: 'Iota Decor',
    cnpj: '67.890.123/0001-16',
    email: 'vendas@iotadecor.com.br',
    telefone: '(98) 21098-7654',
    endereco: {
      logradouro: 'Avenida do Design',
      numero: '1600',
      bairro: 'Setor Comercial',
      cidade: 'São Luís',
      estado: 'MA',
      cep: '65000-000'
    }
  },
  {
    id: '17',
    razaoSocial: 'Kappa Energia Solar Ltda',
    nomeFantasia: 'Kappa Solar',
    cnpj: '78.901.234/0001-17',
    email: 'comercial@kappasolar.com.br',
    telefone: '(95) 10987-6543',
    endereco: {
      logradouro: 'Rua da Sustentabilidade',
      numero: '1700',
      bairro: 'Distrito Industrial',
      cidade: 'Boa Vista',
      estado: 'RR',
      cep: '69300-000'
    }
  },
  {
    id: '18',
    razaoSocial: 'Lambda Consultoria Empresarial Ltda',
    nomeFantasia: 'Lambda Consult',
    cnpj: '89.012.345/0001-18',
    email: 'contato@lambdaconsult.com.br',
    telefone: '(96) 09876-5432',
    endereco: {
      logradouro: 'Avenida dos Consultores',
      numero: '1800',
      bairro: 'Centro',
      cidade: 'Macapá',
      estado: 'AP',
      cep: '68900-000'
    }
  },
  {
    id: '19',
    razaoSocial: 'Mu Transportes e Logística S.A.',
    nomeFantasia: 'Mu Log',
    cnpj: '90.123.456/0001-19',
    email: 'operacoes@mulog.com.br',
    telefone: '(69) 98765-4321',
    endereco: {
      logradouro: 'Rua dos Transportadores',
      numero: '1900',
      bairro: 'Setor Logístico',
      cidade: 'Porto Velho',
      estado: 'RO',
      cep: '76800-000'
    }
  },
  {
    id: '20',
    razaoSocial: 'Nu Equipamentos Industriais Ltda',
    nomeFantasia: 'Nu Equip',
    cnpj: '01.234.567/0001-20',
    email: 'vendas@nuequip.com.br',
    telefone: '(63) 87654-3210',
    endereco: {
      logradouro: 'Avenida Industrial',
      numero: '2000',
      bairro: 'Distrito Industrial',
      cidade: 'Palmas',
      estado: 'TO',
      cep: '77000-000'
    }
  },
  {
    id: '21',
    razaoSocial: 'Xi Metalúrgica S.A.',
    nomeFantasia: 'Xi Metal',
    cnpj: '12.345.678/0001-21',
    email: 'comercial@ximetal.com.br',
    telefone: '(82) 76543-2109',
    endereco: {
      logradouro: 'Rua da Metalurgia',
      numero: '2100',
      bairro: 'Área Industrial',
      cidade: 'Maceió',
      estado: 'AL',
      cep: '57000-000'
    }
  },
  {
    id: '22',
    razaoSocial: 'Omicron Química Industrial Ltda',
    nomeFantasia: 'Omicron Chem',
    cnpj: '23.456.789/0001-22',
    email: 'vendas@omicronchem.com.br',
    telefone: '(86) 65432-1098',
    endereco: {
      logradouro: 'Avenida da Química',
      numero: '2200',
      bairro: 'Distrito Industrial',
      cidade: 'Teresina',
      estado: 'PI',
      cep: '64000-000'
    }
  },
  {
    id: '23',
    razaoSocial: 'Pi Automação Industrial S.A.',
    nomeFantasia: 'Pi Auto',
    cnpj: '34.567.890/0001-23',
    email: 'suporte@piauto.com.br',
    telefone: '(79) 54321-0987',
    endereco: {
      logradouro: 'Rua da Automação',
      numero: '2300',
      bairro: 'Centro Industrial',
      cidade: 'Aracaju',
      estado: 'SE',
      cep: '49000-000'
    }
  },
  {
    id: '24',
    razaoSocial: 'Rho Embalagens Ltda',
    nomeFantasia: 'Rho Pack',
    cnpj: '45.678.901/0001-24',
    email: 'vendas@rhopack.com.br',
    telefone: '(68) 43210-9876',
    endereco: {
      logradouro: 'Avenida das Embalagens',
      numero: '2400',
      bairro: 'Setor Industrial',
      cidade: 'Rio Branco',
      estado: 'AC',
      cep: '69900-000'
    }
  },
  {
    id: '25',
    razaoSocial: 'Sigma Tecnologia da Informação S.A.',
    nomeFantasia: 'Sigma TI',
    cnpj: '56.789.012/0001-25',
    email: 'contato@sigmati.com.br',
    telefone: '(65) 32109-8765',
    endereco: {
      logradouro: 'Rua da Inovação',
      numero: '2500',
      bairro: 'Parque Tecnológico',
      cidade: 'Cuiabá',
      estado: 'MT',
      cep: '78000-000'
    }
  }
];

export function CustomerProvider({ children }: { children: React.ReactNode }) {
  const [customers, setCustomers] = useState<Customer[]>(() => {
    const saved = localStorage.getItem('customers');
    return saved ? JSON.parse(saved) : initialCustomers;
  });

  useEffect(() => {
    localStorage.setItem('customers', JSON.stringify(customers));
  }, [customers]);

  const addNewCustomer = (customerData: Omit<Customer, 'id'>) => {
    const newCustomer = {
      ...customerData,
      id: crypto.randomUUID()
    };
    setCustomers(prev => [newCustomer, ...prev]);
  };

  const updateCustomer = (id: string, customerData: Partial<Customer>) => {
    setCustomers(prev => prev.map(customer => 
      customer.id === id ? { ...customer, ...customerData } : customer
    ));
  };

  const deleteCustomer = (id: string) => {
    setCustomers(prev => prev.filter(customer => customer.id !== id));
  };

  return (
    <CustomerContext.Provider value={{ 
      customers, 
      setCustomers, 
      addNewCustomer,
      updateCustomer,
      deleteCustomer
    }}>
      {children}
    </CustomerContext.Provider>
  );
}

export function useCustomers() {
  const context = useContext(CustomerContext);
  if (context === undefined) {
    throw new Error('useCustomers must be used within a CustomerProvider');
  }
  return context;
}