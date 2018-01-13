import Value from './Value'
import { isArray, forceCast } from './utility'

type FormStatify<T> = {
    [k in keyof T]: Value<T[k]> 
}

interface FormStateFields {
    isSelected?: boolean
}

export type FormState<T> = FormStatify<T> & FormStateFields

export function createFormState<T>(current: T, original?: T, suggested?: T): FormState<T> {
    let value = {}

    for (let key in current) {
        value[key.toString()] = new Value(current[key], original && original[key], suggested && suggested[key])
    }

    return value as FormState<T>
}
