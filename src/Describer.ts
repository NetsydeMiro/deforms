import 'reflect-metadata'

const METADATA_KEY = {
    DESIGN_TYPE: 'design:type', 
}

interface Relation<DescribedInterface> {
    value?: any
    relatedFields?: Array<keyof DescribedInterface>
}

type Attribute = string | number

class DeScriber<DescribedInterface> {

    setValue = (attribute: Attribute, value: any) => {
        return this.setRelation(attribute, value)
    }

    setRelation(attribute: Attribute, value: any, ...relatedFields: Array<keyof DescribedInterface>) {
        return function(obj: any, field: keyof DescribedInterface) {
            let description: Relation<DescribedInterface> = { relatedFields, value }
            return Reflect.defineMetadata(attribute, description, obj, field)
        }
    }

    getType(described: DescribedInterface, field: keyof DescribedInterface) {
        return Reflect.getMetadata(METADATA_KEY.DESIGN_TYPE, described, field)
    }

    getValue(described: DescribedInterface, attribute: Attribute, field: keyof DescribedInterface): any {
        let relation = Reflect.getMetadata(attribute, described, field) as Relation<DescribedInterface>
        return relation.value
    }

    getRelation(described: DescribedInterface, attribute: Attribute, field: keyof DescribedInterface): Relation<DescribedInterface> {
        let relation = Reflect.getMetadata(attribute, described, field) as Relation<DescribedInterface>
        return relation
    }
}

export default DeScriber