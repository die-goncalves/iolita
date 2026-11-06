import type { Machine, MachineSchema } from '@zag-js/core'

export type InferSchema<T> =
	T extends Machine<infer S extends MachineSchema> ? S : never

export type InferUserProps<T> = Partial<InferSchema<T>['props']>
