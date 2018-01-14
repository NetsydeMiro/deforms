import Value from './Value'

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

export default DeFormState
