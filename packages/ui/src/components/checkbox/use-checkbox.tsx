import {
	type Api,
	connect,
	type Machine,
	machine,
	props
} from '@zag-js/checkbox'
import {
	mergeProps,
	normalizeProps,
	type PropTypes,
	useMachine
} from '@zag-js/react'
import { createSplitProps } from '@zag-js/utils'
import { useId } from 'react'
import type { InferUserProps } from '../../infer-types'
import { useCheckboxGroupContext } from './use-checkbox-group-context'

type CheckboxApi<T extends PropTypes = PropTypes> = Api<T>
export type UseCheckboxReturn<T extends PropTypes = PropTypes> = {
	api: CheckboxApi<T> & {
		invalid: boolean | undefined
		value: string
	}
}

export type CheckboxUserProps = InferUserProps<Machine>

export const splitCheckboxProps = createSplitProps<CheckboxUserProps>(props)

export type UseCheckboxProps = CheckboxUserProps & {}
export function useCheckbox(props: UseCheckboxProps): UseCheckboxReturn {
	const group = useCheckboxGroupContext()

	const generatedId = useId()

	const defaultProps: UseCheckboxProps = {
		id: generatedId
	}

	const groupProps = group?.api.getItemProps(props) ?? {}

	const userProps = mergeProps(defaultProps, groupProps, props)

	const service = useMachine(machine, userProps)

	const api = connect(service, normalizeProps)

	const getHiddenInputProps = (): ReturnType<
		Api<PropTypes>['getHiddenInputProps']
	> => {
		const defaultProps = api.getHiddenInputProps()
		const hasGroupLabel = group?.api.hasGroupLabel
		const groupDescribedBy = group?.api.groupDescribedBy

		const describedby =
			[!hasGroupLabel && groupDescribedBy].filter(Boolean).join(' ') ||
			undefined

		return {
			...defaultProps,
			'aria-describedby': describedby
		}
	}

	return {
		api: {
			...api,
			getHiddenInputProps,
			invalid: service.prop('invalid'),
			value: service.prop('value')
		}
	}
}
