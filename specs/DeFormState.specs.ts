const { describe, it, beforeEach } = intern.getInterface('bdd')
const { expect } = intern.getPlugin('chai')

import { DeFormAttribute } from '../src/DeForm'
import DeFormState, { createFormState, getFormValue } from '../src/DeFormState'
import { ValueInterface } from '../src/Value'

interface TestInterface {
    aString: string
    aBoolean: boolean
    aNumber: number
    aDate: Date
    aSubForm?: TestInterface
}

let attribute = new DeFormAttribute<TestDefinition>()

class TestDefinition implements TestInterface {
    @attribute.field()
    aString: string
    @attribute.field()
    aBoolean: boolean
    @attribute.field()
    aNumber: number
    @attribute.field()
    aDate: Date
    @attribute.subForm({ definition: new TestDefinition()})
    aSubForm?: TestInterface
}

let testDefinition = new TestDefinition()

let current: TestInterface = {
    aString: 'currentString', 
    aBoolean: true, 
    aNumber: 1, 
    aDate: new Date(2017, 1, 1), 
    aSubForm: {
        aString: 'currentSubString', 
        aBoolean: false, 
        aNumber: 11, 
        aDate: new Date(2017, 1, 11), 
    }
}

let original: TestInterface = {
    aString: 'originalString', 
    aBoolean: false, 
    aNumber: 2, 
    aDate: new Date(2017, 1, 2), 
    aSubForm: {
        aString: 'originalSubString', 
        aBoolean: true, 
        aNumber: 22, 
        aDate: new Date(2017, 1, 22), 
    }
}

let suggested: TestInterface = {
    aString: 'suggestedString', 
    aBoolean: null, 
    aNumber: 3, 
    aDate: new Date(2017, 1, 3), 
    aSubForm: {
        aString: 'suggestedSubString', 
        aBoolean: undefined, 
        aNumber: 33, 
        aDate: new Date(2017, 3, 1), 
    }
}

let formState: DeFormState<TestInterface> 
let formValue: ValueInterface<TestInterface>

describe("createFormState", () => {
    describe("defaults", () => {
        beforeEach(() => {
            formState = createFormState(testDefinition, current)
        })
        it('sets isSelected falsy', () => {
            expect(formState.isSelected).to.not.be.ok
        })
        it('sets isDeleted falsy', () => {
            expect(formState.isSelected).to.not.be.ok
        })
        it('sets current values', () => {
            expect(formState.aString.current).to.equal(current.aString)
            expect(formState.aBoolean.current).to.equal(current.aBoolean)
            expect(formState.aNumber.current).to.equal(current.aNumber)
            expect(formState.aDate.current).to.equal(current.aDate)
        })
        it('sets current subform values', () => {
            expect(formState.aSubForm.aString.current).to.equal(current.aSubForm.aString)
            expect(formState.aSubForm.aBoolean.current).to.equal(current.aSubForm.aBoolean)
            expect(formState.aSubForm.aNumber.current).to.equal(current.aSubForm.aNumber)
            expect(formState.aSubForm.aDate.current).to.equal(current.aSubForm.aDate)
        })
        it('leaves originals undefined', () => {
            expect(formState.aString.original).to.be.undefined
            expect(formState.aBoolean.original).to.be.undefined
            expect(formState.aNumber.original).to.be.undefined
            expect(formState.aDate.original).to.be.undefined
        })
        it('leaves original subform values undefined', () => {
            expect(formState.aSubForm.aString.original).to.be.undefined
            expect(formState.aSubForm.aBoolean.original).to.be.undefined
            expect(formState.aSubForm.aNumber.original).to.be.undefined
            expect(formState.aSubForm.aDate.original).to.be.undefined
        })
        it('leaves suggesteds undefined', () => {
            expect(formState.aString.suggested).to.be.undefined
            expect(formState.aBoolean.suggested).to.be.undefined
            expect(formState.aNumber.suggested).to.be.undefined
            expect(formState.aDate.suggested).to.be.undefined
        })
        it('leaves suggested subform values undefined', () => {
            expect(formState.aSubForm.aString.suggested).to.be.undefined
            expect(formState.aSubForm.aBoolean.suggested).to.be.undefined
            expect(formState.aSubForm.aNumber.suggested).to.be.undefined
            expect(formState.aSubForm.aDate.suggested).to.be.undefined
        })
    })
    describe("all values specified", () => {
        beforeEach(() => {
            formState = createFormState(testDefinition, current, original, suggested)
        })
        it('sets originals', () => {
            expect(formState.aString.original).to.equal(original.aString)
            expect(formState.aBoolean.original).to.equal(original.aBoolean)
            expect(formState.aNumber.original).to.equal(original.aNumber)
            expect(formState.aDate.original).to.equal(original.aDate)
        })
        it('sets original subform values', () => {
            expect(formState.aSubForm.aString.original).to.equal(original.aSubForm.aString)
            expect(formState.aSubForm.aBoolean.original).to.equal(original.aSubForm.aBoolean)
            expect(formState.aSubForm.aNumber.original).to.equal(original.aSubForm.aNumber)
            expect(formState.aSubForm.aDate.original).to.equal(original.aSubForm.aDate)
        })
        it('sets suggesteds', () => {
            expect(formState.aString.suggested).to.equal(suggested.aString)
            expect(formState.aBoolean.suggested).to.equal(suggested.aBoolean)
            expect(formState.aNumber.suggested).to.equal(suggested.aNumber)
            expect(formState.aDate.suggested).to.equal(suggested.aDate)
        })
        it('sets suggested subfrom values', () => {
            expect(formState.aSubForm.aString.suggested).to.equal(suggested.aSubForm.aString)
            expect(formState.aSubForm.aBoolean.suggested).to.equal(suggested.aSubForm.aBoolean)
            expect(formState.aSubForm.aNumber.suggested).to.equal(suggested.aSubForm.aNumber)
            expect(formState.aSubForm.aDate.suggested).to.equal(suggested.aSubForm.aDate)
        })
    })
})

