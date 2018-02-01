const { describe, it, beforeEach } = intern.getInterface('bdd')
const { expect } = intern.getPlugin('chai')

import DeScriber from '../src/DeScriber'
import DeFormState from '../src/DeFormState'
import DeForm, { DeFormAttribute } from '../src/DeForm'
import DeFormStateMachine from '../src/DeFormStateMachine'

let attribute = new DeFormAttribute<TestInterface>()

interface TestInterface {
    aString: string
    aSubFormArray?: Array<TestInterface>
}

class TestDefinition implements TestInterface {
    @attribute.field()
    aString: string

    @attribute.subForm({ definition: new TestDefinition() })
    aSubFormArray?: Array<TestInterface>
}

let testDefinition = new TestDefinition()
let deform = new DeForm(testDefinition)

let deformStateMachine = new DeFormStateMachine(testDefinition)

let testState: DeFormState<TestInterface>

describe("DeFormStateMachine Record Editing", () => {
    beforeEach(() => {
        let current: TestInterface = {
            aString: 'currentString',
            aSubFormArray: [
                { aString: 'currentSubArrayString1' },
                { aString: 'currentSubArrayString2' }
            ]
        }

        let original: TestInterface = {
            aString: 'originalString',
            aSubFormArray: [
                { aString: 'originalSubArrayString1' },
                { aString: 'originalSubArrayString2' }
            ]
        }

        let suggested: TestInterface = {
            aString: 'suggestedString',
            aSubFormArray: [
                { aString: 'suggestedSubArrayString1' },
                { aString: 'currentSubArrayString2' }
            ]
        }

        testState = deform.formState(current, original, suggested)
    })
    it("starts with the expected state", () => {
        expect(testState.aSubFormArray).to.be.of.length(3)

        expect(testState.aSubFormArray[0].aString.current).to.equal('currentSubArrayString1')
        expect(testState.aSubFormArray[0].aString.original).to.equal('originalSubArrayString1')
        expect(testState.aSubFormArray[0].aString.suggested).to.be.undefined

        expect(testState.aSubFormArray[1].aString.current).to.equal('currentSubArrayString2')
        expect(testState.aSubFormArray[1].aString.original).to.equal('originalSubArrayString2')
        expect(testState.aSubFormArray[1].aString.suggested).to.equal('currentSubArrayString2')

        expect(testState.aSubFormArray[2].aString.current).to.be.undefined
        expect(testState.aSubFormArray[2].aString.original).to.be.undefined
        expect(testState.aSubFormArray[2].aString.suggested).to.equal('suggestedSubArrayString1')

        expect(testState.aSubFormArray[3]).to.be.undefined
    })
    describe("add", () => {
        it("adds a new subform", () => {
            let newState = deformStateMachine.add(testState, 'aSubFormArray')
            expect(newState.aSubFormArray[3]).to.not.be.undefined
            expect(newState.aSubFormArray[3].isNew).to.be.true
        })
        it("does not change input state", () => {
            let newState = deformStateMachine.add(testState, 'aSubFormArray')
            expect(testState.aSubFormArray[3]).to.be.undefined
        })
        it("adds a specific subform", () => {
            let newSubForm: TestInterface = {
                aString: 'New Record!'
            }

            let newState = deformStateMachine.add(testState, 'aSubFormArray', newSubForm)
            expect(newState.aSubFormArray[3]).to.not.be.undefined
            expect(newState.aSubFormArray[3].isNew).to.be.true
            expect(newState.aSubFormArray[3].aString.current).to.equal('New Record!')
            expect(newState.aSubFormArray[3].aString.suggested).to.be.undefined
            expect(newState.aSubFormArray[3].aString.original).to.be.undefined
        })
    })
})