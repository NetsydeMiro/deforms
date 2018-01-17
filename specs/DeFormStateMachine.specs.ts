const { describe, it, beforeEach } = intern.getInterface('bdd')
const { expect } = intern.getPlugin('chai')

import DeScriber from '../src/DeScriber'
import DeFormState from '../src/DeFormState'
import DeForm, { DeFormAttribute } from '../src/DeForm'
import DeFormStateMachine from '../src/DeFormStateMachine'

let attribute = new DeFormAttribute<TestInterface>()

interface TestInterface {
    aString: string
    aNumber: number
    aSubForm?: TestInterface
    aSubFormArray?: Array<TestInterface>
}

let current: TestInterface = {
    aString: 'currentString', 
    aNumber: 1, 
    aSubForm: {
        aString: 'currentSubString', 
        aNumber: 11, 
    }, 
    aSubFormArray: [
        {aString: 'currentSubArrayString1', aNumber: 111}, 
        {aString: 'currentSubArrayString2', aNumber: 112}
    ]
}

let original: TestInterface = {
    aString: 'originalString', 
    aNumber: 2, 
    aSubForm: {
        aString: 'originalSubString', 
        aNumber: 22, 
    }, 
    aSubFormArray: [
        {aString: 'originalSubArrayString1', aNumber: 221}, 
        {aString: 'originalSubArrayString2', aNumber: 222}
    ]
}

class TestDefinition implements TestInterface {
    aString: string
    aNumber: number

    @attribute.subForm(new TestDefinition())
    aSubForm?: TestInterface

    @attribute.subForm(new TestDefinition())
    aSubFormArray?: Array<TestInterface>
}

let testDefinition = new TestDefinition()
let deform = new DeForm(testDefinition)

let deformStateMachine = new DeFormStateMachine(testDefinition)

let testState: DeFormState<TestInterface> 

describe("DeFormState", () => {
    beforeEach(() => {
        testState = deform.formState(current, original)
    })
    describe("set", () => {
        describe('fields', () => {
            it("sets the current value", () => {
                let newState = deformStateMachine.set(testState, 'aString', 'new value')
                expect(newState.aString.current).to.equal('new value')
            })
            it("doesn't alter the input state", () => {
                let newState = deformStateMachine.set(testState, 'aString', 'new value')
                expect(testState.aString.current).to.equal('currentString')
            })
            it("doesn't alter the original value", () => {
                let newState = deformStateMachine.set(testState, 'aString', 'new value')
                expect(testState.aString.original).to.equal('originalString')
            })
            it("doesn't alter the suggested value", () => {
                let newState = deformStateMachine.set(testState, 'aString', 'new value')
                expect(testState.aString.suggested).to.be.undefined
            })
        })
        describe('subforms', () => {
            it("sets the subform value", () => {
                let newState = deformStateMachine.set(testState, 'aString', 'new value', [{field: 'aSubForm'}])
                expect(newState.aSubForm.aString.current).to.equal('new value')
            })
            it("doesn't alter the input subform state", () => {
                let newState = deformStateMachine.set(testState, 'aString', 'new value', [{field: 'aSubForm'}])
                expect(testState.aSubForm.aString.current).to.equal('currentSubString')
            })
            it("doesn't alter the original value", () => {
                let newState = deformStateMachine.set(testState, 'aString', 'new value', [{field: 'aSubForm'}])
                expect(testState.aSubForm.aString.original).to.equal('originalSubString')
            })
            it("doesn't alter the suggested value", () => {
                let newState = deformStateMachine.set(testState, 'aString', 'new value', [{field: 'aSubForm'}])
                expect(testState.aSubForm.aString.suggested).to.be.undefined
            })
        })
        describe('subform arrays', () => {
            it("sets the array value", () => {
                let newState = deformStateMachine.set(testState, 'aString', 'new value', [{field: 'aSubFormArray', index: 0}])
                expect(newState.aSubFormArray[0].aString.current).to.equal('new value')
            })
            it("doesn't alter the input array state", () => {
                let newState = deformStateMachine.set(testState, 'aString', 'new value', [{field: 'aSubFormArray', index: 0}])
                expect(testState.aSubFormArray[0].aString.current).to.equal('currentSubArrayString1')
            })
            it("only alters targetted array index", () => {
                let newState = deformStateMachine.set(testState, 'aString', 'new value', [{field: 'aSubFormArray', index: 0}])
                expect(newState.aSubFormArray[1].aString.current).to.equal('currentSubArrayString2')
            })
        })
    })
})