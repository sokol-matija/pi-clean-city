export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

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
        Relationships: []
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
        Relationships: [
          {
            foreignKeyName: "comment_report_id_fkey"
            columns: ["report_id"]
            referencedRelation: "report"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "comment_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
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
        Relationships: [
          {
            foreignKeyName: "photo_report_id_fkey"
            columns: ["report_id"]
            referencedRelation: "report"
            referencedColumns: ["id"]
          },
        ]
      }
      post: {
        Row: {
          averageRating: number | null
          content: string
          created_at: string
          id: number
          imageId: string | null
          title: string
          userId: string | null
        }
        Insert: {
          averageRating?: number | null
          content: string
          created_at?: string
          id?: number
          imageId?: string | null
          title: string
          userId?: string | null
        }
        Update: {
          averageRating?: number | null
          content?: string
          created_at?: string
          id?: number
          imageId?: string | null
          title?: string
          userId?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "post_userId_fkey"
            columns: ["userId"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      post_comment: {
        Row: {
          id: string
          post_id: number
          user_id: string | null
          content: string
          created_at: string
        }
        Insert: {
          id?: string
          post_id: number
          user_id?: string | null
          content: string
          created_at?: string
        }
        Update: {
          id?: string
          post_id?: number
          user_id?: string | null
          content?: string
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "post_comment_post_id_fkey"
            columns: ["post_id"]
            referencedRelation: "post"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "post_comment_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          id: string
          username: string | null
          email: string | null
          role: string
          avatar_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          username?: string | null
          email?: string | null
          role?: string
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          username?: string | null
          email?: string | null
          role?: string
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "profiles_id_fkey"
            columns: ["id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
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
          priority: string
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
          priority?: string
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
          priority?: string
        }
        Relationships: [
          {
            foreignKeyName: "report_category_id_fkey"
            columns: ["category_id"]
            referencedRelation: "category"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "report_status_id_fkey"
            columns: ["status_id"]
            referencedRelation: "status"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "report_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "report_assigned_worker_id_fkey"
            columns: ["assigned_worker_id"]
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
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
        Relationships: [
          {
            foreignKeyName: "report_view_report_id_fkey"
            columns: ["report_id"]
            referencedRelation: "report"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "report_view_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
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
        Relationships: []
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
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

export type Tables<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Row"]
export type Insertable<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Insert"]
export type Updatable<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Update"]

export type Report = Tables<"report">
export type Profile = Tables<"profiles">
export type Category = Tables<"category">
export type Status = Tables<"status">
export type Photo = Tables<"photo">
export type Comment = Tables<"comment">
export type Post = Tables<"post">
export type PostComment = Tables<"post_comment">

export type ReportWithRelations = Report & {
  category: Category
  status: Status
  photos?: Photo[]
  user?: Profile
  assigned_worker?: Profile
}
