import {
	type RadioGroupSlot,
	type RadioGroupVariantProps,
	radioGroup
} from '@iolita/styled-system/recipes'
import type { Pretty } from '@iolita/styled-system/types'
import { createContext, type ReactNode, useContext } from 'react'
import type { UseRadioGroupReturn } from './use-radio-group'

export type RadioGroupContextProps =
	| (UseRadioGroupReturn & {
			styles: Pretty<Record<RadioGroupSlot, string>>
	  })
	| null
export const RadioGroupContext = createContext<RadioGroupContextProps>(null)

type RadioGroupProviderProps = UseRadioGroupReturn &
	RadioGroupVariantProps & { children: ReactNode }
export function RadioGroupProvider({
	api,
	register,
	children,
	...variantProps
}: RadioGroupProviderProps) {
	const styles = radioGroup(variantProps)

	return (
		<RadioGroupContext.Provider value={{ api, register, styles }}>
			{children}
		</RadioGroupContext.Provider>
	)
}

export function useRadioGroupContext() {
	const ctx = useContext(RadioGroupContext)
	if (!ctx) {
		throw new Error(
			'useRadioGroupContext must be used within a RadioGroupProvider'
		)
	}
	return ctx
}
