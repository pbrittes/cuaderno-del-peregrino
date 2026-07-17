import { BaseRepository } from './BaseRepository'

import type {
  ModuleName,
  SharedDocument,
} from '../types/database'

export class SharedDocumentRepository extends BaseRepository {
  async get<T>(
    expeditionId: string,
    module: ModuleName,
  ): Promise<SharedDocument<T> | null> {
    const { data, error } = await this.client
      .from('shared_documents')
      .select('*')
      .eq('expedition_id', expeditionId)
      .eq('module', module)
      .maybeSingle()

    if (error) throw error

    return data as SharedDocument<T> | null
  }

  async save<T>(
    expeditionId: string,
    module: ModuleName,
    payload: T,
    userId: string,
  ): Promise<SharedDocument<T>> {
    const { data, error } = await this.client
      .from('shared_documents')
      .upsert(
        {
          expedition_id: expeditionId,
          module,
          payload,
          updated_by: userId,
        },
        {
          onConflict: 'expedition_id,module',
        },
      )
      .select()
      .single()

    if (error) throw error

    return data as SharedDocument<T>
  }
}

export const sharedDocumentRepository =
  new SharedDocumentRepository()