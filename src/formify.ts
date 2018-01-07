import Field from './Field'
import { isArray, forceCast } from './utility'

type Formify<T> = {
    [k in keyof T]: Field<T[k]> 
}

function formify<T>(current: T, original?: T, suggested?: T): Formify<T> {
    let value = {}

    for (let key in current) {
        value[key.toString()] = new Field(current[key], original && original[key], suggested && suggested[key])
    }

    return value as Formify<T>
}

export default formify 

interface TestSubInterface {
    aNumber: number
    aBoolean: boolean
}

interface TestInterface {
    aNumber: number
    aString: string
    aDate: Date
    anArray: Array<TestSubInterface>
}

let current: TestInterface = {
    aNumber: 7, 
    aString: 'test', 
    aDate: new Date(), 
    anArray: [
        {aNumber: 1, aBoolean: true}, 
        {aNumber: 2, aBoolean: false}, 
    ]
}

let form = formify(current)





