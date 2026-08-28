import { mergeProps } from '@zag-js/react'
import {
	cloneElement,
	forwardRef,
	type HTMLAttributes,
	isValidElement,
	type ReactElement,
	type Ref
} from 'react'
import { useComposedRefs } from '../compose-refs'

export type SlotProps = HTMLAttributes<HTMLElement>

type PropsWithRef<T> = HTMLAttributes<T> & { ref?: Ref<T> | null | undefined }

/**
 * Extracts the `ref` from a cloned element in a version-safe way.
 * - React 19+: `ref` is a regular prop, available on `element.props.ref`.
 * - React < 19: `ref` lives on `element.ref`, which the public
 *   `ReactElement` type intentionally doesn't expose.
 */
function getElementRef<T>(
	element: ReactElement<PropsWithRef<T>>
): Ref<T> | undefined {
	if (element.props.ref !== undefined) return element.props.ref ?? undefined

	const legacyRef = (element as { ref?: Ref<T> | null | undefined }).ref
	return legacyRef ?? undefined
}

type SlotCloneProps = {
	child: ReactElement<PropsWithRef<HTMLElement>>
	slotProps: Omit<SlotProps, 'children'>
	forwardedRef: Ref<HTMLElement>
}

function SlotClone({ child, slotProps, forwardedRef }: SlotCloneProps) {
	const mergedProps = mergeProps(child.props, slotProps)
	const composedRefs = useComposedRefs(getElementRef(child), forwardedRef)

	return cloneElement(child, {
		...mergedProps,
		ref: composedRefs
	})
}

/**
 * Drop-in alternative to `@radix-ui/react-slot`'s `Slot`, but with a
 * different merge priority: props passed directly to `Slot` (the "outer"
 * props, e.g. coming from presence, a dialog primitive, etc.) win over
 * conflicting props already defined on the child element — the opposite
 * of Radix's default, where the child's own props always win except for
 * `className`, `style`, and event handlers.
 *
 * Event handlers are chained via `mergeProps`, with the Slot's handler
 * running before the child's handler (outer-first), matching the same
 * "outer wins" merge priority described above.
 *
 * This matters whenever the child already manages presence-like
 * attributes on its own (e.g. a zag-driven `data-state`), and you want
 * the outer component (like `Presence.Gate`) to be the source of truth.
 */
export const Slot = forwardRef<HTMLElement, SlotProps>(
	({ children, ...slotProps }, forwardedRef) => {
		if (!isValidElement<PropsWithRef<HTMLElement>>(children)) {
			if (process.env.NODE_ENV !== 'production') {
				console.error(
					'Slot: expected a single valid React element as `children`, got:',
					children
				)
			}
			return null
		}

		return (
			<SlotClone
				forwardedRef={forwardedRef}
				slotProps={slotProps}
				child={children}
			/>
		)
	}
)
Slot.displayName = 'Slot'
