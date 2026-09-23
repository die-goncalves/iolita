import { createContext, type ReactNode, useContext, useMemo } from 'react'
import type { UseMenuReturn } from './use-menu'

type Optional<T> = {
	[K in keyof T]?: T[K] | undefined
}

const MenuParentContext = createContext<Optional<UseMenuReturn>>({})

type MenuParentProviderProps = Optional<UseMenuReturn> & {
	children: ReactNode
}
export function MenuParentProvider({
	children,
	api,
	service
}: MenuParentProviderProps) {
	const value = useMemo(() => ({ api, service }), [api, service])

	return (
		<MenuParentContext.Provider value={value}>
			{children}
		</MenuParentContext.Provider>
	)
}

export function useMenuParentContext() {
	return useContext(MenuParentContext)
}
