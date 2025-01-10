/*
  # Tasks and Notes Schema

  1. New Tables
    - `task_lists`
      - `id` (uuid, primary key)
      - `name` (text)
      - `user_id` (uuid, foreign key)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
    
    - `tasks`
      - `id` (uuid, primary key)
      - `list_id` (uuid, foreign key)
      - `content` (text)
      - `completed` (boolean)
      - `created_at` (timestamptz)
      - `completed_at` (timestamptz)
      - `updated_at` (timestamptz)

    - `notes`
      - `id` (uuid, primary key)
      - `list_id` (uuid, foreign key)
      - `title` (text)
      - `content` (text)
      - `status` (text)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users to manage their own data
*/

-- Task Lists Table
CREATE TABLE IF NOT EXISTS task_lists (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Tasks Table
CREATE TABLE IF NOT EXISTS tasks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  list_id uuid NOT NULL REFERENCES task_lists(id) ON DELETE CASCADE,
  content text NOT NULL,
  completed boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  completed_at timestamptz,
  updated_at timestamptz DEFAULT now()
);

-- Notes Table
CREATE TABLE IF NOT EXISTS notes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  list_id uuid NOT NULL REFERENCES task_lists(id) ON DELETE CASCADE,
  title text NOT NULL,
  content text,
  status text NOT NULL CHECK (status IN ('draft', 'saved')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE task_lists ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE notes ENABLE ROW LEVEL SECURITY;

-- Task Lists Policies
CREATE POLICY "Users can view their own task lists"
  ON task_lists
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own task lists"
  ON task_lists
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own task lists"
  ON task_lists
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own task lists"
  ON task_lists
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Tasks Policies
CREATE POLICY "Users can view tasks in their lists"
  ON tasks
  FOR SELECT
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM task_lists
    WHERE task_lists.id = tasks.list_id
    AND task_lists.user_id = auth.uid()
  ));

CREATE POLICY "Users can create tasks in their lists"
  ON tasks
  FOR INSERT
  TO authenticated
  WITH CHECK (EXISTS (
    SELECT 1 FROM task_lists
    WHERE task_lists.id = list_id
    AND task_lists.user_id = auth.uid()
  ));

CREATE POLICY "Users can update tasks in their lists"
  ON tasks
  FOR UPDATE
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM task_lists
    WHERE task_lists.id = tasks.list_id
    AND task_lists.user_id = auth.uid()
  ));

CREATE POLICY "Users can delete tasks in their lists"
  ON tasks
  FOR DELETE
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM task_lists
    WHERE task_lists.id = tasks.list_id
    AND task_lists.user_id = auth.uid()
  ));

-- Notes Policies
CREATE POLICY "Users can view notes in their lists"
  ON notes
  FOR SELECT
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM task_lists
    WHERE task_lists.id = notes.list_id
    AND task_lists.user_id = auth.uid()
  ));

CREATE POLICY "Users can create notes in their lists"
  ON notes
  FOR INSERT
  TO authenticated
  WITH CHECK (EXISTS (
    SELECT 1 FROM task_lists
    WHERE task_lists.id = list_id
    AND task_lists.user_id = auth.uid()
  ));

CREATE POLICY "Users can update notes in their lists"
  ON notes
  FOR UPDATE
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM task_lists
    WHERE task_lists.id = notes.list_id
    AND task_lists.user_id = auth.uid()
  ));

CREATE POLICY "Users can delete notes in their lists"
  ON notes
  FOR DELETE
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM task_lists
    WHERE task_lists.id = notes.list_id
    AND task_lists.user_id = auth.uid()
  ));