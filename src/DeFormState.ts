import { forceCast } from './utility'
import Value from './Value'
import DeForm from './DeForm'
import { debug } from 'util';

// adapted from https://stackoverflow.com/questions/46333496/typescript-complex-mapped-types-that-extract-generic
// Hacked, since conditional mapped types are not yet part of the Typescript language spec
type Primitive = 'Primitive';
type SubForm = 'SubForm';
type SubFormArray = 'SubFormArray';
type FieldType = Primitive | SubForm | SubFormArray
type Case<Typ extends FieldType, Prim, Sub, SubArray> = { Primitive: Prim; SubForm: Sub; SubFormArray: SubArray }[Typ];

declare global {
    interface Object {
        "**__DeForm_FieldType**": SubForm
    }
    interface String {
        "**__DeForm_FieldType**": Primitive
    }
    interface Boolean {
        "**__DeForm_FieldType**": Primitive
    }
    interface Number {
        "**__DeForm_FieldType**": Primitive
    }
    interface Date {
        "**__DeForm_FieldType**": Primitive
    }
    interface Array<T> {
        "**__DeForm_FieldType**": SubFormArray
        "**__DeForm_ArrayType**": T
    }
}

type Fieldify<T extends any> = Case<T['**__DeForm_FieldType**'], Value<T>, DeFormState<T>, Array<DeFormState<T['**__DeForm_ArrayType**']>>>

export type DeFormStatify<T> = {
    [k in keyof T]: Fieldify<T[k]> 
}

interface DeFormStateFields<T> {
    isSelected?: boolean
    isDeleted?: boolean
}

export type DeFormState<T> = DeFormStatify<T> & DeFormStateFields<T>

export function createFormState<T>(subFormDefinition: T, current: T, original?: T, suggested?: T): DeFormState<T> {
    let value = {}

    let deform = new DeForm<any>(subFormDefinition)
    let subFormFields = deform.subFormFields()

    for (let key in current) {
        if (subFormFields.indexOf(key) >= 0) {
            let subFormDefinition = deform.subFormDefinition(key)
            let type = deform.type(key)

            if (type == Array) {
                // subform array
                value[key.toString()] = (forceCast<Array<any>>(current[key])).map((current, ix) => {
                    return createFormState(subFormDefinition, 
                        current, 
                        original && original[key] && original[key][ix], 
                        suggested && suggested[key] && suggested[key][ix])
                })
            }
            else {
                // single embedded subform
                value[key.toString()] = createFormState(subFormDefinition, current[key], original && original[key], suggested && suggested[key])
            }
        }
        else {
            value[key.toString()] = new Value(current[key], original && original[key], suggested && suggested[key])
        }
    }

    return value as DeFormState<T>
}

export default DeFormState
