export interface Database {
  public: {
    Tables: {
      locales: {
        Row: {
          id: string
          name: string
          enabled: boolean
          articles: AppLocaleArticles
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
          words_count: number
          collection_package_name: string
          locale_original: AppLocaleCode
          locale_learn: AppLocaleCode
        }
        Insert: {
          name: string
          user_id: string
          locale_original: AppLocaleCode
          locale_learn: AppLocaleCode
        }
        Update: {
          name?: string
          locale_original?: AppLocaleCode
          locale_learn?: AppLocaleCode
          collection_package_name?: string
        }
      }
      words: {
        Row: {
          id: string
          created_at: string
          collection_id: string
          original: string
          original_article: string
          learn: string
          learn_article: string
          type: AppWordType
        }
        Insert: {
          collection_id: string
          original: string
          learn: string
          original_article: string
          learn_article: string
          type: AppWordType
        }
        Update: {
          original?: string
          learn?: string
          original_article: string | null
          learn_article: string | null
          type: AppWordType
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
