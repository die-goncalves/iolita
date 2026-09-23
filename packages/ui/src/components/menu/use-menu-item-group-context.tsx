import { createContext, useContext } from 'react'

export const ItemGroupContext = createContext<{ id: string } | undefined>(
	undefined
)

export function useItemGroupContext() {
	const ctx = useContext(ItemGroupContext)
	if (!ctx) {
		throw new Error(
			'useItemGroupContext must be used within ItemGroupContext.Provider'
		)
	}
	return ctx
}