describe("getFormData", () => {
    describe("defaults", () => {
        beforeEach(() => {
            formState = createFormState(testDefinition, current)
            formValue = getFormValue(testDefinition, formState)
        })
        it('gets current values', () => {
            expect(formValue.current.aString).to.equal(current.aString)
            expect(formValue.current.aBoolean).to.equal(current.aBoolean)
            expect(formValue.current.aNumber).to.equal(current.aNumber)
            expect(formValue.current.aDate).to.equal(current.aDate)
        })
        it('gets current subform values', () => {
            expect(formValue.current.aSubForm.aString).to.equal(current.aSubForm.aString)
            expect(formValue.current.aSubForm.aBoolean).to.equal(current.aSubForm.aBoolean)
            expect(formValue.current.aSubForm.aNumber).to.equal(current.aSubForm.aNumber)
            expect(formValue.current.aSubForm.aDate).to.equal(current.aSubForm.aDate)
        })
        it('leaves originals undefined', () => {
            expect(formValue.original.aString).to.be.undefined
            expect(formValue.original.aBoolean).to.be.undefined
            expect(formValue.original.aNumber).to.be.undefined
            expect(formValue.original.aDate).to.be.undefined
        })
        it('leaves original subform values undefined', () => {
            expect(formValue.original.aSubForm.aString).to.be.undefined
            expect(formValue.original.aSubForm.aBoolean).to.be.undefined
            expect(formValue.original.aSubForm.aNumber).to.be.undefined
            expect(formValue.original.aSubForm.aDate).to.be.undefined
        })
        it('leaves suggesteds undefined', () => {
            expect(formValue.suggested.aString).to.be.undefined
            expect(formValue.suggested.aBoolean).to.be.undefined
            expect(formValue.suggested.aNumber).to.be.undefined
            expect(formValue.suggested.aDate).to.be.undefined
        })
        it('leaves suggested subform values undefined', () => {
            expect(formValue.suggested.aSubForm.aString).to.be.undefined
            expect(formValue.suggested.aSubForm.aBoolean).to.be.undefined
            expect(formValue.suggested.aSubForm.aNumber).to.be.undefined
            expect(formValue.suggested.aSubForm.aDate).to.be.undefined
        })
    })
    describe("all values specified", () => {
        beforeEach(() => {
            formState = createFormState(testDefinition, current, original, suggested)
            formValue = getFormValue(testDefinition, formState)
        })
        it('sets originals', () => {
            expect(formValue.original.aString).to.equal(original.aString)
            expect(formValue.original.aBoolean).to.equal(original.aBoolean)
            expect(formValue.original.aNumber).to.equal(original.aNumber)
            expect(formValue.original.aDate).to.equal(original.aDate)
        })
        it('sets original subform values', () => {
            expect(formValue.original.aSubForm.aString).to.equal(original.aSubForm.aString)
            expect(formValue.original.aSubForm.aBoolean).to.equal(original.aSubForm.aBoolean)
            expect(formValue.original.aSubForm.aNumber).to.equal(original.aSubForm.aNumber)
            expect(formValue.original.aSubForm.aDate).to.equal(original.aSubForm.aDate)
        })
        it('sets suggesteds', () => {
            expect(formValue.suggested.aString).to.equal(suggested.aString)
            expect(formValue.suggested.aBoolean).to.equal(suggested.aBoolean)
            expect(formValue.suggested.aNumber).to.equal(suggested.aNumber)
            expect(formValue.suggested.aDate).to.equal(suggested.aDate)
        })
        it('sets suggested subfrom values', () => {
            expect(formValue.suggested.aSubForm.aString).to.equal(suggested.aSubForm.aString)
            expect(formValue.suggested.aSubForm.aBoolean).to.equal(suggested.aSubForm.aBoolean)
            expect(formValue.suggested.aSubForm.aNumber).to.equal(suggested.aSubForm.aNumber)
            expect(formValue.suggested.aSubForm.aDate).to.equal(suggested.aSubForm.aDate)
        })
    })
})
