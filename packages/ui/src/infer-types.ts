import type { Machine, MachineSchema } from '@zag-js/core'
import type { useMachine } from '@zag-js/react'

export type InferSchema<T> =
	T extends Machine<infer S extends MachineSchema> ? S : never

export type InferUserProps<T> = Parameters<typeof useMachine<InferSchema<T>>>[1]
