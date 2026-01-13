-- Add DELETE policy for cad_drawings table
-- Users should be able to delete their own CAD drawings

CREATE POLICY "Users can delete own drawings" 
  ON public.cad_drawings 
  FOR DELETE
  USING (
    project_id IS NULL OR 
    EXISTS (
      SELECT 1 FROM public.projects 
      WHERE id = cad_drawings.project_id AND user_id = auth.uid()
    )
  );

-- Also add DELETE policy for project_geometry which was flagged as missing
CREATE POLICY "Users can delete own project geometry" 
  ON public.project_geometry 
  FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public.projects 
      WHERE id = project_geometry.project_id AND user_id = auth.uid()
    )
  );