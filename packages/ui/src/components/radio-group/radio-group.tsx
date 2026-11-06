import { cx } from '@iolita/styled-system/css'
import {
	type RadioGroupVariantProps,
	radioGroup
} from '@iolita/styled-system/recipes'
import type * as zRadioGroup from '@zag-js/radio-group'
import type { Api } from '@zag-js/radio-group'
import { mergeProps, type PropTypes } from '@zag-js/react'
import {
	type ComponentPropsWithoutRef,
	createContext,
	forwardRef,
	useContext,
	useLayoutEffect
} from 'react'
import { Slot } from '../../utils/slot'
import {
	type RadioGroupUserProps,
	splitRadioGroupItemProps,
	splitRadioGroupProps,
	type UseRadioGroupReturn,
	useRadioGroup
} from './use-radio-group'
import {
	RadioGroupProvider,
	useRadioGroupContext
} from './use-radio-group-context'

type RootInnerProps = ComponentPropsWithoutRef<'div'>
const RootInner = forwardRef<HTMLDivElement, RootInnerProps>(
	(props, forwardedRef) => {
		const { api, styles } = useRadioGroupContext()
		const { className, ...mergedProps } = mergeProps(api.getRootProps(), props)
		const mergedClassName = cx(styles.root, className)

		return (
			<div {...mergedProps} className={mergedClassName} ref={forwardedRef} />
		)
	}
)

type RootProviderProps = ComponentPropsWithoutRef<'div'> &
	UseRadioGroupReturn &
	RadioGroupVariantProps
export const RootProvider = forwardRef<HTMLDivElement, RootProviderProps>(
	({ api, register, ...props }, forwardedRef) => {
		const [variantProps, rootInnerProps] = radioGroup.splitVariantProps(props)

		return (
			<RadioGroupProvider api={api} register={register} {...variantProps}>
				<RootInner {...rootInnerProps} ref={forwardedRef} />
			</RadioGroupProvider>
		)
	}
)
RootProvider.displayName = 'RadioGroup.RootProvider'

type RootProps = Omit<
	ComponentPropsWithoutRef<'div'>,
	keyof RadioGroupUserProps
> &
	RadioGroupUserProps &
	RadioGroupVariantProps
export const Root = forwardRef<HTMLDivElement, RootProps>(
	(props, forwardedRef) => {
		const [rootProps, restProps] = splitRadioGroupProps(props)
		const [variantProps, rootInnerProps] =
			radioGroup.splitVariantProps(restProps)
		const { api, register } = useRadioGroup(rootProps)

		return (
			<RadioGroupProvider api={api} register={register} {...variantProps}>
				<RootInner {...rootInnerProps} ref={forwardedRef} />
			</RadioGroupProvider>
		)
	}
)
Root.displayName = 'RadioGroup.Root'

type LabelProps = Omit<ComponentPropsWithoutRef<'div'>, 'id'>
export const Label = forwardRef<HTMLDivElement, LabelProps>(
	(props, forwardedRef) => {
		const { api, styles } = useRadioGroupContext()
		const { className, ...mergedProps } = mergeProps(api.getLabelProps(), props)
		const mergedClassName = cx(styles.label, className)

		return (
			<div {...mergedProps} className={mergedClassName} ref={forwardedRef} />
		)
	}
)
Label.displayName = 'RadioGroup.Label'

type ItemStateContextData = ReturnType<Api<PropTypes>['getItemState']> & {
	value: string
}
const ItemStateContext = createContext({} as ItemStateContextData)

type ItemProps = Omit<ComponentPropsWithoutRef<'label'>, 'id'> &
	zRadioGroup.ItemProps
export const Item = forwardRef<HTMLLabelElement, ItemProps>(
	({ children, ...props }, forwardedRef) => {
		const [itemProps, restProps] = splitRadioGroupItemProps(props)
		const { api, styles } = useRadioGroupContext()
		const { className, ...mergedProps } = mergeProps(
			api.getItemProps(itemProps),
			restProps
		)
		const mergedClassName = cx(styles.item, className)
		const itemState = api.getItemState(itemProps)

		return (
			// biome-ignore lint/a11y/noLabelWithoutControl: label component, input is provided by the consumer
			<label {...mergedProps} className={mergedClassName} ref={forwardedRef}>
				<ItemStateContext.Provider value={itemState}>
					{children}
				</ItemStateContext.Provider>
			</label>
		)
	}
)
Item.displayName = 'RadioGroup.Item'

type ItemControlProps = Omit<ComponentPropsWithoutRef<'div'>, 'id'>
export const ItemControl = forwardRef<HTMLDivElement, ItemControlProps>(
	(props, forwardedRef) => {
		const { api, styles } = useRadioGroupContext()
		const { disabled, invalid, value } = useContext(ItemStateContext)
		const { className, ...mergedProps } = mergeProps(
			api.getItemControlProps({ disabled, invalid, value }),
			props
		)
		const mergedClassName = cx(styles.itemControl, className)

		return (
			<div {...mergedProps} className={mergedClassName} ref={forwardedRef} />
		)
	}
)
ItemControl.displayName = 'RadioGroup.ItemControl'

