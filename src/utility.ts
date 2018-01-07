// utility functions that can be reimplemented later if we want to save on dependencies
export { isUndefined, isArray } from 'lodash'

export function forceCast<T>(val: any): T { return val as any as T }
