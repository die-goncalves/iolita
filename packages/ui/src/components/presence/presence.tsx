import {
	Activity,
	type ComponentPropsWithoutRef,
	forwardRef,
	type ReactNode
} from 'react'
import { mergeRefs } from '../../utils/merge-refs'
import { type UsePresenceProps, usePresence } from './use-presence'
import {
	PresenceProvider,
	type PresenceProviderProps,
	usePresenceContext
} from './use-presence-context'

type RootProviderProps = PresenceProviderProps
export function RootProvider({ children, ...props }: RootProviderProps) {
	return <PresenceProvider {...props}>{children}</PresenceProvider>
}
RootProvider.displayName = 'Presence.RootProvider'

type RootProps = UsePresenceProps & { children: ReactNode }
export const Root = ({ children, ...props }: RootProps) => {
	const api = usePresence(props)

	return <PresenceProvider {...api}>{children}</PresenceProvider>
}
Root.displayName = 'Presence.Root'

type GateProps = ComponentPropsWithoutRef<'div'>
export const Gate = forwardRef<HTMLDivElement, GateProps>(
	(props, forwardedRef) => {
		const { getPresenceProps, setNode, shouldUnmount, present, activity } =
			usePresenceContext()
		const mergedRefs = mergeRefs(setNode, forwardedRef)

		if (shouldUnmount) return null

		const content = (
			<div
				{...props}
				{...getPresenceProps()}
				data-scope="presence"
				data-part="root"
				ref={mergedRefs}
			/>
		)

		if (activity) {
			return (
				<Activity mode={present ? 'visible' : 'hidden'}>{content}</Activity>
			)
		}

		return content
	}
)
Gate.displayName = 'Presence.Gate'
