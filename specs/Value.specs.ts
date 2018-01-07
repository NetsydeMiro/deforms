const { describe, it, beforeEach } = intern.getInterface('bdd')
const { expect } = intern.getPlugin('chai')

import Value from '../src/Value'

describe("Value", () => {
    describe("isEditing", () => {
        it("is not editing if original is undefined", () => {
            let val = new Value('test')
            expect(val.isEditing).to.not.be.ok
        })
    })
})