-- Create user roles enum
CREATE TYPE public.app_role AS ENUM ('admin', 'moderator', 'user');

-- Create subscription tier enum
CREATE TYPE public.subscription_tier AS ENUM ('free', 'pro', 'business', 'enterprise');

-- Create project status enum
CREATE TYPE public.project_status AS ENUM ('draft', 'in_progress', 'quoted', 'approved', 'completed', 'archived');

-- Create project type enum
CREATE TYPE public.project_type AS ENUM (
  'single_storey_rear', 
  'single_storey_side', 
  'double_storey_rear', 
  'double_storey_side',
  'wrap_around',
  'loft_dormer',
  'loft_hip_to_gable',
  'loft_mansard',
  'loft_velux',
  'hmo_conversion',
  'garage_integral',
  'garage_detached',
  'basement_conversion',
  'new_build',
  'renovation',
  'office_conversion'
);

-- Create build quality enum
CREATE TYPE public.build_quality AS ENUM ('basic', 'standard', 'premium', 'luxury');

-- Profiles table
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  full_name TEXT,
  company_name TEXT,
  phone TEXT,
  subscription_tier subscription_tier DEFAULT 'free',
  credits_remaining INTEGER DEFAULT 100,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- User roles table
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role app_role NOT NULL DEFAULT 'user',
  UNIQUE(user_id, role)
);

-- Organisations table
CREATE TABLE public.organisations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  subscription_tier subscription_tier DEFAULT 'business',
  owner_id UUID REFERENCES auth.users(id),
  logo_url TEXT,
  settings JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Organisation members
CREATE TABLE public.organisation_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organisation_id UUID REFERENCES public.organisations(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT DEFAULT 'member',
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(organisation_id, user_id)
);

-- Projects table
CREATE TABLE public.projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  organisation_id UUID REFERENCES public.organisations(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  description TEXT,
  address TEXT,
  postcode TEXT,
  project_type project_type NOT NULL,
  build_quality build_quality DEFAULT 'standard',
  status project_status DEFAULT 'draft',
  estimated_cost DECIMAL(12,2),
  estimated_duration_weeks INTEGER,
  geometry_hash TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Geometry data (parametric inputs)
CREATE TABLE public.project_geometry (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  
  -- Dimensions
  length_m DECIMAL(8,3),
  width_m DECIMAL(8,3),
  height_m DECIMAL(8,3),
  floor_area_sqm DECIMAL(10,2),
  
  -- Rooms
  rooms JSONB DEFAULT '[]',
  
  -- Structural
  wall_type TEXT DEFAULT 'cavity',
  foundation_type TEXT DEFAULT 'strip',
  roof_type TEXT DEFAULT 'pitched',
  
  -- Openings
  windows JSONB DEFAULT '[]',
  doors JSONB DEFAULT '[]',
  
  -- Services
  electrical_points INTEGER DEFAULT 0,
  plumbing_points INTEGER DEFAULT 0,
  heating_radiators INTEGER DEFAULT 0,
  
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- UK regional cost rates (BCIS-style)
CREATE TABLE public.cost_rates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category TEXT NOT NULL,
  item_code TEXT NOT NULL UNIQUE,
  description TEXT NOT NULL,
  unit TEXT NOT NULL,
  base_rate DECIMAL(10,2) NOT NULL,
  labour_rate DECIMAL(10,2) DEFAULT 0,
  material_rate DECIMAL(10,2) DEFAULT 0,
  plant_rate DECIMAL(10,2) DEFAULT 0,
  region_multiplier JSONB DEFAULT '{"london": 1.25, "south_east": 1.10, "south_west": 1.00, "midlands": 0.95, "north": 0.90, "scotland": 0.95, "wales": 0.92, "ni": 0.88}',
  valid_from DATE DEFAULT CURRENT_DATE,
  valid_to DATE,
  source TEXT DEFAULT 'BCIS',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Project cost items (calculated quantities)
CREATE TABLE public.project_costs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  cost_rate_id UUID REFERENCES public.cost_rates(id),
  description TEXT NOT NULL,
  quantity DECIMAL(10,3) NOT NULL,
  unit TEXT NOT NULL,
  unit_rate DECIMAL(10,2) NOT NULL,
  labour_cost DECIMAL(10,2) DEFAULT 0,
  material_cost DECIMAL(10,2) DEFAULT 0,
  plant_cost DECIMAL(10,2) DEFAULT 0,
  total_cost DECIMAL(12,2) NOT NULL,
  category TEXT,
  trade TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Schedule items
CREATE TABLE public.project_schedules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  task_name TEXT NOT NULL,
  trade TEXT,
  duration_days INTEGER NOT NULL,
  start_day INTEGER,
  end_day INTEGER,
  dependencies JSONB DEFAULT '[]',
  labour_hours DECIMAL(8,2) DEFAULT 0,
  skill_level TEXT DEFAULT 'skilled',
  machinery JSONB DEFAULT '[]',
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- CAD drawings cache
CREATE TABLE public.cad_drawings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE,
  geometry_hash TEXT NOT NULL,
  project_type project_type NOT NULL,
  drawing_type TEXT NOT NULL,
  svg_content TEXT,
  metadata JSONB DEFAULT '{}',
  is_watermarked BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(geometry_hash, project_type, drawing_type)
);

-- Compliance checks
CREATE TABLE public.compliance_reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  regulation TEXT NOT NULL,
  check_name TEXT NOT NULL,
  status TEXT DEFAULT 'pending',
  passed BOOLEAN,
  details TEXT,
  ai_explanation TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Invoices
CREATE TABLE public.invoices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  invoice_number TEXT NOT NULL,
  type TEXT DEFAULT 'interim',
  gross_value DECIMAL(12,2) NOT NULL,
  retention_percent DECIMAL(5,2) DEFAULT 5,
  retention_value DECIMAL(12,2) DEFAULT 0,
  vat_percent DECIMAL(5,2) DEFAULT 20,
  vat_value DECIMAL(12,2) DEFAULT 0,
  net_value DECIMAL(12,2) NOT NULL,
  status TEXT DEFAULT 'draft',
  due_date DATE,
  paid_date DATE,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Material orders
CREATE TABLE public.material_orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  supplier TEXT,
  items JSONB NOT NULL DEFAULT '[]',
  total_cost DECIMAL(12,2),
  status TEXT DEFAULT 'draft',
  lead_time_days INTEGER,
  order_date DATE,
  delivery_date DATE,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Audit log
CREATE TABLE public.audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id),
  project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE,
  action TEXT NOT NULL,
  entity_type TEXT,
  entity_id UUID,
  old_values JSONB,
  new_values JSONB,
  ip_address TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.organisations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.organisation_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_geometry ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cost_rates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_costs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_schedules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cad_drawings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.compliance_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.material_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view own profile" ON public.profiles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = user_id);

