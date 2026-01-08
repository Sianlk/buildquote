export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      audit_logs: {
        Row: {
          action: string
          created_at: string | null
          entity_id: string | null
          entity_type: string | null
          id: string
          ip_address: string | null
          new_values: Json | null
          old_values: Json | null
          project_id: string | null
          user_id: string | null
        }
        Insert: {
          action: string
          created_at?: string | null
          entity_id?: string | null
          entity_type?: string | null
          id?: string
          ip_address?: string | null
          new_values?: Json | null
          old_values?: Json | null
          project_id?: string | null
          user_id?: string | null
        }
        Update: {
          action?: string
          created_at?: string | null
          entity_id?: string | null
          entity_type?: string | null
          id?: string
          ip_address?: string | null
          new_values?: Json | null
          old_values?: Json | null
          project_id?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "audit_logs_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      cad_drawings: {
        Row: {
          created_at: string | null
          drawing_type: string
          geometry_hash: string
          id: string
          is_watermarked: boolean | null
          metadata: Json | null
          project_id: string | null
          project_type: Database["public"]["Enums"]["project_type"]
          svg_content: string | null
        }
        Insert: {
          created_at?: string | null
          drawing_type: string
          geometry_hash: string
          id?: string
          is_watermarked?: boolean | null
          metadata?: Json | null
          project_id?: string | null
          project_type: Database["public"]["Enums"]["project_type"]
          svg_content?: string | null
        }
        Update: {
          created_at?: string | null
          drawing_type?: string
          geometry_hash?: string
          id?: string
          is_watermarked?: boolean | null
          metadata?: Json | null
          project_id?: string | null
          project_type?: Database["public"]["Enums"]["project_type"]
          svg_content?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "cad_drawings_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      compliance_reports: {
        Row: {
          ai_explanation: string | null
          check_name: string
          created_at: string | null
          details: string | null
          id: string
          passed: boolean | null
          project_id: string
          regulation: string
          status: string | null
        }
        Insert: {
          ai_explanation?: string | null
          check_name: string
          created_at?: string | null
          details?: string | null
          id?: string
          passed?: boolean | null
          project_id: string
          regulation: string
          status?: string | null
        }
        Update: {
          ai_explanation?: string | null
          check_name?: string
          created_at?: string | null
          details?: string | null
          id?: string
          passed?: boolean | null
          project_id?: string
          regulation?: string
          status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "compliance_reports_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      cost_rates: {
        Row: {
          base_rate: number
          category: string
          created_at: string | null
          description: string
          id: string
          item_code: string
          labour_rate: number | null
          material_rate: number | null
          plant_rate: number | null
          region_multiplier: Json | null
          source: string | null
          unit: string
          valid_from: string | null
          valid_to: string | null
        }
        Insert: {
          base_rate: number
          category: string
          created_at?: string | null
          description: string
          id?: string
          item_code: string
          labour_rate?: number | null
          material_rate?: number | null
          plant_rate?: number | null
          region_multiplier?: Json | null
          source?: string | null
          unit: string
          valid_from?: string | null
          valid_to?: string | null
        }
        Update: {
          base_rate?: number
          category?: string
          created_at?: string | null
          description?: string
          id?: string
          item_code?: string
          labour_rate?: number | null
          material_rate?: number | null
          plant_rate?: number | null
          region_multiplier?: Json | null
          source?: string | null
          unit?: string
          valid_from?: string | null
          valid_to?: string | null
        }
        Relationships: []
      }
      invoices: {
        Row: {
          created_at: string | null
          due_date: string | null
          gross_value: number
          id: string
          invoice_number: string
          net_value: number
          paid_date: string | null
          project_id: string
          retention_percent: number | null
          retention_value: number | null
          status: string | null
          type: string | null
          vat_percent: number | null
          vat_value: number | null
        }
        Insert: {
          created_at?: string | null
          due_date?: string | null
          gross_value: number
          id?: string
          invoice_number: string
          net_value: number
          paid_date?: string | null
          project_id: string
          retention_percent?: number | null
          retention_value?: number | null
          status?: string | null
          type?: string | null
          vat_percent?: number | null
          vat_value?: number | null
        }
        Update: {
          created_at?: string | null
          due_date?: string | null
          gross_value?: number
          id?: string
          invoice_number?: string
          net_value?: number
          paid_date?: string | null
          project_id?: string
          retention_percent?: number | null
          retention_value?: number | null
          status?: string | null
          type?: string | null
          vat_percent?: number | null
          vat_value?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "invoices_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      material_orders: {
        Row: {
          created_at: string | null
          delivery_date: string | null
          id: string
          items: Json
          lead_time_days: number | null
          order_date: string | null
          project_id: string
          status: string | null
          supplier: string | null
          total_cost: number | null
        }
        Insert: {
          created_at?: string | null
          delivery_date?: string | null
          id?: string
          items?: Json
          lead_time_days?: number | null
          order_date?: string | null
          project_id: string
          status?: string | null
          supplier?: string | null
          total_cost?: number | null
        }
        Update: {
          created_at?: string | null
          delivery_date?: string | null
          id?: string
          items?: Json
          lead_time_days?: number | null
          order_date?: string | null
          project_id?: string
          status?: string | null
          supplier?: string | null
          total_cost?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "material_orders_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      organisation_members: {
        Row: {
          created_at: string | null
          id: string
          organisation_id: string | null
          role: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          organisation_id?: string | null
          role?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          organisation_id?: string | null
          role?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "organisation_members_organisation_id_fkey"
            columns: ["organisation_id"]
            isOneToOne: false
            referencedRelation: "organisations"
            referencedColumns: ["id"]
          },
        ]
      }
      organisations: {
        Row: {
          created_at: string | null
          id: string
          logo_url: string | null
          name: string
          owner_id: string | null
          settings: Json | null
          subscription_tier:
            | Database["public"]["Enums"]["subscription_tier"]
            | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          logo_url?: string | null
          name: string
          owner_id?: string | null
          settings?: Json | null
          subscription_tier?:
            | Database["public"]["Enums"]["subscription_tier"]
            | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          logo_url?: string | null
          name?: string
          owner_id?: string | null
          settings?: Json | null
          subscription_tier?:
            | Database["public"]["Enums"]["subscription_tier"]
            | null
          updated_at?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          company_name: string | null
          created_at: string | null
          credits_remaining: number | null
          email: string | null
          full_name: string | null
          id: string
          phone: string | null
          subscription_tier:
            | Database["public"]["Enums"]["subscription_tier"]
            | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          company_name?: string | null
          created_at?: string | null
          credits_remaining?: number | null
          email?: string | null
          full_name?: string | null
          id?: string
          phone?: string | null
          subscription_tier?:
            | Database["public"]["Enums"]["subscription_tier"]
            | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          company_name?: string | null
          created_at?: string | null
          credits_remaining?: number | null
          email?: string | null
          full_name?: string | null
          id?: string
          phone?: string | null
          subscription_tier?:
            | Database["public"]["Enums"]["subscription_tier"]
            | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      project_costs: {
        Row: {
          category: string | null
          cost_rate_id: string | null
          created_at: string | null
          description: string
          id: string
          labour_cost: number | null
          material_cost: number | null
          notes: string | null
          plant_cost: number | null
          project_id: string
          quantity: number
          total_cost: number
          trade: string | null
          unit: string
          unit_rate: number
        }
        Insert: {
          category?: string | null
          cost_rate_id?: string | null
          created_at?: string | null
          description: string
          id?: string
          labour_cost?: number | null
          material_cost?: number | null
          notes?: string | null
          plant_cost?: number | null
          project_id: string
          quantity: number
          total_cost: number
          trade?: string | null
          unit: string
          unit_rate: number
        }
        Update: {
          category?: string | null
          cost_rate_id?: string | null
          created_at?: string | null
          description?: string
          id?: string
          labour_cost?: number | null
          material_cost?: number | null
          notes?: string | null
          plant_cost?: number | null
          project_id?: string
          quantity?: number
          total_cost?: number
          trade?: string | null
          unit?: string
          unit_rate?: number
        }
        Relationships: [
          {
            foreignKeyName: "project_costs_cost_rate_id_fkey"
            columns: ["cost_rate_id"]
            isOneToOne: false
            referencedRelation: "cost_rates"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "project_costs_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      project_geometry: {
        Row: {
          created_at: string | null
          doors: Json | null
          electrical_points: number | null
          floor_area_sqm: number | null
          foundation_type: string | null
          heating_radiators: number | null
          height_m: number | null
          id: string
          length_m: number | null
          plumbing_points: number | null
          project_id: string
          roof_type: string | null
          rooms: Json | null
          updated_at: string | null
          wall_type: string | null
          width_m: number | null
          windows: Json | null
        }
        Insert: {
          created_at?: string | null
          doors?: Json | null
          electrical_points?: number | null
          floor_area_sqm?: number | null
          foundation_type?: string | null
          heating_radiators?: number | null
          height_m?: number | null
          id?: string
          length_m?: number | null
          plumbing_points?: number | null
          project_id: string
          roof_type?: string | null
          rooms?: Json | null
          updated_at?: string | null
          wall_type?: string | null
          width_m?: number | null
          windows?: Json | null
        }
        Update: {
          created_at?: string | null
          doors?: Json | null
          electrical_points?: number | null
          floor_area_sqm?: number | null
          foundation_type?: string | null
          heating_radiators?: number | null
          height_m?: number | null
          id?: string
          length_m?: number | null
          plumbing_points?: number | null
          project_id?: string
          roof_type?: string | null
          rooms?: Json | null
          updated_at?: string | null
          wall_type?: string | null
          width_m?: number | null
          windows?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "project_geometry_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      project_schedules: {
        Row: {
          created_at: string | null
          dependencies: Json | null
          duration_days: number
          end_day: number | null
          id: string
          labour_hours: number | null
          machinery: Json | null
          project_id: string
          skill_level: string | null
          sort_order: number | null
          start_day: number | null
          task_name: string
          trade: string | null
        }
        Insert: {
          created_at?: string | null
          dependencies?: Json | null
          duration_days: number
          end_day?: number | null
          id?: string
          labour_hours?: number | null
          machinery?: Json | null
          project_id: string
          skill_level?: string | null
          sort_order?: number | null
          start_day?: number | null
          task_name: string
          trade?: string | null
        }
        Update: {
          created_at?: string | null
          dependencies?: Json | null
          duration_days?: number
          end_day?: number | null
          id?: string
          labour_hours?: number | null
          machinery?: Json | null
          project_id?: string
          skill_level?: string | null
          sort_order?: number | null
          start_day?: number | null
          task_name?: string
          trade?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "project_schedules_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      projects: {
        Row: {
          address: string | null
          build_quality: Database["public"]["Enums"]["build_quality"] | null
          created_at: string | null
          description: string | null
          estimated_cost: number | null
          estimated_duration_weeks: number | null
          geometry_hash: string | null
          id: string
          name: string
          organisation_id: string | null
          postcode: string | null
          project_type: Database["public"]["Enums"]["project_type"]
          status: Database["public"]["Enums"]["project_status"] | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          address?: string | null
          build_quality?: Database["public"]["Enums"]["build_quality"] | null
          created_at?: string | null
          description?: string | null
          estimated_cost?: number | null
          estimated_duration_weeks?: number | null
          geometry_hash?: string | null
          id?: string
          name: string
          organisation_id?: string | null
          postcode?: string | null
          project_type: Database["public"]["Enums"]["project_type"]
          status?: Database["public"]["Enums"]["project_status"] | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          address?: string | null
          build_quality?: Database["public"]["Enums"]["build_quality"] | null
          created_at?: string | null
          description?: string | null
          estimated_cost?: number | null
          estimated_duration_weeks?: number | null
          geometry_hash?: string | null
          id?: string
          name?: string
          organisation_id?: string | null
          postcode?: string | null
          project_type?: Database["public"]["Enums"]["project_type"]
          status?: Database["public"]["Enums"]["project_status"] | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "projects_organisation_id_fkey"
            columns: ["organisation_id"]
            isOneToOne: false
            referencedRelation: "organisations"
            referencedColumns: ["id"]
          },
        ]
      }
      tax_records: {
        Row: {
          created_at: string
          id: string
          national_insurance: number | null
          notes: string | null
          profit: number | null
          status: string | null
          tax_due_estimate: number | null
          tax_year: string
          total_expenses: number | null
          total_income: number | null
          total_vat_collected: number | null
          total_vat_paid: number | null
          updated_at: string
          user_id: string
          vat_liability: number | null
        }
        Insert: {
          created_at?: string
          id?: string
          national_insurance?: number | null
          notes?: string | null
          profit?: number | null
          status?: string | null
          tax_due_estimate?: number | null
          tax_year: string
          total_expenses?: number | null
          total_income?: number | null
          total_vat_collected?: number | null
          total_vat_paid?: number | null
          updated_at?: string
          user_id: string
          vat_liability?: number | null
        }
        Update: {
          created_at?: string
          id?: string
          national_insurance?: number | null
          notes?: string | null
          profit?: number | null
          status?: string | null
          tax_due_estimate?: number | null
          tax_year?: string
          total_expenses?: number | null
          total_income?: number | null
          total_vat_collected?: number | null
          total_vat_paid?: number | null
          updated_at?: string
          user_id?: string
          vat_liability?: number | null
        }
        Relationships: []
      }
      trade_jobs: {
        Row: {
          completion_date: string | null
          created_at: string
          customer_address: string | null
          customer_email: string | null
          customer_name: string | null
          customer_phone: string | null
          customer_price: number | null
          id: string
          job_date: string | null
          job_description: string | null
          job_type: string
          labour_hours: number | null
          labour_rate: number | null
          materials: Json | null
          materials_cost: number | null
          notes: string | null
          profit_margin: number | null
          status: string | null
          total_cost: number | null
          trade: string
          updated_at: string
          user_id: string
        }
        Insert: {
          completion_date?: string | null
          created_at?: string
          customer_address?: string | null
          customer_email?: string | null
          customer_name?: string | null
          customer_phone?: string | null
          customer_price?: number | null
          id?: string
          job_date?: string | null
          job_description?: string | null
          job_type: string
          labour_hours?: number | null
          labour_rate?: number | null
          materials?: Json | null
          materials_cost?: number | null
          notes?: string | null
          profit_margin?: number | null
          status?: string | null
          total_cost?: number | null
          trade: string
          updated_at?: string
          user_id: string
        }
        Update: {
          completion_date?: string | null
          created_at?: string
          customer_address?: string | null
          customer_email?: string | null
          customer_name?: string | null
          customer_phone?: string | null
          customer_price?: number | null
          id?: string
          job_date?: string | null
          job_description?: string | null
          job_type?: string
          labour_hours?: number | null
          labour_rate?: number | null
          materials?: Json | null
          materials_cost?: number | null
          notes?: string | null
          profit_margin?: number | null
          status?: string | null
          total_cost?: number | null
          trade?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      trade_receipts: {
        Row: {
          category: string
          created_at: string
          description: string
          gross_amount: number
          id: string
          is_claimable: boolean | null
          job_id: string | null
          net_amount: number
          payment_method: string | null
          receipt_date: string
          receipt_image_url: string | null
          receipt_type: string
          supplier: string | null
          tax_year: string | null
          user_id: string
          vat_amount: number | null
        }
        Insert: {
          category: string
          created_at?: string
          description: string
          gross_amount: number
          id?: string
          is_claimable?: boolean | null
          job_id?: string | null
          net_amount: number
          payment_method?: string | null
          receipt_date: string
          receipt_image_url?: string | null
          receipt_type?: string
          supplier?: string | null
          tax_year?: string | null
          user_id: string
          vat_amount?: number | null
        }
        Update: {
          category?: string
          created_at?: string
          description?: string
          gross_amount?: number
          id?: string
          is_claimable?: boolean | null
          job_id?: string | null
          net_amount?: number
          payment_method?: string | null
          receipt_date?: string
          receipt_image_url?: string | null
          receipt_type?: string
          supplier?: string | null
          tax_year?: string | null
          user_id?: string
          vat_amount?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "trade_receipts_job_id_fkey"
            columns: ["job_id"]
            isOneToOne: false
            referencedRelation: "trade_jobs"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "moderator" | "user"
      build_quality: "basic" | "standard" | "premium" | "luxury"
      project_status:
        | "draft"
        | "in_progress"
        | "quoted"
        | "approved"
        | "completed"
        | "archived"
      project_type:
        | "single_storey_rear"
        | "single_storey_side"
        | "double_storey_rear"
        | "double_storey_side"
        | "wrap_around"
        | "loft_dormer"
        | "loft_hip_to_gable"
        | "loft_mansard"
        | "loft_velux"
        | "hmo_conversion"
        | "garage_integral"
        | "garage_detached"
        | "basement_conversion"
        | "new_build"
        | "renovation"
        | "office_conversion"
      subscription_tier: "free" | "pro" | "business" | "enterprise"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "moderator", "user"],
      build_quality: ["basic", "standard", "premium", "luxury"],
      project_status: [
        "draft",
        "in_progress",
        "quoted",
        "approved",
        "completed",
        "archived",
      ],
      project_type: [
        "single_storey_rear",
        "single_storey_side",
        "double_storey_rear",
        "double_storey_side",
        "wrap_around",
        "loft_dormer",
        "loft_hip_to_gable",
        "loft_mansard",
        "loft_velux",
        "hmo_conversion",
        "garage_integral",
        "garage_detached",
        "basement_conversion",
        "new_build",
        "renovation",
        "office_conversion",
      ],
      subscription_tier: ["free", "pro", "business", "enterprise"],
    },
  },
} as const
