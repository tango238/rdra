export type JsonSchema = {
  overview: JsonSchemaOverview
  actor: (JsonSchemaActor | string)[]
  external_actor: (JsonSchemaExternalActor | string)[] | null
  information: JsonSchemaInformation[]
  usecase: JsonSchemaUsecase[] | null
  business: JsonSchemaBusiness[] | null
  state: JsonSchemaState[] | null
  variation: JsonSchemaVariation[] | null
  condition: JsonSchemaCondition[] | null
}

export type JsonSchemaOverview = {
  business: string
  system: string
}

export type JsonSchemaActor = {
  name: string
  description?: string | null
}

export type JsonSchemaExternalActor = {
  name: string
  description?: string | null
}

export type JsonSchemaInformation = {
  context: string
  value: JsonSchemaInformationValue[]
}

export type JsonSchemaInformationValue = {
  name: string
  description?: string
  related?: string[]
  variation?: string
}


export type JsonSchemaUsecase = {
  name: string
  view: string[] | null
  information: string[]
  condition: string[]
  // event: string[]
}

export type JsonSchemaBusiness = {
  name: string
  main_actor: string[]
  buc: SourceBucJSON[]
}

export type SourceBucJSON = {
  name: string
  activity: SourceActivityJSON[]
}

export type SourceActivityJSON = {
  name: string
  used_by: string[]
  usecase: string[]
}

export type JsonSchemaState = {
  group: string
  value: SourceStateValueJSON[]
}

export type SourceStateValueJSON = {
  name: string
  usecase: SourceUsecaseForState[] | null
}

export type SourceUsecaseForState = {
  name: string
  next_state: string
}

export type JsonSchemaVariation = {
  name: string
  value: string[]
}

export type JsonSchemaCondition = {
  name: string
  description?: string
  variation?: string[]
  state?: string
}
