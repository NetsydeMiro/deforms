import 'reflect-metadata'
import { isFunction } from './utility'

const METADATA_KEY = {
    DESIGN_TYPE: 'design:type', 
}

interface Relation<DescribedInterface> {
    value?: any
    relatedFields?: Array<keyof DescribedInterface>
}

type AttributeName = string | number

function getAttributeGroup(attribute: AttributeName) {
    return "_group_" + attribute
}

export class DeScriber<DescribedInterface> {
    attribute(attribute: AttributeName, value: any) 
    attribute(attribute: AttributeName, value: any, attribute2: AttributeName, value2: any) 
    attribute(attribute: AttributeName, value: any, attribute2: AttributeName, value2: any, ...remainingAttributeValuePairs: Array<any>) 

    attribute(...attributeValuePairs: Array<any>) {
        return function(obj: any, field: keyof DescribedInterface) {
            for (let ix = 0; ix < attributeValuePairs.length; ix += 2) {
                let attribute = attributeValuePairs[ix]
                let value = attributeValuePairs[ix + 1]

                Reflect.defineMetadata(attribute, value, obj, field)
                let attributedFields = Reflect.getMetadata(getAttributeGroup(attribute), obj) || []
                Reflect.defineMetadata(getAttributeGroup(attribute), attributedFields.concat(field), obj)
            }
        }
    }

    relation(attribute: AttributeName, value: any, ...relatedFields: Array<keyof DescribedInterface>) {
        return function(obj: any, field: keyof DescribedInterface) {
            let description: Relation<DescribedInterface> = { relatedFields, value }
            Reflect.defineMetadata(attribute, description, obj, field)
            let attributedFields = Reflect.getMetadata(getAttributeGroup(attribute), obj) || []
            Reflect.defineMetadata(getAttributeGroup(attribute), attributedFields.concat(field), obj)
        }
    }
}

export type InstanceOrClass<DescribedInterface> = DescribedInterface | (new () => DescribedInterface)

export class DeScanner<DescribedInterface> {
    constructor(private described: InstanceOrClass<DescribedInterface>) {
        if (isFunction(described)) {
            this.described = described.prototype
        }
    }

    type(field: keyof DescribedInterface) {
        return Reflect.getMetadata(METADATA_KEY.DESIGN_TYPE, this.described, field)
    }

    attribute(attribute: AttributeName, field: keyof DescribedInterface): any {
        let value = Reflect.getMetadata(attribute, this.described, field) 
        return value
    }

    attributed<AttributeType>(attribute: AttributeName): Array<keyof DescribedInterface> {
        return this.related(attribute)
    }

    relation(attribute: AttributeName, field: keyof DescribedInterface): Relation<DescribedInterface> {
        let relation = Reflect.getMetadata(attribute, this.described, field) as Relation<DescribedInterface>
        return relation
    }

    related(attribute: AttributeName): Array<keyof DescribedInterface> {
        let related = Reflect.getMetadata(getAttributeGroup(attribute), this.described) 
        return related 
    }
}

export default DeScriber