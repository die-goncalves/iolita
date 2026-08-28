import { createRef, forwardRef, useRef, useState } from 'react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { cleanup, render } from 'vitest-browser-react'
import { composeRefs, useComposedRefs } from '.'

describe('composeRefs', () => {
	afterEach(async () => {
		await cleanup()
		vi.restoreAllMocks()
	})

	it('updates RefObjects and invokes callback refs with the DOM element', () => {
		const refObject = createRef<HTMLDivElement>()
		const refCallback = vi.fn()
		const element = document.createElement('div')

		const composed = composeRefs(refObject, refCallback)
		composed(element)

		expect(refObject.current).toBe(element)
		expect(refCallback).toHaveBeenCalledWith(element)
	})

	it('ignores undefined and null refs safely without throwing', () => {
		const refObject = createRef<HTMLDivElement>()
		const element = document.createElement('div')

		const composed = composeRefs(undefined, null, refObject, undefined)

		expect(() => composed(element)).not.toThrow()
		expect(refObject.current).toBe(element)
	})

	it('propagates null to all refs during element unmount', () => {
		const refObject = createRef<HTMLDivElement>()
		const refCallback = vi.fn()
		const element = document.createElement('div')

		const composed = composeRefs(refObject, refCallback)
		composed(element)
		composed(null)

		expect(refObject.current).toBeNull()
		expect(refCallback).toHaveBeenNthCalledWith(2, null)
	})

	it('assigns DOM element to both inner and outer refs in a React component', async () => {
		const outerRef = createRef<HTMLButtonElement>()
		const innerRef = createRef<HTMLButtonElement>()

		const Button = forwardRef<HTMLButtonElement>((props, ref) => (
			<button ref={composeRefs(ref, innerRef)} {...props}>
				Click
			</button>
		))
		Button.displayName = 'Button'

		const screen = await render(<Button ref={outerRef} />)
		const button = screen.getByRole('button')
		await expect.element(button).toBeInTheDocument()

		expect(outerRef.current).toBe(button.element())
		expect(innerRef.current).toBe(button.element())
	})

	it('cleans up composed refs when the component unmounts', async () => {
		const outerRef = createRef<HTMLButtonElement>()

		const Button = forwardRef<HTMLButtonElement>((props, ref) => (
			<button ref={composeRefs(ref)} {...props}>
				Click
			</button>
		))
		Button.displayName = 'Button'

		const screen = await render(<Button ref={outerRef} />)
		await expect.element(screen.getByRole('button')).toBeInTheDocument()
		expect(outerRef.current).not.toBeNull()

		await screen.unmount()

		expect(outerRef.current).toBeNull()
	})

	it('handles execution without throwing when called without refs', () => {
		const composed = composeRefs()
		expect(() => composed(document.createElement('div'))).not.toThrow()
	})

	it('invokes legacy callback ref with null on aggregated cleanup execution', () => {
		const legacyRef = vi.fn(() => undefined)
		const element = document.createElement('div')

		const composed = composeRefs(legacyRef)
		const teardown = composed(element)

		expect(legacyRef).toHaveBeenNthCalledWith(1, element)
		expect(typeof teardown).toBe('function')

		teardown?.()

		expect(legacyRef).toHaveBeenNthCalledWith(2, null)
		expect(legacyRef).toHaveBeenCalledTimes(2)
	})

	it('avoids calling the ref callback twice when it returns a cleanup function', () => {
		const cleanupFn = vi.fn()
		const newStyleRef = vi.fn(() => cleanupFn)
		const element = document.createElement('div')

		const composed = composeRefs(newStyleRef)
		const teardown = composed(element)

		teardown?.()

		expect(newStyleRef).toHaveBeenCalledTimes(1)
		expect(newStyleRef).toHaveBeenCalledWith(element)
		expect(cleanupFn).toHaveBeenCalledTimes(1)
	})

	it('handles mixed legacy refs and new-style cleanup refs within the same composed ref', () => {
		const cleanupFn = vi.fn()
		const newStyleRef = vi.fn(() => cleanupFn)
		const legacyRef = vi.fn(() => undefined)
		const refObject = createRef<HTMLDivElement>()
		const element = document.createElement('div')

		const composed = composeRefs(newStyleRef, legacyRef, refObject)
		const teardown = composed(element)

		expect(refObject.current).toBe(element)

		teardown?.()

		expect(newStyleRef).toHaveBeenCalledTimes(1)
		expect(cleanupFn).toHaveBeenCalledTimes(1)

		expect(legacyRef).toHaveBeenNthCalledWith(2, null)

		expect(refObject.current).toBeNull()
	})

	it('returns undefined instead of a cleanup function when all refs are nullish', () => {
		const composed = composeRefs(undefined, null, undefined)
		const result = composed(document.createElement('div'))
		expect(result).toBeUndefined()
	})
})

