import { createMachine, type Scope } from '@zag-js/core'
import { trackDismissableElement } from '@zag-js/dismissable'
import {
	contains,
	getByOwnerId,
	getEventTarget,
	isHTMLElement,
	queryAll
} from '@zag-js/dom-query'
import {
	type Api,
	anatomy,
	machine as baseMachine,
	connect,
	type Machine,
	type Service
} from '@zag-js/menu'
import {
	mergeProps,
	normalizeProps,
	type PropTypes,
	useMachine
} from '@zag-js/react'
import { isFunction } from '@zag-js/utils'
import { useId } from 'react'
import type { InferUserProps } from '../../infer-types'

function getContentId(ctx: Scope): string {
	return ctx.ids?.content ?? `menu:${ctx.id}:content`
}
function getContentEl(ctx: Scope): HTMLElement | null {
	return ctx.getById(getContentId(ctx))
}
function getContextTriggerEls(ctx: Scope) {
	return queryAll(
		ctx.getRootNode(),
		`[data-scope="menu"][data-part="context-trigger"]${getByOwnerId(ctx.id)}`
	)
}
function getTriggerId(ctx: Scope, value?: string) {
	const customId = ctx.ids?.trigger
	if (customId != null) return isFunction(customId) ? customId(value) : customId
	return value ? `menu:${ctx.id}:trigger:${value}` : `menu:${ctx.id}:trigger`
}
function getTriggerEl(ctx: Scope) {
	return ctx.getById(getTriggerId(ctx))
}
function getTriggerEls(ctx: Scope) {
	return queryAll(
		ctx.getRootNode(),
		`[data-scope="menu"][data-part="trigger"]${getByOwnerId(ctx.id)}`
	)
}
function getPortaledContentEl(scope: Scope) {
	return (
		getContentEl(scope) ?? scope.getDoc().getElementById(getContentId(scope))
	)
}
function isTargetWithinMenuTree(
	target: EventTarget | null,
	children: Record<string, Service>
) {
	if (!isHTMLElement(target)) return false
	for (const child of Object.values(children)) {
		const childContent = getPortaledContentEl(child.scope)
		if (childContent && contains(childContent, target)) return true

		const nested = child.refs.get('children')
		if (nested && isTargetWithinMenuTree(target, nested)) return true
	}

	return false
}
function closeRootMenu(ctx: { parent: Service | null | undefined }) {
	let parent = ctx.parent
	while (parent?.context.get('isSubmenu')) {
		parent = parent.refs.get('parent')
	}
	parent?.send({ type: 'CLOSE' })
}

const machine = createMachine({
	...baseMachine,
	implementations: {
		...baseMachine.implementations,
		effects: {
			...baseMachine.implementations?.effects,
			trackInteractOutside({ refs, scope, prop, context, send }) {
				const getContentEl2 = () => getContentEl(scope)
				let restoreFocus = true
				const isWithinAnyContextTrigger = (target: EventTarget | null) => {
					return getContextTriggerEls(scope).some(el => contains(el, target))
				}
				return trackDismissableElement(getContentEl2, {
					type: 'menu',
					defer: true,
					exclude: [getTriggerEl(scope), ...getTriggerEls(scope)].filter(
						Boolean
					),
					onInteractOutside: prop('onInteractOutside'),
					onRequestDismiss: prop('onRequestDismiss'),
					onFocusOutside(event) {
						prop('onFocusOutside')?.(event)
						const target = getEventTarget(event.detail.originalEvent)
						if (isWithinAnyContextTrigger(target)) {
							event.preventDefault()
							return
						}
						if (isTargetWithinMenuTree(target, refs.get('children'))) {
							event.preventDefault()
							return
						}
					},
					onEscapeKeyDown(event) {
						prop('onEscapeKeyDown')?.(event)

						if (context.get('isSubmenu')) {
							event.preventDefault()
							refs.get('parent')?.send({ type: 'FOCUS_MENU' })
							send({ type: 'CLOSE' })
							return
						}

						closeRootMenu({ parent: refs.get('parent') })
					},
					onPointerDownOutside(event) {
						prop('onPointerDownOutside')?.(event)
						const target = getEventTarget(event.detail.originalEvent)
						if (isWithinAnyContextTrigger(target) && event.detail.contextmenu) {
							event.preventDefault()
							return
						}
						restoreFocus = !event.detail.focusable
					},
					onDismiss() {
						send({ type: 'CLOSE', src: 'interact-outside', restoreFocus })
					}
				})
			}
		}
	}
})

const parts = anatomy.extendWith('surface').build()

export const getSurfaceId = (ctx: Scope) =>
	ctx.ids?.surface ?? `menu:${ctx.id}:surface`

type MenuApi<T extends PropTypes = PropTypes> = Api<T> & {
	getSurfaceProps: () => T['element']
}
export type UseMenuReturn<T extends PropTypes = PropTypes> = {
	api: MenuApi<T>
	service: Service
}

export type MenuUserProps = InferUserProps<Machine>

export type UseMenuProps = MenuUserProps & {}
export const useMenu = (props: UseMenuProps): UseMenuReturn => {
	const defaultProps: UseMenuProps = {
		id: useId(),
		positioning: {
			placement: 'top',
			gutter: 8,
			overflowPadding: 8,
			arrowPadding: 0
		}
	}

	const userProps = mergeProps(defaultProps, props)

	const service = useMachine(machine, userProps)

	const getSurfaceProps = () =>
		normalizeProps.element({
			...parts.surface.attrs,
			id: getSurfaceId(service.scope)
		})

	const api = connect(service, normalizeProps)

	return { api: { ...api, getSurfaceProps }, service }
}
