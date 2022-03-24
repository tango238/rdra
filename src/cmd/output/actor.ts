import { RelationalModel } from '../../model/RDRA'
import { Actor } from '../../model/actor/Actor'
import { System } from '../../model/actor/System'
import { ExternalSystem } from '../../model/actor/ExternalSystem'
import { Activity, Buc, Business, BusinessInstance } from '../../model/business/Business'
import { br, info, subtitle, title } from './console'

export const outputAllActors = (model: RelationalModel) => {
  title("システム／アクター／外部システム")
  subtitle("システム")
  outputSystem(model.system)

  subtitle("アクター")
  outputActor(model.actor, model.business)

  if (model.externalSystem) {
    subtitle("外部システム")
    outputExternal(model.externalSystem, model.business)
  }
}

const outputActor = (actor: Actor, business: Business | null) => {
  actor.instances.forEach(it => {
    info(`名前          : ${it.name}`)
    info(`説明          : ${it.description ?? '-'}`)
    if (business) {
      const bs = getBusiness(it.name, business)
      const b = `主な業務      : ${bs.length > 0 ? bs.map(b => b.name).join(', ') : '-'}`
      info(b)

      const acts = getActivities(it.name, business)
      const activity = `アクティビティ: ${acts.length > 0 ? acts.map(act => act.name).join(', ') : '-'}`
      info(activity)
    }
    br()
  })
}

const outputSystem = (system: System) => {
  info(`名前          : ${system.name}`)
  info(`説明          : ${system.description ?? '-'}`)
  br()
}

const outputExternal = (external: ExternalSystem, business: Business | null) => {
  external.instances.forEach(it => {
    info(`名前          : ${it.name}`)
    info(`説明          : ${it.description ?? '-'}`)
    if (business) {
      const bs = getBusiness(it.name, business)
      const b = `主な業務      : ${bs.length > 0 ? bs.map(b => b.name).join(', ') : '-'}`
      info(b)

      const acts = getActivities(it.name, business)
      const activity = `アクティビティ: ${acts.length > 0 ? acts.map(act => act.name).join(', ') : '-'}`
      info(activity)
    }
    br()
  })
}
const getBusiness = (actorName: string, business: Business): BusinessInstance[] => {
  return business.instances.filter(b => b.main.includes(actorName))
}

const getActivities = (actorName: string, business: Business): Activity[] => {
  return business.instances.flatMap(b =>
    b.buc.flatMap(buc =>
      buc.activity.filter(act => act.used_by.includes(actorName))
    )
  )
}
