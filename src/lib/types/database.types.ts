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
      criterion_signals: {
        Row: {
          criterion_idx: number | null
          criterion_txt: string | null
          id: number
          signal: string | null
          submission_id: number | null
        }
        Insert: {
          criterion_idx?: number | null
          criterion_txt?: string | null
          id?: never
          signal?: string | null
          submission_id?: number | null
        }
        Update: {
          criterion_idx?: number | null
          criterion_txt?: string | null
          id?: never
          signal?: string | null
          submission_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "criterion_signals_submission_id_fkey"
            columns: ["submission_id"]
            isOneToOne: false
            referencedRelation: "submissions"
            referencedColumns: ["id"]
          },
        ]
      }
      question_answers: {
        Row: {
          answer: string
          created_at: string
          id: number
          question_idx: number
          session_id: number
          student_id: string
          updated_at: string
        }
        Insert: {
          answer: string
          created_at?: string
          id?: never
          question_idx: number
          session_id: number
          student_id: string
          updated_at?: string
        }
        Update: {
          answer?: string
          created_at?: string
          id?: never
          question_idx?: number
          session_id?: number
          student_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "question_answers_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "question_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      question_sessions: {
        Row: {
          class_label: string | null
          created_at: string
          fingerprint: string
          id: number
          question_count: number
          session_code: string
          title: string
          user_id: string
        }
        Insert: {
          class_label?: string | null
          created_at?: string
          fingerprint: string
          id?: never
          question_count: number
          session_code: string
          title: string
          user_id: string
        }
        Update: {
          class_label?: string | null
          created_at?: string
          fingerprint?: string
          id?: never
          question_count?: number
          session_code?: string
          title?: string
          user_id?: string
        }
        Relationships: []
      }
      session_questions: {
        Row: {
          correct: string | null
          criteria: Json | null
          id: number
          idx: number
          options: Json | null
          session_id: number
          stem: string
          type: string
        }
        Insert: {
          correct?: string | null
          criteria?: Json | null
          id?: never
          idx: number
          options?: Json | null
          session_id: number
          stem: string
          type: string
        }
        Update: {
          correct?: string | null
          criteria?: Json | null
          id?: never
          idx?: number
          options?: Json | null
          session_id?: number
          stem?: string
          type?: string
        }
        Relationships: [
          {
            foreignKeyName: "session_questions_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "question_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      sessions: {
        Row: {
          created_at: string | null
          id: number
          label: string | null
          node_id: string | null
          node_label: string | null
          session_code: string
          standard: string | null
          user_id: string | null
          y_goal: string | null
        }
        Insert: {
          created_at?: string | null
          id?: never
          label?: string | null
          node_id?: string | null
          node_label?: string | null
          session_code: string
          standard?: string | null
          user_id?: string | null
          y_goal?: string | null
        }
        Update: {
          created_at?: string | null
          id?: never
          label?: string | null
          node_id?: string | null
          node_label?: string | null
          session_code?: string
          standard?: string | null
          user_id?: string | null
          y_goal?: string | null
        }
        Relationships: []
      }
      submissions: {
        Row: {
          created_at: string | null
          id: number
          node_id: string | null
          node_label: string | null
          session_code: string
          standard: string | null
          student_id: string
          y_goal_signal: string | null
        }
        Insert: {
          created_at?: string | null
          id?: never
          node_id?: string | null
          node_label?: string | null
          session_code: string
          standard?: string | null
          student_id: string
          y_goal_signal?: string | null
        }
        Update: {
          created_at?: string | null
          id?: never
          node_id?: string | null
          node_label?: string | null
          session_code?: string
          standard?: string | null
          student_id?: string
          y_goal_signal?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      create_question_session: {
        Args: { class_label?: string; payload: Json }
        Returns: {
          code: string
          fingerprint: string
        }[]
      }
      generate_unique_session_code: { Args: never; Returns: string }
      get_session_aggregate: {
        Args: { code: string; idx?: number }
        Returns: {
          counts: Json
          question_idx: number
          responses: number
          type: string
        }[]
      }
      get_session_questions: {
        Args: { code: string }
        Returns: {
          criteria: Json
          idx: number
          options: Json
          stem: string
          type: string
        }[]
      }
      submit_answer: {
        Args: {
          answer: string
          code: string
          question_idx: number
          student_id: string
        }
        Returns: undefined
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
    Enums: {},
  },
} as const
