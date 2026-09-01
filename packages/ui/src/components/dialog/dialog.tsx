import { cx } from '@iolita/styled-system/css'
import type { DialogVariantProps } from '@iolita/styled-system/recipes'
import type * as zDialog from '@zag-js/dialog'
import { mergeProps } from '@zag-js/react'
import {
	type ComponentPropsWithoutRef,
	type ForwardedRef,
	forwardRef,
	type ReactNode
} from 'react'
import { Slot } from '../../utils/slot'
import { type DialogApi, type DialogUserProps, useDialog } from './use-dialog'
import { DialogProvider, useDialogContext } from './use-dialog-context'

type RootProviderProps = DialogApi &
	DialogVariantProps & { children: ReactNode }
export function RootProvider({
	size,
	scrollBehavior,
	placement,
	children,
	...props
}: RootProviderProps) {
	return (
		<DialogProvider
			size={size}
			scrollBehavior={scrollBehavior}
			placement={placement}
			{...props}
		>
			{children}
		</DialogProvider>
	)
}
RootProvider.displayName = 'Dialog.RootProvider'

type RootProps = DialogUserProps & DialogVariantProps & { children: ReactNode }
export const Root = ({
	size,
	scrollBehavior,
	placement,
	children,
	...props
}: RootProps) => {
	const api = useDialog(props)

	return (
		<DialogProvider
			size={size}
			scrollBehavior={scrollBehavior}
			placement={placement}
			{...api}
		>
			{children}
		</DialogProvider>
	)
}
Root.displayName = 'Dialog.Root'

type TriggerProps = Omit<ComponentPropsWithoutRef<'button'>, 'value'> &
	zDialog.TriggerProps & { asChild?: boolean }
export const Trigger = forwardRef<HTMLButtonElement, TriggerProps>(
	({ asChild, value, ...props }, forwardedRef) => {
		const { getTriggerProps, styles } = useDialogContext()
		const { className, ...mergedProps } = mergeProps(
			getTriggerProps({
				...(value ? { value } : {})
			}),
			props
		)
		const mergedClassName = cx(styles.trigger, className)

		const Component = asChild ? Slot : 'button'

		return (
			<Component
				{...mergedProps}
				className={mergedClassName}
				ref={forwardedRef}
			/>
		)
	}
)
Trigger.displayName = 'Dialog.Trigger'

type BackdropProps = ComponentPropsWithoutRef<'div'>
export const Backdrop = forwardRef<HTMLDivElement, BackdropProps>(
	(props, forwardedRef) => {
		const { getBackdropProps, styles } = useDialogContext()
		const { className, ...mergedProps } = mergeProps(getBackdropProps(), props)
		const mergedClassName = cx(styles.backdrop, className)

		return (
			<div {...mergedProps} className={mergedClassName} ref={forwardedRef} />
		)
	}
)
Backdrop.displayName = 'Dialog.Backdrop'

type PositionerProps = ComponentPropsWithoutRef<'div'>
export const Positioner = forwardRef<HTMLDivElement, PositionerProps>(
	(props, forwardedRef) => {
		const { getPositionerProps, styles } = useDialogContext()
		const { className, ...mergedProps } = mergeProps(
			getPositionerProps(),
			props
		)
		const mergedClassName = cx(styles.positioner, className)

		return (
			<div {...mergedProps} className={mergedClassName} ref={forwardedRef} />
		)
	}
)
Positioner.displayName = 'Dialog.Positioner'

type ContentProps = ComponentPropsWithoutRef<'div'>
export const Content = forwardRef<HTMLDivElement, ContentProps>(
	(props, forwardedRef) => {
		const { getContentProps, placement, styles } = useDialogContext()
		const { className, ...mergedProps } = mergeProps(getContentProps(), props)
		const mergedClassName = cx(styles.content, className)

		return (
			<div
				{...mergedProps}
				data-placement={placement}
				className={mergedClassName}
				ref={forwardedRef}
			/>
		)
	}
)
Content.displayName = 'Dialog.Content'

type CloseTriggerProps = ComponentPropsWithoutRef<'button'> & {
	asChild?: boolean
}
export const CloseTrigger = forwardRef<HTMLButtonElement, CloseTriggerProps>(
	({ asChild, ...props }, forwardedRef) => {
		const { getCloseTriggerProps, styles } = useDialogContext()
		const { className, ...mergedProps } = mergeProps(
			getCloseTriggerProps(),
			props
		)
		const mergedClassName = cx(styles.closeTrigger, className)

		const Component = asChild ? Slot : 'button'

		return (
			<Component
				{...mergedProps}
				className={mergedClassName}
				ref={forwardedRef}
			/>
		)
	}
)
CloseTrigger.displayName = 'Dialog.CloseTrigger'

type HeadlineProps = ComponentPropsWithoutRef<'div'>
export const Headline = forwardRef<HTMLDivElement, HeadlineProps>(
	(props, forwardedRef) => {
		const { getHeadlineProps, styles } = useDialogContext()
		const { className, ...mergedProps } = mergeProps(getHeadlineProps(), props)
		const mergedClassName = cx(styles.headline, className)

		return (
			<div {...mergedProps} className={mergedClassName} ref={forwardedRef} />
		)
	}
)
Headline.displayName = 'Dialog.Headline'

type HeadingTag = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'
type TitleProps<T extends HeadingTag = 'h3'> = ComponentPropsWithoutRef<T> & {
	as?: T
}
export const Title = forwardRef(
	<T extends HeadingTag = 'h3'>(
		{ as, ...props }: TitleProps<T>,
		forwardedRef: ForwardedRef<HTMLHeadingElement>
	) => {
		const { getTitleProps, styles } = useDialogContext()
		const { className, ...mergedProps } = mergeProps(getTitleProps(), props)
		const mergedClassName = cx(styles.title, className)

		const Component = as || 'h3'

		return (
			<Component
				{...mergedProps}
				className={mergedClassName}
				ref={forwardedRef}
			/>
		)
	}
)
Title.displayName = 'Dialog.Title'

type DescriptionProps = ComponentPropsWithoutRef<'div'>
export const Description = forwardRef<HTMLDivElement, DescriptionProps>(
	(props, forwardedRef) => {
		const { getDescriptionProps, styles } = useDialogContext()
		const { className, ...mergedProps } = mergeProps(
			getDescriptionProps(),
			props
		)
		const mergedClassName = cx(styles.description, className)

		return (
			<div {...mergedProps} className={mergedClassName} ref={forwardedRef} />
		)
	}
)
Description.displayName = 'Dialog.Description'

type ActionProps = ComponentPropsWithoutRef<'div'>
export const Action = forwardRef<HTMLDivElement, ActionProps>(
	(props, forwardedRef) => {
		const { getActionProps, styles } = useDialogContext()
		const { className, ...mergedProps } = mergeProps(getActionProps(), props)
		const mergedClassName = cx(styles.action, className)

		return (
			<div {...mergedProps} className={mergedClassName} ref={forwardedRef} />
		)
	}
)
Action.displayName = 'Dialog.Action'
