const { describe, it, beforeEach } = intern.getInterface('bdd')
const { expect } = intern.getPlugin('chai')

import { DeFormAttribute } from '../src/DeForm'
import DeFormState, { createFormState } from '../src/DeFormState'

interface TestInterface {
    aString: string
    aSubFormArray?: Array<TestInterface>
}

let attribute = new DeFormAttribute<TestDefinition>()

class TestDefinition implements TestInterface {
    aString: string
    @attribute.subForm(new TestDefinition())
    aSubFormArray?: Array<TestInterface>
}

let testDefinition = new TestDefinition()

let current: TestInterface = {
    aString: 'currentString', 
    aSubFormArray: [
        { aString: 'currentSubString1' }, 
        { aString: 'currentSubString2' }, 
    ]
}

let original: TestInterface = {
    aString: 'originalSubString1', 
    aSubFormArray: [
        { aString: 'originalSubString1' }, 
        { aString: 'originalSubString2' }, 
    ]
}

let suggested: TestInterface = {
    aString: 'suggestedSubString1', 
    aSubFormArray: [
        { aString: 'suggestedSubString1' }, 
        { aString: 'suggestedSubString2' }, 
    ]
}

let formState: DeFormState<TestInterface> 

describe("createFormState SubForm Arrays", () => {
    describe("defaults", () => {
        beforeEach(() => {
            formState = createFormState(testDefinition, current)
        })
        it('sets current subform values', () => {
            expect(formState.aSubFormArray[0].aString.current).to.equal(current.aSubFormArray[0].aString)
            expect(formState.aSubFormArray[1].aString.current).to.equal(current.aSubFormArray[1].aString)
        })
        it('leaves original subform values undefined', () => {
            expect(formState.aSubFormArray[0].aString.original).to.be.undefined
            expect(formState.aSubFormArray[1].aString.original).to.be.undefined
        })
        it('leaves suggested subform values undefined', () => {
            expect(formState.aSubFormArray[0].aString.suggested).to.be.undefined
            expect(formState.aSubFormArray[1].aString.suggested).to.be.undefined
        })
    })
    describe("all values specified", () => {
        beforeEach(() => {
            formState = createFormState(testDefinition, current, original, suggested)
        })
        it('sets original subform values', () => {
            expect(formState.aSubFormArray[0].aString.original).to.equal(original.aSubFormArray[0].aString)
            expect(formState.aSubFormArray[1].aString.original).to.equal(original.aSubFormArray[1].aString)
        })
        it('sets suggested subfrom values', () => {
            expect(formState.aSubFormArray[0].aString.suggested).to.equal(suggested.aSubFormArray[0].aString)
            expect(formState.aSubFormArray[1].aString.suggested).to.equal(suggested.aSubFormArray[1].aString)
        })
    })
})