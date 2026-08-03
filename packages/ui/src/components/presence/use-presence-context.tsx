import type { Api } from '@zag-js/presence'
import { createContext, type ReactNode, useContext } from 'react'

export type PresenceContextProps = Api & {
	unmountOnExit?: boolean | undefined
	getPresenceProps: () => {
		'data-state': string | undefined
		hidden?: boolean | undefined
	}
	activity?: boolean | undefined
	shouldUnmount: boolean
}
export const PresenceContext = createContext({} as PresenceContextProps)

export type PresenceProviderProps = PresenceContextProps & {
	children: ReactNode
}
export function PresenceProvider({
	unmountOnExit = false,
	getPresenceProps,
	shouldUnmount,
	children,
	...api
}: PresenceProviderProps) {
	return (
		<PresenceContext.Provider
			value={{ unmountOnExit, getPresenceProps, shouldUnmount, ...api }}
		>
			{children}
		</PresenceContext.Provider>
	)
}

export const usePresenceContext = () => useContext(PresenceContext)
