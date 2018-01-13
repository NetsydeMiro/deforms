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
    anotherString: string
    aBoolean: boolean
    aNumber: number
    aDate: Date
}

let scriber = new DeScriber<TestInterface>()

class TestClass implements TestInterface {
    @scriber.setAttribute(EnumAttributeType.FieldDescription, 'This is a string')
    aString: string

    @scriber.setRelation(EnumAttributeType.RelatedField, null, 'aBoolean')
    anotherString: string 

    @scriber.setRelation(EnumAttributeType.RelatedField, null, 'aString')
    aBoolean: boolean

    @scriber.setRelation(EnumAttributeType.SiblingField, 'lucky number is a sibling to string and bool', 'aString', 'aBoolean')
    aNumber: number

    @scriber.setAttribute(EnumAttributeType.FieldDescription, 'This is a date')
    aDate: Date
}

let testDefinition = new TestClass()

describe("DeScriber", () => {
    describe("setAttribute", () => {
        it("sets the type (string)", () => {
            let typ = scriber.getType(testDefinition, 'aString')
            expect(typ).to.equal(String)
        })
        it("sets the type (Date)", () => {
            let typ = scriber.getType(testDefinition, 'aDate')
            expect(typ).to.equal(Date)
        })
        it("sets the attribute", () => {
            let description = scriber.getAttribute(testDefinition, EnumAttributeType.FieldDescription, 'aString')
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
    describe("getAttributed", () => {
        it('gets all fields marked with that attribute type', () => {
            let fields = scriber.getAttributed(testDefinition, EnumAttributeType.FieldDescription)
            expect(fields).to.have.members(['aDate', 'aString'])
        })
    })
    describe("getRelated", () => {
        it('gets all fields marked with that relation type', () => {
            let fields = scriber.getRelated(testDefinition, EnumAttributeType.RelatedField)
            expect(fields).to.have.members(['aBoolean', 'anotherString'])
        })
    })
})