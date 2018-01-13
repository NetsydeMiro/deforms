const { describe, it, beforeEach } = intern.getInterface('bdd')
const { expect } = intern.getPlugin('chai')

import Value from '../src/Value'

describe("Value", () => {
    describe('isHidden', () => {
        it("is not hidden by default", () => {
            let val = new Value('test')
            expect(val.isHidden).to.not.be.ok
        })
        it("can be set to true", () => {
            let val = new Value('test', undefined, undefined, true)
            expect(val.isHidden).to.be.true
        })
    })
    describe("isEditing", () => {
        it("is not editing if original is undefined", () => {
            let val = new Value('test')
            expect(val.isEditing).to.be.false
        })
        it("is editing if original has a value", () => {
            let val = new Value('test', 'test')
            expect(val.isEditing).to.be.true
        })
    })
    describe("hasChange", () => {
        it("does not have a change if original is undefined", () => {
            let val = new Value('test')
            expect(val.hasChange).to.be.false
        })
        it("does have a change if original is null", () => {
            let val = new Value('test', null)
            expect(val.hasChange).to.be.true
        })
        it("does not have a change if current equals original", () => {
            let val = new Value('test', 'test')
            expect(val.hasChange).to.be.false
        })
        it("has a change if current does not equal original", () => {
            let val = new Value('test', 'test2')
            expect(val.hasChange).to.be.true
        })
    })
    describe("hasSuggestedChange", () => {
        it("does not have a suggested change if suggested is undefined", () => {
            let val = new Value('test')
            expect(val.hasSuggestedChange).to.be.false
        })
        it("does have a suggested change if suggested is null", () => {
            let val = new Value('test', undefined, null)
            expect(val.hasSuggestedChange).to.be.true
        })
        it("does not have a suggested change if current equals suggested", () => {
            let val = new Value('test', undefined, 'test')
            expect(val.hasSuggestedChange).to.be.false
        })
        it("has a suggested change if current does not equal suggested", () => {
            let val = new Value('test', undefined, 'test2')
            expect(val.hasSuggestedChange).to.be.true
        })
    })
})