describe('useComposedRefs', () => {
	afterEach(async () => {
		await cleanup()
		vi.restoreAllMocks()
	})

	it('memoizes the composed ref function across re-renders when refs remain identical', async () => {
		const refCallback = vi.fn()
		const capturedFns: Array<unknown> = []

		function Example() {
			const [, setCount] = useState(0)
			const objectRef = useRef<HTMLDivElement | null>(null)
			const composed = useComposedRefs(refCallback, objectRef)
			capturedFns.push(composed)

			return (
				<>
					<div data-testid="node" ref={composed} />
					<button type="button" onClick={() => setCount(c => c + 1)}>
						rerender
					</button>
				</>
			)
		}

		const screen = await render(<Example />)
		const button = screen.getByRole('button')

		await button.click()
		await button.click()

		expect(capturedFns.every(fn => fn === capturedFns[0])).toBe(true)

		expect(refCallback).toHaveBeenCalledTimes(1)
	})

	it('re-creates composed ref function and updates references when individual ref identity changes', async () => {
		const firstRef = vi.fn()
		const secondRef = vi.fn()

		function Example({ cb }: { cb: (el: HTMLDivElement | null) => void }) {
			const composed = useComposedRefs(cb)
			return <div data-testid="node" ref={composed} />
		}

		const screen = await render(<Example cb={firstRef} />)
		const node = screen.getByTestId('node').element()

		expect(firstRef).toHaveBeenCalledWith(node)

		await screen.rerender(<Example cb={secondRef} />)

		expect(firstRef).toHaveBeenCalledWith(null)
		expect(secondRef).toHaveBeenCalledWith(node)
	})

	it('runs previous cleanup and sets up new ref when ref set composition changes', async () => {
		const cleanupFn = vi.fn()
		const refWithCleanup = vi.fn(() => cleanupFn)
		const plainCallbackRef = vi.fn()

		function Example({ includeCleanupRef }: { includeCleanupRef: boolean }) {
			const composed = useComposedRefs(
				includeCleanupRef ? refWithCleanup : undefined,
				plainCallbackRef
			)
			return <div data-testid="node" ref={composed} />
		}

		const screen = await render(<Example includeCleanupRef />)
		const node = screen.getByTestId('node').element()

		expect(refWithCleanup).toHaveBeenCalledWith(node)
		expect(plainCallbackRef).toHaveBeenCalledWith(node)
		expect(plainCallbackRef).not.toHaveBeenCalledWith(null)

		await screen.rerender(<Example includeCleanupRef={false} />)

		expect(cleanupFn).toHaveBeenCalledTimes(1)
		expect(plainCallbackRef).toHaveBeenCalledWith(null)
	})

	it('detaches all composed refs and triggers cleanups on component unmount', async () => {
		const cleanupFn = vi.fn()
		const refWithCleanup = vi.fn(() => cleanupFn)
		const plainCallbackRef = vi.fn()
		const objectRef = createRef<HTMLDivElement>()

		function Example() {
			const composed = useComposedRefs(
				refWithCleanup,
				plainCallbackRef,
				objectRef
			)
			return <div data-testid="node" ref={composed} />
		}

		const screen = await render(<Example />)
		const node = screen.getByTestId('node').element()

		expect(objectRef.current).toBe(node)
		expect(plainCallbackRef).toHaveBeenCalledWith(node)

		await screen.unmount()

		expect(cleanupFn).toHaveBeenCalledTimes(1)
		expect(plainCallbackRef).toHaveBeenCalledWith(null)
		expect(objectRef.current).toBeNull()
	})
})
