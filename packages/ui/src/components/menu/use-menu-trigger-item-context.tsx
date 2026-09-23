import type { Api } from '@zag-js/menu'
import type { PropTypes } from '@zag-js/react'
import { createContext, type ReactNode, useContext, useMemo } from 'react'

type TriggerItemProps = {
	getTriggerItemProps: () =>
		| ReturnType<Api<PropTypes>['getTriggerItemProps']>
		| undefined
}

const MenuTriggerItemContext = createContext<TriggerItemProps>({
	getTriggerItemProps: () => undefined
})

type MenuTriggerItemProviderProps = TriggerItemProps & {
	children: ReactNode
}
export function MenuTriggerItemProvider({
	getTriggerItemProps,
	children
}: MenuTriggerItemProviderProps) {
	const value = useMemo(() => ({ getTriggerItemProps }), [getTriggerItemProps])

	return (
		<MenuTriggerItemContext.Provider value={value}>
			{children}
		</MenuTriggerItemContext.Provider>
	)
}

export function useMenuTriggerItemContext() {
	return useContext(MenuTriggerItemContext)
}
