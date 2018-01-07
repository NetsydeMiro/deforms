const { describe, it, beforeEach } = intern.getInterface('bdd')
const { expect } = intern.getPlugin('chai')

import DeScriber from '../src/DeScriber'

enum EnumAttributeType {
    FieldDescription, 
    RelatedField,
    SiblingField,
}

type StringAttributeType = "StringRelation1" | "StringRelation2"

interface TestInterface {
    aString: string
    aBoolean: boolean
    aNumber: number
    aDate: Date
}

let scriber = new DeScriber<TestInterface>()

class TestClass implements TestInterface {
    @scriber.setValue(EnumAttributeType.FieldDescription, 'This is a string')
    aString: string

    @scriber.setRelation(EnumAttributeType.RelatedField, null, 'aString')
    aBoolean: boolean

    @scriber.setRelation(EnumAttributeType.SiblingField, 'lucky number is a sibling to string and bool', 'aString', 'aBoolean')
    aNumber: number

    @scriber.setValue(EnumAttributeType.FieldDescription, 'This is a date')
    aDate: Date
}

let testDefinition = new TestClass()

describe("Describer", () => {
    describe("setValue", () => {
        it("sets the type (string)", () => {
            let typ = scriber.getType(testDefinition, 'aString')
            expect(typ).to.equal(String)
        })
        it("sets the type (Date)", () => {
            let typ = scriber.getType(testDefinition, 'aDate')
            expect(typ).to.equal(Date)
        })
        it("sets the value", () => {
            let description = scriber.getValue(testDefinition, EnumAttributeType.FieldDescription, 'aString')
            expect(description).to.equal('This is a string')
        })
    })
    describe("setRelation", () => {
        it("sets the type (Boolean)", () => {
            let typ = scriber.getType(testDefinition, 'aBoolean')
            expect(typ).to.equal(Boolean)
        })
        it("sets the type (Number)", () => {
            let typ = scriber.getType(testDefinition, 'aNumber')
            expect(typ).to.equal(Number)
        })
        it("sets the relation", () => {
            let description = scriber.getRelation(testDefinition, EnumAttributeType.RelatedField, 'aBoolean')
            expect(description.relatedFields).to.deep.equal(['aString'])
        })
        it("sets the relation to multiple fields", () => {
            let description = scriber.getRelation(testDefinition, EnumAttributeType.SiblingField, 'aNumber')
            expect(description.relatedFields).to.deep.equal(['aString', 'aBoolean'])
        })
        it("sets the value along with the relation", () => {
            let description = scriber.getRelation(testDefinition, EnumAttributeType.SiblingField, 'aNumber')
            expect(description.value).to.equal('lucky number is a sibling to string and bool')
        })
    })
})