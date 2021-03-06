export interface ValueInterface<T> {
    current: T,
    original?: T,
    suggested?: T,
}

export class Value<T> implements ValueInterface<T> {

    constructor(
        public current: T,
        public original?: T,
        public suggested?: T,
        public isHidden?: boolean) { }

    get isEditing(): boolean {
        return this.original !== undefined
    }

    get hasChange(): boolean {
        return this.isEditing && this.current !== this.original
    }

    get hasSuggestedChange(): boolean {
        return this.suggested !== undefined && this.current !== this.suggested
    }
}

export default Value
