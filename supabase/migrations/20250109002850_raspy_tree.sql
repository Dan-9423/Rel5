/*
  # Criar tabela de sacados

  1. Nova Tabela
    - `customers`
      - `id` (uuid, chave primária)
      - `razao_social` (texto, não nulo)
      - `nome_fantasia` (texto)
      - `cnpj` (texto, único, não nulo)
      - `email` (texto, não nulo)
      - `telefone` (texto)
      - `endereco_logradouro` (texto)
      - `endereco_numero` (texto)
      - `endereco_complemento` (texto)
      - `endereco_bairro` (texto)
      - `endereco_cidade` (texto)
      - `endereco_estado` (texto)
      - `endereco_cep` (texto)
      - `created_at` (timestamp com timezone)
      - `updated_at` (timestamp com timezone)

  2. Security
    - Habilitar RLS na tabela `customers`
    - Adicionar política para usuários autenticados poderem ler todos os registros
    - Adicionar política para usuários autenticados poderem inserir registros
    - Adicionar política para usuários autenticados poderem atualizar registros
    - Adicionar política para usuários autenticados poderem deletar registros
*/

CREATE TABLE IF NOT EXISTS customers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  razao_social text NOT NULL,
  nome_fantasia text,
  cnpj text UNIQUE NOT NULL,
  email text NOT NULL,
  telefone text,
  endereco_logradouro text,
  endereco_numero text,
  endereco_complemento text,
  endereco_bairro text,
  endereco_cidade text,
  endereco_estado text,
  endereco_cep text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Habilitar RLS
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;

-- Políticas de acesso
CREATE POLICY "Permitir leitura para usuários autenticados"
  ON customers
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Permitir inserção para usuários autenticados"
  ON customers
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Permitir atualização para usuários autenticados"
  ON customers
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Permitir deleção para usuários autenticados"
  ON customers
  FOR DELETE
  TO authenticated
  USING (true);

-- Inserir dados de exemplo
INSERT INTO customers (razao_social, nome_fantasia, cnpj, email, telefone, endereco_logradouro, endereco_numero, endereco_bairro, endereco_cidade, endereco_estado, endereco_cep)
VALUES
  ('Tech Solutions Ltda', 'TechSol', '12345678901234', 'contato@techsol.com.br', '(11) 98765-4321', 'Rua da Tecnologia', '100', 'Centro', 'São Paulo', 'SP', '01234567'),
  ('Indústria ABC S.A.', 'ABC Industries', '98765432109876', 'financeiro@abc.com.br', '(21) 99876-5432', 'Avenida Industrial', '200', 'Distrito Industrial', 'Rio de Janeiro', 'RJ', '23456789'),
  ('Comércio XYZ Eireli', 'XYZ Store', '45678901234567', 'contato@xyz.com.br', '(31) 97654-3210', 'Rua do Comércio', '300', 'Centro', 'Belo Horizonte', 'MG', '34567890'),
  ('Distribuidora 123 Ltda', '123 Distrib', '78901234567890', 'vendas@123distrib.com.br', '(41) 96543-2109', 'Avenida das Distribuições', '400', 'Mercado', 'Curitiba', 'PR', '45678901'),
  ('Serviços Beta ME', 'Beta Services', '23456789012345', 'atendimento@betaservices.com.br', '(51) 95432-1098', 'Rua dos Serviços', '500', 'Centro', 'Porto Alegre', 'RS', '56789012'),
  ('Global Trade Ltda', 'Global', '34567890123456', 'contato@globaltrade.com.br', '(11) 94321-0987', 'Avenida do Comércio', '600', 'Vila Empresarial', 'São Paulo', 'SP', '67890123'),
  ('Indústria Delta S.A.', 'Delta Ind', '89012345678901', 'comercial@deltaindustria.com.br', '(21) 93210-9876', 'Rua Industrial', '700', 'Zona Industrial', 'Rio de Janeiro', 'RJ', '78901234'),
  ('Omega Comércio Ltda', 'Omega', '12345098765432', 'vendas@omega.com.br', '(31) 92109-8765', 'Avenida Principal', '800', 'Centro', 'Belo Horizonte', 'MG', '89012345'),
  ('Sigma Serviços Eireli', 'Sigma', '56789012345678', 'contato@sigmaservicos.com.br', '(41) 91098-7654', 'Rua dos Negócios', '900', 'Empresarial', 'Curitiba', 'PR', '90123456'),
  ('Alpha Tecnologia S.A.', 'Alpha Tech', '90123456789012', 'suporte@alphatech.com.br', '(51) 90987-6543', 'Avenida da Inovação', '1000', 'Parque Tecnológico', 'Porto Alegre', 'RS', '01234567');