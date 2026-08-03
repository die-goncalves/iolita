import type { Ref, RefCallback, RefObject } from 'react'

export function mergeRefs<T>(...refs: (Ref<T> | undefined)[]): RefCallback<T> {
	return (instance: T | null) => {
		for (const ref of refs) {
			if (typeof ref === 'function') {
				ref(instance)
			} else if (ref) {
				;(ref as RefObject<T | null>).current = instance
			}
		}
	}
}
