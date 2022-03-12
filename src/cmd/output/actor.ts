import { RelationalModel } from '../../model/RDRA'
import { Actor } from '../../model/actor/Actor'
import { InternalSystem } from '../../model/actor/InternalSystem'
import { ExternalSystem } from '../../model/actor/ExternalSystem'
import { Activity, Business } from '../../model/business/Business'
import { br, info, subtitle, title } from './console'

export const outputAllActors = (model: RelationalModel) => {
    title("アクター／内部システム／外部システム")
    subtitle("アクター")
    outputActor(model.actor, model.business)

    subtitle("内部システム")
    outputInternal(model.internalSystem, model.business)

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
      const body = `アクティビティ: ${activities.map(act => act.name).join(', ')}`
      info(body)
    }
    br()
  })
}

const outputInternal = (internal: InternalSystem, business: Business | null) => {
  internal.instances.forEach(it => {
    info(`名前          : ${it.name}`)
    info(`説明          : ${it.description ?? '-'}`)
    if (business) {
      const activities = getActivities(it.name, business)
      const body = `アクティビティ: ${activities.map(act => act.name).join(', ')}`
      info(body)
    }
    br()
  })
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
