const { describe, it, beforeEach } = intern.getInterface('bdd')
const { expect } = intern.getPlugin('chai')

import DeScriber from '../src/DeScriber'
import FormState from '../src/FormState'
import DeForm, { DeFormAttribute } from '../src/DeForm'
import DeFormStateMachine from '../src/DeFormStateMachine'

let attribute = new DeFormAttribute<TestInterface>()

interface TestInterface {
    aString: string
    aNumber: number
    aSubForm?: TestInterface
}

let current: TestInterface = {
    aString: 'currentString', 
    aNumber: 1, 
    aSubForm: {
        aString: 'currentSubString', 
        aNumber: 11, 
    }
}

let original: TestInterface = {
    aString: 'originalString', 
    aNumber: 2, 
    aSubForm: {
        aString: 'originalSubString', 
        aNumber: 22, 
    }
}

class TestDefinition implements TestInterface {
    aString: string
    aNumber: number
    @attribute.subForm(new TestDefinition())
    aSubForm?: TestInterface
}

let testDefinition = new TestDefinition()
let deform = new DeForm(testDefinition)

let deformStateMachine = new DeFormStateMachine(testDefinition)

let testState: FormState<TestInterface> 

describe("DeFormState", () => {
    beforeEach(() => {
        testState = deform.formState(current, original)
    })
    describe("set", () => {
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
        it("sets the embedded value", () => {
            let newState = deformStateMachine.set(testState, 'aString', 'new value', [{field: 'aSubForm'}])
            expect(newState.aSubForm.aString.current).to.equal('new value')
        })
        it("doesn't alter the input embedded state", () => {
            let newState = deformStateMachine.set(testState, 'aString', 'new value', [{field: 'aSubForm'}])
            expect(testState.aSubForm.aString.current).to.equal('currentSubString')
        })
    })
    describe("setSelected", () => {
        it("sets selected true by default", () => {
            expect(testState.isSelected).to.not.be.ok
            let newState = deformStateMachine.setSelected(testState)
            expect(newState.isSelected).to.be.true
        })
        it("can set selected back to false", () => {
            let newState = deformStateMachine.setSelected(testState)
            expect(newState.isSelected).to.be.true
            newState = deformStateMachine.setSelected(testState, false)
            expect(newState.isSelected).to.be.false
        })
        it("doesn't alter the original state", () => {
            expect(testState.isSelected).to.not.be.ok
            let newState = deformStateMachine.setSelected(testState)
            expect(testState.isSelected).to.not.be.ok
        })
    })
    describe("setDeleted", () => {
        it("sets deleted true by default", () => {
            expect(testState.isDeleted).to.not.be.ok
            let newState = deformStateMachine.setDeleted(testState)
            expect(newState.isDeleted).to.be.true
        })
        it("can set deleted back to false", () => {
            let newState = deformStateMachine.setDeleted(testState)
            expect(newState.isDeleted).to.be.true
            newState = deformStateMachine.setDeleted(testState, false)
            expect(newState.isDeleted).to.be.false
        })
        it("doesn't alter the original state", () => {
            expect(testState.isDeleted).to.not.be.ok
            let newState = deformStateMachine.setDeleted(testState)
            expect(testState.isDeleted).to.not.be.ok
        })
    })
})