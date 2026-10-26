import {
	type TextInputSlot,
	type TextInputVariantProps,
	textInput
} from '@iolita/styled-system/recipes'
import type { Pretty } from '@iolita/styled-system/types'
import { createContext, type ReactNode, useContext } from 'react'
import type { UseTextInputReturn } from './use-text-input'

export type TextInputContextProps =
	| (UseTextInputReturn & {
			styles: Pretty<Record<TextInputSlot, string>>
	  })
	| null
export const TextInputContext = createContext<TextInputContextProps>(null)

type TextInputProviderProps = UseTextInputReturn &
	TextInputVariantProps & { children: ReactNode }
export function TextInputProvider({
	api,
	register,
	children,
	...variantProps
}: TextInputProviderProps) {
	const styles = textInput(variantProps)

	return (
		<TextInputContext.Provider value={{ api, register, styles }}>
			{children}
		</TextInputContext.Provider>
	)
}

export function useTextInputContext() {
	const ctx = useContext(TextInputContext)
	if (!ctx) {
		throw new Error(
			'useTextInputContext must be used within a TextInputProvider'
		)
	}
	return ctx
}
