import { cx } from '@iolita/styled-system/css'
import {
	type CheckboxVariantProps,
	checkbox
} from '@iolita/styled-system/recipes'
import { mergeProps } from '@zag-js/react'
import {
	type ComponentPropsWithoutRef,
	forwardRef,
	useLayoutEffect
} from 'react'
import { Slot } from '../../utils/slot'
import {
	type CheckboxUserProps,
	splitCheckboxProps,
	type UseCheckboxReturn,
	useCheckbox
} from './use-checkbox'
import { CheckboxProvider, useCheckboxContext } from './use-checkbox-context'
import {
	type CheckboxGroupUserProps,
	splitCheckboxGroupProps,
	useCheckboxGroup
} from './use-checkbox-group'
import {
	CheckboxGroupContext,
	useCheckboxGroupContext
} from './use-checkbox-group-context'

type RootInnerProps = ComponentPropsWithoutRef<'label'>
const RootInner = forwardRef<HTMLLabelElement, RootInnerProps>(
	(props, forwardedRef) => {
		const { api, styles } = useCheckboxContext()
		const { className, ...mergedProps } = mergeProps(api.getRootProps(), props)
		const mergedClassName = cx(styles.root, className)

		return (
			// biome-ignore lint/a11y/noLabelWithoutControl: label component, input is provided by the consumer
			<label {...mergedProps} className={mergedClassName} ref={forwardedRef} />
		)
	}
)

type RootProviderProps = ComponentPropsWithoutRef<'label'> &
	UseCheckboxReturn &
	CheckboxVariantProps
export const RootProvider = forwardRef<HTMLLabelElement, RootProviderProps>(
	({ api, ...props }, forwardedRef) => {
		const [variantProps, rootInnerProps] = checkbox.splitVariantProps(props)

		return (
			<CheckboxProvider api={api} {...variantProps}>
				<RootInner {...rootInnerProps} ref={forwardedRef} />
			</CheckboxProvider>
		)
	}
)
RootProvider.displayName = 'Checkbox.RootProvider'

type RootProps = Omit<
	ComponentPropsWithoutRef<'label'>,
	keyof CheckboxUserProps
> &
	CheckboxUserProps &
	CheckboxVariantProps
export const Root = forwardRef<HTMLLabelElement, RootProps>(
	(props, forwardedRef) => {
		const [rootProps, restProps] = splitCheckboxProps(props)
		const [variantProps, rootInnerProps] = checkbox.splitVariantProps(restProps)
		const { api } = useCheckbox(rootProps)

		return (
			<CheckboxProvider api={api} {...variantProps}>
				<RootInner {...rootInnerProps} ref={forwardedRef} />
			</CheckboxProvider>
		)
	}
)
Root.displayName = 'Checkbox.Root'

type ControlProps = ComponentPropsWithoutRef<'div'>
export const Control = forwardRef<HTMLDivElement, ControlProps>(
	(props, forwardedRef) => {
		const { api, styles } = useCheckboxContext()
		const { className, ...mergedProps } = mergeProps(
			api.getControlProps(),
			props
		)
		const mergedClassName = cx(styles.control, className)

		return (
			<div {...mergedProps} className={mergedClassName} ref={forwardedRef} />
		)
	}
)
Control.displayName = 'Checkbox.Control'

type IndicatorProps = ComponentPropsWithoutRef<'div'>
export const Indicator = forwardRef<HTMLDivElement, IndicatorProps>(
	(props, forwardedRef) => {
		const { api, styles } = useCheckboxContext()
		const { style, hidden, ...rest } = api.getIndicatorProps()
		const { className, ...mergedProps } = mergeProps(rest, props)
		const mergedClassName = cx(styles.indicator, className)

		return (
			<div {...mergedProps} className={mergedClassName} ref={forwardedRef}>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					viewBox="0 0 48 48"
					preserveAspectRatio="xMidYMid meet"
					aria-hidden="true"
					fill="currentColor"
				>
					<path
						id="path-box"
						d="M 6 6 L 6 42 L 42 42 L 42 6 L 6 6 z M 9 9 L 39 9 L 39 39 L 9 39 L 9 9 z "
					/>
					<path
						id="path-check"
						pathLength={1}
						d="M 13.925,22.775 20.95,29.8 34.325,16.425"
						fill="none"
						stroke="currentColor"
						strokeWidth={3.04}
					/>
				</svg>
			</div>
		)
	}
)
Indicator.displayName = 'Checkbox.Indicator'