type ItemIndicatorProps = Omit<ComponentPropsWithoutRef<'div'>, 'id'>
export const ItemIndicator = forwardRef<HTMLDivElement, ItemIndicatorProps>(
	(props, forwardedRef) => {
		const { api, styles } = useRadioGroupContext()
		const { disabled, invalid, value } = useContext(ItemStateContext)
		const { className, ...mergedProps } = mergeProps(
			api.getItemIndicatorProps({ disabled, invalid, value }),
			props
		)
		const mergedClassName = cx(styles.itemIndicator, className)

		return (
			<div {...mergedProps} className={mergedClassName} ref={forwardedRef}>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					viewBox="0 0 48 48"
					preserveAspectRatio="xMidYMid meet"
					aria-hidden="true"
					fill="currentColor"
				>
					{<circle cx="24" cy="24" r="10" />}
					<path d="M 24 3.9984375 C 21.280003 3.9917708 18.700935 4.5154177 16.260937 5.56875 C 13.82094 6.6220823 11.694582 8.0484393 9.88125 9.8484375 C 8.0679185 11.648436 6.6314573 13.766669 5.578125 16.2 C 4.5247927 18.633331 3.9984375 21.233336 3.9984375 24 C 3.9984375 26.719997 4.5220844 29.299065 5.56875 31.739062 C 6.6154156 34.17906 8.0518768 36.305418 9.871875 38.11875 C 11.691873 39.932082 13.818232 41.368543 16.251562 42.421875 C 18.684893 43.475207 21.266669 44.001562 24 44.001562 C 26.773331 44.001562 29.373336 43.477916 31.8 42.43125 C 34.226664 41.384584 36.344898 39.948123 38.151562 38.128125 C 39.958227 36.308127 41.384584 34.181768 42.43125 31.748437 C 43.477916 29.315107 44.001562 26.733331 44.001562 24 C 44.008229 21.226669 43.484582 18.626664 42.43125 16.2 C 41.377918 13.773336 39.951561 11.655102 38.151562 9.8484375 C 36.351564 8.0417726 34.233331 6.6154156 31.8 5.56875 C 29.366669 4.5220844 26.766664 3.9984375 24 3.9984375 z M 24 6.9984375 C 28.733329 6.9984375 32.751566 8.6484408 36.051562 11.948437 C 39.351559 15.248434 41.001562 19.266671 41.001562 24 C 41.001562 28.693329 39.351559 32.698753 36.051562 36.01875 C 32.751566 39.338747 28.733329 41.001562 24 41.001562 C 19.306671 40.994896 15.301247 39.33208 11.98125 36.01875 C 8.6612533 32.70542 6.9984375 28.699995 6.9984375 24 C 7.0051042 19.266671 8.66792 15.248434 11.98125 11.948437 C 15.29458 8.6484408 19.300005 6.9984375 24 6.9984375 z " />
				</svg>
			</div>
		)
	}
)
ItemIndicator.displayName = 'RadioGroup.ItemIndicator'

type ItemTextProps = Omit<ComponentPropsWithoutRef<'div'>, 'id'>
export const ItemText = forwardRef<HTMLDivElement, ItemTextProps>(
	(props, forwardedRef) => {
		const { api, styles } = useRadioGroupContext()
		const { disabled, invalid, value } = useContext(ItemStateContext)
		const { className, ...mergedProps } = mergeProps(
			api.getItemTextProps({ disabled, invalid, value }),
			props
		)
		const mergedClassName = cx(styles.itemText, className)

		return (
			<div {...mergedProps} className={mergedClassName} ref={forwardedRef} />
		)
	}
)
ItemText.displayName = 'RadioGroup.ItemText'

type ItemHiddenInputProps = Omit<ComponentPropsWithoutRef<'input'>, 'id'>
export const ItemHiddenInput = forwardRef<
	HTMLInputElement,
	ItemHiddenInputProps
>((props, forwardedRef) => {
	const { api } = useRadioGroupContext()
	const { disabled, invalid, value } = useContext(ItemStateContext)

	const mergedProps = mergeProps(
		api.getItemHiddenInputProps({ disabled, invalid, value }),
		props
	)

	return <input {...mergedProps} ref={forwardedRef} />
})
ItemHiddenInput.displayName = 'RadioGroup.ItemHiddenInput'

type SupportingTextProps = Omit<ComponentPropsWithoutRef<'span'>, 'id'> & {
	asChild?: boolean
}
export const SupportingText = forwardRef<HTMLSpanElement, SupportingTextProps>(
	({ asChild, ...props }, forwardedRef) => {
		const { api, register, styles } = useRadioGroupContext()
		const { className, ...mergedProps } = mergeProps(
			api.getSupportingTextProps(),
			props
		)
		const mergedClassName = cx(styles.supportingText, className)

		useLayoutEffect(() => register.supportingText(), [register])

		const Component = asChild ? Slot : 'span'

		return (
			<Component
				{...mergedProps}
				className={mergedClassName}
				ref={forwardedRef}
			/>
		)
	}
)
SupportingText.displayName = 'RadioGroup.SupportingText'

type ErrorTextProps = Omit<ComponentPropsWithoutRef<'span'>, 'id'>
export const ErrorText = forwardRef<HTMLSpanElement, ErrorTextProps>(
	(props, forwardedRef) => {
		const { api, register, styles } = useRadioGroupContext()
		const { className, ...mergedProps } = mergeProps(
			api.getErrorTextProps(),
			props
		)
		const mergedClassName = cx(styles.errorText, className)

		useLayoutEffect(() => register.errorText(), [register])

		return api.invalid ? (
			<span
				role="alert"
				{...mergedProps}
				className={mergedClassName}
				ref={forwardedRef}
			/>
		) : null
	}
)
ErrorText.displayName = 'RadioGroup.ErrorText'
