import invariant from 'tiny-invariant'
import fs from 'fs'

export const getSourcePath = (file:string | undefined, value:string | undefined) => {
  if (file) {
    return file
  }
  invariant(value, "読み取り対象のファイルがありません。")
  return value
}

export const checkFileExists = (file:string | undefined, value:string | undefined) => {
  let sourcePath = null
  if (file) {
    sourcePath = file
  } else if (value) {
    sourcePath = value
  } else {
    throw new Error('ファイル名を指定してください。')
  }
  if (!fs.existsSync(sourcePath)) {
    throw new Error(`ファイルが見つかりません。 [${sourcePath}]`)
  }
}