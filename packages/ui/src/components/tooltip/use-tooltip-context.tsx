import { createContext, type ReactNode, useContext } from 'react'
import type { UseTooltipReturn } from './use-tooltip'

export type TooltipContextProps = UseTooltipReturn | null
export const TooltipContext = createContext<TooltipContextProps>(null)

type TooltipProviderProps = UseTooltipReturn & { children: ReactNode }
export function TooltipProvider({ children, ...props }: TooltipProviderProps) {
	return (
		<TooltipContext.Provider value={props}>{children}</TooltipContext.Provider>
	)
}

export function useTooltipContext() {
	const ctx = useContext(TooltipContext)
	if (!ctx) {
		throw new Error('useTooltipContext must be used within a TooltipProvider')
	}
	return ctx
}
