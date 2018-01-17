const { describe, it, beforeEach } = intern.getInterface('bdd')
const { expect } = intern.getPlugin('chai')

import { DeFormAttribute } from '../src/DeForm'
import DeFormState, { createFormState } from '../src/DeFormState'

interface TestInterface {
    aString: string
    aSubFormArray?: Array<TestInterface>
}

let attribute = new DeFormAttribute<TestInterface>()

class TestDefinition implements TestInterface {
    aString: string
    @attribute.subForm({ definition: new TestDefinition(), noRecordMatching: true })
    aSubFormArray?: Array<TestInterface>
}

let testDefinition = new TestDefinition()

let current: TestInterface, original: TestInterface, suggested: TestInterface

let formState: DeFormState<TestInterface> 

describe("createFormState SubForm Arrays", () => {
    describe("defaults", () => {
        beforeEach(() => {
            current  = {
                aString: 'currentString',
                aSubFormArray: [
                    { aString: 'currentSubString1' },
                    { aString: 'currentSubString2' },
                ]
            }

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
    describe("form record status flags", () => {
        beforeEach(() => {
            current  = {
                aString: 'currentString',
                aSubFormArray: [
                    { aString: 'normal record' },
                    { aString: 'new record' },
                    undefined, 
                    undefined
                ]
            }

            original = {
                aString: 'originalSubString1',
                aSubFormArray: [
                    { aString: 'normal record' },
                    undefined, 
                    { aString: 'deleted record' },
                    undefined
                ]
            }

            suggested = {
                aString: 'suggestedSubString1',
                aSubFormArray: [
                    { aString: 'normal record' },
                    undefined, 
                    undefined, 
                    { aString: 'suggested record' },
                ]
            }

            formState = createFormState(testDefinition, current, original, suggested)
        })
        it('does not set any flags if all values specified', () => {
            expect(
                formState.aSubFormArray[0].isDeleted || 
                formState.aSubFormArray[0].isNew || 
                formState.aSubFormArray[0].isSuggested
            ).to.not.be.ok
        })
        it('sets new flag if current value is specified, and original is not', () => {
            expect(
                formState.aSubFormArray[1].isDeleted || 
                formState.aSubFormArray[1].isSuggested
            ).to.not.be.ok
            expect(formState.aSubFormArray[1].isNew).to.be.true
        })
        it('sets deleted flag if original value is specified, and current is not', () => {
            expect(
                formState.aSubFormArray[2].isNew || 
                formState.aSubFormArray[2].isSuggested
            ).to.not.be.ok
            expect(formState.aSubFormArray[2].isDeleted).to.be.true
        })
        it('sets suggested flag if suggested value is specified, and current and original are not', () => {
            expect(
                formState.aSubFormArray[3].isNew || 
                formState.aSubFormArray[3].isSelected
            ).to.not.be.ok
            expect(formState.aSubFormArray[3].isSuggested).to.be.true
        })
    })
})