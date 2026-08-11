import type { PropTypes } from '@zag-js/react'
import type { Api } from '@zag-js/tooltip'
import { createContext, type ReactNode, useContext } from 'react'

export const TooltipContext = createContext({} as Api<PropTypes>)

type TooltipProviderProps = Api<PropTypes> & { children: ReactNode }
export function TooltipProvider({ children, ...props }: TooltipProviderProps) {
	return (
		<TooltipContext.Provider value={props}>{children}</TooltipContext.Provider>
	)
}

export const useTooltipContext = () => useContext(TooltipContext)
