import { cx } from '@iolita/styled-system/css'
import {
	type PopoverVariantProps,
	popover
} from '@iolita/styled-system/recipes'
import type * as zPopover from '@zag-js/popover'
import { mergeProps, type PropTypes } from '@zag-js/react'
import {
	type ComponentPropsWithoutRef,
	forwardRef,
	type ReactNode
} from 'react'
import { Slot } from '../../utils/slot'
import { type PopoverUserProps, usePopover } from './use-popover'
import { PopoverProvider, usePopoverContext } from './use-popover-context'

type RootProviderProps = zPopover.Api<PropTypes> &
	PopoverVariantProps & { children: ReactNode }
export function RootProvider({ children, ...props }: RootProviderProps) {
	return <PopoverProvider {...props}>{children}</PopoverProvider>
}
RootProvider.displayName = 'Popover.RootProvider'

type RootProps = PopoverUserProps &
	PopoverVariantProps & { children: ReactNode }
export const Root = ({ children, ...props }: RootProps) => {
	const api = usePopover(props)

	return <PopoverProvider {...api}>{children}</PopoverProvider>
}
Root.displayName = 'Popover.Root'

type TriggerProps = Omit<ComponentPropsWithoutRef<'button'>, 'value'> &
	zPopover.TriggerProps & { asChild?: boolean }
export const Trigger = forwardRef<HTMLButtonElement, TriggerProps>(
	({ asChild, value, ...props }, forwardedRef) => {
		const { getTriggerProps } = usePopoverContext()
		const { className, ...mergedProps } = mergeProps(
			getTriggerProps({
				...(value ? { value } : {})
			}),
			props
		)
		const { trigger } = popover()
		const mergedClassName = cx(trigger, className)

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
Trigger.displayName = 'Popover.Trigger'

type PositionerProps = ComponentPropsWithoutRef<'div'>
export const Positioner = forwardRef<HTMLDivElement, PositionerProps>(
	(props, forwardedRef) => {
		const { getPositionerProps } = usePopoverContext()
		const { className, ...mergedProps } = mergeProps(
			getPositionerProps(),
			props
		)
		const { positioner } = popover()
		const mergedClassName = cx(positioner, className)

		return (
			<div {...mergedProps} className={mergedClassName} ref={forwardedRef} />
		)
	}
)
Positioner.displayName = 'Popover.Positioner'

type ContentProps = ComponentPropsWithoutRef<'div'>
export const Content = forwardRef<HTMLDivElement, ContentProps>(
	(props, forwardedRef) => {
		const { getContentProps } = usePopoverContext()
		const { className, ...mergedProps } = mergeProps(getContentProps(), props)
		const { content } = popover()
		const mergedClassName = cx(content, className)

		return (
			<div {...mergedProps} className={mergedClassName} ref={forwardedRef} />
		)
	}
)
Content.displayName = 'Popover.Content'

type ArrowProps = ComponentPropsWithoutRef<'div'>
export const Arrow = forwardRef<HTMLDivElement, ArrowProps>(
	(props, forwardedRef) => {
		const { getArrowProps, getContentProps } = usePopoverContext()
		const { className, ...mergedProps } = mergeProps(
			getArrowProps(),
			{ hidden: getContentProps().hidden },
			props
		)
		const { arrow } = popover()
		const mergedClassName = cx(arrow, className)

		return (
			<div {...mergedProps} className={mergedClassName} ref={forwardedRef} />
		)
	}
)
Arrow.displayName = 'Popover.Arrow'

type ArrowTipProps = ComponentPropsWithoutRef<'div'>
export const ArrowTip = forwardRef<HTMLDivElement, ArrowTipProps>(
	(props, forwardedRef) => {
		const { getArrowTipProps } = usePopoverContext()
		const { className, ...mergedProps } = mergeProps(getArrowTipProps(), props)
		const { arrowTip } = popover()
		const mergedClassName = cx(arrowTip, className)

		return (
			<div {...mergedProps} className={mergedClassName} ref={forwardedRef} />
		)
	}
)
ArrowTip.displayName = 'Popover.ArrowTip'

type CloseTriggerProps = ComponentPropsWithoutRef<'button'> & {
	asChild?: boolean
}
export const CloseTrigger = forwardRef<HTMLButtonElement, CloseTriggerProps>(
	({ asChild, ...props }, forwardedRef) => {
		const { getCloseTriggerProps } = usePopoverContext()
		const { className, ...mergedProps } = mergeProps(
			getCloseTriggerProps(),
			props
		)
		const { closeTrigger } = popover()
		const mergedClassName = cx(closeTrigger, className)

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
CloseTrigger.displayName = 'Popover.CloseTrigger'

type TitleProps = ComponentPropsWithoutRef<'div'>
export const Title = forwardRef<HTMLDivElement, TitleProps>(
	(props, forwardedRef) => {
		const { getTitleProps } = usePopoverContext()
		const { className, ...mergedProps } = mergeProps(getTitleProps(), props)
		const { title } = popover()
		const mergedClassName = cx(title, className)

		return (
			<div {...mergedProps} className={mergedClassName} ref={forwardedRef} />
		)
	}
)
Title.displayName = 'Popover.Title'

type DescriptionProps = ComponentPropsWithoutRef<'div'>
export const Description = forwardRef<HTMLDivElement, DescriptionProps>(
	(props, forwardedRef) => {
		const { getDescriptionProps } = usePopoverContext()
		const { className, ...mergedProps } = mergeProps(
			getDescriptionProps(),
			props
		)
		const { description } = popover()
		const mergedClassName = cx(description, className)

		return (
			<div {...mergedProps} className={mergedClassName} ref={forwardedRef} />
		)
	}
)
Description.displayName = 'Popover.Description'
