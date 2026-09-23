/*
 * https://github.com/chakra-ui/ark/blob/main/packages/react/src/utils/use-effect-once.ts
 */

import { type EffectCallback, useEffect, useRef } from 'react'

export const useEffectOnce = (cb: EffectCallback) => {
	const savedCallback = useRef(cb)
	const effectGuard = useRef(false)

	useEffect(() => {
		savedCallback.current = cb
	})

	useEffect(() => {
		if (effectGuard.current !== true) {
			effectGuard.current = true
			savedCallback.current()
		}
	}, [])
}
