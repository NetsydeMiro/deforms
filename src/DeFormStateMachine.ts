import { clone } from './utility'
import DeForm from './DeForm'
import DeFormState, { DeFormStatify, createFormState } from './DeFormState'

interface FormSelectorStep {
    field: string
    index?: number
}

export class DeFormStateMachine<T> {
    private _deform: DeForm<T>
    constructor(private _formDefinition: T) {
        this._deform = new DeForm(_formDefinition)
    }

    set<K extends keyof T>(formState: DeFormStatify<T>, field: K, value: T[K]): DeFormState<T>
    set(formState: DeFormStatify<T>, field: string, value: any, selector: Array<FormSelectorStep>): DeFormState<T>

    set(formState: DeFormStatify<T>, field: string, value: any, selector: Array<FormSelectorStep> = []): DeFormState<T> {
        let newState = clone(formState)

        if (selector.length == 0) {
            newState[field] = clone(newState[field])
            newState[field].current = value
        }
        else {
            let step = selector[0]
            let newSelector = selector.slice(1)

            if (step.index || step.index === 0) {
                // subform array
                newState[step.field] = newState[step.field].slice()
                newState[step.field][step.index] = this.set(newState[step.field][step.index], field, value, newSelector)
            }
            else {
                // embedded subform
                newState[step.field] = this.set(newState[step.field], field, value, newSelector)
            }
        }

        return newState
    }

    add<K extends keyof T>(formState: DeFormStatify<T>, field: K, newSubForm?: T[K]): DeFormState<T>
    add(formState: DeFormStatify<T>, field: string, newSubForm?: any, selector?: Array<FormSelectorStep>): DeFormState<T>

    add(formState: DeFormStatify<T>, field: string, newSubForm: any = null, selector: Array<FormSelectorStep> = []): DeFormState<T> {
        let newState = clone(formState)
        let { definition: subFormDefinition } = 
            this._deform.subForm(field as keyof T)

        if (selector.length == 0) {
            newState[field] = clone(newState[field])
            let newRecord = createFormState(subFormDefinition, newSubForm)
            newRecord.isNew = true

            newState[field].push(newRecord)
        }
        else {
            let step = selector[0]
            let newSelector = selector.slice(1)
            let machine = new DeFormStateMachine(subFormDefinition)

            if (step.index || step.index === 0) {
                // subform array
                newState[step.field] = newState[step.field].slice()
                newState[step.field][step.index] = machine.add(newState[step.field][step.index], field, newSubForm, newSelector)
            }
            else {
                // embedded subform
                newState[step.field] = machine.add(newState[step.field], field, newSubForm, newSelector)
            }
        }

        return newState

    }
}

export default DeFormStateMachine