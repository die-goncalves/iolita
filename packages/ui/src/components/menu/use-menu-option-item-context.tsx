import type * as zMenu from '@zag-js/menu'
import { createContext, type ReactNode, useContext } from 'react'

type OptionItemProps = zMenu.OptionItemProps | null

const MenuOptionItemContext = createContext<OptionItemProps>(null)

type MenuOptionItemProviderProps = OptionItemProps & {
	children: ReactNode
}
export function MenuOptionItemProvider({
	children,
	...props
}: MenuOptionItemProviderProps) {
	return (
		<MenuOptionItemContext.Provider value={props}>
			{children}
		</MenuOptionItemContext.Provider>
	)
}

export function useMenuOptionItemContext() {
	const ctx = useContext(MenuOptionItemContext)
	if (!ctx) {
		throw new Error(
			'useMenuOptionItemContext must be used within a MenuOptionItemProvider'
		)
	}
	return ctx
}
