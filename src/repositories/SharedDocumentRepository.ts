import { BaseRepository } from "./BaseRepository"
import type {
  ModuleName,
  SharedDocument,
} from "../types/database"

export class SharedDocumentRepository extends BaseRepository {
  async get<T>(
    expeditionId: string,
    module: ModuleName,
  ) {
    const { data, error } = await this.client
      .from("shared_documents")
      .select("*")
      .eq("expedition_id", expeditionId)
      .eq("module", module)
      .single()

    if (error) throw error

    return data as SharedDocument<T>
  }

  async save<T>(
    expeditionId: string,
    module: ModuleName,
    payload: T,
    userId: string,
  ) {
    const { data, error } = await this.client
      .from("shared_documents")
      .upsert({
        expedition_id: expeditionId,
        module,
        payload,
        updated_by: userId,
      })
      .select()
      .single()

    if (error) throw error

    return data as SharedDocument<T>
  }
}