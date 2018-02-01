import { forceCast, union, difference } from './utility'
import Value from './Value'
import DeForm from './DeForm'

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
    isNew?: boolean
    isSuggested?: boolean
}

export type DeFormState<T> = DeFormStatify<T> & DeFormStateFields<T>

export function createFormState<T>(formDefinition: T, current: T, original?: T, suggested?: T): DeFormState<T> {
    let formState = forceCast<DeFormState<T>>({})

    let deform = new DeForm<any>(formDefinition)

    // this won't work if inputs are all null or undefined
    // let allFields = union(current && Object.keys(current), original && Object.keys(original), suggested && Object.keys(suggested))
    let fields = deform.fields()
    let subFormFields = deform.subForms()
    let allFields = fields.concat(subFormFields)

    for (let key of allFields) {
        if (subFormFields.indexOf(key) >= 0) {
            let { definition: subFormDefinition, omitRecordMatching } = deform.subForm(key)
            let type = deform.type(key)
            let matchedSuggestedRecords = []

            if (type == Array) {
                // subform array formed from current values
                let currentRecords = current && current[key] && (forceCast<Array<any>>(current[key])).map((currentSubForm, ix) => {
                    let suggestedSubForm

                    // no record matching mean we align records strictly by index
                    if (omitRecordMatching) suggestedSubForm = suggested && suggested[key] && suggested[key][ix]

                    else if (currentSubForm) {
                        let subDeform = new DeForm(subFormDefinition)
                        let matchFields = subDeform.keys()

                        // if there are no key fields defined, we'll match by all non-subform fields
                        if (matchFields.length == 0) matchFields = difference(allFields, subFormFields)

                        suggestedSubForm = suggested && suggested[key] && 
                            forceCast<Array<any>>(suggested[key]).find((subForm) => {
                                return matchFields.every(field => subForm && (subForm[field] == currentSubForm[field]) )
                            })
                    }

                    if (suggestedSubForm) matchedSuggestedRecords.push(suggestedSubForm)

                    return createFormState(subFormDefinition, 
                        currentSubForm, 
                        original && original[key] && original[key][ix], 
                        suggestedSubForm) // && suggested[key] && suggested[key][ix])
                }) || []

                // subform array formed from unmatched suggested values
                let suggestedRecords = suggested && suggested[key] && difference(forceCast<Array<any>>(suggested[key]), matchedSuggestedRecords).
                    map(suggestedSubForm => createFormState(subFormDefinition, undefined, undefined, suggestedSubForm)) || []

                formState[key.toString()] = currentRecords.concat(suggestedRecords)
            }
            else {
                // single embedded subform
                if (current && current[key] || suggested && suggested[key]) {
                    formState[key.toString()] = createFormState(subFormDefinition, current && current[key], original && original[key], suggested && suggested[key])
                }
            }
        }
        else {
            formState[key.toString()] = new Value(current && current[key], original && original[key], suggested && suggested[key])
        }
    }
    
    if (current && original === undefined) formState.isNew = true
    else if (original && current === undefined) formState.isDeleted = true
    else if (suggested && current === undefined && original === undefined) formState.isSuggested = true

    return formState
}

export default DeFormState
