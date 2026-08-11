import { normalizeProps, type PropTypes, useMachine } from '@zag-js/react'
import { type Api, connect, type Machine, machine } from '@zag-js/tooltip'
import { useId } from 'react'
import type { InferUserProps } from '../../infer-types'

export type TooltipUserProps = InferUserProps<Machine>

export type UseTooltipProps = TooltipUserProps & {}
export const useTooltip = (props: UseTooltipProps): Api<PropTypes> => {
	const userProps: UseTooltipProps = {
		id: useId(),
		interactive: true,
		positioning: {
			placement: 'top',
			gutter: 8,
			overflowPadding: 8,
			arrowPadding: 0
		},
		...props
	}

	const service = useMachine(machine, userProps)

	return connect(service, normalizeProps)
}
