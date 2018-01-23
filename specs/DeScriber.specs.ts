const { describe, it, beforeEach } = intern.getInterface('bdd')
const { expect } = intern.getPlugin('chai')

import DeScriber, { DeScanner } from '../src/DeScriber'

enum EnumAttributeType {
    FieldDescription, 
    FieldDescription2, 
    RelatedField,
    SiblingField,
}

type StringAttributeType = "StringRelation1" | "StringRelation2"

interface TestInterface {
    aString: string
    anotherString: string
    aBoolean: boolean
    aNumber: number
    aDate: Date
}

let scriber = new DeScriber<TestInterface>()

class TestClass implements TestInterface {
    @scriber.attribute(EnumAttributeType.FieldDescription, 'This is a string')
    aString: string

    @scriber.relation(EnumAttributeType.RelatedField, null, 'aBoolean')
    anotherString: string 

    @scriber.relation(EnumAttributeType.RelatedField, null, 'aString')
    aBoolean: boolean

    @scriber.relation(EnumAttributeType.SiblingField, 'lucky number is a sibling to string and bool', 'aString', 'aBoolean')
    aNumber: number

    @scriber.attribute(EnumAttributeType.FieldDescription, 'This is a date', EnumAttributeType.FieldDescription2, 'Added some extra info here')
    aDate: Date
}

let instanceScanner: DeScanner<TestClass>
let classScanner: DeScanner<TestClass>

describe("DeScriber/DeScanner", () => {
    beforeEach(() => {
        instanceScanner = new DeScanner(new TestClass())
        classScanner = new DeScanner(TestClass)
    })
    describe("setAttribute", () => {
        it("sets the type (string)", () => {
            let typ = instanceScanner.type('aString')
            expect(typ).to.equal(String)

            typ = classScanner.type('aString')
            expect(typ).to.equal(String)
        })
        it("sets the type (Date)", () => {
            let typ = instanceScanner.type('aDate')
            expect(typ).to.equal(Date)

            typ = classScanner.type('aDate')
            expect(typ).to.equal(Date)
        })
        it("sets the attribute", () => {
            let description = instanceScanner.attribute(EnumAttributeType.FieldDescription, 'aString')
            expect(description).to.equal('This is a string')

            description = classScanner.attribute(EnumAttributeType.FieldDescription, 'aString')
            expect(description).to.equal('This is a string')
        })
        it("can set multiple attributes", () => {
            let description = instanceScanner.attribute(EnumAttributeType.FieldDescription, 'aDate')
            expect(description).to.equal('This is a date')

            let description2 = instanceScanner.attribute(EnumAttributeType.FieldDescription2, 'aDate')
            expect(description2).to.equal('Added some extra info here')

            description = classScanner.attribute(EnumAttributeType.FieldDescription, 'aDate')
            expect(description).to.equal('This is a date')

            description2 = classScanner.attribute(EnumAttributeType.FieldDescription2, 'aDate')
            expect(description2).to.equal('Added some extra info here')
        })
    })
    describe("setRelation", () => {
        it("sets the type (Boolean)", () => {
            let typ = instanceScanner.type('aBoolean')
            expect(typ).to.equal(Boolean)

            typ = classScanner.type('aBoolean')
            expect(typ).to.equal(Boolean)
        })
        it("sets the type (Number)", () => {
            let typ = instanceScanner.type('aNumber')
            expect(typ).to.equal(Number)

            typ = classScanner.type('aNumber')
            expect(typ).to.equal(Number)
        })
        it("sets the relation", () => {
            let description = instanceScanner.relation(EnumAttributeType.RelatedField, 'aBoolean')
            expect(description.relatedFields).to.deep.equal(['aString'])

            description = classScanner.relation(EnumAttributeType.RelatedField, 'aBoolean')
            expect(description.relatedFields).to.deep.equal(['aString'])
        })
        it("sets the relation to multiple fields", () => {
            let description = instanceScanner.relation(EnumAttributeType.SiblingField, 'aNumber')
            expect(description.relatedFields).to.deep.equal(['aString', 'aBoolean'])

            description = classScanner.relation(EnumAttributeType.SiblingField, 'aNumber')
            expect(description.relatedFields).to.deep.equal(['aString', 'aBoolean'])
        })
        it("sets the value along with the relation", () => {
            let description = instanceScanner.relation(EnumAttributeType.SiblingField, 'aNumber')
            expect(description.value).to.equal('lucky number is a sibling to string and bool')

            description = classScanner.relation(EnumAttributeType.SiblingField, 'aNumber')
            expect(description.value).to.equal('lucky number is a sibling to string and bool')
        })
    })
    describe("getAttributed", () => {
        it('gets all fields marked with that attribute type', () => {
            let fields = instanceScanner.attributed(EnumAttributeType.FieldDescription)
            expect(fields).to.have.members(['aDate', 'aString'])

            fields = classScanner.attributed(EnumAttributeType.FieldDescription)
            expect(fields).to.have.members(['aDate', 'aString'])
        })
    })
    describe("getRelated", () => {
        it('gets all fields marked with that relation type', () => {
            let fields = instanceScanner.related(EnumAttributeType.RelatedField)
            expect(fields).to.have.members(['aBoolean', 'anotherString'])

            fields = classScanner.related(EnumAttributeType.RelatedField)
            expect(fields).to.have.members(['aBoolean', 'anotherString'])
        })
    })
})