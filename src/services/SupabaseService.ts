import type { Database } from '@/types/supabase'
import type { SupabaseClient } from '@supabase/supabase-js'
import { isEmptyObject } from '@/utils'
import { createClient } from '@supabase/supabase-js'

type CollectionRow = Database['public']['Tables']['collections']['Row']
type CollectionUpdate = Database['public']['Tables']['collections']['Update']
type WordRow = Database['public']['Tables']['words']['Row']
type WordUpdate = Database['public']['Tables']['words']['Update']

function noRowsReturned(supabaseErrorCode: string) {
  return supabaseErrorCode === 'PGRST116'
}

export class SupabaseService {
  private static instance: SupabaseService
  private client: SupabaseClient<Database>

  private constructor() {
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
    const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY

    if (!supabaseUrl || !supabaseKey) {
      throw new Error('MissingSupabaseConfig')
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
      console.error('ErrorEmailUniqueness', error)
      return false
    }
  }

  async isUsernameUnique(username: string): Promise<boolean> {
    try {
      const exists = await this.checkUserExists(null, username)
      return !exists
    } catch (error) {
      console.error('ErrorUsernameUniqueness', error)
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
      throw new Error('MissingEmailOrPassword')
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

      const { data: { user }, error: userError } = await this.client.auth.getUser()
      if (userError) {
        throw userError
      }

      if (!user) {
        return null
      }

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
      throw new Error('MissingUserAuth')
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
    table: 'collections' | 'words' | 'streak',
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

  private async updateRecord<T>(
    table: 'collections' | 'words' | 'user_data' | 'streak',
    id: string,
    payload: Record<string, any>,
    idField: string = 'id',
  ): Promise<T> {
    const { data, error } = await this.client
      .from(table)
      .update(payload)
      .eq(idField, id)
      .select()
      .single()

    if (error) {
      throw error
    }

    if (!data) {
      throw new Error(`FailedUpdate_${table}`)
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

  private async verifyCollectionOwnership(collectionId: string): Promise<boolean> {
    const user = await this.getCurrentUser()

    const { data } = await this.client
      .from('collections')
      .select('id')
      .eq('id', collectionId)
      .eq('user_id', user.id)
      .single()

    return !!data
  }

  private async verifyWordOwnership(wordId: string): Promise<string> {
    const { data: word } = await this.client
      .from('words')
      .select('collection_id')
      .eq('id', wordId)
      .single()

    if (!word) {
      throw new Error('WordNotFound')
    }

    const hasAccess = await this.verifyCollectionOwnership(word.collection_id)
    if (!hasAccess) {
      throw new Error('UnauthorizedAccess')
    }

    return word.collection_id
  }

  async updateUserData(payload: Partial<UserDataPayload>): Promise<boolean> {
    const user = await this.getCurrentUser()

    if (!user) {
      throw new Error('MissingUserAuth')
    }

    try {
      await this.updateRecord(
        'user_data',
        user.id,
        payload,
        'user_id',
      )

      return true
    } catch (error) {
      console.error('FailedUpdateUserData', error)
      return false
    }
  }

  async fetchStreak(): Promise<{
    streak_dates: string[]
    current_streak: number
  } | null> {
    const user = await this.getCurrentUser()

    if (!user) {
      throw new Error('MissingUserAuth')
    }

    const { data, error } = await this.client
      .from('streak')
      .select('*')
      .eq('user_id', user.id)
      .single()

    if (error) {
      if (noRowsReturned(error.code)) {
        return null
      }

      throw error
    }

    return data
  }

  async initializeStreak(): Promise<boolean> {
    const user = await this.getCurrentUser()

    if (!user) {
      throw new Error('MissingUserAuth')
    }

    try {
      await this.insertRecord('streak', {
        user_id: user.id,
        streak_dates: [],
        current_streak: 0,
      })
      return true
    } catch (error) {
      console.error('FailedInitializeStreak:', error)
      return false
    }
  }

  async updateStreak(payload: {
    streak_dates: string[]
    current_streak: number
  }): Promise<boolean> {
    const user = await this.getCurrentUser()

    if (!user) {
      throw new Error('MissingUserAuth')
    }

    try {
      await this.updateRecord(
        'streak',
        user.id,
        payload,
        'user_id',
      )

      return true
    } catch (error) {
      console.error('FailedUpdateStreak:', error)
      return false
    }
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

  async fetchCollection(id: string): Promise<CollectionRow | null> {
    const user = await this.getCurrentUser()

    const { data, error } = await this.client
      .from('collections')
      .select('*')
      .eq('id', id)
      .eq('user_id', user.id)
      .single()

    if (error) {
      if (noRowsReturned(error.code)) {
        return null
      }

      throw error
    }

    return data
  }

  async insertCollection(payload: {
    name: string
    locale_original: RoundLocaleCodes
    locale_learn: RoundLocaleCodes
  }): Promise<CollectionRow> {
    const user = await this.getCurrentUser()

    if (!user) {
      throw new Error('MissingUserAuth')
    }

    const rs = await this.insertRecord('collections', {
      ...payload,
      user_id: user.id,
    })

    return rs as CollectionRow
  }

  async updateCollection(
    id: string,
    payload: CollectionUpdate,
  ): Promise<CollectionRow> {
    const user = await this.getCurrentUser()

    if (!user) {
      throw new Error('MissingUserAuth')
    }

    const rs = await this.updateRecord('collections', id, payload)

    return rs as CollectionRow
  }

  async deleteCollection(collectionId: string): Promise<boolean> {
    const rs = await this.deleteRecord('collections', collectionId)
    return rs
  }

  async fetchWords(collectionId: string) {
    const { data, error } = await this.client
      .from('words')
      .select('*')
      .eq('collection_id', collectionId)

    if (error) {
      throw error
    }

    return data
  }

  async insertWord(payload: {
    collection_id: string
    original: string
    learn: string
  }): Promise<WordRow> {
    const hasAccess = await this.verifyCollectionOwnership(payload.collection_id)

    if (!hasAccess) {
      throw new Error('CollectionNotFoundForUser')
    }

    return this.insertRecord<WordRow>('words', payload)
  }

  async updateWord(
    wordId: string,
    payload: WordUpdate,
  ): Promise<WordRow> {
    await this.verifyWordOwnership(wordId)
    return this.updateRecord<WordRow>('words', wordId, payload)
  }

  async deleteWord(wordId: string): Promise<boolean> {
    await this.verifyWordOwnership(wordId)
    return this.deleteRecord('words', wordId)
  }
}

export const supabase = SupabaseService.getInstance()
