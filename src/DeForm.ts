import Value from './Value'
import DeScriber, { DeScanner } from './DeScriber'
import DeFormState from './DeFormState'

enum FieldType {
    SubForm
}

export class DeFormAttribute<T> {
    private _scribe: DeScriber<T>

    constructor(){
        this._scribe = new DeScriber<T>()
    }

    subForm<S>(subFormDefinition: S){
        return this._scribe.attribute(FieldType.SubForm, subFormDefinition)
    }
}

export class DeForm<T> {
    _scanner: DeScanner<T>

    constructor(private _formDefinition: T) {
        this._scanner = new DeScanner<T>(_formDefinition)
    }

    subFormDefinition(subFormField: keyof T) {
        return this._scanner.attribute(FieldType.SubForm, subFormField)
    }

    subFormFields(): Array<keyof T> {
        return this._scanner.attributed(FieldType.SubForm) || []
    }

    formState(current: T, original?: T, suggested?: T, subFormDefinition: any = null): DeFormState<T> {
        let value = {}
        let subFormFields = this.subFormFields()

        let deform = this as DeForm<any>
        if (subFormDefinition) deform = new DeForm<any>(subFormDefinition)

        for (let key in current) {
            if (subFormFields.indexOf(key) >= 0) {
                let subFormDefinition = this.subFormDefinition(key)
                value[key.toString()] = deform.formState(current[key], original && original[key], suggested && suggested[key])
            }
            else {
                value[key.toString()] = new Value(current[key], original && original[key], suggested && suggested[key])
            }
        }

        return value as DeFormState<T>
    }
}

export default DeForm