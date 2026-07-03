export type MissionCategory =
  | 'viagem'
  | 'equipamentos'
  | 'hospedagem'
  | 'financeiro'
  | 'treinos'
  | 'documentos'
  | 'saúde'
  | 'compras'
  | 'geral'

export type MissionPriority = 'alta' | 'média' | 'baixa'

export type MissionStatus = 'todo' | 'doing' | 'done' | 'cancelled'

export type MissionSource = 'manual' | 'system'

export type Mission = {
  id: string
  title: string
  description?: string
  category: MissionCategory
  priority: MissionPriority
  status: MissionStatus
  source: MissionSource
  dueDate?: string
  linkedTo?: {
    type: 'agenda' | 'mochila' | 'viagem' | 'hospedagem'
    id: string
  }
}

export const initialMissions: Mission[] = [
  {
    id: 'comprar-passagens',
    title: 'Comprar passagens',
    description: 'Avaliar no fim de semana do WOODZ.',
    category: 'viagem',
    priority: 'alta',
    status: 'todo',
    source: 'manual',
    dueDate: '2026-07-19',
  },
  {
    id: 'testar-konos-deia',
    title: 'Deia testar o Konos',
    description: 'Tênis comprado. Falta teste no pé da peregrina.',
    category: 'equipamentos',
    priority: 'alta',
    status: 'todo',
    source: 'manual',
    linkedTo: {
      type: 'mochila',
      id: 'tenis-principal',
    },
  },
  {
    id: 'revisar-mochilas',
    title: 'Revisar peso das mochilas',
    description: 'Checar o que vai na mochila e o que vai no corpo.',
    category: 'equipamentos',
    priority: 'média',
    status: 'todo',
    source: 'manual',
  },
]