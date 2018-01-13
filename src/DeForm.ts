import DeScriber from './DeScriber'

enum FieldType {
    SubForm
}

export class DeForm<T> {
    private _scribe: DeScriber<T>

    constructor(){
        this._scribe = new DeScriber<T>()
    }

    subForm<S>(subFormDefinition: S){
        return this._scribe.setAttribute(FieldType.SubForm, subFormDefinition)
    }

    getSubFormDefinition(formDefinition: T, subFormField: keyof T) {
        return this._scribe.getAttribute(formDefinition, FieldType.SubForm, subFormField)
    }

    getSubFormFields(formDefinition: T): Array<keyof T> {
        return this._scribe.getAttributed(formDefinition, FieldType.SubForm) || []
    }
}

export default DeForm