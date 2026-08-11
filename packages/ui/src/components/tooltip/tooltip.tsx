import { cx } from '@iolita/styled-system/css'
import {
	type TooltipVariantProps,
	tooltip
} from '@iolita/styled-system/recipes'
import * as slot from '@radix-ui/react-slot'
import { mergeProps, type PropTypes } from '@zag-js/react'
import type * as zTooltip from '@zag-js/tooltip'
import {
	type ComponentPropsWithoutRef,
	forwardRef,
	type ReactNode
} from 'react'
import { type TooltipUserProps, useTooltip } from './use-tooltip'
import { TooltipProvider, useTooltipContext } from './use-tooltip-context'

type RootProviderProps = zTooltip.Api<PropTypes> &
	TooltipVariantProps & { children: ReactNode }
export function RootProvider({ children, ...props }: RootProviderProps) {
	return <TooltipProvider {...props}>{children}</TooltipProvider>
}
RootProvider.displayName = 'Tooltip.RootProvider'

type RootProps = TooltipUserProps &
	TooltipVariantProps & { children: ReactNode }
export const Root = ({ children, ...props }: RootProps) => {
	const api = useTooltip(props)

	return <TooltipProvider {...api}>{children}</TooltipProvider>
}
Root.displayName = 'Tooltip.Root'

type TriggerProps = Omit<ComponentPropsWithoutRef<'button'>, 'value'> &
	zTooltip.TriggerProps & { asChild?: boolean }
export const Trigger = forwardRef<HTMLButtonElement, TriggerProps>(
	({ asChild, value, ...props }, forwardedRef) => {
		const { getTriggerProps } = useTooltipContext()
		const { className, ...mergedProps } = mergeProps(
			getTriggerProps({
				...(value ? { value } : {})
			}),
			props
		)
		const { trigger } = tooltip()
		const mergedClassName = cx(trigger, className)

		const Component = asChild ? slot.Slot : 'button'

		return (
			<Component
				{...mergedProps}
				className={mergedClassName}
				ref={forwardedRef}
			/>
		)
	}
)
Trigger.displayName = 'Tooltip.Trigger'

type PositionerProps = ComponentPropsWithoutRef<'div'>
export const Positioner = forwardRef<HTMLDivElement, PositionerProps>(
	(props, forwardedRef) => {
		const { getPositionerProps } = useTooltipContext()
		const { className, ...mergedProps } = mergeProps(
			getPositionerProps(),
			props
		)
		const { positioner } = tooltip()
		const mergedClassName = cx(positioner, className)

		return (
			<div {...mergedProps} className={mergedClassName} ref={forwardedRef} />
		)
	}
)
Positioner.displayName = 'Tooltip.Positioner'

type ContentProps = ComponentPropsWithoutRef<'div'>
export const Content = forwardRef<HTMLDivElement, ContentProps>(
	(props, forwardedRef) => {
		const { getContentProps } = useTooltipContext()
		const { className, ...mergedProps } = mergeProps(getContentProps(), props)
		const { content } = tooltip()
		const mergedClassName = cx(content, className)

		return (
			<div {...mergedProps} className={mergedClassName} ref={forwardedRef} />
		)
	}
)
Content.displayName = 'Tooltip.Content'

type ArrowProps = ComponentPropsWithoutRef<'div'>
export const Arrow = forwardRef<HTMLDivElement, ArrowProps>(
	(props, forwardedRef) => {
		const { getArrowProps, getContentProps } = useTooltipContext()
		const { className, ...mergedProps } = mergeProps(
			getArrowProps(),
			{ hidden: getContentProps().hidden },
			props
		)
		const { arrow } = tooltip()
		const mergedClassName = cx(arrow, className)

		return (
			<div {...mergedProps} className={mergedClassName} ref={forwardedRef} />
		)
	}
)
Arrow.displayName = 'Tooltip.Arrow'

type ArrowTipProps = ComponentPropsWithoutRef<'div'>
export const ArrowTip = forwardRef<HTMLDivElement, ArrowTipProps>(
	(props, forwardedRef) => {
		const { getArrowTipProps } = useTooltipContext()
		const { className, ...mergedProps } = mergeProps(getArrowTipProps(), props)
		const { arrowTip } = tooltip()
		const mergedClassName = cx(arrowTip, className)

		return (
			<div {...mergedProps} className={mergedClassName} ref={forwardedRef} />
		)
	}
)
ArrowTip.displayName = 'Tooltip.ArrowTip'
