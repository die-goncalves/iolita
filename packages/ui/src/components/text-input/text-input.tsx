import { cx } from '@iolita/styled-system/css'
import {
	type TextInputVariantProps,
	textInput
} from '@iolita/styled-system/recipes'
import { mergeProps } from '@zag-js/react'
import {
	type ComponentPropsWithoutRef,
	forwardRef,
	useLayoutEffect
} from 'react'
import { Slot } from '../../utils/slot'
import {
	splitTextInputProps,
	type TextInputUserProps,
	type UseTextInputReturn,
	useTextInput
} from './use-text-input'
import {
	TextInputProvider,
	useTextInputContext
} from './use-text-input-context'

type RootInnerProps = ComponentPropsWithoutRef<'div'>
const RootInner = forwardRef<HTMLDivElement, RootInnerProps>(
	(props, forwardedRef) => {
		const { api, styles } = useTextInputContext()
		const { className, ...mergedProps } = mergeProps(api.getRootProps(), props)
		const mergedClassName = cx(styles.root, className)

		return (
			<div {...mergedProps} className={mergedClassName} ref={forwardedRef} />
		)
	}
)

type RootProviderProps = ComponentPropsWithoutRef<'div'> &
	UseTextInputReturn &
	TextInputVariantProps
export const RootProvider = forwardRef<HTMLDivElement, RootProviderProps>(
	({ api, register, ...props }, forwardedRef) => {
		const [variantProps, rootInnerProps] = textInput.splitVariantProps(props)

		return (
			<TextInputProvider api={api} register={register} {...variantProps}>
				<RootInner {...rootInnerProps} ref={forwardedRef} />
			</TextInputProvider>
		)
	}
)
RootProvider.displayName = 'TextInput.RootProvider'

type RootProps = Omit<
	ComponentPropsWithoutRef<'div'>,
	keyof TextInputUserProps
> &
	TextInputUserProps &
	TextInputVariantProps
export const Root = forwardRef<HTMLDivElement, RootProps>(
	(props, forwardedRef) => {
		const [rootProps, restProps] = splitTextInputProps(props)
		const [variantProps, rootInnerProps] =
			textInput.splitVariantProps(restProps)

		const { api, register } = useTextInput(rootProps)

		return (
			<TextInputProvider api={api} register={register} {...variantProps}>
				<RootInner {...rootInnerProps} ref={forwardedRef} />
			</TextInputProvider>
		)
	}
)
Root.displayName = 'TextInput.Root'

type LabelProps = Omit<ComponentPropsWithoutRef<'label'>, 'id'>
export const Label = forwardRef<HTMLLabelElement, LabelProps>(
	(props, forwardedRef) => {
		const { api, styles } = useTextInputContext()
		const { className, ...mergedProps } = mergeProps(api.getLabelProps(), props)
		const mergedClassName = cx(styles.label, className)

		return (
			// biome-ignore lint/a11y/noLabelWithoutControl: label component, input is provided by the consumer
			<label {...mergedProps} className={mergedClassName} ref={forwardedRef} />
		)
	}
)
Label.displayName = 'TextInput.Label'

type InputProps = Omit<ComponentPropsWithoutRef<'input'>, 'id'>
export const Input = forwardRef<HTMLInputElement, InputProps>(
	(props, forwardedRef) => {
		const { api, styles } = useTextInputContext()
		const { className, ...mergedProps } = mergeProps(api.getInputProps(), props)
		const mergedClassName = cx(styles.input, className)

		return (
			<input {...mergedProps} className={mergedClassName} ref={forwardedRef} />
		)
	}
)
Input.displayName = 'TextInput.Input'

type SupportingTextProps = Omit<ComponentPropsWithoutRef<'span'>, 'id'> & {
	asChild?: boolean
}
export const SupportingText = forwardRef<HTMLSpanElement, SupportingTextProps>(
	({ asChild, ...props }, forwardedRef) => {
		const { api, register, styles } = useTextInputContext()
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
SupportingText.displayName = 'TextInput.SupportingText'

type ErrorTextProps = Omit<ComponentPropsWithoutRef<'span'>, 'id'>
export const ErrorText = forwardRef<HTMLSpanElement, ErrorTextProps>(
	(props, forwardedRef) => {
		const { api, register, styles } = useTextInputContext()
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
ErrorText.displayName = 'TextInput.ErrorText'
