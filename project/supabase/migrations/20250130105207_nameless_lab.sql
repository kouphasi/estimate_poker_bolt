/*
  # Initial Schema Setup for Project Estimation App

  1. New Tables
    - `projects`
      - `id` (uuid, primary key)
      - `name` (text)
      - `description` (text)
      - `created_at` (timestamp)
      - `user_id` (uuid, references auth.users)
      - `is_completed` (boolean)
      - `final_estimation` (numeric)
    
    - `tasks`
      - `id` (uuid, primary key)
      - `project_id` (uuid, references projects)
      - `name` (text)
      - `description` (text)
      - `created_at` (timestamp)
      - `is_completed` (boolean)
      - `final_estimation` (numeric)
      - `show_estimations` (boolean)
      - `estimation_url` (text)
    
    - `estimations`
      - `id` (uuid, primary key)
      - `task_id` (uuid, references tasks)
      - `user_id` (uuid, references auth.users)
      - `estimation` (numeric)
      - `created_at` (timestamp)
      - `is_custom` (boolean)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users
*/

-- Projects table
CREATE TABLE projects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  created_at timestamptz DEFAULT now(),
  user_id uuid REFERENCES auth.users NOT NULL,
  is_completed boolean DEFAULT false,
  final_estimation numeric
);

ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can create projects"
  ON projects FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view own projects"
  ON projects FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update own projects"
  ON projects FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

-- Tasks table
CREATE TABLE tasks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid REFERENCES projects NOT NULL,
  name text NOT NULL,
  description text,
  created_at timestamptz DEFAULT now(),
  is_completed boolean DEFAULT false,
  final_estimation numeric,
  show_estimations boolean DEFAULT false,
  estimation_url text UNIQUE DEFAULT gen_random_uuid()
);

ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can create tasks for own projects"
  ON tasks FOR INSERT
  TO authenticated
  WITH CHECK (EXISTS (
    SELECT 1 FROM projects
    WHERE projects.id = project_id
    AND projects.user_id = auth.uid()
  ));

CREATE POLICY "Users can view tasks they have access to"
  ON tasks FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM projects
      WHERE projects.id = project_id
      AND projects.user_id = auth.uid()
    )
    OR
    estimation_url IS NOT NULL
  );

CREATE POLICY "Project owners can update tasks"
  ON tasks FOR UPDATE
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM projects
    WHERE projects.id = project_id
    AND projects.user_id = auth.uid()
  ));

-- Estimations table
CREATE TABLE estimations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  task_id uuid REFERENCES tasks NOT NULL,
  user_id uuid REFERENCES auth.users NOT NULL,
  estimation numeric NOT NULL,
  created_at timestamptz DEFAULT now(),
  is_custom boolean DEFAULT false,
  UNIQUE(task_id, user_id)
);

ALTER TABLE estimations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can create estimations"
  ON estimations FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM tasks
      WHERE tasks.id = task_id
      AND (
        EXISTS (
          SELECT 1 FROM projects
          WHERE projects.id = tasks.project_id
          AND projects.user_id = auth.uid()
        )
        OR
        tasks.estimation_url IS NOT NULL
      )
    )
  );

CREATE POLICY "Users can view estimations"
  ON estimations FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM tasks
      WHERE tasks.id = task_id
      AND (
        EXISTS (
          SELECT 1 FROM projects
          WHERE projects.id = tasks.project_id
          AND projects.user_id = auth.uid()
        )
        OR
        (
          tasks.estimation_url IS NOT NULL
          AND tasks.show_estimations = true
        )
      )
    )
  );

-- Enable realtime for tasks and estimations
ALTER PUBLICATION supabase_realtime ADD TABLE tasks;
ALTER PUBLICATION supabase_realtime ADD TABLE estimations;