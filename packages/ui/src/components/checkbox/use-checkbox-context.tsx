import {
	type CheckboxSlot,
	type CheckboxVariantProps,
	checkbox
} from '@iolita/styled-system/recipes'
import type { Pretty } from '@iolita/styled-system/types'
import { createContext, type ReactNode, useContext } from 'react'
import type { UseCheckboxReturn } from './use-checkbox'

export type CheckboxContextProps =
	| (UseCheckboxReturn & {
			styles: Pretty<Record<CheckboxSlot, string>>
	  })
	| null
export const CheckboxContext = createContext<CheckboxContextProps>(null)

type CheckboxProviderProps = UseCheckboxReturn &
	CheckboxVariantProps & { children: ReactNode }
export function CheckboxProvider({
	api,
	children,
	...variantProps
}: CheckboxProviderProps) {
	const styles = checkbox(variantProps)

	return (
		<CheckboxContext.Provider value={{ api, styles }}>
			{children}
		</CheckboxContext.Provider>
	)
}

export function useCheckboxContext() {
	const ctx = useContext(CheckboxContext)
	if (!ctx) {
		throw new Error('useCheckboxContext must be used within a CheckboxProvider')
	}
	return ctx
}
