import {
	type MenuSlot,
	type MenuVariantProps,
	menu
} from '@iolita/styled-system/recipes'
import type { Pretty } from '@iolita/styled-system/types'
import { createContext, type ReactNode, useContext, useMemo } from 'react'
import type { UseMenuReturn } from './use-menu'

export type MenuContextProps =
	| (Pick<UseMenuReturn, 'api'> & { styles: Pretty<Record<MenuSlot, string>> })
	| null
export const MenuContext = createContext<MenuContextProps>(null)

type MenuProviderProps = Pick<UseMenuReturn, 'api'> &
	MenuVariantProps & { children: ReactNode }
export function MenuProvider({ gap, children, ...props }: MenuProviderProps) {
	const styles = useMemo(() => menu({ gap }), [gap])

	return (
		<MenuContext.Provider value={{ ...props, styles }}>
			{children}
		</MenuContext.Provider>
	)
}

export function useMenuContext() {
	const ctx = useContext(MenuContext)
	if (!ctx) {
		throw new Error('useMenuContext must be used within a MenuProvider')
	}
	return ctx
}
