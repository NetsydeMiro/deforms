import Value from './Value'
import DeScriber, { DeScanner } from './DeScriber'
import DeFormState, { createFormState } from './DeFormState'

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

    type(field: keyof T) {
        return this._scanner.type(field)
    }

    subFormDefinition(subFormField: keyof T) {
        return this._scanner.attribute(FieldType.SubForm, subFormField)
    }

    subFormFields(): Array<keyof T> {
        return this._scanner.attributed(FieldType.SubForm) || []
    }

    formState(current: T, original?: T, suggested?: T): DeFormState<T> {
        return createFormState(this._formDefinition, current, original, suggested)
    }
}

export default DeForm