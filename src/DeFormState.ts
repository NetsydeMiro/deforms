import { clone } from './utility'
import DeScriber from './DeScriber'
import FormState, { FormStatify } from './FormState'

interface FormSelectorStep {
    field: string
}

export class DeFormState<T> {
    constructor(private formDefinition: T) { }

    set<K extends keyof T>(formState: FormStatify<T>, field: K, value: T[K]): FormState<T> 
    set(formState: FormStatify<T>, field: string, value: any, selector: Array<FormSelectorStep>): FormState<T> 

    set(formState: FormStatify<T>, field: string, value: any, selector: Array<FormSelectorStep> = []): FormState<T> {
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

    setSelected(formState: FormState<T>, isSelected = true): FormState<T> {
        let newState = clone(formState)
        newState.isSelected = isSelected
        return newState
    }

    setDeleted(formState: FormState<T>, isDeleted = true): FormState<T> {
        let newState = clone(formState)
        newState.isDeleted = isDeleted
        return newState
    }
}

export default DeFormState