export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      category: {
        Row: {
          id: number
          name: string
          icon: string
          description: string | null
        }
        Insert: {
          id?: number
          name: string
          icon: string
          description?: string | null
        }
        Update: {
          id?: number
          name?: string
          icon?: string
          description?: string | null
        }
      }
      comment: {
        Row: {
          id: string
          report_id: string
          user_id: string | null
          content: string
          created_at: string
        }
        Insert: {
          id?: string
          report_id: string
          user_id?: string | null
          content: string
          created_at?: string
        }
        Update: {
          id?: string
          report_id?: string
          user_id?: string | null
          content?: string
          created_at?: string
        }
      }
      photo: {
        Row: {
          id: string
          url: string
          filename: string
          report_id: string
          uploaded_at: string
        }
        Insert: {
          id?: string
          url: string
          filename: string
          report_id: string
          uploaded_at?: string
        }
        Update: {
          id?: string
          url?: string
          filename?: string
          report_id?: string
          uploaded_at?: string
        }
      }
      profiles: {
        Row: {
          id: string
          username: string | null
          email: string | null
          role: 'citizen' | 'worker' | 'admin'
          avatar_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          username?: string | null
          email?: string | null
          role?: 'citizen' | 'worker' | 'admin'
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          username?: string | null
          email?: string | null
          role?: 'citizen' | 'worker' | 'admin'
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      report: {
        Row: {
          id: string
          title: string
          description: string
          address: string | null
          latitude: number
          longitude: number
          created_at: string
          resolved_at: string | null
          category_id: number
          status_id: number
          user_id: string | null
          assigned_worker_id: string | null
          priority: 'low' | 'medium' | 'high'
        }
        Insert: {
          id?: string
          title: string
          description: string
          address?: string | null
          latitude: number
          longitude: number
          created_at?: string
          resolved_at?: string | null
          category_id: number
          status_id?: number
          user_id?: string | null
          assigned_worker_id?: string | null
          priority?: 'low' | 'medium' | 'high'
        }
        Update: {
          id?: string
          title?: string
          description?: string
          address?: string | null
          latitude?: number
          longitude?: number
          created_at?: string
          resolved_at?: string | null
          category_id?: number
          status_id?: number
          user_id?: string | null
          assigned_worker_id?: string | null
          priority?: 'low' | 'medium' | 'high'
        }
      }
      report_view: {
        Row: {
          id: string
          report_id: string
          user_id: string | null
          viewed_at: string
        }
        Insert: {
          id?: string
          report_id: string
          user_id?: string | null
          viewed_at?: string
        }
        Update: {
          id?: string
          report_id?: string
          user_id?: string | null
          viewed_at?: string
        }
      }
      status: {
        Row: {
          id: number
          name: string
          color: string
          description: string | null
          sort_order: number
        }
        Insert: {
          id?: number
          name: string
          color: string
          description?: string | null
          sort_order?: number
        }
        Update: {
          id?: number
          name?: string
          color?: string
          description?: string | null
          sort_order?: number
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_user_role: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
    }
    Enums: {
      [_ in never]: never
    }
  }
}

// Helper types for easier usage
export type Tables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Row']
export type Insertable<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Insert']
export type Updatable<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Update']

// Commonly used types
export type Report = Tables<'report'>
export type Profile = Tables<'profiles'>
export type Category = Tables<'category'>
export type Status = Tables<'status'>
export type Photo = Tables<'photo'>
export type Comment = Tables<'comment'>

// Extended types with relations
export type ReportWithRelations = Report & {
  category: Category
  status: Status
  photos?: Photo[]
  user?: Profile
  assigned_worker?: Profile
}
