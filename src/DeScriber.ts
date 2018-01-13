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

class DeScriber<DescribedInterface> {

    setAttribute = (attribute: Attribute, value: any) => {
        return this.setRelation(attribute, value)
    }

    setRelation(attribute: Attribute, value: any, ...relatedFields: Array<keyof DescribedInterface>) {
        return function(obj: any, field: keyof DescribedInterface) {
            let description: Relation<DescribedInterface> = { relatedFields, value }
            Reflect.defineMetadata(attribute, description, obj, field)
            let attributedFields = Reflect.getMetadata(getAttributeGroup(attribute), obj) || []
            Reflect.defineMetadata(getAttributeGroup(attribute), attributedFields.concat(field), obj)
        }
    }

    getType(described: DescribedInterface, field: keyof DescribedInterface) {
        return Reflect.getMetadata(METADATA_KEY.DESIGN_TYPE, described, field)
    }

    getAttribute(described: DescribedInterface, attribute: Attribute, field: keyof DescribedInterface): any {
        let relation = Reflect.getMetadata(attribute, described, field) as Relation<DescribedInterface>
        return relation.value
    }

    getAttributed(described: DescribedInterface, attribute: Attribute): Array<keyof DescribedInterface> {
        return this.getRelated(described, attribute)
    }

    getRelation(described: DescribedInterface, attribute: Attribute, field: keyof DescribedInterface): Relation<DescribedInterface> {
        let relation = Reflect.getMetadata(attribute, described, field) as Relation<DescribedInterface>
        return relation
    }

    getRelated(described: DescribedInterface, attribute: Attribute): Array<keyof DescribedInterface> {
        let related = Reflect.getMetadata(getAttributeGroup(attribute), described) 
        return related 
    }
}

export default DeScriber