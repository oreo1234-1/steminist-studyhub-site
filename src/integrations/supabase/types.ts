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
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      badges: {
        Row: {
          created_at: string | null
          description: string | null
          icon: string | null
          id: string
          name: string
          points_required: number | null
          rarity: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          icon?: string | null
          id?: string
          name: string
          points_required?: number | null
          rarity?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          icon?: string | null
          id?: string
          name?: string
          points_required?: number | null
          rarity?: string | null
        }
        Relationships: []
      }
      challenge_participants: {
        Row: {
          challenge_id: string
          completed: boolean
          joined_at: string
          progress: number
          user_id: string
        }
        Insert: {
          challenge_id: string
          completed?: boolean
          joined_at?: string
          progress?: number
          user_id: string
        }
        Update: {
          challenge_id?: string
          completed?: boolean
          joined_at?: string
          progress?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "challenge_participants_challenge_id_fkey"
            columns: ["challenge_id"]
            isOneToOne: false
            referencedRelation: "group_challenges"
            referencedColumns: ["id"]
          },
        ]
      }
      challenge_submissions: {
        Row: {
          challenge_id: string
          challenge_type: string
          created_at: string
          description: string
          file_urls: string[] | null
          id: string
          project_links: string[] | null
          status: string
          submitted_at: string | null
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          challenge_id: string
          challenge_type: string
          created_at?: string
          description: string
          file_urls?: string[] | null
          id?: string
          project_links?: string[] | null
          status?: string
          submitted_at?: string | null
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          challenge_id?: string
          challenge_type?: string
          created_at?: string
          description?: string
          file_urls?: string[] | null
          id?: string
          project_links?: string[] | null
          status?: string
          submitted_at?: string | null
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      event_registrations: {
        Row: {
          attended: boolean | null
          event_id: string
          id: string
          registered_at: string | null
          user_id: string
        }
        Insert: {
          attended?: boolean | null
          event_id: string
          id?: string
          registered_at?: string | null
          user_id: string
        }
        Update: {
          attended?: boolean | null
          event_id?: string
          id?: string
          registered_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "event_registrations_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
        ]
      }
      events: {
        Row: {
          created_at: string | null
          created_by: string | null
          current_attendees: number | null
          date: string
          description: string | null
          duration: string | null
          end_time: string | null
          event_type: string
          id: string
          location: string | null
          max_attendees: number | null
          meeting_link: string | null
          skills: string[] | null
          speakers: string[] | null
          tags: string[] | null
          title: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          current_attendees?: number | null
          date: string
          description?: string | null
          duration?: string | null
          end_time?: string | null
          event_type?: string
          id?: string
          location?: string | null
          max_attendees?: number | null
          meeting_link?: string | null
          skills?: string[] | null
          speakers?: string[] | null
          tags?: string[] | null
          title: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          current_attendees?: number | null
          date?: string
          description?: string | null
          duration?: string | null
          end_time?: string | null
          event_type?: string
          id?: string
          location?: string | null
          max_attendees?: number | null
          meeting_link?: string | null
          skills?: string[] | null
          speakers?: string[] | null
          tags?: string[] | null
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      forum_comments: {
        Row: {
          author_id: string | null
          content: string
          created_at: string | null
          id: string
          post_id: string | null
          upvotes_count: number | null
        }
        Insert: {
          author_id?: string | null
          content: string
          created_at?: string | null
          id?: string
          post_id?: string | null
          upvotes_count?: number | null
        }
        Update: {
          author_id?: string | null
          content?: string
          created_at?: string | null
          id?: string
          post_id?: string | null
          upvotes_count?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "forum_comments_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "forum_posts"
            referencedColumns: ["id"]
          },
        ]
      }
      forum_posts: {
        Row: {
          author_id: string | null
          category: string
          comments_count: number | null
          content: string
          created_at: string | null
          id: string
          is_pinned: boolean | null
          tags: string[] | null
          title: string
          updated_at: string | null
          upvotes_count: number | null
        }
        Insert: {
          author_id?: string | null
          category: string
          comments_count?: number | null
          content: string
          created_at?: string | null
          id?: string
          is_pinned?: boolean | null
          tags?: string[] | null
          title: string
          updated_at?: string | null
          upvotes_count?: number | null
        }
        Update: {
          author_id?: string | null
          category?: string
          comments_count?: number | null
          content?: string
          created_at?: string | null
          id?: string
          is_pinned?: boolean | null
          tags?: string[] | null
          title?: string
          updated_at?: string | null
          upvotes_count?: number | null
        }
        Relationships: []
      }
      forum_votes: {
        Row: {
          comment_id: string | null
          created_at: string | null
          id: string
          post_id: string | null
          user_id: string | null
          vote_type: string | null
        }
        Insert: {
          comment_id?: string | null
          created_at?: string | null
          id?: string
          post_id?: string | null
          user_id?: string | null
          vote_type?: string | null
        }
        Update: {
          comment_id?: string | null
          created_at?: string | null
          id?: string
          post_id?: string | null
          user_id?: string | null
          vote_type?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "forum_votes_comment_id_fkey"
            columns: ["comment_id"]
            isOneToOne: false
            referencedRelation: "forum_comments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "forum_votes_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "forum_posts"
            referencedColumns: ["id"]
          },
        ]
      }
      group_challenges: {
        Row: {
          created_at: string
          description: string | null
          ends_at: string | null
          group_id: string
          id: string
          points_reward: number
          starts_at: string | null
          title: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          ends_at?: string | null
          group_id: string
          id?: string
          points_reward?: number
          starts_at?: string | null
          title: string
        }
        Update: {
          created_at?: string
          description?: string | null
          ends_at?: string | null
          group_id?: string
          id?: string
          points_reward?: number
          starts_at?: string | null
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "group_challenges_group_id_fkey"
            columns: ["group_id"]
            isOneToOne: false
            referencedRelation: "study_groups"
            referencedColumns: ["id"]
          },
        ]
      }
      group_members: {
        Row: {
          group_id: string
          joined_at: string
          role: string
          user_id: string
        }
        Insert: {
          group_id: string
          joined_at?: string
          role?: string
          user_id: string
        }
        Update: {
          group_id?: string
          joined_at?: string
          role?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "group_members_group_id_fkey"
            columns: ["group_id"]
            isOneToOne: false
            referencedRelation: "study_groups"
            referencedColumns: ["id"]
          },
        ]
      }
      leadership_applications: {
        Row: {
          created_at: string | null
          id: string
          position: string
          reviewed_at: string | null
          reviewer_notes: string | null
          statement: string
          status: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          position: string
          reviewed_at?: string | null
          reviewer_notes?: string | null
          statement: string
          status?: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          position?: string
          reviewed_at?: string | null
          reviewer_notes?: string | null
          statement?: string
          status?: string
          user_id?: string
        }
        Relationships: []
      }
      mentors: {
        Row: {
          category: string
          created_at: string | null
          description: string | null
          expertise: string
          id: string
          is_active: boolean | null
          name: string
          type_label: string | null
          user_id: string | null
          year_or_experience: string | null
        }
        Insert: {
          category?: string
          created_at?: string | null
          description?: string | null
          expertise: string
          id?: string
          is_active?: boolean | null
          name: string
          type_label?: string | null
          user_id?: string | null
          year_or_experience?: string | null
        }
        Update: {
          category?: string
          created_at?: string | null
          description?: string | null
          expertise?: string
          id?: string
          is_active?: boolean | null
          name?: string
          type_label?: string | null
          user_id?: string | null
          year_or_experience?: string | null
        }
        Relationships: []
      }
      mentorship_requests: {
        Row: {
          created_at: string | null
          id: string
          mentor_id: string
          message: string | null
          status: string
          student_id: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          mentor_id: string
          message?: string | null
          status?: string
          student_id: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          mentor_id?: string
          message?: string | null
          status?: string
          student_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "mentorship_requests_mentor_id_fkey"
            columns: ["mentor_id"]
            isOneToOne: false
            referencedRelation: "mentors"
            referencedColumns: ["id"]
          },
        ]
      }
      newsletter_subscribers: {
        Row: {
          email: string
          full_name: string | null
          id: string
          is_active: boolean | null
          subscribed_at: string | null
        }
        Insert: {
          email: string
          full_name?: string | null
          id?: string
          is_active?: boolean | null
          subscribed_at?: string | null
        }
        Update: {
          email?: string
          full_name?: string | null
          id?: string
          is_active?: boolean | null
          subscribed_at?: string | null
        }
        Relationships: []
      }
      opportunities: {
        Row: {
          amount: string | null
          created_at: string | null
          deadline: string | null
          description: string | null
          eligibility: string[] | null
          external_url: string | null
          id: string
          is_featured: boolean | null
          organization: string | null
          tags: string[] | null
          title: string
          type: string
        }
        Insert: {
          amount?: string | null
          created_at?: string | null
          deadline?: string | null
          description?: string | null
          eligibility?: string[] | null
          external_url?: string | null
          id?: string
          is_featured?: boolean | null
          organization?: string | null
          tags?: string[] | null
          title: string
          type: string
        }
        Update: {
          amount?: string | null
          created_at?: string | null
          deadline?: string | null
          description?: string | null
          eligibility?: string[] | null
          external_url?: string | null
          id?: string
          is_featured?: boolean | null
          organization?: string | null
          tags?: string[] | null
          title?: string
          type?: string
        }
        Relationships: []
      }
      pomodoro_sessions: {
        Row: {
          completed: boolean
          created_at: string
          duration_minutes: number | null
          ended_at: string | null
          id: string
          mode: string
          started_at: string
          user_id: string
        }
        Insert: {
          completed?: boolean
          created_at?: string
          duration_minutes?: number | null
          ended_at?: string | null
          id?: string
          mode: string
          started_at: string
          user_id: string
        }
        Update: {
          completed?: boolean
          created_at?: string
          duration_minutes?: number | null
          ended_at?: string | null
          id?: string
          mode?: string
          started_at?: string
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          bio: string | null
          created_at: string | null
          email: string
          full_name: string | null
          id: string
          interests: string[] | null
          portfolio_data: Json | null
          role: Database["public"]["Enums"]["app_role"] | null
          stem_goals: string | null
          updated_at: string | null
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string | null
          email: string
          full_name?: string | null
          id: string
          interests?: string[] | null
          portfolio_data?: Json | null
          role?: Database["public"]["Enums"]["app_role"] | null
          stem_goals?: string | null
          updated_at?: string | null
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string | null
          email?: string
          full_name?: string | null
          id?: string
          interests?: string[] | null
          portfolio_data?: Json | null
          role?: Database["public"]["Enums"]["app_role"] | null
          stem_goals?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      quizzes: {
        Row: {
          created_at: string | null
          created_by: string | null
          description: string | null
          difficulty_level: string | null
          id: string
          passing_score: number | null
          questions: Json
          subject: string
          title: string
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          difficulty_level?: string | null
          id?: string
          passing_score?: number | null
          questions: Json
          subject: string
          title: string
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          difficulty_level?: string | null
          id?: string
          passing_score?: number | null
          questions?: Json
          subject?: string
          title?: string
        }
        Relationships: []
      }
      resources: {
        Row: {
          category: string
          created_at: string | null
          description: string | null
          downloads_count: number | null
          external_url: string | null
          file_url: string | null
          id: string
          is_approved: boolean | null
          level: string | null
          question_count: number | null
          subject: string | null
          tags: string[] | null
          title: string
          uploaded_by: string | null
        }
        Insert: {
          category?: string
          created_at?: string | null
          description?: string | null
          downloads_count?: number | null
          external_url?: string | null
          file_url?: string | null
          id?: string
          is_approved?: boolean | null
          level?: string | null
          question_count?: number | null
          subject?: string | null
          tags?: string[] | null
          title: string
          uploaded_by?: string | null
        }
        Update: {
          category?: string
          created_at?: string | null
          description?: string | null
          downloads_count?: number | null
          external_url?: string | null
          file_url?: string | null
          id?: string
          is_approved?: boolean | null
          level?: string | null
          question_count?: number | null
          subject?: string | null
          tags?: string[] | null
          title?: string
          uploaded_by?: string | null
        }
        Relationships: []
      }
      study_groups: {
        Row: {
          created_at: string
          description: string | null
          id: string
          is_public: boolean
          name: string
          owner_id: string
          subject: string | null
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          is_public?: boolean
          name: string
          owner_id: string
          subject?: string | null
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          is_public?: boolean
          name?: string
          owner_id?: string
          subject?: string | null
        }
        Relationships: []
      }
      study_materials: {
        Row: {
          created_at: string | null
          description: string | null
          difficulty_level: string | null
          downloads_count: number | null
          file_type: string | null
          file_url: string | null
          id: string
          is_approved: boolean | null
          subject: string
          tags: string[] | null
          title: string
          uploaded_by: string | null
          views_count: number | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          difficulty_level?: string | null
          downloads_count?: number | null
          file_type?: string | null
          file_url?: string | null
          id?: string
          is_approved?: boolean | null
          subject: string
          tags?: string[] | null
          title: string
          uploaded_by?: string | null
          views_count?: number | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          difficulty_level?: string | null
          downloads_count?: number | null
          file_type?: string | null
          file_url?: string | null
          id?: string
          is_approved?: boolean | null
          subject?: string
          tags?: string[] | null
          title?: string
          uploaded_by?: string | null
          views_count?: number | null
        }
        Relationships: []
      }
      submission_feedback: {
        Row: {
          created_at: string
          feedback_text: string
          id: string
          improvements: string[] | null
          mentor_id: string
          rating: number | null
          strengths: string[] | null
          submission_id: string
        }
        Insert: {
          created_at?: string
          feedback_text: string
          id?: string
          improvements?: string[] | null
          mentor_id: string
          rating?: number | null
          strengths?: string[] | null
          submission_id: string
        }
        Update: {
          created_at?: string
          feedback_text?: string
          id?: string
          improvements?: string[] | null
          mentor_id?: string
          rating?: number | null
          strengths?: string[] | null
          submission_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "submission_feedback_submission_id_fkey"
            columns: ["submission_id"]
            isOneToOne: false
            referencedRelation: "challenge_submissions"
            referencedColumns: ["id"]
          },
        ]
      }
      user_activity: {
        Row: {
          activity_type: string
          created_at: string | null
          id: string
          metadata: Json | null
          points_earned: number | null
          user_id: string | null
        }
        Insert: {
          activity_type: string
          created_at?: string | null
          id?: string
          metadata?: Json | null
          points_earned?: number | null
          user_id?: string | null
        }
        Update: {
          activity_type?: string
          created_at?: string | null
          id?: string
          metadata?: Json | null
          points_earned?: number | null
          user_id?: string | null
        }
        Relationships: []
      }
      user_badges: {
        Row: {
          badge_id: string | null
          earned_at: string | null
          id: string
          user_id: string | null
        }
        Insert: {
          badge_id?: string | null
          earned_at?: string | null
          id?: string
          user_id?: string | null
        }
        Update: {
          badge_id?: string | null
          earned_at?: string | null
          id?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_badges_badge_id_fkey"
            columns: ["badge_id"]
            isOneToOne: false
            referencedRelation: "badges"
            referencedColumns: ["id"]
          },
        ]
      }
      user_bookmarks: {
        Row: {
          bookmarked_at: string | null
          id: string
          opportunity_id: string | null
          user_id: string | null
        }
        Insert: {
          bookmarked_at?: string | null
          id?: string
          opportunity_id?: string | null
          user_id?: string | null
        }
        Update: {
          bookmarked_at?: string | null
          id?: string
          opportunity_id?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_bookmarks_opportunity_id_fkey"
            columns: ["opportunity_id"]
            isOneToOne: false
            referencedRelation: "opportunities"
            referencedColumns: ["id"]
          },
        ]
      }
      user_points: {
        Row: {
          current_level: number | null
          id: string
          points: number | null
          total_earned: number | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          current_level?: number | null
          id?: string
          points?: number | null
          total_earned?: number | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          current_level?: number | null
          id?: string
          points?: number | null
          total_earned?: number | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      user_quiz_results: {
        Row: {
          answers: Json | null
          completed_at: string | null
          id: string
          quiz_id: string | null
          score: number
          user_id: string | null
        }
        Insert: {
          answers?: Json | null
          completed_at?: string | null
          id?: string
          quiz_id?: string | null
          score: number
          user_id?: string | null
        }
        Update: {
          answers?: Json | null
          completed_at?: string | null
          id?: string
          quiz_id?: string | null
          score?: number
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_quiz_results_quiz_id_fkey"
            columns: ["quiz_id"]
            isOneToOne: false
            referencedRelation: "quizzes"
            referencedColumns: ["id"]
          },
        ]
      }
      user_streaks: {
        Row: {
          created_at: string
          current_streak: number
          id: string
          last_check_in_date: string | null
          longest_streak: number
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          current_streak?: number
          id?: string
          last_check_in_date?: string | null
          longest_streak?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          current_streak?: number
          id?: string
          last_check_in_date?: string | null
          longest_streak?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      workshop_registrations: {
        Row: {
          attended: boolean | null
          id: string
          registered_at: string | null
          user_id: string | null
          workshop_id: string | null
        }
        Insert: {
          attended?: boolean | null
          id?: string
          registered_at?: string | null
          user_id?: string | null
          workshop_id?: string | null
        }
        Update: {
          attended?: boolean | null
          id?: string
          registered_at?: string | null
          user_id?: string | null
          workshop_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "workshop_registrations_workshop_id_fkey"
            columns: ["workshop_id"]
            isOneToOne: false
            referencedRelation: "workshops"
            referencedColumns: ["id"]
          },
        ]
      }
      workshops: {
        Row: {
          created_at: string | null
          current_participants: number | null
          description: string | null
          duration_minutes: number | null
          id: string
          instructor_name: string | null
          is_recorded: boolean | null
          max_participants: number | null
          meeting_link: string | null
          recording_url: string | null
          scheduled_at: string
          tags: string[] | null
          title: string
        }
        Insert: {
          created_at?: string | null
          current_participants?: number | null
          description?: string | null
          duration_minutes?: number | null
          id?: string
          instructor_name?: string | null
          is_recorded?: boolean | null
          max_participants?: number | null
          meeting_link?: string | null
          recording_url?: string | null
          scheduled_at: string
          tags?: string[] | null
          title: string
        }
        Update: {
          created_at?: string | null
          current_participants?: number | null
          description?: string | null
          duration_minutes?: number | null
          id?: string
          instructor_name?: string | null
          is_recorded?: boolean | null
          max_participants?: number | null
          meeting_link?: string | null
          recording_url?: string | null
          scheduled_at?: string
          tags?: string[] | null
          title?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_current_user_role: {
        Args: never
        Returns: Database["public"]["Enums"]["app_role"]
      }
      get_public_profiles: {
        Args: { user_ids: string[] }
        Returns: {
          full_name: string
          id: string
        }[]
      }
    }
    Enums: {
      app_role: "student" | "mentor" | "admin"
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
      app_role: ["student", "mentor", "admin"],
    },
  },
} as const
