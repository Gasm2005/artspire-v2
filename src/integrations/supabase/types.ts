export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5";
  };
  public: {
    Tables: {
      artwork_faqs: {
        Row: {
          artwork_id: string;
          display_order: number | null;
          faq_id: string;
        };
        Insert: {
          artwork_id: string;
          display_order?: number | null;
          faq_id: string;
        };
        Update: {
          artwork_id?: string;
          display_order?: number | null;
          faq_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "artwork_faqs_artwork_id_fkey";
            columns: ["artwork_id"];
            isOneToOne: false;
            referencedRelation: "artworks";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "artwork_faqs_faq_id_fkey";
            columns: ["faq_id"];
            isOneToOne: false;
            referencedRelation: "faqs";
            referencedColumns: ["id"];
          },
        ];
      };
      artwork_gallery_images: {
        Row: {
          alt_text: string | null;
          artwork_id: string | null;
          caption: string | null;
          created_at: string | null;
          display_order: number | null;
          id: string;
          media_id: string | null;
        };
        Insert: {
          alt_text?: string | null;
          artwork_id?: string | null;
          caption?: string | null;
          created_at?: string | null;
          display_order?: number | null;
          id?: string;
          media_id?: string | null;
        };
        Update: {
          alt_text?: string | null;
          artwork_id?: string | null;
          caption?: string | null;
          created_at?: string | null;
          display_order?: number | null;
          id?: string;
          media_id?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "artwork_gallery_images_artwork_id_fkey";
            columns: ["artwork_id"];
            isOneToOne: false;
            referencedRelation: "artworks";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "artwork_gallery_images_media_id_fkey";
            columns: ["media_id"];
            isOneToOne: false;
            referencedRelation: "media_library";
            referencedColumns: ["id"];
          },
        ];
      };
      artwork_process_images: {
        Row: {
          artwork_id: string | null;
          created_at: string | null;
          display_order: number | null;
          id: string;
          media_id: string | null;
          step_description: string | null;
          step_number: number;
          step_title: string | null;
        };
        Insert: {
          artwork_id?: string | null;
          created_at?: string | null;
          display_order?: number | null;
          id?: string;
          media_id?: string | null;
          step_description?: string | null;
          step_number: number;
          step_title?: string | null;
        };
        Update: {
          artwork_id?: string | null;
          created_at?: string | null;
          display_order?: number | null;
          id?: string;
          media_id?: string | null;
          step_description?: string | null;
          step_number?: number;
          step_title?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "artwork_process_images_artwork_id_fkey";
            columns: ["artwork_id"];
            isOneToOne: false;
            referencedRelation: "artworks";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "artwork_process_images_media_id_fkey";
            columns: ["media_id"];
            isOneToOne: false;
            referencedRelation: "media_library";
            referencedColumns: ["id"];
          },
        ];
      };
      artwork_tags: {
        Row: {
          artwork_id: string;
          display_order: number | null;
          tag_id: string;
        };
        Insert: {
          artwork_id: string;
          display_order?: number | null;
          tag_id: string;
        };
        Update: {
          artwork_id?: string;
          display_order?: number | null;
          tag_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "artwork_tags_artwork_id_fkey";
            columns: ["artwork_id"];
            isOneToOne: false;
            referencedRelation: "artworks";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "artwork_tags_tag_id_fkey";
            columns: ["tag_id"];
            isOneToOne: false;
            referencedRelation: "tags";
            referencedColumns: ["id"];
          },
        ];
      };
      artworks: {
        Row: {
          after_image_id: string | null;
          ai_summary: string | null;
          alt_text: string;
          artwork_type: Database["public"]["Enums"]["artwork_type"];
          before_image_id: string | null;
          canonical_url: string | null;
          category_id: string | null;
          commission_open: Database["public"]["Enums"]["commission_status"];
          created_at: string;
          created_by: string | null;
          currency: string;
          date_created: string | null;
          deleted_at: string | null;
          dimensions: string | null;
          display_order: number;
          featured: boolean;
          h1_heading: string | null;
          h2_heading: string | null;
          h3_heading: string | null;
          id: string;
          image_alt: string | null;
          image_blurhash: string | null;
          image_height: number | null;
          image_url: string;
          image_width: number | null;
          inquiry_count: number | null;
          is_for_sale: boolean;
          is_sold: boolean;
          main_image_id: string | null;
          medium: string | null;
          meta_description: string | null;
          meta_title: string | null;
          og_image_url: string | null;
          price: number | null;
          published_at: string | null;
          robots: string;
          scheduled_publish_at: string | null;
          search_vector: unknown;
          short_description: string | null;
          show_on_homepage: boolean;
          slug: string;
          status: Database["public"]["Enums"]["artwork_status"];
          story_content: Json;
          style: string | null;
          subject: string | null;
          summary: string;
          thumbnail_image_id: string | null;
          thumbnail_url: string | null;
          title: string;
          updated_at: string;
          updated_by: string | null;
          view_count: number | null;
        };
        Insert: {
          after_image_id?: string | null;
          ai_summary?: string | null;
          alt_text: string;
          artwork_type?: Database["public"]["Enums"]["artwork_type"];
          before_image_id?: string | null;
          canonical_url?: string | null;
          category_id?: string | null;
          commission_open?: Database["public"]["Enums"]["commission_status"];
          created_at?: string;
          created_by?: string | null;
          currency?: string;
          date_created?: string | null;
          deleted_at?: string | null;
          dimensions?: string | null;
          display_order?: number;
          featured?: boolean;
          h1_heading?: string | null;
          h2_heading?: string | null;
          h3_heading?: string | null;
          id?: string;
          image_alt?: string | null;
          image_blurhash?: string | null;
          image_height?: number | null;
          image_url: string;
          image_width?: number | null;
          inquiry_count?: number | null;
          is_for_sale?: boolean;
          is_sold?: boolean;
          main_image_id?: string | null;
          medium?: string | null;
          meta_description?: string | null;
          meta_title?: string | null;
          og_image_url?: string | null;
          price?: number | null;
          published_at?: string | null;
          robots?: string;
          scheduled_publish_at?: string | null;
          search_vector?: unknown;
          short_description?: string | null;
          show_on_homepage?: boolean;
          slug: string;
          status?: Database["public"]["Enums"]["artwork_status"];
          story_content?: Json;
          style?: string | null;
          subject?: string | null;
          summary: string;
          thumbnail_image_id?: string | null;
          thumbnail_url?: string | null;
          title: string;
          updated_at?: string;
          updated_by?: string | null;
          view_count?: number | null;
        };
        Update: {
          after_image_id?: string | null;
          ai_summary?: string | null;
          alt_text?: string;
          artwork_type?: Database["public"]["Enums"]["artwork_type"];
          before_image_id?: string | null;
          canonical_url?: string | null;
          category_id?: string | null;
          commission_open?: Database["public"]["Enums"]["commission_status"];
          created_at?: string;
          created_by?: string | null;
          currency?: string;
          date_created?: string | null;
          deleted_at?: string | null;
          dimensions?: string | null;
          display_order?: number;
          featured?: boolean;
          h1_heading?: string | null;
          h2_heading?: string | null;
          h3_heading?: string | null;
          id?: string;
          image_alt?: string | null;
          image_blurhash?: string | null;
          image_height?: number | null;
          image_url?: string;
          image_width?: number | null;
          inquiry_count?: number | null;
          is_for_sale?: boolean;
          is_sold?: boolean;
          main_image_id?: string | null;
          medium?: string | null;
          meta_description?: string | null;
          meta_title?: string | null;
          og_image_url?: string | null;
          price?: number | null;
          published_at?: string | null;
          robots?: string;
          scheduled_publish_at?: string | null;
          search_vector?: unknown;
          short_description?: string | null;
          show_on_homepage?: boolean;
          slug?: string;
          status?: Database["public"]["Enums"]["artwork_status"];
          story_content?: Json;
          style?: string | null;
          subject?: string | null;
          summary?: string;
          thumbnail_image_id?: string | null;
          thumbnail_url?: string | null;
          title?: string;
          updated_at?: string;
          updated_by?: string | null;
          view_count?: number | null;
        };
        Relationships: [
          {
            foreignKeyName: "artworks_after_image_id_fkey";
            columns: ["after_image_id"];
            isOneToOne: false;
            referencedRelation: "media_library";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "artworks_before_image_id_fkey";
            columns: ["before_image_id"];
            isOneToOne: false;
            referencedRelation: "media_library";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "artworks_category_id_fkey";
            columns: ["category_id"];
            isOneToOne: false;
            referencedRelation: "categories";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "artworks_created_by_fkey";
            columns: ["created_by"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "artworks_main_image_id_fkey";
            columns: ["main_image_id"];
            isOneToOne: false;
            referencedRelation: "media_library";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "artworks_thumbnail_image_id_fkey";
            columns: ["thumbnail_image_id"];
            isOneToOne: false;
            referencedRelation: "media_library";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "artworks_updated_by_fkey";
            columns: ["updated_by"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      blog_posts: {
        Row: {
          author: string | null;
          body: string | null;
          category: string | null;
          cover_image_url: string | null;
          created_at: string;
          excerpt: string | null;
          id: string;
          meta_description: string | null;
          meta_title: string | null;
          og_image_url: string | null;
          published_at: string | null;
          reading_minutes: number | null;
          slug: string;
          status: string;
          title: string;
          updated_at: string;
        };
        Insert: {
          author?: string | null;
          body?: string | null;
          category?: string | null;
          cover_image_url?: string | null;
          created_at?: string;
          excerpt?: string | null;
          id?: string;
          meta_description?: string | null;
          meta_title?: string | null;
          og_image_url?: string | null;
          published_at?: string | null;
          reading_minutes?: number | null;
          slug: string;
          status?: string;
          title: string;
          updated_at?: string;
        };
        Update: {
          author?: string | null;
          body?: string | null;
          category?: string | null;
          cover_image_url?: string | null;
          created_at?: string;
          excerpt?: string | null;
          id?: string;
          meta_description?: string | null;
          meta_title?: string | null;
          og_image_url?: string | null;
          published_at?: string | null;
          reading_minutes?: number | null;
          slug?: string;
          status?: string;
          title?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      cart_items: {
        Row: {
          cart_id: string;
          created_at: string;
          id: string;
          price_at_add: number;
          product_id: string;
          quantity: number;
        };
        Insert: {
          cart_id: string;
          created_at?: string;
          id?: string;
          price_at_add: number;
          product_id: string;
          quantity?: number;
        };
        Update: {
          cart_id?: string;
          created_at?: string;
          id?: string;
          price_at_add?: number;
          product_id?: string;
          quantity?: number;
        };
        Relationships: [
          {
            foreignKeyName: "cart_items_cart_id_fkey";
            columns: ["cart_id"];
            isOneToOne: false;
            referencedRelation: "carts";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "cart_items_product_id_fkey";
            columns: ["product_id"];
            isOneToOne: false;
            referencedRelation: "products";
            referencedColumns: ["id"];
          },
        ];
      };
      carts: {
        Row: {
          created_at: string;
          id: string;
          session_id: string;
          updated_at: string;
        };
        Insert: {
          created_at?: string;
          id?: string;
          session_id: string;
          updated_at?: string;
        };
        Update: {
          created_at?: string;
          id?: string;
          session_id?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      categories: {
        Row: {
          banner_artwork_image_id: string | null;
          banner_overlay_id: string | null;
          card_artwork_image_id: string | null;
          card_gradient_style: string | null;
          card_overlay_id: string | null;
          card_overlay_opacity: number | null;
          card_text_position: string | null;
          created_at: string;
          created_by: string | null;
          deleted_at: string | null;
          description: string | null;
          display_order: number;
          faq_section_id: string | null;
          featured: boolean | null;
          id: string;
          meta_description: string | null;
          meta_title: string | null;
          name: string;
          og_image_id: string | null;
          og_image_url: string | null;
          parent_id: string | null;
          short_summary: string | null;
          slug: string;
          summary: string | null;
          thumbnail_image_id: string | null;
          updated_at: string;
          updated_by: string | null;
        };
        Insert: {
          banner_artwork_image_id?: string | null;
          banner_overlay_id?: string | null;
          card_artwork_image_id?: string | null;
          card_gradient_style?: string | null;
          card_overlay_id?: string | null;
          card_overlay_opacity?: number | null;
          card_text_position?: string | null;
          created_at?: string;
          created_by?: string | null;
          deleted_at?: string | null;
          description?: string | null;
          display_order?: number;
          faq_section_id?: string | null;
          featured?: boolean | null;
          id?: string;
          meta_description?: string | null;
          meta_title?: string | null;
          name: string;
          og_image_id?: string | null;
          og_image_url?: string | null;
          parent_id?: string | null;
          short_summary?: string | null;
          slug: string;
          summary?: string | null;
          thumbnail_image_id?: string | null;
          updated_at?: string;
          updated_by?: string | null;
        };
        Update: {
          banner_artwork_image_id?: string | null;
          banner_overlay_id?: string | null;
          card_artwork_image_id?: string | null;
          card_gradient_style?: string | null;
          card_overlay_id?: string | null;
          card_overlay_opacity?: number | null;
          card_text_position?: string | null;
          created_at?: string;
          created_by?: string | null;
          deleted_at?: string | null;
          description?: string | null;
          display_order?: number;
          faq_section_id?: string | null;
          featured?: boolean | null;
          id?: string;
          meta_description?: string | null;
          meta_title?: string | null;
          name?: string;
          og_image_id?: string | null;
          og_image_url?: string | null;
          parent_id?: string | null;
          short_summary?: string | null;
          slug?: string;
          summary?: string | null;
          thumbnail_image_id?: string | null;
          updated_at?: string;
          updated_by?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "categories_banner_artwork_image_id_fkey";
            columns: ["banner_artwork_image_id"];
            isOneToOne: false;
            referencedRelation: "media_library";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "categories_banner_overlay_id_fkey";
            columns: ["banner_overlay_id"];
            isOneToOne: false;
            referencedRelation: "visual_assets";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "categories_card_artwork_image_id_fkey";
            columns: ["card_artwork_image_id"];
            isOneToOne: false;
            referencedRelation: "media_library";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "categories_card_overlay_id_fkey";
            columns: ["card_overlay_id"];
            isOneToOne: false;
            referencedRelation: "visual_assets";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "categories_created_by_fkey";
            columns: ["created_by"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "categories_faq_section_id_fkey";
            columns: ["faq_section_id"];
            isOneToOne: false;
            referencedRelation: "faq_sections";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "categories_og_image_id_fkey";
            columns: ["og_image_id"];
            isOneToOne: false;
            referencedRelation: "media_library";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "categories_parent_id_fkey";
            columns: ["parent_id"];
            isOneToOne: false;
            referencedRelation: "categories";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "categories_thumbnail_image_id_fkey";
            columns: ["thumbnail_image_id"];
            isOneToOne: false;
            referencedRelation: "media_library";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "categories_updated_by_fkey";
            columns: ["updated_by"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      category_faqs: {
        Row: {
          category_id: string;
          display_order: number | null;
          faq_id: string;
        };
        Insert: {
          category_id: string;
          display_order?: number | null;
          faq_id: string;
        };
        Update: {
          category_id?: string;
          display_order?: number | null;
          faq_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "category_faqs_category_id_fkey";
            columns: ["category_id"];
            isOneToOne: false;
            referencedRelation: "categories";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "category_faqs_faq_id_fkey";
            columns: ["faq_id"];
            isOneToOne: false;
            referencedRelation: "faqs";
            referencedColumns: ["id"];
          },
        ];
      };
      category_gallery_images: {
        Row: {
          alt_text: string | null;
          caption: string | null;
          category_id: string | null;
          created_at: string | null;
          display_order: number | null;
          id: string;
          media_id: string | null;
        };
        Insert: {
          alt_text?: string | null;
          caption?: string | null;
          category_id?: string | null;
          created_at?: string | null;
          display_order?: number | null;
          id?: string;
          media_id?: string | null;
        };
        Update: {
          alt_text?: string | null;
          caption?: string | null;
          category_id?: string | null;
          created_at?: string | null;
          display_order?: number | null;
          id?: string;
          media_id?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "category_gallery_images_category_id_fkey";
            columns: ["category_id"];
            isOneToOne: false;
            referencedRelation: "categories";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "category_gallery_images_media_id_fkey";
            columns: ["media_id"];
            isOneToOne: false;
            referencedRelation: "media_library";
            referencedColumns: ["id"];
          },
        ];
      };
      collections: {
        Row: {
          created_at: string;
          deleted_at: string | null;
          description: string | null;
          display_order: number;
          ends_at: string | null;
          hero_image_id: string | null;
          id: string;
          is_active: boolean;
          is_seasonal: boolean;
          slug: string;
          starts_at: string | null;
          title: string;
          updated_at: string;
        };
        Insert: {
          created_at?: string;
          deleted_at?: string | null;
          description?: string | null;
          display_order?: number;
          ends_at?: string | null;
          hero_image_id?: string | null;
          id?: string;
          is_active?: boolean;
          is_seasonal?: boolean;
          slug: string;
          starts_at?: string | null;
          title: string;
          updated_at?: string;
        };
        Update: {
          created_at?: string;
          deleted_at?: string | null;
          description?: string | null;
          display_order?: number;
          ends_at?: string | null;
          hero_image_id?: string | null;
          id?: string;
          is_active?: boolean;
          is_seasonal?: boolean;
          slug?: string;
          starts_at?: string | null;
          title?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "collections_hero_image_id_fkey";
            columns: ["hero_image_id"];
            isOneToOne: false;
            referencedRelation: "media_library";
            referencedColumns: ["id"];
          },
        ];
      };
      commission_requests: {
        Row: {
          admin_notes: string | null;
          artwork_description: string | null;
          artwork_id: string | null;
          budget: string | null;
          created_at: string;
          email: string;
          id: string;
          message: string;
          name: string;
          phone: string | null;
          reference_images: string[];
          status: Database["public"]["Enums"]["request_status"];
          updated_at: string;
        };
        Insert: {
          admin_notes?: string | null;
          artwork_description?: string | null;
          artwork_id?: string | null;
          budget?: string | null;
          created_at?: string;
          email: string;
          id?: string;
          message: string;
          name: string;
          phone?: string | null;
          reference_images?: string[];
          status?: Database["public"]["Enums"]["request_status"];
          updated_at?: string;
        };
        Update: {
          admin_notes?: string | null;
          artwork_description?: string | null;
          artwork_id?: string | null;
          budget?: string | null;
          created_at?: string;
          email?: string;
          id?: string;
          message?: string;
          name?: string;
          phone?: string | null;
          reference_images?: string[];
          status?: Database["public"]["Enums"]["request_status"];
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "commission_requests_artwork_id_fkey";
            columns: ["artwork_id"];
            isOneToOne: false;
            referencedRelation: "artworks";
            referencedColumns: ["id"];
          },
        ];
      };
      dashboard_activity_feed: {
        Row: {
          activity_type: string;
          description: string | null;
          entity_id: string | null;
          entity_slug: string | null;
          entity_type: string | null;
          id: string;
          performed_at: string | null;
          performed_by: string | null;
          title: string;
        };
        Insert: {
          activity_type: string;
          description?: string | null;
          entity_id?: string | null;
          entity_slug?: string | null;
          entity_type?: string | null;
          id?: string;
          performed_at?: string | null;
          performed_by?: string | null;
          title: string;
        };
        Update: {
          activity_type?: string;
          description?: string | null;
          entity_id?: string | null;
          entity_slug?: string | null;
          entity_type?: string | null;
          id?: string;
          performed_at?: string | null;
          performed_by?: string | null;
          title?: string;
        };
        Relationships: [
          {
            foreignKeyName: "dashboard_activity_feed_performed_by_fkey";
            columns: ["performed_by"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      dashboard_metrics: {
        Row: {
          calculated_at: string | null;
          change_percent: number | null;
          change_value: number | null;
          id: string;
          metric_name: string;
          metric_period: string | null;
          metric_value: number | null;
          metric_value_numeric: number | null;
          trend: string | null;
        };
        Insert: {
          calculated_at?: string | null;
          change_percent?: number | null;
          change_value?: number | null;
          id?: string;
          metric_name: string;
          metric_period?: string | null;
          metric_value?: number | null;
          metric_value_numeric?: number | null;
          trend?: string | null;
        };
        Update: {
          calculated_at?: string | null;
          change_percent?: number | null;
          change_value?: number | null;
          id?: string;
          metric_name?: string;
          metric_period?: string | null;
          metric_value?: number | null;
          metric_value_numeric?: number | null;
          trend?: string | null;
        };
        Relationships: [];
      };
      faq_sections: {
        Row: {
          created_at: string | null;
          description: string | null;
          display_order: number | null;
          id: string;
          slug: string;
          status: string | null;
          title: string;
          updated_at: string | null;
        };
        Insert: {
          created_at?: string | null;
          description?: string | null;
          display_order?: number | null;
          id?: string;
          slug: string;
          status?: string | null;
          title: string;
          updated_at?: string | null;
        };
        Update: {
          created_at?: string | null;
          description?: string | null;
          display_order?: number | null;
          id?: string;
          slug?: string;
          status?: string | null;
          title?: string;
          updated_at?: string | null;
        };
        Relationships: [];
      };
      faqs: {
        Row: {
          answer: string;
          created_at: string;
          created_by: string | null;
          display_order: number;
          entity_id: string | null;
          entity_type: Database["public"]["Enums"]["faq_entity_type"];
          id: string;
          question: string;
          schema_type: string | null;
          section_id: string | null;
          status: string | null;
          updated_at: string;
          updated_by: string | null;
        };
        Insert: {
          answer: string;
          created_at?: string;
          created_by?: string | null;
          display_order?: number;
          entity_id?: string | null;
          entity_type: Database["public"]["Enums"]["faq_entity_type"];
          id?: string;
          question: string;
          schema_type?: string | null;
          section_id?: string | null;
          status?: string | null;
          updated_at?: string;
          updated_by?: string | null;
        };
        Update: {
          answer?: string;
          created_at?: string;
          created_by?: string | null;
          display_order?: number;
          entity_id?: string | null;
          entity_type?: Database["public"]["Enums"]["faq_entity_type"];
          id?: string;
          question?: string;
          schema_type?: string | null;
          section_id?: string | null;
          status?: string | null;
          updated_at?: string;
          updated_by?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "faqs_created_by_fkey";
            columns: ["created_by"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "faqs_section_id_fkey";
            columns: ["section_id"];
            isOneToOne: false;
            referencedRelation: "faq_sections";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "faqs_updated_by_fkey";
            columns: ["updated_by"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      lead_activities: {
        Row: {
          activity_type: string;
          body: string | null;
          created_at: string | null;
          created_by: string | null;
          direction: string | null;
          id: string;
          is_automated: boolean | null;
          lead_id: string | null;
          subject: string | null;
        };
        Insert: {
          activity_type: string;
          body?: string | null;
          created_at?: string | null;
          created_by?: string | null;
          direction?: string | null;
          id?: string;
          is_automated?: boolean | null;
          lead_id?: string | null;
          subject?: string | null;
        };
        Update: {
          activity_type?: string;
          body?: string | null;
          created_at?: string | null;
          created_by?: string | null;
          direction?: string | null;
          id?: string;
          is_automated?: boolean | null;
          lead_id?: string | null;
          subject?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "lead_activities_created_by_fkey";
            columns: ["created_by"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "lead_activities_lead_id_fkey";
            columns: ["lead_id"];
            isOneToOne: false;
            referencedRelation: "leads";
            referencedColumns: ["id"];
          },
        ];
      };
      lead_tag_items: {
        Row: {
          lead_id: string;
          tag_id: string;
        };
        Insert: {
          lead_id: string;
          tag_id: string;
        };
        Update: {
          lead_id?: string;
          tag_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "lead_tag_items_lead_id_fkey";
            columns: ["lead_id"];
            isOneToOne: false;
            referencedRelation: "leads";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "lead_tag_items_tag_id_fkey";
            columns: ["tag_id"];
            isOneToOne: false;
            referencedRelation: "lead_tags";
            referencedColumns: ["id"];
          },
        ];
      };
      lead_tags: {
        Row: {
          color: string | null;
          created_at: string | null;
          id: string;
          name: string;
        };
        Insert: {
          color?: string | null;
          created_at?: string | null;
          id?: string;
          name: string;
        };
        Update: {
          color?: string | null;
          created_at?: string | null;
          id?: string;
          name?: string;
        };
        Relationships: [];
      };
      leads: {
        Row: {
          artwork_id: string | null;
          assigned_to: string | null;
          budget_range: string | null;
          category_id: string | null;
          created_at: string | null;
          email: string | null;
          id: string;
          lead_number: string;
          location: string | null;
          name: string;
          notes: string | null;
          phone: string | null;
          requirement: string | null;
          source: string | null;
          source_detail: string | null;
          status: string | null;
          status_changed_at: string | null;
          updated_at: string | null;
          whatsapp_number: string | null;
        };
        Insert: {
          artwork_id?: string | null;
          assigned_to?: string | null;
          budget_range?: string | null;
          category_id?: string | null;
          created_at?: string | null;
          email?: string | null;
          id?: string;
          lead_number: string;
          location?: string | null;
          name: string;
          notes?: string | null;
          phone?: string | null;
          requirement?: string | null;
          source?: string | null;
          source_detail?: string | null;
          status?: string | null;
          status_changed_at?: string | null;
          updated_at?: string | null;
          whatsapp_number?: string | null;
        };
        Update: {
          artwork_id?: string | null;
          assigned_to?: string | null;
          budget_range?: string | null;
          category_id?: string | null;
          created_at?: string | null;
          email?: string | null;
          id?: string;
          lead_number?: string;
          location?: string | null;
          name?: string;
          notes?: string | null;
          phone?: string | null;
          requirement?: string | null;
          source?: string | null;
          source_detail?: string | null;
          status?: string | null;
          status_changed_at?: string | null;
          updated_at?: string | null;
          whatsapp_number?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "leads_artwork_id_fkey";
            columns: ["artwork_id"];
            isOneToOne: false;
            referencedRelation: "artworks";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "leads_assigned_to_fkey";
            columns: ["assigned_to"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "leads_category_id_fkey";
            columns: ["category_id"];
            isOneToOne: false;
            referencedRelation: "categories";
            referencedColumns: ["id"];
          },
        ];
      };
      media_library: {
        Row: {
          ai_generated_alt: string | null;
          ai_generated_tags: string[] | null;
          alt_text: string | null;
          aspect_ratio: number | null;
          caption: string | null;
          created_at: string | null;
          deleted_at: string | null;
          description: string | null;
          dominant_colors: Json | null;
          file_size: number | null;
          filename: string;
          folder: string | null;
          height: number | null;
          id: string;
          mime_type: string | null;
          original_name: string;
          public_url: string;
          storage_path: string;
          tags: string[] | null;
          title: string | null;
          updated_at: string | null;
          uploaded_by: string | null;
          usage_count: number | null;
          used_in: Json | null;
          variants: Json | null;
          width: number | null;
        };
        Insert: {
          ai_generated_alt?: string | null;
          ai_generated_tags?: string[] | null;
          alt_text?: string | null;
          aspect_ratio?: number | null;
          caption?: string | null;
          created_at?: string | null;
          deleted_at?: string | null;
          description?: string | null;
          dominant_colors?: Json | null;
          file_size?: number | null;
          filename: string;
          folder?: string | null;
          height?: number | null;
          id?: string;
          mime_type?: string | null;
          original_name: string;
          public_url: string;
          storage_path: string;
          tags?: string[] | null;
          title?: string | null;
          updated_at?: string | null;
          uploaded_by?: string | null;
          usage_count?: number | null;
          used_in?: Json | null;
          variants?: Json | null;
          width?: number | null;
        };
        Update: {
          ai_generated_alt?: string | null;
          ai_generated_tags?: string[] | null;
          alt_text?: string | null;
          aspect_ratio?: number | null;
          caption?: string | null;
          created_at?: string | null;
          deleted_at?: string | null;
          description?: string | null;
          dominant_colors?: Json | null;
          file_size?: number | null;
          filename?: string;
          folder?: string | null;
          height?: number | null;
          id?: string;
          mime_type?: string | null;
          original_name?: string;
          public_url?: string;
          storage_path?: string;
          tags?: string[] | null;
          title?: string | null;
          updated_at?: string | null;
          uploaded_by?: string | null;
          usage_count?: number | null;
          used_in?: Json | null;
          variants?: Json | null;
          width?: number | null;
        };
        Relationships: [
          {
            foreignKeyName: "media_library_uploaded_by_fkey";
            columns: ["uploaded_by"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      media_usage_log: {
        Row: {
          created_at: string | null;
          entity_id: string;
          entity_type: string;
          id: string;
          media_id: string | null;
          usage_type: string;
        };
        Insert: {
          created_at?: string | null;
          entity_id: string;
          entity_type: string;
          id?: string;
          media_id?: string | null;
          usage_type: string;
        };
        Update: {
          created_at?: string | null;
          entity_id?: string;
          entity_type?: string;
          id?: string;
          media_id?: string | null;
          usage_type?: string;
        };
        Relationships: [
          {
            foreignKeyName: "media_usage_log_media_id_fkey";
            columns: ["media_id"];
            isOneToOne: false;
            referencedRelation: "media_library";
            referencedColumns: ["id"];
          },
        ];
      };
      media_variants: {
        Row: {
          created_at: string | null;
          file_size: number | null;
          height: number | null;
          id: string;
          media_id: string | null;
          mime_type: string | null;
          storage_path: string;
          url: string;
          variant_name: string;
          width: number | null;
        };
        Insert: {
          created_at?: string | null;
          file_size?: number | null;
          height?: number | null;
          id?: string;
          media_id?: string | null;
          mime_type?: string | null;
          storage_path: string;
          url: string;
          variant_name: string;
          width?: number | null;
        };
        Update: {
          created_at?: string | null;
          file_size?: number | null;
          height?: number | null;
          id?: string;
          media_id?: string | null;
          mime_type?: string | null;
          storage_path?: string;
          url?: string;
          variant_name?: string;
          width?: number | null;
        };
        Relationships: [
          {
            foreignKeyName: "media_variants_media_id_fkey";
            columns: ["media_id"];
            isOneToOne: false;
            referencedRelation: "media_library";
            referencedColumns: ["id"];
          },
        ];
      };
      medium_craft_content: {
        Row: {
          content: string;
          created_at: string;
          id: string;
          image_id: string | null;
          medium: string;
          title: string;
          updated_at: string;
        };
        Insert: {
          content: string;
          created_at?: string;
          id?: string;
          image_id?: string | null;
          medium: string;
          title: string;
          updated_at?: string;
        };
        Update: {
          content?: string;
          created_at?: string;
          id?: string;
          image_id?: string | null;
          medium?: string;
          title?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "medium_craft_content_image_id_fkey";
            columns: ["image_id"];
            isOneToOne: false;
            referencedRelation: "media_library";
            referencedColumns: ["id"];
          },
        ];
      };
      newsletter_subscribers: {
        Row: {
          created_at: string;
          email: string | null;
          id: string;
          phone: string | null;
          source: string | null;
        };
        Insert: {
          created_at?: string;
          email?: string | null;
          id?: string;
          phone?: string | null;
          source?: string | null;
        };
        Update: {
          created_at?: string;
          email?: string | null;
          id?: string;
          phone?: string | null;
          source?: string | null;
        };
        Relationships: [];
      };
      order_items: {
        Row: {
          created_at: string;
          id: string;
          image_snapshot: string | null;
          line_total: number;
          order_id: string;
          price_snapshot: number;
          product_id: string | null;
          quantity: number;
          title_snapshot: string;
        };
        Insert: {
          created_at?: string;
          id?: string;
          image_snapshot?: string | null;
          line_total: number;
          order_id: string;
          price_snapshot: number;
          product_id?: string | null;
          quantity: number;
          title_snapshot: string;
        };
        Update: {
          created_at?: string;
          id?: string;
          image_snapshot?: string | null;
          line_total?: number;
          order_id?: string;
          price_snapshot?: number;
          product_id?: string | null;
          quantity?: number;
          title_snapshot?: string;
        };
        Relationships: [
          {
            foreignKeyName: "order_items_order_id_fkey";
            columns: ["order_id"];
            isOneToOne: false;
            referencedRelation: "orders";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "order_items_product_id_fkey";
            columns: ["product_id"];
            isOneToOne: false;
            referencedRelation: "products";
            referencedColumns: ["id"];
          },
        ];
      };
      orders: {
        Row: {
          cancelled_at: string | null;
          confirmed_at: string | null;
          coupon_code: string | null;
          created_at: string;
          currency: string;
          customer_name: string;
          delivered_at: string | null;
          discount_amount: number;
          email: string;
          gift_message: string | null;
          id: string;
          notes: string | null;
          order_number: string;
          payment_status: Database["public"]["Enums"]["payment_status"];
          phone: string;
          razorpay_order_id: string | null;
          razorpay_payment_id: string | null;
          razorpay_signature: string | null;
          shipped_at: string | null;
          shipping_address: Json;
          shipping_cost: number;
          status: Database["public"]["Enums"]["order_status"];
          subtotal: number;
          total: number;
          updated_at: string;
        };
        Insert: {
          cancelled_at?: string | null;
          confirmed_at?: string | null;
          coupon_code?: string | null;
          created_at?: string;
          currency?: string;
          customer_name: string;
          delivered_at?: string | null;
          discount_amount?: number;
          email: string;
          gift_message?: string | null;
          id?: string;
          notes?: string | null;
          order_number: string;
          payment_status?: Database["public"]["Enums"]["payment_status"];
          phone: string;
          razorpay_order_id?: string | null;
          razorpay_payment_id?: string | null;
          razorpay_signature?: string | null;
          shipped_at?: string | null;
          shipping_address: Json;
          shipping_cost?: number;
          status?: Database["public"]["Enums"]["order_status"];
          subtotal: number;
          total: number;
          updated_at?: string;
        };
        Update: {
          cancelled_at?: string | null;
          confirmed_at?: string | null;
          coupon_code?: string | null;
          created_at?: string;
          currency?: string;
          customer_name?: string;
          delivered_at?: string | null;
          discount_amount?: number;
          email?: string;
          gift_message?: string | null;
          id?: string;
          notes?: string | null;
          order_number?: string;
          payment_status?: Database["public"]["Enums"]["payment_status"];
          phone?: string;
          razorpay_order_id?: string | null;
          razorpay_payment_id?: string | null;
          razorpay_signature?: string | null;
          shipped_at?: string | null;
          shipping_address?: Json;
          shipping_cost?: number;
          status?: Database["public"]["Enums"]["order_status"];
          subtotal?: number;
          total?: number;
          updated_at?: string;
        };
        Relationships: [];
      };
      page_sections: {
        Row: {
          background_color: string | null;
          background_image_id: string | null;
          content_data: Json;
          created_at: string | null;
          custom_css: string | null;
          display_order: number | null;
          id: string;
          is_active: boolean | null;
          overlay_opacity: number | null;
          padding_bottom: number | null;
          padding_top: number | null;
          page_id: string | null;
          section_name: string;
          section_type: string;
          updated_at: string | null;
        };
        Insert: {
          background_color?: string | null;
          background_image_id?: string | null;
          content_data?: Json;
          created_at?: string | null;
          custom_css?: string | null;
          display_order?: number | null;
          id?: string;
          is_active?: boolean | null;
          overlay_opacity?: number | null;
          padding_bottom?: number | null;
          padding_top?: number | null;
          page_id?: string | null;
          section_name: string;
          section_type: string;
          updated_at?: string | null;
        };
        Update: {
          background_color?: string | null;
          background_image_id?: string | null;
          content_data?: Json;
          created_at?: string | null;
          custom_css?: string | null;
          display_order?: number | null;
          id?: string;
          is_active?: boolean | null;
          overlay_opacity?: number | null;
          padding_bottom?: number | null;
          padding_top?: number | null;
          page_id?: string | null;
          section_name?: string;
          section_type?: string;
          updated_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "page_sections_background_image_id_fkey";
            columns: ["background_image_id"];
            isOneToOne: false;
            referencedRelation: "media_library";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "page_sections_page_id_fkey";
            columns: ["page_id"];
            isOneToOne: false;
            referencedRelation: "pages";
            referencedColumns: ["id"];
          },
        ];
      };
      pages: {
        Row: {
          created_at: string | null;
          id: string;
          is_active: boolean | null;
          meta_description: string | null;
          meta_title: string | null;
          name: string;
          route: string;
          slug: string;
          updated_at: string | null;
        };
        Insert: {
          created_at?: string | null;
          id?: string;
          is_active?: boolean | null;
          meta_description?: string | null;
          meta_title?: string | null;
          name: string;
          route: string;
          slug: string;
          updated_at?: string | null;
        };
        Update: {
          created_at?: string | null;
          id?: string;
          is_active?: boolean | null;
          meta_description?: string | null;
          meta_title?: string | null;
          name?: string;
          route?: string;
          slug?: string;
          updated_at?: string | null;
        };
        Relationships: [];
      };
      product_collections: {
        Row: {
          collection_id: string;
          display_order: number;
          product_id: string;
        };
        Insert: {
          collection_id: string;
          display_order?: number;
          product_id: string;
        };
        Update: {
          collection_id?: string;
          display_order?: number;
          product_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "product_collections_collection_id_fkey";
            columns: ["collection_id"];
            isOneToOne: false;
            referencedRelation: "collections";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "product_collections_product_id_fkey";
            columns: ["product_id"];
            isOneToOne: false;
            referencedRelation: "products";
            referencedColumns: ["id"];
          },
        ];
      };
      product_gallery_images: {
        Row: {
          created_at: string;
          display_order: number;
          id: string;
          media_id: string;
          product_id: string;
        };
        Insert: {
          created_at?: string;
          display_order?: number;
          id?: string;
          media_id: string;
          product_id: string;
        };
        Update: {
          created_at?: string;
          display_order?: number;
          id?: string;
          media_id?: string;
          product_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "product_gallery_images_media_id_fkey";
            columns: ["media_id"];
            isOneToOne: false;
            referencedRelation: "media_library";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "product_gallery_images_product_id_fkey";
            columns: ["product_id"];
            isOneToOne: false;
            referencedRelation: "products";
            referencedColumns: ["id"];
          },
        ];
      };
      product_reviews: {
        Row: {
          comment: string | null;
          created_at: string;
          customer_name: string;
          id: string;
          is_approved: boolean;
          order_id: string | null;
          product_id: string;
          rating: number;
        };
        Insert: {
          comment?: string | null;
          created_at?: string;
          customer_name: string;
          id?: string;
          is_approved?: boolean;
          order_id?: string | null;
          product_id: string;
          rating: number;
        };
        Update: {
          comment?: string | null;
          created_at?: string;
          customer_name?: string;
          id?: string;
          is_approved?: boolean;
          order_id?: string | null;
          product_id?: string;
          rating?: number;
        };
        Relationships: [
          {
            foreignKeyName: "product_reviews_order_id_fkey";
            columns: ["order_id"];
            isOneToOne: false;
            referencedRelation: "orders";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "product_reviews_product_id_fkey";
            columns: ["product_id"];
            isOneToOne: false;
            referencedRelation: "products";
            referencedColumns: ["id"];
          },
        ];
      };
      products: {
        Row: {
          care_instructions: string | null;
          category_id: string | null;
          commission_similar_enabled: boolean;
          compare_at_price: number | null;
          created_at: string;
          created_by: string | null;
          currency: string;
          deleted_at: string | null;
          description: string | null;
          dimensions: string | null;
          display_order: number;
          featured: boolean;
          id: string;
          image_url: string | null;
          inventory_count: number;
          is_one_of_a_kind: boolean;
          main_image_id: string | null;
          materials_used: string | null;
          medium: string | null;
          meta_description: string | null;
          meta_title: string | null;
          price: number;
          published_at: string | null;
          show_on_homepage: boolean;
          sku: string | null;
          slug: string;
          status: Database["public"]["Enums"]["product_status"];
          summary: string | null;
          title: string;
          updated_at: string;
          updated_by: string | null;
          view_count: number;
          weight: string | null;
        };
        Insert: {
          care_instructions?: string | null;
          category_id?: string | null;
          commission_similar_enabled?: boolean;
          compare_at_price?: number | null;
          created_at?: string;
          created_by?: string | null;
          currency?: string;
          deleted_at?: string | null;
          description?: string | null;
          dimensions?: string | null;
          display_order?: number;
          featured?: boolean;
          id?: string;
          image_url?: string | null;
          inventory_count?: number;
          is_one_of_a_kind?: boolean;
          main_image_id?: string | null;
          materials_used?: string | null;
          medium?: string | null;
          meta_description?: string | null;
          meta_title?: string | null;
          price?: number;
          published_at?: string | null;
          show_on_homepage?: boolean;
          sku?: string | null;
          slug: string;
          status?: Database["public"]["Enums"]["product_status"];
          summary?: string | null;
          title: string;
          updated_at?: string;
          updated_by?: string | null;
          view_count?: number;
          weight?: string | null;
        };
        Update: {
          care_instructions?: string | null;
          category_id?: string | null;
          commission_similar_enabled?: boolean;
          compare_at_price?: number | null;
          created_at?: string;
          created_by?: string | null;
          currency?: string;
          deleted_at?: string | null;
          description?: string | null;
          dimensions?: string | null;
          display_order?: number;
          featured?: boolean;
          id?: string;
          image_url?: string | null;
          inventory_count?: number;
          is_one_of_a_kind?: boolean;
          main_image_id?: string | null;
          materials_used?: string | null;
          medium?: string | null;
          meta_description?: string | null;
          meta_title?: string | null;
          price?: number;
          published_at?: string | null;
          show_on_homepage?: boolean;
          sku?: string | null;
          slug?: string;
          status?: Database["public"]["Enums"]["product_status"];
          summary?: string | null;
          title?: string;
          updated_at?: string;
          updated_by?: string | null;
          view_count?: number;
          weight?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "products_category_id_fkey";
            columns: ["category_id"];
            isOneToOne: false;
            referencedRelation: "shop_categories";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "products_created_by_fkey";
            columns: ["created_by"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "products_main_image_id_fkey";
            columns: ["main_image_id"];
            isOneToOne: false;
            referencedRelation: "media_library";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "products_updated_by_fkey";
            columns: ["updated_by"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      profiles: {
        Row: {
          avatar_url: string | null;
          created_at: string;
          display_name: string | null;
          id: string;
          role: Database["public"]["Enums"]["user_role"];
          updated_at: string;
        };
        Insert: {
          avatar_url?: string | null;
          created_at?: string;
          display_name?: string | null;
          id: string;
          role?: Database["public"]["Enums"]["user_role"];
          updated_at?: string;
        };
        Update: {
          avatar_url?: string | null;
          created_at?: string;
          display_name?: string | null;
          id?: string;
          role?: Database["public"]["Enums"]["user_role"];
          updated_at?: string;
        };
        Relationships: [];
      };
      redirects: {
        Row: {
          created_at: string;
          from_path: string;
          id: string;
          reason: string | null;
          to_path: string;
          type: Database["public"]["Enums"]["redirect_type"];
        };
        Insert: {
          created_at?: string;
          from_path: string;
          id?: string;
          reason?: string | null;
          to_path: string;
          type?: Database["public"]["Enums"]["redirect_type"];
        };
        Update: {
          created_at?: string;
          from_path?: string;
          id?: string;
          reason?: string | null;
          to_path?: string;
          type?: Database["public"]["Enums"]["redirect_type"];
        };
        Relationships: [];
      };
      section_type_definitions: {
        Row: {
          available_fields: Json | null;
          default_config: Json | null;
          description: string | null;
          icon: string | null;
          id: string;
          is_active: boolean | null;
          name: string;
          section_type: string;
        };
        Insert: {
          available_fields?: Json | null;
          default_config?: Json | null;
          description?: string | null;
          icon?: string | null;
          id?: string;
          is_active?: boolean | null;
          name: string;
          section_type: string;
        };
        Update: {
          available_fields?: Json | null;
          default_config?: Json | null;
          description?: string | null;
          icon?: string | null;
          id?: string;
          is_active?: boolean | null;
          name?: string;
          section_type?: string;
        };
        Relationships: [];
      };
      seo_metadata: {
        Row: {
          canonical_url: string | null;
          created_at: string;
          custom_schema: Json | null;
          entity_id: string | null;
          entity_type: Database["public"]["Enums"]["seo_entity_type"];
          id: string;
          meta_description: string | null;
          meta_title: string | null;
          og_description: string | null;
          og_image_id: string | null;
          og_image_url: string | null;
          og_title: string | null;
          robots: string;
          robots_meta: string | null;
          schema_type: string | null;
          seo_score: number | null;
          structured_data: Json | null;
          twitter_card: string | null;
          twitter_description: string | null;
          twitter_image_id: string | null;
          twitter_image_url: string | null;
          twitter_title: string | null;
          updated_at: string;
          updated_by: string | null;
        };
        Insert: {
          canonical_url?: string | null;
          created_at?: string;
          custom_schema?: Json | null;
          entity_id?: string | null;
          entity_type: Database["public"]["Enums"]["seo_entity_type"];
          id?: string;
          meta_description?: string | null;
          meta_title?: string | null;
          og_description?: string | null;
          og_image_id?: string | null;
          og_image_url?: string | null;
          og_title?: string | null;
          robots?: string;
          robots_meta?: string | null;
          schema_type?: string | null;
          seo_score?: number | null;
          structured_data?: Json | null;
          twitter_card?: string | null;
          twitter_description?: string | null;
          twitter_image_id?: string | null;
          twitter_image_url?: string | null;
          twitter_title?: string | null;
          updated_at?: string;
          updated_by?: string | null;
        };
        Update: {
          canonical_url?: string | null;
          created_at?: string;
          custom_schema?: Json | null;
          entity_id?: string | null;
          entity_type?: Database["public"]["Enums"]["seo_entity_type"];
          id?: string;
          meta_description?: string | null;
          meta_title?: string | null;
          og_description?: string | null;
          og_image_id?: string | null;
          og_image_url?: string | null;
          og_title?: string | null;
          robots?: string;
          robots_meta?: string | null;
          schema_type?: string | null;
          seo_score?: number | null;
          structured_data?: Json | null;
          twitter_card?: string | null;
          twitter_description?: string | null;
          twitter_image_id?: string | null;
          twitter_image_url?: string | null;
          twitter_title?: string | null;
          updated_at?: string;
          updated_by?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "seo_metadata_og_image_id_fkey";
            columns: ["og_image_id"];
            isOneToOne: false;
            referencedRelation: "media_library";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "seo_metadata_twitter_image_id_fkey";
            columns: ["twitter_image_id"];
            isOneToOne: false;
            referencedRelation: "media_library";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "seo_metadata_updated_by_fkey";
            columns: ["updated_by"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      seo_page_inventory: {
        Row: {
          created_at: string | null;
          has_seo_metadata: boolean | null;
          id: string;
          last_checked_at: string | null;
          page_id: string | null;
          page_title: string | null;
          page_type: string;
          page_url: string;
        };
        Insert: {
          created_at?: string | null;
          has_seo_metadata?: boolean | null;
          id?: string;
          last_checked_at?: string | null;
          page_id?: string | null;
          page_title?: string | null;
          page_type: string;
          page_url: string;
        };
        Update: {
          created_at?: string | null;
          has_seo_metadata?: boolean | null;
          id?: string;
          last_checked_at?: string | null;
          page_id?: string | null;
          page_title?: string | null;
          page_type?: string;
          page_url?: string;
        };
        Relationships: [];
      };
      shop_categories: {
        Row: {
          created_at: string;
          deleted_at: string | null;
          display_order: number;
          id: string;
          image_url: string | null;
          is_active: boolean;
          name: string;
          short_summary: string | null;
          slug: string;
          updated_at: string;
        };
        Insert: {
          created_at?: string;
          deleted_at?: string | null;
          display_order?: number;
          id?: string;
          image_url?: string | null;
          is_active?: boolean;
          name: string;
          short_summary?: string | null;
          slug: string;
          updated_at?: string;
        };
        Update: {
          created_at?: string;
          deleted_at?: string | null;
          display_order?: number;
          id?: string;
          image_url?: string | null;
          is_active?: boolean;
          name?: string;
          short_summary?: string | null;
          slug?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      sitemap_entries: {
        Row: {
          changefreq: string | null;
          created_at: string | null;
          id: string;
          lastmod: string | null;
          priority: number | null;
          sitemap_type: string | null;
          status: string | null;
          updated_at: string | null;
          url: string;
        };
        Insert: {
          changefreq?: string | null;
          created_at?: string | null;
          id?: string;
          lastmod?: string | null;
          priority?: number | null;
          sitemap_type?: string | null;
          status?: string | null;
          updated_at?: string | null;
          url: string;
        };
        Update: {
          changefreq?: string | null;
          created_at?: string | null;
          id?: string;
          lastmod?: string | null;
          priority?: number | null;
          sitemap_type?: string | null;
          status?: string | null;
          updated_at?: string | null;
          url?: string;
        };
        Relationships: [];
      };
      tags: {
        Row: {
          created_at: string;
          id: string;
          name: string;
          slug: string;
        };
        Insert: {
          created_at?: string;
          id?: string;
          name: string;
          slug: string;
        };
        Update: {
          created_at?: string;
          id?: string;
          name?: string;
          slug?: string;
        };
        Relationships: [];
      };
      visual_asset_usage_log: {
        Row: {
          asset_id: string | null;
          created_at: string | null;
          entity_id: string;
          entity_type: string;
          id: string;
          opacity: number | null;
          usage_type: string;
        };
        Insert: {
          asset_id?: string | null;
          created_at?: string | null;
          entity_id: string;
          entity_type: string;
          id?: string;
          opacity?: number | null;
          usage_type: string;
        };
        Update: {
          asset_id?: string | null;
          created_at?: string | null;
          entity_id?: string;
          entity_type?: string;
          id?: string;
          opacity?: number | null;
          usage_type?: string;
        };
        Relationships: [
          {
            foreignKeyName: "visual_asset_usage_log_asset_id_fkey";
            columns: ["asset_id"];
            isOneToOne: false;
            referencedRelation: "visual_assets";
            referencedColumns: ["id"];
          },
        ];
      };
      visual_assets: {
        Row: {
          asset_type: string;
          category_suggestions: string[] | null;
          created_at: string | null;
          default_opacity: number | null;
          description: string | null;
          file_size: number | null;
          height: number | null;
          id: string;
          is_active: boolean | null;
          is_predefined: boolean | null;
          mime_type: string | null;
          name: string;
          preview_url: string | null;
          public_url: string;
          slug: string;
          storage_path: string;
          updated_at: string | null;
          usage_count: number | null;
          width: number | null;
        };
        Insert: {
          asset_type: string;
          category_suggestions?: string[] | null;
          created_at?: string | null;
          default_opacity?: number | null;
          description?: string | null;
          file_size?: number | null;
          height?: number | null;
          id?: string;
          is_active?: boolean | null;
          is_predefined?: boolean | null;
          mime_type?: string | null;
          name: string;
          preview_url?: string | null;
          public_url: string;
          slug: string;
          storage_path: string;
          updated_at?: string | null;
          usage_count?: number | null;
          width?: number | null;
        };
        Update: {
          asset_type?: string;
          category_suggestions?: string[] | null;
          created_at?: string | null;
          default_opacity?: number | null;
          description?: string | null;
          file_size?: number | null;
          height?: number | null;
          id?: string;
          is_active?: boolean | null;
          is_predefined?: boolean | null;
          mime_type?: string | null;
          name?: string;
          preview_url?: string | null;
          public_url?: string;
          slug?: string;
          storage_path?: string;
          updated_at?: string | null;
          usage_count?: number | null;
          width?: number | null;
        };
        Relationships: [];
      };
      website_content: {
        Row: {
          content_key: string;
          created_at: string | null;
          description: string | null;
          field_name: string;
          field_type: string | null;
          id: string;
          is_active: boolean | null;
          is_required: boolean | null;
          page: string;
          placeholder: string | null;
          section: string;
          updated_at: string | null;
          value_html: string | null;
          value_json: Json | null;
          value_media_id: string | null;
          value_text: string | null;
        };
        Insert: {
          content_key: string;
          created_at?: string | null;
          description?: string | null;
          field_name: string;
          field_type?: string | null;
          id?: string;
          is_active?: boolean | null;
          is_required?: boolean | null;
          page: string;
          placeholder?: string | null;
          section: string;
          updated_at?: string | null;
          value_html?: string | null;
          value_json?: Json | null;
          value_media_id?: string | null;
          value_text?: string | null;
        };
        Update: {
          content_key?: string;
          created_at?: string | null;
          description?: string | null;
          field_name?: string;
          field_type?: string | null;
          id?: string;
          is_active?: boolean | null;
          is_required?: boolean | null;
          page?: string;
          placeholder?: string | null;
          section?: string;
          updated_at?: string | null;
          value_html?: string | null;
          value_json?: Json | null;
          value_media_id?: string | null;
          value_text?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "website_content_value_media_id_fkey";
            columns: ["value_media_id"];
            isOneToOne: false;
            referencedRelation: "media_library";
            referencedColumns: ["id"];
          },
        ];
      };
      website_content_repeater_items: {
        Row: {
          created_at: string | null;
          display_order: number | null;
          id: string;
          item_data: Json;
          parent_key: string;
        };
        Insert: {
          created_at?: string | null;
          display_order?: number | null;
          id?: string;
          item_data: Json;
          parent_key: string;
        };
        Update: {
          created_at?: string | null;
          display_order?: number | null;
          id?: string;
          item_data?: Json;
          parent_key?: string;
        };
        Relationships: [];
      };
      whatsapp_click_daily_rollup: {
        Row: {
          by_category: Json | null;
          by_cta_type: Json | null;
          by_page: Json | null;
          created_at: string | null;
          date: string;
          total_clicks: number | null;
          unique_visitors: number | null;
        };
        Insert: {
          by_category?: Json | null;
          by_cta_type?: Json | null;
          by_page?: Json | null;
          created_at?: string | null;
          date: string;
          total_clicks?: number | null;
          unique_visitors?: number | null;
        };
        Update: {
          by_category?: Json | null;
          by_cta_type?: Json | null;
          by_page?: Json | null;
          created_at?: string | null;
          date?: string;
          total_clicks?: number | null;
          unique_visitors?: number | null;
        };
        Relationships: [];
      };
      whatsapp_clicks: {
        Row: {
          artwork_id: string | null;
          category_id: string | null;
          city: string | null;
          clicked_at: string | null;
          country: string | null;
          cta_type: string;
          id: string;
          ip_address: string | null;
          page_path: string | null;
          page_url: string | null;
          user_agent: string | null;
          visitor_id: string | null;
        };
        Insert: {
          artwork_id?: string | null;
          category_id?: string | null;
          city?: string | null;
          clicked_at?: string | null;
          country?: string | null;
          cta_type: string;
          id?: string;
          ip_address?: string | null;
          page_path?: string | null;
          page_url?: string | null;
          user_agent?: string | null;
          visitor_id?: string | null;
        };
        Update: {
          artwork_id?: string | null;
          category_id?: string | null;
          city?: string | null;
          clicked_at?: string | null;
          country?: string | null;
          cta_type?: string;
          id?: string;
          ip_address?: string | null;
          page_path?: string | null;
          page_url?: string | null;
          user_agent?: string | null;
          visitor_id?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "whatsapp_clicks_artwork_id_fkey";
            columns: ["artwork_id"];
            isOneToOne: false;
            referencedRelation: "artworks";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "whatsapp_clicks_category_id_fkey";
            columns: ["category_id"];
            isOneToOne: false;
            referencedRelation: "categories";
            referencedColumns: ["id"];
          },
        ];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      deduct_product_inventory: {
        Args: { p_product_id: string; p_quantity: number };
        Returns: undefined;
      };
      generate_lead_number: { Args: never; Returns: string };
      generate_order_number: { Args: never; Returns: string };
      is_admin: { Args: never; Returns: boolean };
      is_admin_user: { Args: { user_id: string }; Returns: boolean };
      show_limit: { Args: never; Returns: number };
      show_trgm: { Args: { "": string }; Returns: string[] };
    };
    Enums: {
      artwork_status: "draft" | "published" | "archived";
      artwork_type: "original" | "print" | "digital" | "commission";
      commission_status: "open" | "closed" | "waitlist";
      faq_entity_type: "artwork" | "category" | "global";
      order_status:
        | "pending"
        | "payment_failed"
        | "confirmed"
        | "processing"
        | "shipped"
        | "delivered"
        | "cancelled"
        | "refunded";
      payment_status: "pending" | "paid" | "failed" | "refunded" | "partially_refunded";
      product_status: "draft" | "published" | "sold_out" | "archived";
      redirect_type: "301" | "302";
      request_status: "pending" | "contacted" | "quoted" | "accepted" | "completed" | "rejected";
      seo_entity_type: "site" | "artwork" | "category" | "tag" | "page";
      user_role: "admin" | "customer";
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">;

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">];

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] & DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R;
      }
      ? R
      : never
    : never;

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I;
      }
      ? I
      : never
    : never;

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U;
      }
      ? U
      : never
    : never;

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never;

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never;

export const Constants = {
  public: {
    Enums: {
      artwork_status: ["draft", "published", "archived"],
      artwork_type: ["original", "print", "digital", "commission"],
      commission_status: ["open", "closed", "waitlist"],
      faq_entity_type: ["artwork", "category", "global"],
      order_status: [
        "pending",
        "payment_failed",
        "confirmed",
        "processing",
        "shipped",
        "delivered",
        "cancelled",
        "refunded",
      ],
      payment_status: ["pending", "paid", "failed", "refunded", "partially_refunded"],
      product_status: ["draft", "published", "sold_out", "archived"],
      redirect_type: ["301", "302"],
      request_status: ["pending", "contacted", "quoted", "accepted", "completed", "rejected"],
      seo_entity_type: ["site", "artwork", "category", "tag", "page"],
      user_role: ["admin", "customer"],
    },
  },
} as const;
