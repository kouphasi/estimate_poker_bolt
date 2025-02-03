/*
  # Update estimations table policies

  1. Changes
    - Add UPDATE policy for estimations table
    - Modify INSERT policy to handle upsert operations
    - Ensure policies work with estimation URLs

  2. Security
    - Enable users to update their own estimations
    - Maintain access control based on project ownership and estimation URLs
*/

-- Drop existing policies for estimations table
DROP POLICY IF EXISTS "Users can create estimations" ON estimations;
DROP POLICY IF EXISTS "Users can view estimations" ON estimations;

-- Create new policies with proper permissions
CREATE POLICY "Users can manage estimations"
  ON estimations
  FOR ALL
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
        tasks.estimation_url IS NOT NULL
      )
    )
  )
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
    AND auth.uid() = user_id
  );