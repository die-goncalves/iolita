import { type Api, connect, type Machine, machine } from '@zag-js/popover'
import {
	mergeProps,
	normalizeProps,
	type PropTypes,
	useMachine
} from '@zag-js/react'
import { useId } from 'react'
import type { InferUserProps } from '../../infer-types'

export type PopoverUserProps = InferUserProps<Machine>

export type UsePopoverProps = PopoverUserProps & {}
export const usePopover = (props: UsePopoverProps): Api<PropTypes> => {
	const defaultProps: UsePopoverProps = {
		id: useId(),
		positioning: {
			placement: 'top',
			gutter: 8,
			overflowPadding: 8,
			arrowPadding: 0
		}
	}

	const userProps = mergeProps(defaultProps, props)

	const service = useMachine(machine, userProps)

	return connect(service, normalizeProps)
}
