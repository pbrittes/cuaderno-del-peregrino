export type Pilgrim = 'Pri' | 'Tan' | 'Deia'

export type GearStatus = 'tem' | 'comprar' | 'trocar' | 'testar' | 'dispensado'

export type GearCategory =
  | 'mochila'
  | 'calçado'
  | 'roupa'
  | 'dormir'
  | 'higiene'
  | 'saúde'
  | 'eletrônicos'
  | 'acessórios'

export type GearItem = {
  id: string
  name: string
  category: GearCategory
  weight: number
  status: Record<Pilgrim, GearStatus>
}

export const gearItems: GearItem[] = [
  {
    id: 'mochila',
    name: 'Mochila cargueira',
    category: 'mochila',
    weight: 900,
    status: {
      Pri: 'tem',
      Tan: 'tem',
      Deia: 'comprar',
    },
  },
  {
    id: 'tenis-principal',
    name: 'Tênis principal',
    category: 'calçado',
    weight: 670,
    status: {
      Pri: 'trocar',
      Tan: 'tem',
      Deia: 'tem',
    },
  },
  {
    id: 'bastoes',
    name: 'Bastões',
    category: 'acessórios',
    weight: 430,
    status: {
      Pri: 'tem',
      Tan: 'comprar',
      Deia: 'comprar',
    },
  },
  {
    id: 'saco-dormir',
    name: 'Saco de dormir leve',
    category: 'dormir',
    weight: 350,
    status: {
      Pri: 'tem',
      Tan: 'comprar',
      Deia: 'comprar',
    },
  },
  {
    id: 'calca-conversivel',
    name: 'Calça conversível',
    category: 'roupa',
    weight: 300,
    status: {
      Pri: 'tem',
      Tan: 'comprar',
      Deia: 'comprar',
    },
  },
  {
    id: 'meias-merino',
    name: 'Meias de merino',
    category: 'roupa',
    weight: 90,
    status: {
      Pri: 'tem',
      Tan: 'comprar',
      Deia: 'comprar',
    },
  },
  {
    id: 'power-bank',
    name: 'Power bank',
    category: 'eletrônicos',
    weight: 240,
    status: {
      Pri: 'tem',
      Tan: 'comprar',
      Deia: 'comprar',
    },
  },
]