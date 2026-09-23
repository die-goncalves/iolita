import { cx } from '@iolita/styled-system/css'
import type { MenuVariantProps } from '@iolita/styled-system/recipes'
import * as zMenu from '@zag-js/menu'
import { mergeProps } from '@zag-js/react'
import {
	type ComponentPropsWithoutRef,
	forwardRef,
	type ReactNode,
	useCallback,
	useId
} from 'react'
import { Slot } from '../../utils/slot'
import { useEffectOnce } from '../../utils/use-effect-once'
import { type MenuUserProps, type UseMenuReturn, useMenu } from './use-menu'
import { MenuProvider, useMenuContext } from './use-menu-context'
import {
	ItemGroupContext,
	useItemGroupContext
} from './use-menu-item-group-context'
import {
	MenuOptionItemProvider,
	useMenuOptionItemContext
} from './use-menu-option-item-context'
import {
	MenuParentProvider,
	useMenuParentContext
} from './use-menu-parent-context'
import {
	MenuTriggerItemProvider,
	useMenuTriggerItemContext
} from './use-menu-trigger-item-context'

type RootProviderProps = UseMenuReturn &
	MenuVariantProps & {
		children?: ReactNode | (({ open }: { open: boolean }) => ReactNode)
	}
export function RootProvider({ gap, children, ...props }: RootProviderProps) {
	const { api: parentApi, service: parentService } = useMenuParentContext()
	const { api, service } = props

	useEffectOnce(() => {
		if (!parentService) return
		if (!parentApi) return

		parentApi.setChild(service)
		api.setParent(parentService)
	})

	const getTriggerItemProps = useCallback(
		() => parentApi?.getTriggerItemProps(api),
		[api, parentApi]
	)

	return (
		<MenuTriggerItemProvider getTriggerItemProps={getTriggerItemProps}>
			<MenuParentProvider api={api} service={service}>
				<MenuProvider gap={gap} api={api}>
					{typeof children === 'function'
						? children({ open: api.open })
						: children}
				</MenuProvider>
			</MenuParentProvider>
		</MenuTriggerItemProvider>
	)
}
RootProvider.displayName = 'Menu.RootProvider'

type RootProps = MenuUserProps &
	MenuVariantProps & {
		children?: ReactNode | (({ open }: { open: boolean }) => ReactNode)
	}
export const Root = ({ gap, children, ...props }: RootProps) => {
	const { api: parentApi, service: parentService } = useMenuParentContext()
	const { api, service } = useMenu(props)

	useEffectOnce(() => {
		if (!parentService) return
		if (!parentApi) return

		parentApi.setChild(service)
		api.setParent(parentService)
	})

	const getTriggerItemProps = useCallback(
		() => parentApi?.getTriggerItemProps(api),
		[api, parentApi]
	)

	return (
		<MenuTriggerItemProvider getTriggerItemProps={getTriggerItemProps}>
			<MenuParentProvider api={api} service={service}>
				<MenuProvider gap={gap} api={api}>
					{typeof children === 'function'
						? children({ open: api.open })
						: children}
				</MenuProvider>
			</MenuParentProvider>
		</MenuTriggerItemProvider>
	)
}
Root.displayName = 'Menu.Root'

type TriggerProps = Omit<ComponentPropsWithoutRef<'button'>, 'value'> &
	zMenu.TriggerProps & { asChild?: boolean }