-- User roles policies
CREATE POLICY "Users can view own roles" ON public.user_roles FOR SELECT USING (auth.uid() = user_id);

-- Projects policies
CREATE POLICY "Users can view own projects" ON public.projects FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own projects" ON public.projects FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own projects" ON public.projects FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own projects" ON public.projects FOR DELETE USING (auth.uid() = user_id);

-- Project geometry policies
CREATE POLICY "Users can view own project geometry" ON public.project_geometry FOR SELECT 
  USING (EXISTS (SELECT 1 FROM public.projects WHERE id = project_id AND user_id = auth.uid()));
CREATE POLICY "Users can insert own project geometry" ON public.project_geometry FOR INSERT 
  WITH CHECK (EXISTS (SELECT 1 FROM public.projects WHERE id = project_id AND user_id = auth.uid()));
CREATE POLICY "Users can update own project geometry" ON public.project_geometry FOR UPDATE 
  USING (EXISTS (SELECT 1 FROM public.projects WHERE id = project_id AND user_id = auth.uid()));

-- Cost rates policies (public read)
CREATE POLICY "Anyone can view cost rates" ON public.cost_rates FOR SELECT USING (true);

-- Project costs policies
CREATE POLICY "Users can view own project costs" ON public.project_costs FOR SELECT 
  USING (EXISTS (SELECT 1 FROM public.projects WHERE id = project_id AND user_id = auth.uid()));
CREATE POLICY "Users can manage own project costs" ON public.project_costs FOR ALL 
  USING (EXISTS (SELECT 1 FROM public.projects WHERE id = project_id AND user_id = auth.uid()));

-- Project schedules policies
CREATE POLICY "Users can view own schedules" ON public.project_schedules FOR SELECT 
  USING (EXISTS (SELECT 1 FROM public.projects WHERE id = project_id AND user_id = auth.uid()));
CREATE POLICY "Users can manage own schedules" ON public.project_schedules FOR ALL 
  USING (EXISTS (SELECT 1 FROM public.projects WHERE id = project_id AND user_id = auth.uid()));

-- CAD drawings policies
CREATE POLICY "Users can view own drawings" ON public.cad_drawings FOR SELECT 
  USING (project_id IS NULL OR EXISTS (SELECT 1 FROM public.projects WHERE id = project_id AND user_id = auth.uid()));

-- Compliance reports policies
CREATE POLICY "Users can view own compliance" ON public.compliance_reports FOR SELECT 
  USING (EXISTS (SELECT 1 FROM public.projects WHERE id = project_id AND user_id = auth.uid()));

-- Invoices policies
CREATE POLICY "Users can view own invoices" ON public.invoices FOR SELECT 
  USING (EXISTS (SELECT 1 FROM public.projects WHERE id = project_id AND user_id = auth.uid()));
CREATE POLICY "Users can manage own invoices" ON public.invoices FOR ALL 
  USING (EXISTS (SELECT 1 FROM public.projects WHERE id = project_id AND user_id = auth.uid()));

-- Material orders policies
CREATE POLICY "Users can view own orders" ON public.material_orders FOR SELECT 
  USING (EXISTS (SELECT 1 FROM public.projects WHERE id = project_id AND user_id = auth.uid()));
CREATE POLICY "Users can manage own orders" ON public.material_orders FOR ALL 
  USING (EXISTS (SELECT 1 FROM public.projects WHERE id = project_id AND user_id = auth.uid()));

-- Audit logs policies (users can only view their own)
CREATE POLICY "Users can view own audit logs" ON public.audit_logs FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "System can insert audit logs" ON public.audit_logs FOR INSERT WITH CHECK (true);

-- Organisations policies
CREATE POLICY "Members can view org" ON public.organisations FOR SELECT 
  USING (EXISTS (SELECT 1 FROM public.organisation_members WHERE organisation_id = id AND user_id = auth.uid()));
CREATE POLICY "Owner can manage org" ON public.organisations FOR ALL 
  USING (owner_id = auth.uid());

-- Org members policies
CREATE POLICY "Members can view members" ON public.organisation_members FOR SELECT 
  USING (EXISTS (SELECT 1 FROM public.organisation_members om WHERE om.organisation_id = organisation_id AND om.user_id = auth.uid()));

-- Create has_role function
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role
  )
$$;

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (user_id, email, full_name)
  VALUES (NEW.id, NEW.email, NEW.raw_user_meta_data ->> 'full_name');
  
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'user');
  
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Update timestamps function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Add update triggers
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_projects_updated_at BEFORE UPDATE ON public.projects FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_organisations_updated_at BEFORE UPDATE ON public.organisations FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_geometry_updated_at BEFORE UPDATE ON public.project_geometry FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();