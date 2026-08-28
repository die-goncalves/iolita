import {
	Activity,
	type ComponentPropsWithoutRef,
	forwardRef,
	type ReactNode
} from 'react'
import { useComposedRefs } from '../../utils/compose-refs'
import { Slot } from '../../utils/slot'
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

type GateProps = ComponentPropsWithoutRef<'div'> & {
	asChild?: boolean | undefined
	activity?: boolean | undefined
}
export const Gate = forwardRef<HTMLDivElement, GateProps>(
	({ asChild = false, activity = false, ...props }, forwardedRef) => {
		const { getPresenceProps, setNode, shouldUnmount, present } =
			usePresenceContext()
		const composedRefs = useComposedRefs(setNode, forwardedRef)

		if (shouldUnmount) return null

		const Component = asChild ? Slot : 'div'

		const dataAttr = asChild
			? {}
			: { 'data-scope': 'presence', 'data-part': 'root' }

		const content = (
			<Component
				{...props}
				{...getPresenceProps({ activity })}
				{...dataAttr}
				ref={composedRefs}
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

export const Show = ({ children }: { children: ReactNode }) => {
	const { shouldUnmount } = usePresenceContext()

	if (shouldUnmount) return null

	return children
}
Show.displayName = 'Presence.Show'
