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

type RootProps = UsePresenceProps & {
	children?:
		| ReactNode
		| (({ shouldUnmount }: { shouldUnmount: boolean }) => ReactNode)
}
export const Root = ({ children, ...props }: RootProps) => {
	const api = usePresence(props)

	return (
		<PresenceProvider {...api}>
			{typeof children === 'function'
				? children({ shouldUnmount: api.shouldUnmount })
				: children}
		</PresenceProvider>
	)
}
Root.displayName = 'Presence.Root'

type GateProps = Omit<ComponentPropsWithoutRef<'div'>, 'children'> & {
	asChild?: boolean | undefined
	children?:
		| ReactNode
		| ((props: {
				'data-state'?: 'open' | 'closed' | undefined
				hidden?: boolean | undefined
		  }) => ReactNode)
	activity?: boolean | undefined
}
export const Gate = forwardRef<HTMLDivElement, GateProps>(
	({ asChild, activity = false, children, ...props }, forwardedRef) => {
		const { getPresenceProps, setNode, shouldUnmount, present } =
			usePresenceContext()
		const composedRefs = useComposedRefs(setNode, forwardedRef)
		const presenceAttrs = getPresenceProps({ activity })

		if (shouldUnmount) return null

		const Component = asChild ? Slot : 'div'

		const dataAttrs = asChild
			? {}
			: { 'data-scope': 'presence', 'data-part': 'root' }

		const content = (
			<Component
				{...props}
				{...presenceAttrs}
				{...dataAttrs}
				ref={composedRefs}
			>
				{typeof children === 'function'
					? children({ ...presenceAttrs })
					: children}
			</Component>
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
