import { createAnatomy } from '@zag-js/anatomy'
import { ariaAttr, dataAttr } from '@zag-js/dom-query'
import { normalizeProps, type PropTypes } from '@zag-js/react'
import { createSplitProps } from '@zag-js/utils'
import {
	type EffectCallback,
	type HTMLInputAutoCompleteAttribute,
	useId,
	useMemo,
	useState
} from 'react'

const parts = createAnatomy('text-input')
	.parts('root', 'label', 'input', 'supportingText', 'errorText')
	.build()

type ElementIds = {
	root?: string | undefined
	label?: string | undefined
	input?: string | undefined
	supportingText?: string | undefined
	errorText?: string | undefined
}

type Scope = {
	id?: string | undefined
	ids?: ElementIds | undefined
}

const getRootId = (ctx: Scope) => ctx.ids?.root ?? `text-input:${ctx.id}:root`

const getLabelId = (ctx: Scope) =>
	ctx.ids?.label ?? `text-input:${ctx.id}:label`

const getInputId = (ctx: Scope) =>
	ctx.ids?.input ?? `text-input:${ctx.id}:input`

const getSupportingTextId = (ctx: Scope) =>
	ctx.ids?.supportingText ?? `text-input:${ctx.id}:supporting-text`

const getErrorTextId = (ctx: Scope) =>
	ctx.ids?.errorText ?? `text-input:${ctx.id}:error-text`

export type TextInputUserProps = {
	autoComplete?: HTMLInputAutoCompleteAttribute | undefined
	disabled?: boolean | undefined
	id?: string | undefined
	ids?: ElementIds | undefined
	invalid?: boolean | undefined
	name?: string | undefined
	readOnly?: boolean | undefined
	required?: boolean | undefined
}

export const splitTextInputProps = createSplitProps<TextInputUserProps>([
	'autoComplete',
	'disabled',
	'id',
	'ids',
	'invalid',
	'name',
	'readOnly',
	'required'
])

type TextInputApi<T extends PropTypes = PropTypes> = {
	getRootProps: () => T['element']
	getLabelProps: () => T['label']
	getInputProps: () => T['input']
	getSupportingTextProps: () => T['element']
	getErrorTextProps: () => T['element']
}

export type UseTextInputReturn<T extends PropTypes = PropTypes> = {
	api: TextInputApi<T> & Pick<TextInputUserProps, 'invalid'>
	register: {
		supportingText: EffectCallback
		errorText: EffectCallback
	}
}

export type UseTextInputProps = TextInputUserProps & {}
export const useTextInput = (props: UseTextInputProps): UseTextInputReturn => {
	const generatedId = useId()
	const {
		autoComplete,
		disabled,
		ids,
		invalid,
		name,
		readOnly,
		required,
		id = generatedId
	} = props

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
			hasSupportingText && getSupportingTextId({ id, ids }),
			hasErrorText && invalid && getErrorTextId({ id, ids })
		]
			.filter(Boolean)
			.join(' ') || undefined

	const getRootProps = () =>
		normalizeProps.element({
			...parts.root.attrs,
			id: getRootId({ id, ids }),
			'data-disabled': dataAttr(disabled),
			'data-invalid': dataAttr(invalid),
			'data-readonly': dataAttr(readOnly)
		})

	const getLabelProps = () =>
		normalizeProps.label({
			...parts.label.attrs,
			id: getLabelId({ id, ids }),
			htmlFor: getInputId({ id, ids }),
			'data-disabled': dataAttr(disabled),
			'data-invalid': dataAttr(invalid),
			'data-readonly': dataAttr(readOnly),
			'data-required': dataAttr(required)
		})

	const getInputProps = () =>
		normalizeProps.input({
			...parts.input.attrs,
			id: getInputId({ id, ids }),
			autoComplete,
			disabled,
			name,
			readOnly,
			required,
			'data-disabled': dataAttr(disabled),
			'aria-invalid': ariaAttr(invalid),
			'data-invalid': dataAttr(invalid),
			'data-readonly': dataAttr(readOnly),
			'data-required': dataAttr(required),
			'aria-describedby': describedBy
		})

	const getSupportingTextProps = () =>
		normalizeProps.element({
			...parts.supportingText.attrs,
			id: getSupportingTextId({ id, ids })
		})

	const getErrorTextProps = () =>
		normalizeProps.element({
			...parts.errorText.attrs,
			id: getErrorTextId({ id, ids })
		})

	return {
		api: {
			invalid,
			getRootProps,
			getLabelProps,
			getInputProps,
			getSupportingTextProps,
			getErrorTextProps
		},
		register
	}
}
