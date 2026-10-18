export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type Database = {
  public: {
    Tables: {
      clients: {
        Row: {
          billing_address: string | null;
          company_address: string | null;
          company_name: string;
          contact_first_name: string | null;
          contact_last_name: string | null;
          contact_name: string | null;
          email: string | null;
          first_name: string | null;
          id: string;
          is_approved: boolean;
          last_name: string | null;
          phone_number: string | null;
          user_id: string | null;
        };
        Insert: {
          billing_address?: string | null;
          company_address?: string | null;
          company_name: string;
          contact_first_name?: string | null;
          contact_last_name?: string | null;
          contact_name?: string | null;
          email?: string | null;
          first_name?: string | null;
          id?: string;
          is_approved?: boolean;
          last_name?: string | null;
          phone_number?: string | null;
          user_id?: string | null;
        };
        Update: {
          billing_address?: string | null;
          company_address?: string | null;
          company_name?: string;
          contact_first_name?: string | null;
          contact_last_name?: string | null;
          contact_name?: string | null;
          email?: string | null;
          first_name?: string | null;
          id?: string;
          is_approved?: boolean;
          last_name?: string | null;
          phone_number?: string | null;
          user_id?: string | null;
        };
        Relationships: [];
      };
      profiles: {
        Row: {
          email: string | null;
          full_name: string | null;
          id: string;
          role: string;
        };
        Insert: {
          email?: string | null;
          full_name?: string | null;
          id: string;
          role?: string;
        };
        Update: {
          email?: string | null;
          full_name?: string | null;
          id?: string;
          role?: string;
        };
        Relationships: [];
      };
      tasks: {
        Row: {
          client: string | null;
          client_id: string | null;
          company_name: string | null;
          contact_first_name: string | null;
          contact_last_name: string | null;
          credit_note_file_url: string | null;
          email: string | null;
          gallery_link: string | null;
          google_drive_link: string | null;
          id: string;
          invoice_date: string | null;
          invoice_paid: boolean;
          lexoffice_document_file_id: string | null;
          lexoffice_invoice_id: string | null;
          photoshoot_date: string | null;
          photoshoot_time: string | null;
          photoshoot_type: string | null;
          shoot_location: string | null;
          status: string;
          title: string;
        };
        Insert: {
          client?: string | null;
          client_id?: string | null;
          company_name?: string | null;
          contact_first_name?: string | null;
          contact_last_name?: string | null;
          credit_note_file_url?: string | null;
          email?: string | null;
          gallery_link?: string | null;
          google_drive_link?: string | null;
          id?: string;
          invoice_date?: string | null;
          invoice_paid?: boolean;
          lexoffice_document_file_id?: string | null;
          lexoffice_invoice_id?: string | null;
          photoshoot_date?: string | null;
          photoshoot_time?: string | null;
          photoshoot_type?: string | null;
          shoot_location?: string | null;
          status: string;
          title: string;
        };
        Update: {
          client?: string | null;
          client_id?: string | null;
          company_name?: string | null;
          credit_note_file_url?: string | null;
          gallery_link?: string | null;
          google_drive_link?: string | null;
          invoice_date?: string | null;
          invoice_paid?: boolean;
          lexoffice_document_file_id?: string | null;
          lexoffice_invoice_id?: string | null;
          status?: string;
          title?: string;
        };
        Relationships: [];
      };
      bookings: {
        Row: {
          created_at: string;
          id: string;
          location_address: string;
          property_status: string;
          requested_date: string;
          requested_time: string;
          user_id: string;
        };
        Insert: {
          created_at?: string;
          id?: string;
          location_address: string;
          property_status: string;
          requested_date: string;
          requested_time: string;
          user_id: string;
        };
        Update: {
          created_at?: string;
          id?: string;
          location_address?: string;
          property_status?: string;
          requested_date?: string;
          requested_time?: string;
          user_id?: string;
        };
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};
