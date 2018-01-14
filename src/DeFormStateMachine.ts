import { clone } from './utility'
import DeScriber from './DeScriber'
import DeFormState, { DeFormStatify } from './DeFormState'

interface FormSelectorStep {
    field: string
}

export class DeFormStateMachine<T> {
    constructor(private formDefinition: T) { }

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

            newState[step.field] = this.set(newState[step.field], field, value, newSelector)
        }

        return newState
    }

    setSelected(formState: DeFormState<T>, isSelected = true): DeFormState<T> {
        let newState = clone(formState)
        newState.isSelected = isSelected
        return newState
    }

    setDeleted(formState: DeFormState<T>, isDeleted = true): DeFormState<T> {
        let newState = clone(formState)
        newState.isDeleted = isDeleted
        return newState
    }
}

export default DeFormStateMachine