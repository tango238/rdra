import { RelationalModel } from '../../model/RDRA'
import { info, title } from './console'
import { table } from 'table-b'

export const outputAllView = (model: RelationalModel) => {
  if (model.usecase) {
    title("画面")

    let rows: string[][] = []
    model.usecase.instances.forEach(uc => {
      if (uc.view) {
        uc.view.forEach(view => {
          rows.push([view, uc.information.join(', ')])
        })
      }
    })
    rows.unshift(['[画面名]', '[情報]'])
    info(table(rows))
  }
}