export const Trigger = forwardRef<HTMLButtonElement, TriggerProps>(
	({ asChild, value, ...props }, forwardedRef) => {
		const { api, styles } = useMenuContext()
		const { className, ...mergedProps } = mergeProps(
			api.getTriggerProps({
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
Trigger.displayName = 'Menu.Trigger'

type PositionerProps = ComponentPropsWithoutRef<'div'>
export const Positioner = forwardRef<HTMLDivElement, PositionerProps>(
	(props, forwardedRef) => {
		const { api, styles } = useMenuContext()
		const { className, ...mergedProps } = mergeProps(
			api.getPositionerProps(),
			props
		)
		const mergedClassName = cx(styles.positioner, className)

		return (
			<div {...mergedProps} className={mergedClassName} ref={forwardedRef} />
		)
	}
)
Positioner.displayName = 'Menu.Positioner'

type ContentProps = ComponentPropsWithoutRef<'div'>
export const Content = forwardRef<HTMLDivElement, ContentProps>(
	(props, forwardedRef) => {
		const { api, styles } = useMenuContext()
		const { className, ...mergedProps } = mergeProps(
			api.getContentProps(),
			props
		)
		const mergedClassName = cx(styles.content, className)

		return (
			<div {...mergedProps} className={mergedClassName} ref={forwardedRef} />
		)
	}
)
Content.displayName = 'Menu.Content'

type ArrowProps = ComponentPropsWithoutRef<'div'>
export const Arrow = forwardRef<HTMLDivElement, ArrowProps>(
	(props, forwardedRef) => {
		const { api, styles } = useMenuContext()
		const { className, ...mergedProps } = mergeProps(api.getArrowProps(), props)
		const mergedClassName = cx(styles.arrow, className)

		return (
			<div {...mergedProps} className={mergedClassName} ref={forwardedRef} />
		)
	}
)
Arrow.displayName = 'Menu.Arrow'

type ArrowTipProps = ComponentPropsWithoutRef<'div'>
export const ArrowTip = forwardRef<HTMLDivElement, ArrowTipProps>(
	(props, forwardedRef) => {
		const { api, styles } = useMenuContext()
		const { className, ...mergedProps } = mergeProps(
			api.getArrowTipProps(),
			props
		)
		const mergedClassName = cx(styles.arrowTip, className)

		return (
			<div {...mergedProps} className={mergedClassName} ref={forwardedRef} />
		)
	}
)
ArrowTip.displayName = 'Menu.ArrowTip'

type ItemProps = Omit<ComponentPropsWithoutRef<'div'>, 'value'> &
	zMenu.ItemProps & {
		leadingIcon?: ReactNode
		trailingIcon?: ReactNode
		trailingText?: string
	}
export const Item = forwardRef<HTMLDivElement, ItemProps>(
	(
		{
			children,
			value,
			closeOnSelect,
			valueText,
			disabled,
			leadingIcon,
			trailingIcon,
			trailingText,
			...props
		},
		forwardedRef
	) => {
		const { api, styles } = useMenuContext()
		const { className, ...mergedProps } = mergeProps(
			api.getItemProps({ value, closeOnSelect, disabled, valueText }),
			props
		)
		const mergedClassName = cx(styles.item, className)

		return (
			<div
				{...mergedProps}
				className={mergedClassName}
				ref={forwardedRef}
				key={value}
			>
				{leadingIcon && <div>{leadingIcon}</div>}
				<span>{children}</span>
				{trailingIcon && <div>{trailingIcon}</div>}
				{trailingText && <kbd>{trailingText}</kbd>}
			</div>
		)
	}
)
Item.displayName = 'Menu.Item'

type TriggerItemProps = ComponentPropsWithoutRef<'div'> & {
	leadingIcon?: ReactNode
	trailingIcon?: ReactNode
	trailingText?: string
}
export const TriggerItem = forwardRef<HTMLDivElement, TriggerItemProps>(
	(
		{ children, leadingIcon, trailingIcon, trailingText, ...props },
		forwardedRef
	) => {
		const { styles } = useMenuContext()
		const { getTriggerItemProps } = useMenuTriggerItemContext()
		const { className, ...mergedProps } = mergeProps(
			getTriggerItemProps(),
			props
		)
		const mergedClassName = cx(styles.triggerItem, className)

		return (
			<div {...mergedProps} className={mergedClassName} ref={forwardedRef}>
				{leadingIcon && <div>{leadingIcon}</div>}
				<span>{children}</span>
				{trailingIcon && <div>{trailingIcon}</div>}
				{trailingText && <kbd>{trailingText}</kbd>}
			</div>
		)
	}
)
TriggerItem.displayName = 'Menu.TriggerItem'

type SurfaceProps = ComponentPropsWithoutRef<'div'>
export const Surface = forwardRef<HTMLDivElement, SurfaceProps>(
	(props, forwardedRef) => {
		const { api, styles } = useMenuContext()
		const { className, ...mergedProps } = mergeProps(
			api.getSurfaceProps(),
			props
		)
		const mergedClassName = cx(styles.surface, className)

		return (
			<div {...mergedProps} className={mergedClassName} ref={forwardedRef} />
		)
	}
)
Surface.displayName = 'Menu.Surface'

type ItemGroupProps = ComponentPropsWithoutRef<'div'>
export const ItemGroup = forwardRef<HTMLDivElement, ItemGroupProps>(
	(props, forwardedRef) => {
		const { api, styles } = useMenuContext()
		const defaultId = useId()
		const { id = defaultId, ...rest } = props
		const [itemGroupProps, localProps] = zMenu.splitItemGroupProps({
			id,
			...rest
		})
		const { className, ...mergedProps } = mergeProps(
			api.getItemGroupProps(itemGroupProps),
			localProps
		)
		const mergedClassName = cx(styles.itemGroup, className)

		return (
			<ItemGroupContext.Provider value={{ id }}>
				<div {...mergedProps} className={mergedClassName} ref={forwardedRef} />
			</ItemGroupContext.Provider>
		)
	}
)
ItemGroup.displayName = 'Menu.ItemGroup'

type ItemGroupLabelProps = ComponentPropsWithoutRef<'div'> &
	Partial<zMenu.ItemGroupLabelProps>
export const ItemGroupLabel = forwardRef<HTMLDivElement, ItemGroupLabelProps>(
	(props, forwardedRef) => {
		const { api, styles } = useMenuContext()
		const { id: groupId } = useItemGroupContext()
		const { htmlFor = groupId, ...rest } = props
		const [ItemGroupLabel, localProps] = zMenu.splitItemGroupLabelProps({
			htmlFor,
			...rest
		})
		const { className, ...mergedProps } = mergeProps(
			api.getItemGroupLabelProps(ItemGroupLabel),
			localProps
		)
		const mergedClassName = cx(styles.itemGroupLabel, className)

		return (
			<div {...mergedProps} className={mergedClassName} ref={forwardedRef} />
		)
	}
)
ItemGroupLabel.displayName = 'Menu.ItemGroupLabel'

type SeparatorProps = ComponentPropsWithoutRef<'div'>
export const Separator = forwardRef<HTMLDivElement, SeparatorProps>(
	(props, forwardedRef) => {
		const { api, styles } = useMenuContext()
		const { className, ...mergedProps } = mergeProps(
			api.getSeparatorProps(),
			props
		)
		const mergedClassName = cx(styles.separator, className)

		return (
			<div {...mergedProps} className={mergedClassName} ref={forwardedRef} />
		)
	}
)
Separator.displayName = 'Menu.Separator'

type OptionItemProps = ComponentPropsWithoutRef<'div'> & zMenu.OptionItemProps
export const OptionItem = forwardRef<HTMLDivElement, OptionItemProps>(
	(props, forwardedRef) => {
		const { api, styles } = useMenuContext()
		const [optionItemProps, localProps] = zMenu.splitOptionItemProps(props)
		const { className, ...mergedProps } = mergeProps(
			api.getOptionItemProps(optionItemProps),
			localProps
		)
		const mergedClassName = cx(styles.item, className)

		return (
			<MenuOptionItemProvider {...optionItemProps}>
				<div {...mergedProps} className={mergedClassName} ref={forwardedRef} />
			</MenuOptionItemProvider>
		)
	}
)
OptionItem.displayName = 'Menu.OptionItem'

type ItemTextProps = ComponentPropsWithoutRef<'div'>
export const ItemText = forwardRef<HTMLDivElement, ItemTextProps>(
	(props, forwardedRef) => {
		const { api, styles } = useMenuContext()
		const { checked, value, disabled, valueText } = useMenuOptionItemContext()
		const { className, ...mergedProps } = mergeProps(
			api.getItemTextProps({ value, checked, disabled, valueText }),
			props
		)
		const mergedClassName = cx(styles.itemText, className)

		return (
			<div {...mergedProps} className={mergedClassName} ref={forwardedRef} />
		)
	}
)
ItemText.displayName = 'Menu.ItemText'

type ItemIndicatorProps = ComponentPropsWithoutRef<'div'>
export const ItemIndicator = forwardRef<HTMLDivElement, ItemIndicatorProps>(
	(props, forwardedRef) => {
		const { api, styles } = useMenuContext()
		const { checked, value, disabled, valueText } = useMenuOptionItemContext()
		const { className, ...mergedProps } = mergeProps(
			api.getItemIndicatorProps({ value, checked, disabled, valueText }),
			props
		)
		const mergedClassName = cx(styles.itemIndicator, className)

		return (
			<div {...mergedProps} className={mergedClassName} ref={forwardedRef} />
		)
	}
)
ItemIndicator.displayName = 'Menu.ItemIndicator'
