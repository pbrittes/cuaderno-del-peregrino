export type ModuleName =
  | "agenda"
  | "backpack"
  | "missions"
  | "travel"
  | "finance"
  | "budget"

export interface SharedDocument<T = unknown> {
  id: string
  expedition_id: string
  module: ModuleName
  payload: T
  version: number
  updated_by: string | null
  created_at: string
  updated_at: string
}

export interface Expedition {
  id: string
  name: string
  created_by: string
  created_at: string
  updated_at: string
}

export interface Profile {
  id: string
  display_name: string
  created_at: string
  updated_at: string
}

export interface ExpeditionMember {
  expedition_id: string
  user_id: string
  role: string
  created_at: string
  profile?: Profile
}