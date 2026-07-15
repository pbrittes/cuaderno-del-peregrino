import { supabase } from '../lib/supabase'
import type {
  Expedition,
  ExpeditionMember,
  Profile,
} from '../types/database'

type ExpeditionMemberRow = {
  expedition_id: string
  user_id: string
  role: string
  created_at: string
  profile: Profile | Profile[] | null
}

type CurrentExpeditionRow = {
  role: string
  created_at: string
  expedition: Expedition | Expedition[] | null
}

export class ExpeditionRepository {
  async getCurrent(userId: string): Promise<Expedition | null> {
    const { data, error } = await supabase
      .from('expedition_members')
      .select(`
        role,
        created_at,
        expedition:expeditions(
          id,
          name,
          created_by,
          created_at,
          updated_at
        )
      `)
      .eq('user_id', userId)

    if (error) throw error

    const rows = (data ?? []) as CurrentExpeditionRow[]

    const memberships = rows
      .map((row) => ({
        role: row.role,
        created_at: row.created_at,
        expedition: Array.isArray(row.expedition)
          ? row.expedition[0]
          : row.expedition,
      }))
      .filter(
        (
          item,
        ): item is {
          role: string
          created_at: string
          expedition: Expedition
        } => Boolean(item.expedition),
      )

    memberships.sort((a, b) => {
      if (a.role === 'member' && b.role !== 'member') {
        return -1
      }

      if (a.role !== 'member' && b.role === 'member') {
        return 1
      }

      return a.created_at.localeCompare(b.created_at)
    })

    return memberships[0]?.expedition ?? null
  }

  async create(
    name: string,
    userId: string,
  ): Promise<Expedition> {
    const { data, error } = await supabase
      .from('expeditions')
      .insert({
        name,
        created_by: userId,
      })
      .select()
      .single()

    if (error) throw error

    return data as Expedition
  }

  async addMemberByEmail(
    expeditionId: string,
    email: string,
  ): Promise<void> {
    const { error } = await supabase.rpc(
      'add_member_by_email',
      {
        p_expedition_id: expeditionId,
        p_email: email,
      },
    )

    if (error) throw error
  }

  async removeMember(
    expeditionId: string,
    userId: string,
  ): Promise<void> {
    const { error } = await supabase
      .from('expedition_members')
      .delete()
      .eq('expedition_id', expeditionId)
      .eq('user_id', userId)
      .neq('role', 'owner')

    if (error) throw error
  }

  async getMembers(
    expeditionId: string,
  ): Promise<ExpeditionMember[]> {
    const { data, error } = await supabase
      .from('expedition_members')
      .select(`
        expedition_id,
        user_id,
        role,
        created_at,
        profile:profiles(
          id,
          display_name,
          created_at,
          updated_at
        )
      `)
      .eq('expedition_id', expeditionId)
      .order('created_at')

    if (error) throw error

    const rows = (data ?? []) as ExpeditionMemberRow[]

    return rows.map((row) => ({
      expedition_id: row.expedition_id,
      user_id: row.user_id,
      role: row.role,
      created_at: row.created_at,
      profile: Array.isArray(row.profile)
        ? row.profile[0]
        : row.profile ?? undefined,
    }))
  }
}

export const expeditionRepository =
  new ExpeditionRepository()