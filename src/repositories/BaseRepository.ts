import { supabase } from "../lib/supabase"

export abstract class BaseRepository {
  protected readonly client = supabase
}