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
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      artwork_tags: {
        Row: {
          artwork_id: string
          tag_id: string
        }
        Insert: {
          artwork_id: string
          tag_id: string
        }
        Update: {
          artwork_id?: string
          tag_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "artwork_tags_artwork_id_fkey"
            columns: ["artwork_id"]
            isOneToOne: false
            referencedRelation: "artworks"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "artwork_tags_tag_id_fkey"
            columns: ["tag_id"]
            isOneToOne: false
            referencedRelation: "tags"
            referencedColumns: ["id"]
          },
        ]
      }
      artworks: {
        Row: {
          ai_summary: string | null
          alt_text: string
          artwork_type: Database["public"]["Enums"]["artwork_type"]
          canonical_url: string | null
          category_id: string | null
          commission_open: Database["public"]["Enums"]["commission_status"]
          created_at: string
          currency: string
          date_created: string | null
          deleted_at: string | null
          dimensions: string | null
          display_order: number
          featured: boolean
          id: string
          image_blurhash: string | null
          image_height: number | null
          image_url: string
          image_width: number | null
          is_for_sale: boolean
          is_sold: boolean
          medium: string | null
          meta_description: string | null
          meta_title: string | null
          og_image_url: string | null
          price: number | null
          published_at: string | null
          robots: string
          search_vector: unknown
          show_on_homepage: boolean
          slug: string
          status: Database["public"]["Enums"]["artwork_status"]
          story_content: Json
          style: string | null
          subject: string | null
          summary: string
          thumbnail_url: string | null
          title: string
          updated_at: string
        }
        Insert: {
          ai_summary?: string | null
          alt_text: string
          artwork_type?: Database["public"]["Enums"]["artwork_type"]
          canonical_url?: string | null
          category_id?: string | null
          commission_open?: Database["public"]["Enums"]["commission_status"]
          created_at?: string
          currency?: string
          date_created?: string | null
          deleted_at?: string | null
          dimensions?: string | null
          display_order?: number
          featured?: boolean
          id?: string
          image_blurhash?: string | null
          image_height?: number | null
          image_url: string
          image_width?: number | null
          is_for_sale?: boolean
          is_sold?: boolean
          medium?: string | null
          meta_description?: string | null
          meta_title?: string | null
          og_image_url?: string | null
          price?: number | null
          published_at?: string | null
          robots?: string
          search_vector?: unknown
          show_on_homepage?: boolean
          slug: string
          status?: Database["public"]["Enums"]["artwork_status"]
          story_content?: Json
          style?: string | null
          subject?: string | null
          summary: string
          thumbnail_url?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          ai_summary?: string | null
          alt_text?: string
          artwork_type?: Database["public"]["Enums"]["artwork_type"]
          canonical_url?: string | null
          category_id?: string | null
          commission_open?: Database["public"]["Enums"]["commission_status"]
          created_at?: string
          currency?: string
          date_created?: string | null
          deleted_at?: string | null
          dimensions?: string | null
          display_order?: number
          featured?: boolean
          id?: string
          image_blurhash?: string | null
          image_height?: number | null
          image_url?: string
          image_width?: number | null
          is_for_sale?: boolean
          is_sold?: boolean
          medium?: string | null
          meta_description?: string | null
          meta_title?: string | null
          og_image_url?: string | null
          price?: number | null
          published_at?: string | null
          robots?: string
          search_vector?: unknown
          show_on_homepage?: boolean
          slug?: string
          status?: Database["public"]["Enums"]["artwork_status"]
          story_content?: Json
          style?: string | null
          subject?: string | null
          summary?: string
          thumbnail_url?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "artworks_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
        ]
      }
      categories: {
        Row: {
          created_at: string
          deleted_at: string | null
          description: string | null
          display_order: number
          id: string
          meta_description: string | null
          meta_title: string | null
          name: string
          og_image_url: string | null
          parent_id: string | null
          slug: string
          summary: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          deleted_at?: string | null
          description?: string | null
          display_order?: number
          id?: string
          meta_description?: string | null
          meta_title?: string | null
          name: string
          og_image_url?: string | null
          parent_id?: string | null
          slug: string
          summary?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          deleted_at?: string | null
          description?: string | null
          display_order?: number
          id?: string
          meta_description?: string | null
          meta_title?: string | null
          name?: string
          og_image_url?: string | null
          parent_id?: string | null
          slug?: string
          summary?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "categories_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
        ]
      }
      commission_requests: {
        Row: {
          admin_notes: string | null
          artwork_description: string | null
          artwork_id: string | null
          budget: string | null
          created_at: string
          email: string
          id: string
          message: string
          name: string
          phone: string | null
          reference_images: string[]
          status: Database["public"]["Enums"]["request_status"]
          updated_at: string
        }
        Insert: {
          admin_notes?: string | null
          artwork_description?: string | null
          artwork_id?: string | null
          budget?: string | null
          created_at?: string
          email: string
          id?: string
          message: string
          name: string
          phone?: string | null
          reference_images?: string[]
          status?: Database["public"]["Enums"]["request_status"]
          updated_at?: string
        }
        Update: {
          admin_notes?: string | null
          artwork_description?: string | null
          artwork_id?: string | null
          budget?: string | null
          created_at?: string
          email?: string
          id?: string
          message?: string
          name?: string
          phone?: string | null
          reference_images?: string[]
          status?: Database["public"]["Enums"]["request_status"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "commission_requests_artwork_id_fkey"
            columns: ["artwork_id"]
            isOneToOne: false
            referencedRelation: "artworks"
            referencedColumns: ["id"]
          },
        ]
      }
      faqs: {
        Row: {
          answer: string
          created_at: string
          display_order: number
          entity_id: string | null
          entity_type: Database["public"]["Enums"]["faq_entity_type"]
          id: string
          question: string
          updated_at: string
        }
        Insert: {
          answer: string
          created_at?: string
          display_order?: number
          entity_id?: string | null
          entity_type: Database["public"]["Enums"]["faq_entity_type"]
          id?: string
          question: string
          updated_at?: string
        }
        Update: {
          answer?: string
          created_at?: string
          display_order?: number
          entity_id?: string | null
          entity_type?: Database["public"]["Enums"]["faq_entity_type"]
          id?: string
          question?: string
          updated_at?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          display_name: string | null
          id: string
          role: Database["public"]["Enums"]["user_role"]
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          display_name?: string | null
          id: string
          role?: Database["public"]["Enums"]["user_role"]
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          display_name?: string | null
          id?: string
          role?: Database["public"]["Enums"]["user_role"]
          updated_at?: string
        }
        Relationships: []
      }
      redirects: {
        Row: {
          created_at: string
          from_path: string
          id: string
          reason: string | null
          to_path: string
          type: Database["public"]["Enums"]["redirect_type"]
        }
        Insert: {
          created_at?: string
          from_path: string
          id?: string
          reason?: string | null
          to_path: string
          type?: Database["public"]["Enums"]["redirect_type"]
        }
        Update: {
          created_at?: string
          from_path?: string
          id?: string
          reason?: string | null
          to_path?: string
          type?: Database["public"]["Enums"]["redirect_type"]
        }
        Relationships: []
      }
      seo_metadata: {
        Row: {
          canonical_url: string | null
          created_at: string
          entity_id: string | null
          entity_type: Database["public"]["Enums"]["seo_entity_type"]
          id: string
          meta_description: string | null
          meta_title: string | null
          og_description: string | null
          og_image_url: string | null
          og_title: string | null
          robots: string
          structured_data: Json | null
          twitter_description: string | null
          twitter_image_url: string | null
          twitter_title: string | null
          updated_at: string
        }
        Insert: {
          canonical_url?: string | null
          created_at?: string
          entity_id?: string | null
          entity_type: Database["public"]["Enums"]["seo_entity_type"]
          id?: string
          meta_description?: string | null
          meta_title?: string | null
          og_description?: string | null
          og_image_url?: string | null
          og_title?: string | null
          robots?: string
          structured_data?: Json | null
          twitter_description?: string | null
          twitter_image_url?: string | null
          twitter_title?: string | null
          updated_at?: string
        }
        Update: {
          canonical_url?: string | null
          created_at?: string
          entity_id?: string | null
          entity_type?: Database["public"]["Enums"]["seo_entity_type"]
          id?: string
          meta_description?: string | null
          meta_title?: string | null
          og_description?: string | null
          og_image_url?: string | null
          og_title?: string | null
          robots?: string
          structured_data?: Json | null
          twitter_description?: string | null
          twitter_image_url?: string | null
          twitter_title?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      tags: {
        Row: {
          created_at: string
          id: string
          name: string
          slug: string
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
          slug: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          slug?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      is_admin: { Args: never; Returns: boolean }
    }
    Enums: {
      artwork_status: "draft" | "published" | "archived"
      artwork_type: "original" | "print" | "digital" | "commission"
      commission_status: "open" | "closed" | "waitlist"
      faq_entity_type: "artwork" | "category" | "global"
      redirect_type: "301" | "302"
      request_status:
        | "pending"
        | "contacted"
        | "quoted"
        | "accepted"
        | "completed"
        | "rejected"
      seo_entity_type: "site" | "artwork" | "category" | "tag" | "page"
      user_role: "admin" | "customer"
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
      artwork_status: ["draft", "published", "archived"],
      artwork_type: ["original", "print", "digital", "commission"],
      commission_status: ["open", "closed", "waitlist"],
      faq_entity_type: ["artwork", "category", "global"],
      redirect_type: ["301", "302"],
      request_status: [
        "pending",
        "contacted",
        "quoted",
        "accepted",
        "completed",
        "rejected",
      ],
      seo_entity_type: ["site", "artwork", "category", "tag", "page"],
      user_role: ["admin", "customer"],
    },
  },
} as const
