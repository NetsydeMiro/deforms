import Value from './Value'
import DeForm from './DeForm'
import { isArray, forceCast } from './utility'

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

type Fieldify<T extends any> = Case<T['**__DeForm_FieldType**'], Value<T>, FormState<T>, Array<FormState<T['**__DeForm_ArrayType**']>>>

export type FormStatify<T> = {
    [k in keyof T]: Fieldify<T[k]> 
}

interface FormStateFields<T> {
    isSelected?: boolean
    isDeleted?: boolean
}

export type FormState<T> = FormStatify<T> & FormStateFields<T>

export function createFormState<T>(definition: T, current: T, original?: T, suggested?: T): FormState<T> {
    let value = {}
    let deform = new DeForm<T>()
    let subFormFields = deform.getSubFormFields(definition)

    for (let key in current) {
        if (subFormFields.indexOf(key) >= 0) {
            let subFormDefinition = deform.getSubFormDefinition(definition, key)
            value[key.toString()] = createFormState(subFormDefinition, current[key], original && original[key], suggested && suggested[key])
        }
        else {
            value[key.toString()] = new Value(current[key], original && original[key], suggested && suggested[key])
        }
    }

    return value as FormState<T>
}

export default FormState

/*
interface TestInterface {
    aString: string
    aBoolean: boolean
    aDate: Date
    anObject: TestInterface
    anArray: Array<TestInterface>
}

let test: TestInterface = {
    aString: 'jack', 
    aBoolean: true, 
    aDate: new Date(), 
    anObject: {
        aString: 'jack', 
        aBoolean: true, 
        aDate: new Date(), 
        anObject: null, 
        anArray: []
    }, 
    anArray: []
}

let formified = createFormState(test)
*/