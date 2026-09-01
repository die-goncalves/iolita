import {
	type DialogSlot,
	type DialogVariantProps,
	dialog
} from '@iolita/styled-system/recipes'
import type { Pretty } from '@iolita/styled-system/types'
import { createContext, type ReactNode, useContext, useMemo } from 'react'
import type { DialogApi } from './use-dialog'

export type DialogContextProps =
	| (DialogApi & {
			styles: Pretty<Record<DialogSlot, string>>
			placement: DialogVariantProps['placement']
	  })
	| null
export const DialogContext = createContext<DialogContextProps>(null)

type DialogProviderProps = DialogApi &
	DialogVariantProps & { children: ReactNode }
export function DialogProvider({
	size,
	scrollBehavior,
	placement,
	children,
	...props
}: DialogProviderProps) {
	const styles = useMemo(
		() => dialog({ size, scrollBehavior, placement }),
		[size, scrollBehavior, placement]
	)
	return (
		<DialogContext.Provider value={{ ...props, placement, styles }}>
			{children}
		</DialogContext.Provider>
	)
}

export function useDialogContext() {
	const ctx = useContext(DialogContext)
	if (!ctx) {
		throw new Error('useDialogContext must be used within a DialogProvider')
	}
	return ctx
}
