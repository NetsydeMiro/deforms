import { isUndefined } from './utility'

export class Value<T> {

    constructor(
        public current: T,
        public original?: T,
        public suggested?: T,
        public isHidden?: boolean) { }

    get isEditing(): boolean {
        return !isUndefined(this.original)
    }

    get hasChange(): boolean {
        return this.isEditing && this.current !== this.original
    }

    get hasSuggestedChange(): boolean {
        return !isUndefined(this.suggested) && this.current !== this.suggested
    }
}

export default Value
