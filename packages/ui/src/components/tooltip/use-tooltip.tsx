import type { Scope } from '@zag-js/core'
import { normalizeProps, type PropTypes, useMachine } from '@zag-js/react'
import {
	type Api,
	anatomy,
	connect,
	type Machine,
	machine
} from '@zag-js/tooltip'
import { useId } from 'react'
import type { InferUserProps } from '../../infer-types'

declare module '@zag-js/tooltip' {
	export interface ElementIds {
		body?: string | undefined
		scrollArea?: string | undefined
		scrollAreaViewport?: string | undefined
	}
}

const parts = anatomy
	.extendWith('body', 'scrollArea', 'scrollAreaViewport')
	.build()

export const getBodyId = (ctx: Scope) =>
	ctx.ids?.body ?? `tooltip:${ctx.id}:body`

export const getScrollAreaId = (ctx: Scope) =>
	ctx.ids?.scrollArea ?? `tooltip:${ctx.id}:scroll-area`

export const getScrollAreaViewportId = (ctx: Scope) =>
	ctx.ids?.scrollAreaViewport ?? `tooltip:${ctx.id}:scroll-area-viewport`

type TooltipApi<T extends PropTypes = PropTypes> = Api<T> & {
	getBodyProps: () => T['element']
	getScrollAreaProps: () => T['element']
	getScrollAreaViewportProps: () => T['element']
}
export type UseTooltipReturn<T extends PropTypes = PropTypes> = TooltipApi<T>

export type TooltipUserProps = InferUserProps<Machine>

export type UseTooltipProps = TooltipUserProps & {}
export const useTooltip = (props: UseTooltipProps): UseTooltipReturn => {
	const userProps: UseTooltipProps = {
		id: useId(),
		interactive: true,
		positioning: {
			placement: 'top',
			gutter: 8,
			overflowPadding: 8,
			arrowPadding: 0
		},
		...props
	}

	const service = useMachine(machine, userProps)

	const getBodyProps = () =>
		normalizeProps.element({
			...parts.body.attrs,
			id: getBodyId(service.scope)
		})

	const getScrollAreaProps = () =>
		normalizeProps.element({
			...parts.scrollArea.attrs,
			id: getScrollAreaId(service.scope)
		})

	const getScrollAreaViewportProps = () =>
		normalizeProps.element({
			...parts.scrollAreaViewport.attrs,
			id: getScrollAreaViewportId(service.scope)
		})

	const api = connect(service, normalizeProps)

	return {
		...api,
		getBodyProps,
		getScrollAreaProps,
		getScrollAreaViewportProps
	}
}