type LabelProps = ComponentPropsWithoutRef<'span'>
export const Label = forwardRef<HTMLSpanElement, LabelProps>(
	(props, forwardedRef) => {
		const { api, styles } = useCheckboxContext()
		const { className, ...mergedProps } = mergeProps(api.getLabelProps(), props)
		const mergedClassName = cx(styles.label, className)

		return (
			<span {...mergedProps} className={mergedClassName} ref={forwardedRef} />
		)
	}
)
Label.displayName = 'Checkbox.Label'

type HiddenInputProps = ComponentPropsWithoutRef<'input'>
export const HiddenInput = forwardRef<HTMLInputElement, HiddenInputProps>(
	(props, forwardedRef) => {
		const { api } = useCheckboxContext()
		const mergedProps = mergeProps(api.getHiddenInputProps(), props)

		return <input {...mergedProps} ref={forwardedRef} />
	}
)
HiddenInput.displayName = 'Checkbox.HiddenInput'

type GroupProps = ComponentPropsWithoutRef<'div'> & CheckboxGroupUserProps
export const Group = forwardRef<HTMLDivElement, GroupProps>(
	(props, forwardedRef) => {
		const [groupProps, restProps] = splitCheckboxGroupProps(props)
		const group = useCheckboxGroup(groupProps)
		const mergedProps = mergeProps(group.api.getGroupProps(), restProps)

		return (
			<CheckboxGroupContext.Provider value={group}>
				<div {...mergedProps} ref={forwardedRef} />
			</CheckboxGroupContext.Provider>
		)
	}
)
Group.displayName = 'Checkbox.Group'

type GroupLabelProps = ComponentPropsWithoutRef<'div'>
export const GroupLabel = forwardRef<HTMLDivElement, GroupLabelProps>(
	(props, forwardedRef) => {
		const group = useCheckboxGroupContext()
		if (!group)
			throw new Error('Checkbox.GroupLabel must be used within Checkbox.Group')

		const mergedProps = mergeProps(group.api.getGroupLabelProps(), props)

		useLayoutEffect(() => group.register.groupLabel(), [group.register])

		return <div {...mergedProps} ref={forwardedRef} />
	}
)
GroupLabel.displayName = 'Checkbox.GroupLabel'

type GroupSupportingTextProps = ComponentPropsWithoutRef<'span'> & {
	asChild?: boolean
}
export const GroupSupportingText = forwardRef<
	HTMLDivElement,
	GroupSupportingTextProps
>(({ asChild, ...props }, forwardedRef) => {
	const group = useCheckboxGroupContext()
	if (!group)
		throw new Error(
			'Checkbox.GroupSupportingText must be used within Checkbox.Group'
		)

	const mergedProps = mergeProps(group.api.getGroupSupportingTextProps(), props)

	useLayoutEffect(() => group.register.groupSupportingText(), [group.register])

	const Component = asChild ? Slot : 'span'

	return <Component {...mergedProps} ref={forwardedRef} />
})
GroupSupportingText.displayName = 'Checkbox.GroupSupportingText'

type GroupErrorTextProps = ComponentPropsWithoutRef<'span'>
export const GroupErrorText = forwardRef<HTMLSpanElement, GroupErrorTextProps>(
	(props, forwardedRef) => {
		const group = useCheckboxGroupContext()
		if (!group)
			throw new Error(
				'Checkbox.GroupErrorText must be used within Checkbox.Group'
			)

		const mergedProps = mergeProps(group.api.getGroupErrorTextProps(), props)

		useLayoutEffect(() => group.register.groupErrorText(), [group.register])

		return group.api.invalid ? (
			<span role="alert" {...mergedProps} ref={forwardedRef} />
		) : null
	}
)
GroupErrorText.displayName = 'Checkbox.GroupErrorText'
