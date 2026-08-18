import type { Api } from '@zag-js/popover'
import type { PropTypes } from '@zag-js/react'
import { createContext, type ReactNode, useContext } from 'react'

export const PopoverContext = createContext({} as Api<PropTypes>)

type PopoverProviderProps = Api<PropTypes> & { children: ReactNode }
export function PopoverProvider({ children, ...props }: PopoverProviderProps) {
	return (
		<PopoverContext.Provider value={props}>{children}</PopoverContext.Provider>
	)
}

export const usePopoverContext = () => useContext(PopoverContext)
