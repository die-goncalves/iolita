import { type Ref, type RefCallback, type RefObject, useCallback } from 'react'

export function composeRefs<T>(
	...refs: (Ref<T> | null | undefined)[]
): RefCallback<T> {
	return (instance: T | null) => {
		const cleanups: Array<() => void> = []

		for (const ref of refs) {
			if (typeof ref === 'function') {
				const cleanup = ref(instance)
				if (typeof cleanup === 'function') {
					cleanups.push(cleanup)
				} else {
					cleanups.push(() => ref(null))
				}
			} else if (ref) {
				const target = ref as RefObject<T | null>
				target.current = instance
				cleanups.push(() => {
					target.current = null
				})
			}
		}

		if (cleanups.length)
			return () => {
				for (const cleanup of cleanups) {
					cleanup()
				}
			}
	}
}

export function useComposedRefs<T>(
	...refs: (Ref<T> | null | undefined)[]
): RefCallback<T> {
	// biome-ignore lint/correctness/useExhaustiveDependencies: `refs` is intentionally used as a dynamic dependency list
	return useCallback(composeRefs(...refs), refs)
}
