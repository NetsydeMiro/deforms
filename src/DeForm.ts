import Value from './Value'
import DeScriber, { DeScanner } from './DeScriber'
import DeFormState, { createFormState } from './DeFormState'

enum FieldType {
    SubForm
}

interface SubFormAttribute {
    subFormDefinition: any
    noRecordMatching: boolean
}

export class DeFormAttribute<T> {
    private _scribe: DeScriber<T>

    constructor(){
        this._scribe = new DeScriber<T>()
    }

    subForm(subFormDefinition: any, noRecordMatching=false){
        let attribute: SubFormAttribute = {
            subFormDefinition, 
            noRecordMatching
        }
        return this._scribe.attribute(FieldType.SubForm, attribute)
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

    subForm(subFormField: keyof T): SubFormAttribute {
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