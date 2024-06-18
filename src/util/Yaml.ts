import * as fs from 'fs'
import * as schema from '../schema.json'
import * as YAML from 'yaml'
import Ajv, { ValidateFunction } from 'ajv/dist/2020'
import { JsonSchema } from '../model/JsonSchema'
import { RDRA, RelationalModel } from '../model/RDRA'

export class Yaml {

  private readonly _validate: ValidateFunction
  private readonly _source: any

  constructor(sourcePath: string) {
    const ajv = new Ajv({ allowUnionTypes: true })
    this._validate = ajv.compile(schema)
    const source = fs.readFileSync(sourcePath, 'utf-8')
    this._source = YAML.parse(source)
  }

  static export(output: string, source: JsonSchema): void {
    const content = YAML.stringify(source)
    fs.writeFileSync(output, content)
  }

  validate(): string[] {
    this._validate(this._source)

    let errors:string[] = []
    if (this._validate.errors) {
      errors = this._validate.errors.map(err => {
        return `${err['instancePath']} ${err['message']}`
      })
    }
    return errors
  }

  getModel() : RelationalModel{
    return RDRA.resolve(this._source)
  }
}
