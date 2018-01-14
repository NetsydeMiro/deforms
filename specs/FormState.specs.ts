const { describe, it, beforeEach } = intern.getInterface('bdd')
const { expect } = intern.getPlugin('chai')

import FormState from '../src/FormState'
import DeForm from '../src/DeForm'

interface TestInterface {
    aString: string
    aBoolean: boolean
    aNumber: number
    aDate: Date
}

class TestDefinition implements TestInterface {
    aString: string
    aBoolean: boolean
    aNumber: number
    aDate: Date
}

let testDefinition = new TestDefinition()

let current: TestInterface = {
    aString: 'currentString', 
    aBoolean: true, 
    aNumber: 1, 
    aDate: new Date(2017, 1, 1)
}

let original: TestInterface = {
    aString: 'originalString', 
    aBoolean: false, 
    aNumber: 2, 
    aDate: new Date(2017, 1, 2)
}

let suggested: TestInterface = {
    aString: 'suggestedString', 
    aBoolean: null, 
    aNumber: 3, 
    aDate: new Date(2017, 1, 3)
}


let deform = new DeForm(testDefinition)
let formState: FormState<TestInterface> 

describe("createFormState", () => {
    describe("defaults", () => {
        beforeEach(() => {
            formState = deform.formState(current)
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
        it('leaves originals undefined', () => {
            expect(formState.aString.original).to.be.undefined
            expect(formState.aBoolean.original).to.be.undefined
            expect(formState.aNumber.original).to.be.undefined
            expect(formState.aDate.original).to.be.undefined
        })
        it('leaves suggesteds undefined', () => {
            expect(formState.aString.suggested).to.be.undefined
            expect(formState.aBoolean.suggested).to.be.undefined
            expect(formState.aNumber.suggested).to.be.undefined
            expect(formState.aDate.suggested).to.be.undefined
        })
    })
    describe("all values specified", () => {
        beforeEach(() => {
            formState = deform.formState(current, original, suggested)
        })
        it('sets current values', () => {
            expect(formState.aString.current).to.equal(current.aString)
            expect(formState.aBoolean.current).to.equal(current.aBoolean)
            expect(formState.aNumber.current).to.equal(current.aNumber)
            expect(formState.aDate.current).to.equal(current.aDate)
        })
        it('sets originals', () => {
            expect(formState.aString.original).to.equal(original.aString)
            expect(formState.aBoolean.original).to.equal(original.aBoolean)
            expect(formState.aNumber.original).to.equal(original.aNumber)
            expect(formState.aDate.original).to.equal(original.aDate)
        })
        it('sets suggesteds', () => {
            expect(formState.aString.suggested).to.equal(suggested.aString)
            expect(formState.aBoolean.suggested).to.equal(suggested.aBoolean)
            expect(formState.aNumber.suggested).to.equal(suggested.aNumber)
            expect(formState.aDate.suggested).to.equal(suggested.aDate)
        })
    })
})
