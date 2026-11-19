import { anatomy } from '@zag-js/checkbox'
import { dataAttr } from '@zag-js/dom-query'
import { mergeProps, normalizeProps } from '@zag-js/react'
import { createSplitProps } from '@zag-js/utils'
import {
	type EffectCallback,
	useCallback,
	useId,
	useMemo,
	useState
} from 'react'

type ElementIds = {
	group?: string | undefined
	groupLabel?: string | undefined
	groupSupportingText?: string | undefined
	groupErrorText?: string | undefined
}

type CheckboxGroupProps = {
	id: string
	ids?: ElementIds | undefined
	value?: string[] | undefined
	defaultValue?: string[] | undefined
	name?: string | undefined
	form?: string | undefined
	disabled?: boolean | undefined
	invalid?: boolean | undefined
	required?: boolean | undefined
	readOnly?: boolean | undefined
	onValueChange?: ((value: string[]) => void) | undefined
}

export const splitCheckboxGroupProps = createSplitProps<
	Partial<CheckboxGroupProps>
>([
	'id',
	'ids',
	'value',
	'defaultValue',
	'name',
	'disabled',
	'invalid',
	'required',
	'readOnly',
	'onValueChange'
])

type Scope = {
	id?: string | undefined
	ids?: ElementIds | undefined
}

export type ItemProps = {
	value?: string | undefined
	disabled?: boolean | undefined
	invalid?: boolean | undefined
}

const parts = anatomy
	.extendWith('group', 'groupLabel', 'groupSupportingText', 'groupErrorText')
	.build()

const getGroupId = (ctx: Scope) => ctx.ids?.group ?? `checkbox:${ctx.id}:group`

const getGroupLabelId = (ctx: Scope) =>
	ctx.ids?.groupLabel ?? `checkbox:${ctx.id}:group-label`

const getGroupSupportingTextId = (ctx: Scope) =>
	ctx.ids?.groupSupportingText ??
	`checkbox-group:${ctx.id}:group-supporting-text`

const getGroupErrorTextId = (ctx: Scope) =>
	ctx.ids?.groupErrorText ?? `checkbox-group:${ctx.id}:group-error-text`

export type GetItemPropsReturn = {
	name?: string | undefined
	checked: boolean
	onCheckedChange: () => void
	disabled?: boolean | undefined
	readOnly?: boolean | undefined
	invalid?: boolean | undefined
}

export type UseCheckboxGroupReturn = {
	api: {
		hasGroupLabel: boolean
		groupDescribedBy: string | undefined
		disabled?: boolean | undefined
		invalid?: boolean | undefined
		required?: boolean | undefined
		getGroupProps: () => Omit<React.HTMLAttributes<HTMLElement>, 'ref'>
		getGroupLabelProps: () => Omit<React.HTMLAttributes<HTMLElement>, 'ref'>
		getGroupSupportingTextProps: () => Omit<
			React.HTMLAttributes<HTMLElement>,
			'ref'
		>
		getGroupErrorTextProps: () => Omit<React.HTMLAttributes<HTMLElement>, 'ref'>
		getItemProps: (props: ItemProps) => GetItemPropsReturn
	}
	register: {
		groupLabel: EffectCallback
		groupSupportingText: EffectCallback
		groupErrorText: EffectCallback
	}
}

export type CheckboxGroupUserProps = Partial<CheckboxGroupProps>

export type UseCheckboxGroupProps = CheckboxGroupUserProps & {}
export function useCheckboxGroup(
	props: UseCheckboxGroupProps
): UseCheckboxGroupReturn {
	const generatedId = useId()

	const defaultProps: UseCheckboxGroupProps = {
		id: generatedId
	}

	const userProps = mergeProps(defaultProps, props)
	const {
		id,
		name,
		disabled,
		required,
		readOnly,
		invalid,
		ids,
		value,
		defaultValue,
		onValueChange
	} = userProps

	const [hasGroupLabel, setHasGroupLabel] = useState(false)
	const [hasGroupSupportingText, setHasGroupSupportingText] = useState(false)
	const [hasGroupErrorText, setHasGroupErrorText] = useState(false)

	const register = useMemo(
		() => ({
			groupLabel: () => {
				setHasGroupLabel(true)
				return () => setHasGroupLabel(false)
			},
			groupSupportingText: () => {
				setHasGroupSupportingText(true)
				return () => setHasGroupSupportingText(false)
			},
			groupErrorText: () => {
				setHasGroupErrorText(true)
				return () => setHasGroupErrorText(false)
			}
		}),
		[]
	)

	const groupDescribedBy =
		[
			hasGroupSupportingText && getGroupSupportingTextId({ id, ids }),
			hasGroupErrorText && invalid && getGroupErrorTextId({ id, ids })
		]
			.filter(Boolean)
			.join(' ') || undefined

	const [uncontrolledValue, setUncontrolledValue] = useState(defaultValue ?? [])
	const isControlled = value !== undefined
	const groupValue = isControlled ? value : uncontrolledValue

	const setValue = useCallback(
		(next: string[]) => {
			if (!isControlled) {
				setUncontrolledValue(next)
			}
			onValueChange?.(next)
		},
		[isControlled, onValueChange]
	)

	const toggleValue = useCallback(
		(value: string) => {
			const next = groupValue.includes(value)
				? groupValue.filter(item => item !== value)
				: [...groupValue, value]

			setValue(next)
		},
		[groupValue, setValue]
	)

	const getGroupProps = () =>
		normalizeProps.element({
			...parts.group.attrs,
			role: 'group',
			'aria-labelledby': hasGroupLabel
				? getGroupLabelId({ id, ids })
				: undefined,
			'aria-describedby': hasGroupLabel ? groupDescribedBy : undefined,
			'aria-disabled': disabled || undefined,
			'aria-readonly': readOnly || undefined,
			'data-disabled': dataAttr(disabled),
			'data-invalid': dataAttr(invalid),
			id: getGroupId({ id, ids }),
			className: 'checkbox__group'
		})

	const getGroupLabelProps = () =>
		normalizeProps.element({
			...parts.groupLabel.attrs,
			'data-disabled': dataAttr(disabled),
			'data-invalid': dataAttr(invalid),
			id: getGroupLabelId({ id, ids }),
			className: 'checkbox__groupLabel'
		})

	const getGroupSupportingTextProps = () =>
		normalizeProps.element({
			...parts.groupSupportingText.attrs,
			id: getGroupSupportingTextId({ id, ids }),
			className: 'checkbox__groupSupportingText'
		})

	const getGroupErrorTextProps = () =>
		normalizeProps.element({
			...parts.groupErrorText.attrs,
			id: getGroupErrorTextId({ id, ids }),
			className: 'checkbox__groupErrorText'
		})

	const getItemProps = useCallback(
		({ value = 'on', ...props }: ItemProps) => ({
			name,
			checked: groupValue.includes(value),
			onCheckedChange: () => toggleValue(value),
			disabled: props.disabled ?? disabled,
			readOnly,
			invalid: props.invalid ?? invalid,
			required: required && groupValue.length === 0 ? true : undefined
		}),
		[name, groupValue, toggleValue, disabled, readOnly, invalid, required]
	)

	return {
		api: {
			hasGroupLabel,
			groupDescribedBy,
			disabled,
			invalid,
			required,
			getGroupProps,
			getGroupLabelProps,
			getGroupSupportingTextProps,
			getGroupErrorTextProps,
			getItemProps
		},
		register
	}
}
