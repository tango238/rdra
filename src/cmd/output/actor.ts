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
      const activities = getActivities(it.name, business)
      const activity = `アクティビティ: ${activities.map(act => act.name).join(', ')}`
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
    info(`説明          : ${it.description ?? '説明なし'}`)
    if (business) {
      const activities = getActivities(it.name, business)
      const body = `アクティビティ: ${activities.map(act => act.name).join(', ')}`
      info(body)
    }
    br()
  })
}

const getActivities = (actorName: string, business: Business): Activity[] => {
  return business.instances.flatMap(b =>
    b.buc.flatMap(buc =>
      buc.activity.filter(act => act.used_by.includes(actorName))
    )
  )
}
