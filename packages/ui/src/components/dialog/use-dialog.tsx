import type { Scope } from '@zag-js/core'
import {
	type Api,
	anatomy,
	connect,
	type Machine,
	machine
} from '@zag-js/dialog'
import {
	mergeProps,
	normalizeProps,
	type PropTypes,
	useMachine
} from '@zag-js/react'
import { useId } from 'react'
import type { InferUserProps } from '../../infer-types'

const parts = anatomy.extendWith('action', 'headline').build()

export const getActionId = (ctx: Scope) =>
	ctx.ids?.action ?? `dialog:${ctx.id}:action`

export const getHeadlineId = (ctx: Scope) =>
	ctx.ids?.headline ?? `dialog:${ctx.id}:headline`

export type DialogApi<T extends PropTypes = PropTypes> = Api<T> & {
	getHeadlineProps: () => T['element']
	getActionProps: () => T['element']
}

type BaseUserProps = InferUserProps<Machine>
type BaseUserPropsObject = NonNullable<BaseUserProps>

export type DialogUserProps = Omit<BaseUserPropsObject, 'ids'>

export type UseDialogProps = DialogUserProps & {}
export const useDialog = (props: UseDialogProps): DialogApi => {
	const defaultProps: UseDialogProps = { id: useId() }

	const userProps = mergeProps(defaultProps, props)

	const service = useMachine(machine, userProps)

	const getActionProps = () =>
		normalizeProps.element({
			...parts.action.attrs,
			id: getActionId(service.scope)
		})

	const getHeadlineProps = () =>
		normalizeProps.element({
			...parts.headline.attrs,
			id: getHeadlineId(service.scope)
		})

	const api = connect(service, normalizeProps)

	return { ...api, getActionProps, getHeadlineProps }
}
