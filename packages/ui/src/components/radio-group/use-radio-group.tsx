import type { Scope } from '@zag-js/core'
import { dataAttr } from '@zag-js/dom-query'
import {
	type Api,
	anatomy,
	connect,
	type ItemProps,
	itemProps,
	type Machine,
	machine,
	props
} from '@zag-js/radio-group'
import {
	mergeProps,
	normalizeProps,
	type PropTypes,
	useMachine
} from '@zag-js/react'
import { createSplitProps } from '@zag-js/utils'
import { type EffectCallback, useId, useMemo, useState } from 'react'
import type { InferUserProps } from '../../infer-types'

declare module '@zag-js/radio-group' {
	export interface ElementIds {
		itemIndicator?: ((value: string) => string) | undefined
		supportingText?: string | undefined
		errorText?: string | undefined
	}
}

const parts = anatomy
	.extendWith('itemIndicator', 'supportingText', 'errorText')
	.build()

const getItemIndicatorId = (ctx: Scope, value: string) =>
	ctx.ids?.itemIndicator?.(value) ??
	`radio-group:${ctx.id}:radio:item-indicator:${value}`

const getSupportingTextId = (ctx: Scope) =>
	ctx.ids?.supportingText ?? `radio-group:${ctx.id}:supporting-text`

const getErrorTextId = (ctx: Scope) =>
	ctx.ids?.errorText ?? `radio-group:${ctx.id}:error-text`

export const splitRadioGroupProps = createSplitProps<RadioGroupUserProps>(props)
export const splitRadioGroupItemProps = createSplitProps<ItemProps>(itemProps)

type RadioGroupApi<T extends PropTypes = PropTypes> = Api<T> & {
	getItemIndicatorProps: (props: ItemProps) => T['element']
	getSupportingTextProps: () => T['element']
	getErrorTextProps: () => T['element']
}
export type UseRadioGroupReturn<T extends PropTypes = PropTypes> = {
	api: RadioGroupApi<T> & Pick<RadioGroupUserProps, 'invalid'>
	register: {
		supportingText: EffectCallback
		errorText: EffectCallback
	}
}

export type RadioGroupUserProps = InferUserProps<Machine>

export type UseRadioGroupProps = RadioGroupUserProps & {}
export function useRadioGroup(props: UseRadioGroupProps): UseRadioGroupReturn {
	const generatedId = useId()

	const defaultProps: UseRadioGroupProps = {
		id: generatedId
	}

	const userProps = mergeProps(defaultProps, props)
	const { invalid } = userProps

	const service = useMachine(machine, userProps)

	const [hasSupportingText, setHasSupportingText] = useState(false)
	const [hasErrorText, setHasErrorText] = useState(false)

	const register = useMemo(
		() => ({
			supportingText: () => {
				setHasSupportingText(true)
				return () => setHasSupportingText(false)
			},
			errorText: () => {
				setHasErrorText(true)
				return () => setHasErrorText(false)
			}
		}),
		[]
	)

	const describedBy =
		[
			hasSupportingText && getSupportingTextId(service.scope),
			hasErrorText && invalid && getErrorTextId(service.scope)
		]
			.filter(Boolean)
			.join(' ') || undefined

	const getSupportingTextProps = () =>
		normalizeProps.element({
			...parts.supportingText.attrs,
			id: getSupportingTextId(service.scope)
		})

	const getErrorTextProps = () =>
		normalizeProps.element({
			...parts.errorText.attrs,
			id: getErrorTextId(service.scope)
		})

	const getItemIndicatorProps = (props: ItemProps) =>
		normalizeProps.element({
			...parts.itemIndicator.attrs,
			id: getItemIndicatorId(service.scope, props.value),
			'data-disabled': dataAttr(
				!!props.disabled || service.computed('isDisabled')
			),
			'data-invalid': dataAttr(!!props.invalid || !!service.prop('invalid')),
			'data-state':
				service.context.get('value') === props.value ? 'checked' : 'unchecked'
		})

	const api = connect(service, normalizeProps)

	const getRootProps = (): ReturnType<typeof api.getRootProps> => {
		const defaultProps = api.getRootProps()

		return {
			...defaultProps,
			'aria-describedby': describedBy
		}
	}

	return {
		api: {
			...api,
			invalid,
			getRootProps,
			getItemIndicatorProps,
			getSupportingTextProps,
			getErrorTextProps
		},
		register
	}
}
