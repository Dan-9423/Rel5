/*
  # Email Templates and History Schema

  1. New Tables
    - `email_templates`
      - `id` (uuid, primary key)
      - `version` (text)
      - `subject` (text)
      - `content` (text)
      - `is_active` (boolean)
      - `user_id` (uuid, foreign key)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
    
    - `email_history`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key)
      - `customer_id` (uuid, foreign key)
      - `template_id` (uuid, foreign key)
      - `subject` (text)
      - `content` (text)
      - `status` (text)
      - `sent_at` (timestamptz)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

    - `email_attachments`
      - `id` (uuid, primary key)
      - `email_id` (uuid, foreign key)
      - `name` (text)
      - `size` (bigint)
      - `type` (text)
      - `url` (text)
      - `created_at` (timestamptz)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users to manage their own data
*/

-- Email Templates Table
CREATE TABLE IF NOT EXISTS email_templates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  version text NOT NULL,
  subject text NOT NULL,
  content text NOT NULL,
  is_active boolean DEFAULT false,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Email History Table
CREATE TABLE IF NOT EXISTS email_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  customer_id uuid NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
  template_id uuid REFERENCES email_templates(id) ON DELETE SET NULL,
  subject text NOT NULL,
  content text NOT NULL,
  status text NOT NULL CHECK (status IN ('draft', 'saved', 'sent')),
  sent_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Email Attachments Table
CREATE TABLE IF NOT EXISTS email_attachments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email_id uuid NOT NULL REFERENCES email_history(id) ON DELETE CASCADE,
  name text NOT NULL,
  size bigint NOT NULL,
  type text NOT NULL,
  url text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE email_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE email_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE email_attachments ENABLE ROW LEVEL SECURITY;

-- Email Templates Policies
CREATE POLICY "Users can view their own email templates"
  ON email_templates
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own email templates"
  ON email_templates
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own email templates"
  ON email_templates
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own email templates"
  ON email_templates
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Email History Policies
CREATE POLICY "Users can view their own email history"
  ON email_history
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own email history"
  ON email_history
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own email history"
  ON email_history
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own email history"
  ON email_history
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Email Attachments Policies
CREATE POLICY "Users can view attachments of their own emails"
  ON email_attachments
  FOR SELECT
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM email_history
    WHERE email_history.id = email_attachments.email_id
    AND email_history.user_id = auth.uid()
  ));

CREATE POLICY "Users can create attachments for their own emails"
  ON email_attachments
  FOR INSERT
  TO authenticated
  WITH CHECK (EXISTS (
    SELECT 1 FROM email_history
    WHERE email_history.id = email_id
    AND email_history.user_id = auth.uid()
  ));

CREATE POLICY "Users can delete attachments of their own emails"
  ON email_attachments
  FOR DELETE
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM email_history
    WHERE email_history.id = email_attachments.email_id
    AND email_history.user_id = auth.uid()
  ));