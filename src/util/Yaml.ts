import * as fs from 'fs'
import * as schema from '../schema.json'
import * as YAML from 'yaml'
import Ajv, { ValidateFunction } from 'ajv/dist/2020'

export class Yaml {

  private readonly _validate: ValidateFunction

  constructor() {
    const ajv = new Ajv({ allowUnionTypes: true })
    this._validate = ajv.compile(schema)
  }

  load(sourcePath: string): any  {
    const source = fs.readFileSync(sourcePath, 'utf-8')
    return YAML.parse(source)
  }

  validate(input: any): string[] {
    this._validate(input)

    let errors:string[] = []
    if (this._validate.errors) {
      errors = this._validate.errors.map(err => {
        return `${err['instancePath']} ${err['message']}`
      })
    }
    return errors
  }
}