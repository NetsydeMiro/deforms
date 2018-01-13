const { describe, it, beforeEach } = intern.getInterface('bdd')
const { expect } = intern.getPlugin('chai')

import { forceCast } from '../src/utility'

describe("utility", () => {
    describe("forceCast", () => {
        it("sets the type", () => {
            // dummy test in that the result doesn't matter 
            let val: any
            val = 'test'
            // intellisense doesn't work on val of type 'any'
            // val.concat
            let val2 = forceCast<string>(val)
            // intellisense does work on val2 that's been casted to string
            expect(val2.concat).to.equal(String.prototype.concat)
        })
    })
})
