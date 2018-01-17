import 'reflect-metadata'

const METADATA_KEY = {
    DESIGN_TYPE: 'design:type', 
}

interface Relation<DescribedInterface> {
    value?: any
    relatedFields?: Array<keyof DescribedInterface>
}

type Attribute = string | number

function getAttributeGroup(attribute: Attribute) {
    return "_group_" + attribute
}

export class DeScriber<DescribedInterface> {
    attribute = (attribute: Attribute, value: any) => {
        return this.relation(attribute, value)
    }

    relation(attribute: Attribute, value: any, ...relatedFields: Array<keyof DescribedInterface>) {
        return function(obj: any, field: keyof DescribedInterface) {
            let description: Relation<DescribedInterface> = { relatedFields, value }
            Reflect.defineMetadata(attribute, description, obj, field)
            let attributedFields = Reflect.getMetadata(getAttributeGroup(attribute), obj) || []
            Reflect.defineMetadata(getAttributeGroup(attribute), attributedFields.concat(field), obj)
        }
    }
}

export class DeScanner<DescribedInterface> {
    constructor(private described: DescribedInterface) {}

    type(field: keyof DescribedInterface) {
        return Reflect.getMetadata(METADATA_KEY.DESIGN_TYPE, this.described, field)
    }

    attribute(attribute: Attribute, field: keyof DescribedInterface): any {
        let relation = Reflect.getMetadata(attribute, this.described, field) as Relation<DescribedInterface>
        return relation.value
    }

    /* perhaps for later, when we want to filter on attribute values
    attributed<AttributeType>(attribute: Attribute, predicate?: (attributeValue: AttributeType) => boolean): Array<keyof DescribedInterface> {
        return this.related(attribute)
    }
    */

    attributed<AttributeType>(attribute: Attribute): Array<keyof DescribedInterface> {
        return this.related(attribute)
    }

    relation(attribute: Attribute, field: keyof DescribedInterface): Relation<DescribedInterface> {
        let relation = Reflect.getMetadata(attribute, this.described, field) as Relation<DescribedInterface>
        return relation
    }

    related(attribute: Attribute): Array<keyof DescribedInterface> {
        let related = Reflect.getMetadata(getAttributeGroup(attribute), this.described) 
        return related 
    }
}

export default DeScriber