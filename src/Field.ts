import Value from './Value'
import SubForms from './SubForms'
import { isArray, forceCast } from './utility'

class Field<T> {
    constructor (current: T, original?: T, suggested?: T) {
        if (isArray(current)) {
            // hack to strongly hint types
            let originalField = forceCast<Array<any>>(original)
            let suggestedField = forceCast<Array<any>>(suggested)

            this.subForms = new SubForms(current, originalField, suggestedField)
        }
        else {
            this.value = new Value(current, original, suggested)
            this.isValue = true
        }
    }

    value?: Value<T>
    subForms?: SubForms<T>

    isValue: boolean
    get isSubForms() {
        return !this.isValue
    }
}

export default Field