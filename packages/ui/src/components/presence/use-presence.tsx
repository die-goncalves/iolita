import { connect, type Machine, machine } from '@zag-js/presence'
import { normalizeProps, useMachine } from '@zag-js/react'
import type { InferUserProps } from '../../infer-types'
import type {
	PresenceContextProps,
	PresenceProps
} from './use-presence-context'

export type PresenceUserProps = InferUserProps<Machine>

export type UsePresenceProps = PresenceUserProps & {
	unmountOnExit?: boolean | undefined
}
export const usePresence = ({
	unmountOnExit,
	...props
}: UsePresenceProps): PresenceContextProps => {
	const userProps: PresenceUserProps = { ...props }

	const service = useMachine(machine, userProps)

	const api = connect(service, normalizeProps)

	const getPresenceProps = (props: PresenceProps = {}) => ({
		'data-state': api.skip ? undefined : userProps.present ? 'open' : 'closed',
		hidden: props.activity ? false : !api.present
	})

	const shouldUnmount = !api.present && Boolean(unmountOnExit)

	return {
		unmountOnExit,
		getPresenceProps,
		shouldUnmount,
		...api
	}
}
