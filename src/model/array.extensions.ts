export {}

declare global {
  interface Array<T> {
    countValues(): Map<string, number>
  }
}

// FIXME: めんどくさいから拡張メソッド追加したが型が指定されていないので良くない
Array.prototype.countValues = function() {
  return this.reduce((item, current) => {
      const count = item.get(current) ?? 0
      item.set(current, count + 1)
      return item
    },
    new Map<string, number>()
  )
}