import { BaseBuilder, BaseHandler } from './util/types'
import * as fs from 'fs'
import { heredoc } from '../util/heredoc'
import { info } from './output/console'

export const command = 'init'
export const desc = 'Create YAML to start creating RDRA model'


export const builder: BaseBuilder = (yargs) =>
  yargs

export const handler: BaseHandler = async (argv) => {
  let path = './rdra.yml'
  if (fs.existsSync(path)) {
    path = path + '.' + new Date().toISOString().split('.')[0]
  }
  const content = heredoc`
actor:
  - 社員

internal_system:
  - 出退勤管理システム

information:
  - name: 社員
  - name: 出退勤記録

state:
  - group: 出退勤
    value:
      - name: 出勤
        usecase:
          - name: 退勤する
            next_state: 退勤
      - name: 退勤
        usecase:
          - name: 出勤する
            next_state: 出勤

usecase:
  - name: 出勤する
    information:
      - 出退勤記録
    view:
      - 出勤記録
  - name: 退勤する
    information:
      - 出退勤記録
    view:
      - 退勤記録
  - name: 社員登録
    information:
      - 社員
    view:
      - 社員管理
  `
  fs.writeFileSync(path, content)
  info(`File generated: ${path}`)
}