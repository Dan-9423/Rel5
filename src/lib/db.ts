import Database from 'better-sqlite3';
import { Customer } from '@/types/customer';

// Initialize database
const db = new Database('customers.db');

// Create customers table
db.exec(`
  CREATE TABLE IF NOT EXISTS customers (
    id TEXT PRIMARY KEY,
    razaoSocial TEXT NOT NULL,
    nomeFantasia TEXT NOT NULL,
    cnpj TEXT UNIQUE NOT NULL,
    email TEXT NOT NULL,
    telefone TEXT,
    endereco_logradouro TEXT,
    endereco_numero TEXT,
    endereco_complemento TEXT,
    endereco_bairro TEXT,
    endereco_cidade TEXT,
    endereco_estado TEXT,
    endereco_cep TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`);

// Insert sample data
const sampleCustomers = [
  {
    id: crypto.randomUUID(),
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
  // Add 24 more sample customers here...
  {
    id: crypto.randomUUID(),
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
    id: crypto.randomUUID(),
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
  // ... Add more customers
];

// Insert sample customers
const insertCustomer = db.prepare(`
  INSERT OR REPLACE INTO customers (
    id, razaoSocial, nomeFantasia, cnpj, email, telefone,
    endereco_logradouro, endereco_numero, endereco_complemento,
    endereco_bairro, endereco_cidade, endereco_estado, endereco_cep
  ) VALUES (
    ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?
  )
`);

const getCustomers = (): Customer[] => {
  const stmt = db.prepare(`
    SELECT 
      id, razaoSocial, nomeFantasia, cnpj, email, telefone,
      endereco_logradouro as logradouro,
      endereco_numero as numero,
      endereco_complemento as complemento,
      endereco_bairro as bairro,
      endereco_cidade as cidade,
      endereco_estado as estado,
      endereco_cep as cep
    FROM customers
  `);
  
  const rows = stmt.all();
  return rows.map(row => ({
    id: row.id,
    razaoSocial: row.razaoSocial,
    nomeFantasia: row.nomeFantasia,
    cnpj: row.cnpj,
    email: row.email,
    telefone: row.telefone,
    endereco: {
      logradouro: row.logradouro,
      numero: row.numero,
      complemento: row.complemento,
      bairro: row.bairro,
      cidade: row.cidade,
      estado: row.estado,
      cep: row.cep
    }
  }));
};

const addCustomer = (customer: Customer) => {
  insertCustomer.run(
    customer.id,
    customer.razaoSocial,
    customer.nomeFantasia,
    customer.cnpj,
    customer.email,
    customer.telefone,
    customer.endereco?.logradouro,
    customer.endereco?.numero,
    customer.endereco?.complemento,
    customer.endereco?.bairro,
    customer.endereco?.cidade,
    customer.endereco?.estado,
    customer.endereco?.cep
  );
};

// Initialize with sample data if table is empty
const count = db.prepare('SELECT COUNT(*) as count FROM customers').get().count;
if (count === 0) {
  sampleCustomers.forEach(customer => addCustomer(customer));
}

export { getCustomers, addCustomer };