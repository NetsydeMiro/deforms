const { describe, it, beforeEach } = intern.getInterface('bdd')
const { expect } = intern.getPlugin('chai')

import DeForm, { DeFormAttribute } from '../src/DeForm'

interface TestInterface {
    aString: string
    aNumber: number
    aBoolean: boolean
    aSubForm?: TestInterface
    aSubFormArray?: Array<TestInterface>
}

let attribute = new DeFormAttribute<TestInterface>()

class TestDefinition implements TestInterface {
    @attribute.field()
    aString: string
    @attribute.field({isKey: true})
    aNumber: number
    @attribute.field({isKey: true})
    aBoolean: boolean
    @attribute.subForm({ definition: new TestDefinition() })
    aSubForm?: TestInterface
    @attribute.subForm({ definition: new TestDefinition(), omitRecordMatching: true })
    aSubFormArray?: Array<TestInterface>
}

let testDefinition = new TestDefinition()

let deform = new DeForm(testDefinition)


describe("DeForm", () => {
    describe("fields", () => {
        it('returns the fields', () => {
            let fields = deform.fields()
            expect(fields).to.have.members(['aString', 'aNumber', 'aBoolean'])
        })
    })
    describe("keys", () => {
        it('returns the keys', () => {
            let keys = deform.keys()
            expect(keys).to.have.members(['aNumber', 'aBoolean'])
        })
    })
    describe("subforms", () => {
        it('returns the subforms', () => {
            let subForms = deform.subForms()
            expect(subForms).to.have.members(['aSubForm', 'aSubFormArray'])
        })
    })
    describe("subform", () => {
        it('returns the subform attribute', () => {
            let subForm = deform.subForm('aSubForm')
            expect(subForm.definition).to.be.instanceof(TestDefinition)
        })
        it('marks no record matching as default', () => {
            let subForm = deform.subForm('aSubForm')
            expect(subForm.omitRecordMatching).to.not.be.ok
        })
        it('returns record matching as true when specified', () => {
            let subForm = deform.subForm('aSubFormArray')
            expect(subForm.omitRecordMatching).to.be.true
        })
        it('returns the subform attribute for an array', () => {
            let subForm = deform.subForm('aSubFormArray')
            expect(subForm.definition).to.be.instanceof(TestDefinition)
        })
    })
})