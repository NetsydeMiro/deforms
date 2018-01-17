const { describe, it, beforeEach } = intern.getInterface('bdd')
const { expect } = intern.getPlugin('chai')

import { DeFormAttribute } from '../src/DeForm'
import DeFormState, { createFormState } from '../src/DeFormState'

interface TestInterface {
    aString: string
    aBoolean: boolean
    aNumber: number
    aSubFormArray?: Array<TestInterface>
}

let attribute = new DeFormAttribute<TestInterface>()

let current: TestInterface, original: TestInterface, suggested: TestInterface

let formState: DeFormState<TestInterface> 

describe("createFormState Record Matching", () => {
    describe("default record matching", () => {
        beforeEach(() => {
            class DefaultDefinition implements TestInterface {
                aString: string
                aBoolean: boolean
                aNumber: number
                @attribute.subForm({ definition: new DefaultDefinition()})
                aSubFormArray?: Array<TestInterface>
            }

            current = {
                aString: 'dummy',
                aBoolean: true, 
                aNumber: 1, 
                aSubFormArray: [
                    {aString: 'record 1', aBoolean: true, aNumber: 1}, 
                    {aString: 'record 2', aBoolean: false, aNumber: 2}, 
                    {aString: 'record 3', aBoolean: null, aNumber: 3}
                ]
            }

            suggested = {
                aString: 'dummy',
                aBoolean: true, 
                aNumber: 1, 
                aSubFormArray: [
                    {aString: 'record 3', aBoolean: null, aNumber: 3},                  // exact match
                    {aString: 'record 2, partial match', aBoolean: false, aNumber: 2},  // varied string
                    {aString: 'record 1', aBoolean: true, aNumber: 1, aSubFormArray: []}, // good match, subForm arrays don't matter
                    {aString: 'record 1', aBoolean: false, aNumber: 1},                 // varied boolean
                    {aString: 'record 3', aBoolean: null, aNumber: 4}                   // varied number
                ]
            }

            formState = createFormState(new DefaultDefinition(), current, undefined, suggested)
        })
        it('aligns suggested record that is exact match', () => {
            // 3rd current record matches 1st suggested
            expect(formState.aSubFormArray[2].aString.suggested).to.equal(suggested.aSubFormArray[0].aString)
            expect(formState.aSubFormArray[2].aBoolean.suggested).to.equal(suggested.aSubFormArray[0].aBoolean)
            expect(formState.aSubFormArray[2].aNumber.suggested).to.equal(suggested.aSubFormArray[0].aNumber)
        })
        it('aligns suggested record that is match except for subforms', () => {
            // 1st current record matches 3rd suggested (except subforms)
            expect(formState.aSubFormArray[0].aString.suggested).to.equal(suggested.aSubFormArray[2].aString)
            expect(formState.aSubFormArray[0].aBoolean.suggested).to.equal(suggested.aSubFormArray[2].aBoolean)
            expect(formState.aSubFormArray[0].aNumber.suggested).to.equal(suggested.aSubFormArray[2].aNumber)
        })
        it('does not align partial matches', () => {
            // 2nd current record does not match any suggested records
            expect(formState.aSubFormArray[1].aString.suggested).to.be.undefined
            expect(formState.aSubFormArray[1].aBoolean.suggested).to.be.undefined
            expect(formState.aSubFormArray[1].aNumber.suggested).to.be.undefined
        })
        it('places suggested records that have not matched at end of subform collection', () => {
            // unmatched suggested records are appended to end of array in order

            // unmatched second suggested is added as fourth record
            expect(formState.aSubFormArray[3].aString.current).to.be.undefined
            expect(formState.aSubFormArray[3].aBoolean.current).to.be.undefined
            expect(formState.aSubFormArray[3].aNumber.current).to.be.undefined

            expect(formState.aSubFormArray[3].aString.suggested).to.equal(suggested.aSubFormArray[1].aString)
            expect(formState.aSubFormArray[3].aBoolean.suggested).to.equal(suggested.aSubFormArray[1].aBoolean)
            expect(formState.aSubFormArray[3].aNumber.suggested).to.equal(suggested.aSubFormArray[1].aNumber)

            // unmatched fourth suggested is added as 5th record
            expect(formState.aSubFormArray[4].aString.current).to.be.undefined
            expect(formState.aSubFormArray[4].aBoolean.current).to.be.undefined
            expect(formState.aSubFormArray[4].aNumber.current).to.be.undefined

            expect(formState.aSubFormArray[4].aString.suggested).to.equal(suggested.aSubFormArray[3].aString)
            expect(formState.aSubFormArray[4].aBoolean.suggested).to.equal(suggested.aSubFormArray[3].aBoolean)
            expect(formState.aSubFormArray[4].aNumber.suggested).to.equal(suggested.aSubFormArray[3].aNumber)

            // unmatched fifth suggested is added as 6th record
            expect(formState.aSubFormArray[5].aString.current).to.be.undefined
            expect(formState.aSubFormArray[5].aBoolean.current).to.be.undefined
            expect(formState.aSubFormArray[5].aNumber.current).to.be.undefined

            expect(formState.aSubFormArray[5].aString.suggested).to.equal(suggested.aSubFormArray[4].aString)
            expect(formState.aSubFormArray[5].aBoolean.suggested).to.equal(suggested.aSubFormArray[4].aBoolean)
            expect(formState.aSubFormArray[5].aNumber.suggested).to.equal(suggested.aSubFormArray[4].aNumber)
        })
    })


    describe("key field record matching", () => {
        beforeEach(() => {
            class KeyFieldDefinition implements TestInterface {
                @attribute.key()
                aString: string
                @attribute.key()
                aBoolean: boolean
                aNumber: number

                @attribute.subForm({definition: new KeyFieldDefinition()})
                aSubFormArray?: Array<TestInterface>
            }

            current = {
                aString: 'dummy',
                aBoolean: true, 
                aNumber: 1, 
                aSubFormArray: [
                    {aString: 'record 1', aBoolean: true, aNumber: 1}, 
                    {aString: 'record 2', aBoolean: false, aNumber: 2}, 
                    {aString: 'record 3', aBoolean: null, aNumber: 3}
                ]
            }

            suggested = {
                aString: 'dummy',
                aBoolean: true, 
                aNumber: 1, 
                aSubFormArray: [
                    {aString: 'record 3', aBoolean: null, aNumber: 5},                  // key match, nonKey difference
                    {aString: 'record 2, partial match', aBoolean: false, aNumber: 2},  // varied key 1
                    {aString: 'record 1', aBoolean: true, aNumber: 3, aSubFormArray: []}, // key match, nonKey differences
                    {aString: 'record 2', aBoolean: true, aNumber: 1},                 // varied key 2
                ]
            }

            formState = createFormState(new KeyFieldDefinition(), current, undefined, suggested)
        })
        it('aligns suggested records that are a key match', () => {
            // 1st current record matches 3rd suggested
            expect(formState.aSubFormArray[0].aString.suggested).to.equal(suggested.aSubFormArray[2].aString)
            expect(formState.aSubFormArray[0].aBoolean.suggested).to.equal(suggested.aSubFormArray[2].aBoolean)
            expect(formState.aSubFormArray[0].aNumber.suggested).to.equal(suggested.aSubFormArray[2].aNumber)

            // 3rd current record matches 1st suggested
            expect(formState.aSubFormArray[2].aString.suggested).to.equal(suggested.aSubFormArray[0].aString)
            expect(formState.aSubFormArray[2].aBoolean.suggested).to.equal(suggested.aSubFormArray[0].aBoolean)
            expect(formState.aSubFormArray[2].aNumber.suggested).to.equal(suggested.aSubFormArray[0].aNumber)
        })
        it('leaves current records with key differences unmatched', () => {
            // 2nd record has no key match
            expect(formState.aSubFormArray[1].aString.suggested).to.be.undefined
            expect(formState.aSubFormArray[1].aBoolean.suggested).to.be.undefined
            expect(formState.aSubFormArray[1].aNumber.suggested).to.be.undefined
        })
        it('places suggested records that have not matched at end of subform collection', () => {
            // 2nd suggested record did not match 
            expect(formState.aSubFormArray[3].aString.current).to.be.undefined
            expect(formState.aSubFormArray[3].aBoolean.current).to.be.undefined
            expect(formState.aSubFormArray[3].aNumber.current).to.be.undefined

            expect(formState.aSubFormArray[3].aString.suggested).to.equal(suggested.aSubFormArray[1].aString)
            expect(formState.aSubFormArray[3].aBoolean.suggested).to.equal(suggested.aSubFormArray[1].aBoolean)
            expect(formState.aSubFormArray[3].aNumber.suggested).to.equal(suggested.aSubFormArray[1].aNumber)

            // 4th suggested record did not match 
            expect(formState.aSubFormArray[4].aString.current).to.be.undefined
            expect(formState.aSubFormArray[4].aBoolean.current).to.be.undefined
            expect(formState.aSubFormArray[4].aNumber.current).to.be.undefined

            expect(formState.aSubFormArray[4].aString.suggested).to.equal(suggested.aSubFormArray[3].aString)
            expect(formState.aSubFormArray[4].aBoolean.suggested).to.equal(suggested.aSubFormArray[3].aBoolean)
            expect(formState.aSubFormArray[4].aNumber.suggested).to.equal(suggested.aSubFormArray[3].aNumber)
        })
    })
})