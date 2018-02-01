import Value from './Value'
import DeScriber, { DeScanner } from './DeScriber'
import DeFormState, { createFormState } from './DeFormState'

enum AttributeType {
    Field, 
    Key, 
    SubForm
}

interface FieldAttribute {
    isKey?: boolean
}

interface SubFormAttribute {
    definition: any
    omitRecordMatching?: boolean
}

export class DeFormAttribute<T> {
    private _scribe: DeScriber<T>

    constructor(){
        this._scribe = new DeScriber<T>()
    }

    subForm(attribute: SubFormAttribute = { definition: {}, omitRecordMatching: false }) {
        return this._scribe.attribute(AttributeType.SubForm, attribute)
    }

    field(attribute: FieldAttribute = { isKey: false }) {
        return this._scribe.attribute(AttributeType.Field, true, AttributeType.Key, attribute.isKey)
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
        return this._scanner.attribute(AttributeType.SubForm, subFormField)
    }

    subForms(): Array<keyof T> {
        return this._scanner.attributed(AttributeType.SubForm) || []
    }

    fields(): Array<keyof T> {
        return this._scanner.attributed(AttributeType.Field) || []
    }

    keys(): Array<keyof T> {
        let fields = this._scanner.attributed(AttributeType.Key) || []
        let keys = fields.filter(f => this._scanner.attribute(AttributeType.Key, f))
        return keys
    }

    formState(current: T, original?: T, suggested?: T): DeFormState<T> {
        return createFormState(this._formDefinition, current, original, suggested)
    }
}

export default DeForm