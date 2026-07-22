import { cx } from '@iolita/styled-system/css'
import { type ButtonVariantProps, button } from '@iolita/styled-system/recipes'
import {
	type ComponentPropsWithoutRef,
	type ForwardedRef,
	forwardRef,
	type ReactNode,
	useId
} from 'react'

export type ButtonProps = ComponentPropsWithoutRef<'button'> &
	ButtonVariantProps & {
		loading?: boolean
		icon?: ReactNode
		iconPlacement?: 'left' | 'right'
	}
export const Button = forwardRef(
	(
		{
			id,
			size,
			variant,
			icon,
			iconPlacement = 'left',
			children,
			className,
			disabled,
			loading = false,
			onClick,
			...props
		}: ButtonProps,
		forwardedRef: ForwardedRef<HTMLButtonElement>
	) => {
		const clientId = useId()
		const buttonId = id ?? clientId

		const style = button({ size, variant })
		const mergedClassName = cx(style, className)

		const interactionBlocked = loading || disabled

		const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
			if (interactionBlocked) {
				event.preventDefault()
				return
			}
			onClick?.(event)
		}

		return (
			<button
				{...props}
				{...(icon && { 'data-icon-placement': iconPlacement })}
				id={buttonId}
				disabled={disabled}
				aria-disabled={loading || undefined}
				aria-busy={loading || undefined}
				onClick={handleClick}
				className={mergedClassName}
				ref={forwardedRef}
			>
				{iconPlacement === 'left' && icon}
				{children}
				{iconPlacement === 'right' && icon}
			</button>
		)
	}
)
Button.displayName = 'Button'
