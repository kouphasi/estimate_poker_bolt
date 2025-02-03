export interface Database {
  public: {
    Tables: {
      projects: {
        Row: {
          id: string;
          name: string;
          description: string | null;
          created_at: string;
          user_id: string;
          is_completed: boolean;
          final_estimation: number | null;
        };
        Insert: {
          id?: string;
          name: string;
          description?: string | null;
          created_at?: string;
          user_id: string;
          is_completed?: boolean;
          final_estimation?: number | null;
        };
        Update: {
          id?: string;
          name?: string;
          description?: string | null;
          created_at?: string;
          user_id?: string;
          is_completed?: boolean;
          final_estimation?: number | null;
        };
      };
      tasks: {
        Row: {
          id: string;
          project_id: string;
          name: string;
          description: string | null;
          created_at: string;
          is_completed: boolean;
          final_estimation: number | null;
          show_estimations: boolean;
          estimation_url: string;
        };
        Insert: {
          id?: string;
          project_id: string;
          name: string;
          description?: string | null;
          created_at?: string;
          is_completed?: boolean;
          final_estimation?: number | null;
          show_estimations?: boolean;
          estimation_url?: string;
        };
        Update: {
          id?: string;
          project_id?: string;
          name?: string;
          description?: string | null;
          created_at?: string;
          is_completed?: boolean;
          final_estimation?: number | null;
          show_estimations?: boolean;
          estimation_url?: string;
        };
      };
      estimations: {
        Row: {
          id: string;
          task_id: string;
          user_id: string;
          estimation: number;
          created_at: string;
          is_custom: boolean;
        };
        Insert: {
          id?: string;
          task_id: string;
          user_id: string;
          estimation: number;
          created_at?: string;
          is_custom?: boolean;
        };
        Update: {
          id?: string;
          task_id?: string;
          user_id?: string;
          estimation?: number;
          created_at?: string;
          is_custom?: boolean;
        };
      };
    };
  };
}