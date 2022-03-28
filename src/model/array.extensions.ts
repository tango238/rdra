export {}

declare global {
  interface Array<T> {
    countValues(): Map<string, number>

    groupBy(getKey: (cur: T, idx: number, src: readonly T[]) => string): [string, T[]][]
  }
}

// FIXME: めんどくさいから拡張メソッド追加したが型が指定されていないので良くない
Array.prototype.countValues = function () {
  return this.reduce((item, current) => {
      const count = item.get(current) ?? 0
      item.set(current, count + 1)
      return item
    },
    new Map<string, number>()
  )
}

Array.prototype.groupBy = function <T>(
  getKey: (cur: T, idx: number, src: readonly T[]) => string
): [string, T[]][] {
  return Array.from(
    this.reduce((prv, cur, idx, src) => {
      const key = getKey(cur, idx, src)
      const list = prv.get(key)
      if (list) list.push(cur)
      else prv.set(key, [cur])
      return prv
    }, new Map<String, T[]>()))
}