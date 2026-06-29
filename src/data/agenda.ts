export type AgendaEvent = {
  id: string
  date: string
  endDate?: string
  title: string
  type: 'treino' | 'show' | 'palestra' | 'bloqueio' | 'viagem' | 'tarefa'
  people: Array<'Pri' | 'Tania' | 'Andrea'>
  status: 'confirmado' | 'parcial' | 'pendente'
  note?: string
}

export const agendaEvents: AgendaEvent[] = [
  {
    id: 'acas-caminhos-mar',
    date: '2026-07-11',
    title: 'ACACS + Caminhos do Mar',
    type: 'palestra',
    people: ['Pri', 'Tania', 'Andrea'],
    status: 'confirmado',
    note: 'Palestra Caminho Português + passaporte peregrino + treino/teste de tênis',
  },
  {
    id: 'woodz',
    date: '2026-07-19',
    title: 'WOODZ',
    type: 'show',
    people: ['Pri', 'Tania', 'Andrea'],
    status: 'confirmado',
    note: 'Show à noite',
  },
  {
    id: 'jaragua',
    date: '2026-07-25',
    title: 'Pico do Jaraguá',
    type: 'treino',
    people: ['Pri', 'Tania', 'Andrea'],
    status: 'confirmado',
    note: '12 km',
  },
  {
    id: 'andrea-bloqueio-ago-1',
    date: '2026-08-01',
    endDate: '2026-08-03',
    title: 'Andrea indisponível',
    type: 'bloqueio',
    people: ['Andrea'],
    status: 'confirmado',
  },
  {
    id: 'lykn',
    date: '2026-08-09',
    title: 'LYKN',
    type: 'show',
    people: ['Pri', 'Tania'],
    status: 'parcial',
    note: 'Dia dos Pais. Andrea a confirmar.',
  },
  {
    id: 'andrea-bloqueio-ago-2',
    date: '2026-08-15',
    endDate: '2026-08-17',
    title: 'Andrea indisponível',
    type: 'bloqueio',
    people: ['Andrea'],
    status: 'confirmado',
  },
  {
    id: 'guararema-mogi',
    date: '2026-08-29',
    title: 'Guararema → Mogi',
    type: 'treino',
    people: ['Pri', 'Tania', 'Andrea'],
    status: 'confirmado',
    note: '26 km. Treino completo.',
  },
  {
    id: 'bts',
    date: '2026-10-28',
    title: 'BTS',
    type: 'show',
    people: ['Pri', 'Tania', 'Andrea'],
    status: 'confirmado',
    note: 'Prioridade máxima. Ingressos conquistados com sofrimento.',
  },
  {
    id: 'embarque',
    date: '2026-10-30',
    title: 'Embarque para Portugal',
    type: 'viagem',
    people: ['Pri', 'Tania', 'Andrea'],
    status: 'pendente',
    note: 'São Paulo → Lisboa',
  },
]