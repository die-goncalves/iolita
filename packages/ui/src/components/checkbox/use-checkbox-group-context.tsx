import { createContext, type ReactNode, useContext } from 'react'
import type { UseCheckboxGroupReturn } from './use-checkbox-group'

export type CheckboxGroupContextProps = UseCheckboxGroupReturn | null
export const CheckboxGroupContext =
	createContext<CheckboxGroupContextProps>(null)

type CheckboxGroupProviderProps = UseCheckboxGroupReturn & {
	children: ReactNode
}
export function CheckboxGroupProvider({
	api,
	register,
	children
}: CheckboxGroupProviderProps) {
	return (
		<CheckboxGroupContext.Provider value={{ api, register }}>
			{children}
		</CheckboxGroupContext.Provider>
	)
}

export function useCheckboxGroupContext() {
	return useContext(CheckboxGroupContext)
}
