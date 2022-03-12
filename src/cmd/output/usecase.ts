import { RelationalModel } from '../../model/RDRA'
import { Business } from '../../model/business/Business'
import { Usecase } from '../../model/usecase/Usecase'
import { br, info, subtitle, title, warn } from './console'

export const outputAllUseCases = (model: RelationalModel, buc?: string) => {
  if (!model.usecase) {
    warn('ユースケースが未登録です。')
    process.exit(0)
  }

  title("ユースケース")
  if (model.business) {
    outputUsecaseForBusiness(model.business, model.usecase, { buc })
  } else {
    // 業務が未登録の場合
    outputUsecase(model.usecase)
  }
}

const outputUsecaseForBusiness = (business: Business, usecase: Usecase, options: { buc?: string }) => {
  const { buc } = options
  business.instances.map(business => {
    business.buc.forEach(b => {
      b.activity.forEach(act => {
        const actors = act.used_by.join(',')
        if (act.usecase) {
          act.usecase.forEach(uc => {
            const usecaseInstance = usecase.load(uc)
            const views = usecaseInstance.view ? usecaseInstance.view.join(', ') : '-'
            const inf = usecaseInstance.information.join(', ')
            if ((buc && buc == b.name) || !buc) {
              outputBusiness(
                b.name, act.name, uc, actors, views, inf, usecaseInstance.condition
              )
            }
          })
        }
      })
    })
  })
}

const outputUsecase = (usecase: Usecase) => {
  usecase.instances.forEach(uc => {
    subtitle(uc.name)
    const views = uc.view ? uc.view.join(', ') : '-'
    const inf = uc.information.join(', ')
    info(`画面          : ${views}`)
    info(`情報          : ${inf}`)
    if (uc.condition) {
      info(`条件          : ${uc.condition.join(', ')}`)
    }
  })
}

const outputBusiness = (buc: string, activity: string, uc: string, actor: string, view: string, information: string, conditions: string[] | null) => {
  subtitle(uc)
  info(`アクター      : ${actor}`)
  info(`BUC           : ${buc}`)
  info(`アクティビティ: ${activity}`)
  info(`画面          : ${view}`)
  info(`情報          : ${information}`)
  if (conditions) {
    info(`条件          : ${conditions.join(', ')}`)
  }
  br()
}
