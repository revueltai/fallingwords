export interface Database {
  public: {
    Tables: {
      locales: {
        Row: {
          id: string
          name: string
          enabled: boolean
          created_at: string
        }
        Insert: {
          id: string
          name: string
          enabled?: boolean
        }
        Update: {
          enabled?: boolean
        }
      }
      user_data: {
        Row: {
          id: string
          user_id: string
          gems: number
          lives: number
          powerups: GamePowerups
          created_at: string
        }
        Insert: {
          user_id?: string
          gems?: number
          lives?: number
          powerups?: GamePowerups
        }
        Update: {
          gems?: number
          lives?: number
          powerups?: GamePowerups
        }
      }
      collections: {
        Row: {
          id: string
          created_at: string
          name: string
          user_id: string
          locale_original: string
          locale_learn: string
        }
        Insert: {
          name: string
          user_id: string
          locale_original: string
          locale_learn: string
        }
        Update: {
          name?: string
          locale_original?: string
          locale_learn?: string
        }
      }
      words: {
        Row: {
          id: string
          created_at: string
          collection_id: string
          word_original: string
          word_learn: string
        }
        Insert: {
          collection_id: string
          word_original: string
          word_learn: string
        }
        Update: {
          word_original?: string
          word_learn?: string
        }
      }
      streak: {
        Row: {
          id: string
          user_id: string
          streak_dates: string[]
          current_streak: number
          created_at: string
        }
        Insert: {
          user_id: string
          streak_dates?: string[]
          current_streak?: number
        }
        Update: {
          streak_dates?: string[]
          current_streak?: number
        }
      }
    }
    Functions: {
      get_available_locales: {
        Returns: {
          id: string
          name: string
        }[]
      }
    }
  }
}
