import type { Database } from '@/types/supabase'
import type { SupabaseClient } from '@supabase/supabase-js'
import { isEmptyObject } from '@/utils'
import { createClient } from '@supabase/supabase-js'

export class SupabaseService {
  private static instance: SupabaseService
  private client: SupabaseClient<Database>

  private constructor() {
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
    const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY

    if (!supabaseUrl || !supabaseKey) {
      throw new Error('Missing Supabase environment variables')
    }

    this.client = createClient<Database>(supabaseUrl, supabaseKey)
  }

  public static getInstance(): SupabaseService {
    if (!SupabaseService.instance) {
      SupabaseService.instance = new SupabaseService()
    }
    return SupabaseService.instance
  }

  public getClient(): SupabaseClient<Database> {
    return this.client
  }

  // AUTH ==========

  async checkUserExists(
    email: string | null = null,
    username: string | null = null,
  ): Promise<boolean> {
    const { data, error } = await this.client.rpc('check_user_exists', { p_email: email, p_username: username })

    if (error) {
      throw error
    }

    return data
  }

  async isEmailUnique(email: string): Promise<boolean> {
    try {
      const exists = await this.checkUserExists(email, null)
      return !exists
    } catch (error) {
      console.error('Error checking email uniqueness:', error)
      return false
    }
  }

  async isUsernameUnique(username: string): Promise<boolean> {
    try {
      const exists = await this.checkUserExists(null, username)
      return !exists
    } catch (error) {
      console.error('Error checking username uniqueness:', error)
      return false
    }
  }

  async signUp(payload: UserPayload) {
    const {
      email,
      password,
      username,
      name,
      age,
      learnLocale,
      originalLocale,
    } = payload

    if (!email || !password) {
      throw new Error('Missing email or password')
    }

    const { data, error } = await this.client.auth.signUp({
      email,
      password,
      options: {
        data: {
          display_name: username,
          name,
          age,
          originalLocale,
          learnLocale,
        },
      },
    })

    if (error) {
      throw error
    }

    return { data, error }
  }

  async signIn(email: string, password: string) {
    const { data, error } = await this.client.auth.signInWithPassword({ email, password })

    if (error) {
      throw error
    }

    return data
  }

  async signOut() {
    const { error } = await this.client.auth.signOut()

    if (error) {
      throw error
    }
  }

  async initializeSession() {
    try {
      // Check for active session
      const {
        data: { session },
        error: sessionError,
      } = await this.client.auth.getSession()

      if (sessionError) {
        throw sessionError
      }

      if (!session) {
        return null
      }

      // Get user data from auth
      const { data: { user }, error: userError } = await this.client.auth.getUser()
      if (userError) {
        throw userError
      }

      if (!user) {
        return null
      }

      // Get user data from database
      const { data: userData, error: dataError } = await this.client
        .from('user_data')
        .select('*')
        .eq('user_id', user.id)
        .single()

      if (dataError) {
        throw dataError
      }

      return {
        session,
        user,
        userData,
      }
    } catch (error) {
      console.error('Session initialization failed:', error)
      return null
    }
  }

  async revertSignUp(email: string) {
    // TODO: revert entry for user in db in supabase
    // send email to cron job
    console.error(`Reverting signup data for ${email}`)
  }

  async insertUserData(payload: UserDataPayload = {}) {
    const user = await this.getCurrentUser()

    if (!user || !user.id) {
      throw new Error('User not authenticated')
    }

    const { data, error } = await this.client
      .from('user_data')
      .insert({
        user_id: user.id,
        ...payload,
      })
      .select()

    if (error) {
      throw error
    }

    return data
  }

  async updateUser(payload: Record<string, any>) {
    if (isEmptyObject(payload)) {
      return false
    }

    const user = await this.getCurrentUser()
    const currentMetaData = user?.user_metadata || {}

    const { data, error } = await this.client.auth.updateUser({
      data: {
        ...currentMetaData,
        ...payload.customMetadata,
      },
    })

    if (error) {
      throw error
    }

    return data.user
  }

  async getCurrentUser() {
    const { data, error } = await this.client.auth.getUser()

    if (error) {
      throw error
    }

    return data.user
  }

  setupAuthListener(callback: (event: 'SIGNED_IN' | 'SIGNED_OUT') => void) {
    return this.client.auth.onAuthStateChange((event) => {
      if (event === 'SIGNED_IN' || event === 'SIGNED_OUT') {
        callback(event)
      }
    })
  }

  // DATA ==========

  private async insertRecord<T>(
    table: 'collections' | 'words',
    payload: Record<string, any>,
  ): Promise<T> {
    const { data, error } = await this.client
      .from(table)
      .insert(payload)
      .select()
      .single()

    if (error) {
      throw error
    }

    if (!data) {
      throw new Error(`FailedInsert_${table}`)
    }

    return data as T
  }

  private async deleteRecord(
    table: 'collections' | 'words',
    id: string,
    options?: { fkField?: string },
  ): Promise<boolean> {
    const query = this.client.from(table).delete()

    if (options?.fkField) {
      query.eq(options.fkField, id)
    } else {
      query.eq('id', id)
    }

    const { error } = await query

    if (error) {
      return false
    }

    return true
  }

  async insertCollection(payload: {
    name: string
    locale_original: RoundLocaleCodes
    locale_learn: RoundLocaleCodes
  }) {
    const user = await this.getCurrentUser()

    if (!user) {
      throw new Error('User not authenticated')
    }

    return this.insertRecord('collections', {
      ...payload,
      user_id: user.id,
    })
  }

  async fetchCollections() {
    const user = await this.getCurrentUser()
    const { data, error } = await this.client
      .from('collections')
      .select('*')
      .eq('user_id', user.id)

    if (error) {
      throw error
    }

    return data
  }

  async getWords(collectionId: string) {
    const { data, error } = await this.client
      .from('words')
      .select('*')
      .eq('collection_id', collectionId)

    if (error) {
      throw error
    }

    return data
  }

  async deleteCollection(collectionId: string): Promise<boolean> {
    const rs = await this.deleteRecord('collections', collectionId)
    return rs
  }

  async deleteWords(
    wordId: string | string[],
    collectionId?: string,
  ): Promise<void> {
    if (collectionId) {
      await this.deleteRecord('words', collectionId, { fkField: 'collection_id' })
      return
    }

    if (Array.isArray(wordId)) {
      // Delete multiple words by IDs
      const { error } = await this.client
        .from('words')
        .delete()
        .in('id', wordId)

      if (error) {
        throw error
      }
    } else {
      // Delete single word by ID
      await this.deleteRecord('words', wordId)
    }
  }
}

export const supabase = SupabaseService.getInstance()
