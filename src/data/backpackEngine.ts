import { gearItems, type Pilgrim } from './backpacks'

const TARGET_WEIGHT = 10000

export function getBackpackWeight(pilgrim: Pilgrim) {
  return gearItems
    .filter((item) => item.status[pilgrim] === 'tem')
    .reduce((total, item) => total + item.weight, 0)
}

export function getBackpackProgress(pilgrim: Pilgrim) {
  return Math.round((getBackpackWeight(pilgrim) / TARGET_WEIGHT) * 100)
}

export function formatKg(weight: number) {
  return `${(weight / 1000).toFixed(1).replace('.', ',')} kg`
}

export function getPendingItems(pilgrim: Pilgrim) {
  return gearItems.filter((item) => item.status[pilgrim] !== 'tem')
}