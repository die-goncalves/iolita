import { createRef, forwardRef } from 'react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { userEvent } from 'vitest/browser'
import { cleanup, render } from 'vitest-browser-react'
import { Slot } from './slot'

describe('slot', () => {
	afterEach(async () => {
		await cleanup()
		vi.restoreAllMocks()
	})

	it('merges refs from Slot and the child element correctly', async () => {
		const slotRef = createRef<HTMLButtonElement>()
		const childRef = createRef<HTMLButtonElement>()

		const ChildWithRef = forwardRef<HTMLButtonElement>((props, ref) => (
			<button ref={ref} {...props}>
				Clique aqui
			</button>
		))

		const screen = await render(
			<Slot ref={slotRef}>
				<ChildWithRef ref={childRef} />
			</Slot>
		)

		const button = screen.getByRole('button')
		await expect.element(button).toBeInTheDocument()

		expect(slotRef.current).toBe(button.element())
		expect(childRef.current).toBe(button.element())
	})

	it('works correctly when the child has no ref of its own', async () => {
		const slotRef = createRef<HTMLDivElement>()

		const screen = await render(
			<Slot ref={slotRef}>
				<div data-testid="child" />
			</Slot>
		)

		const child = screen.getByTestId('child')
		await expect.element(child).toBeInTheDocument()
		expect(slotRef.current).toBe(child.element())
	})

	it('gives priority to Slot props over child props (outer wins)', async () => {
		const screen = await render(
			<Slot data-state="open" data-testid="slot">
				<div id="child-id" data-state="closed" data-testid="child" />
			</Slot>
		)

		const child = screen.container.querySelector('div')
		expect(child).not.toBeNull()
		expect(child).toHaveAttribute('id', 'child-id')
		expect(child).toHaveAttribute('data-state', 'open')
		expect(child).toHaveAttribute('data-testid', 'slot')
	})

	it('concatenates classNames and chains onClick via mergeProps', async () => {
		const user = userEvent.setup()
		const slotOnClick = vi.fn()
		const childOnClick = vi.fn()

		const screen = await render(
			<Slot className="slot-class" onClick={slotOnClick}>
				<button type="button" className="child-class" onClick={childOnClick}>
					Action
				</button>
			</Slot>
		)

		const button = screen.getByRole('button')

		await expect.element(button).toHaveClass('slot-class')
		await expect.element(button).toHaveClass('child-class')

		await user.click(button)

		expect(slotOnClick).toHaveBeenCalledTimes(1)
		expect(childOnClick).toHaveBeenCalledTimes(1)
	})

	it('calls slot and child onClick handlers in the expected order', async () => {
		const user = userEvent.setup()
		const callOrder: string[] = []

		const screen = await render(
			<Slot onClick={() => callOrder.push('slot')}>
				<button type="button" onClick={() => callOrder.push('child')}>
					Action
				</button>
			</Slot>
		)

		await user.click(screen.getByRole('button'))

		expect(callOrder).toEqual(['slot', 'child'])
	})

	it('combines style objects from Slot and the child element', async () => {
		const screen = await render(
			<Slot style={{ color: 'red' }}>
				<div data-testid="child" style={{ fontWeight: 'bold' }} />
			</Slot>
		)

		const child = screen.getByTestId('child')
		await expect
			.element(child)
			.toHaveStyle({ color: 'red', fontWeight: 'bold' })
	})

	it('returns null and logs console.error when receiving multiple children', async () => {
		const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

		const { container } = await render(
			<Slot>
				<div>First Child</div>
				<div>Second Child</div>
			</Slot>
		)

		expect(container.firstChild).toBeNull()
		expect(errorSpy).toHaveBeenCalledWith(
			'Slot: expected a single valid React element as `children`, got:',
			expect.anything()
		)
	})

	it('returns null and logs console.error when children is undefined', async () => {
		const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

		const { container } = await render(<Slot />)

		expect(container.firstChild).toBeNull()
		expect(errorSpy).toHaveBeenCalled()
	})

	it('does not throw when children toggles between valid and invalid across re-renders', async () => {
		vi.spyOn(console, 'error').mockImplementation(() => {})

		function Example({ showChild }: { showChild: boolean }) {
			return <Slot>{showChild ? <div data-testid="child" /> : null}</Slot>
		}

		const screen = await render(<Example showChild />)
		await expect.element(screen.getByTestId('child')).toBeInTheDocument()

		await expect(
			screen.rerender(<Example showChild={false} />)
		).resolves.not.toThrow()
		await expect(screen.rerender(<Example showChild />)).resolves.not.toThrow()
	})

	it('resets composed refs to null when Slot unmounts', async () => {
		const slotRef = createRef<HTMLDivElement>()

		const screen = await render(
			<Slot ref={slotRef}>
				<div data-testid="child" />
			</Slot>
		)

		const child = screen.getByTestId('child')
		await expect.element(child).toBeInTheDocument()

		expect(slotRef.current).not.toBeNull()
		expect(slotRef.current).toBe(child.element())

		await screen.unmount()

		expect(slotRef.current).toBeNull()
	})

	it('reattaches ref when the child element changes to a different valid element', async () => {
		const slotRef = createRef<HTMLElement>()

		function Example({ useSpan }: { useSpan: boolean }) {
			return (
				<Slot ref={slotRef}>
					{useSpan ? <span data-testid="child" /> : <div data-testid="child" />}
				</Slot>
			)
		}

		const screen = await render(<Example useSpan={false} />)
		const divChild = screen.getByTestId('child')
		await expect.element(divChild).toBeInTheDocument()
		const divEl = divChild.element()
		expect(slotRef.current).toBe(divEl)

		await screen.rerender(<Example useSpan />)
		const spanChild = screen.getByTestId('child')
		await expect.element(spanChild).toBeInTheDocument()
		const spanEl = spanChild.element()

		expect(slotRef.current).toBe(spanEl)
		expect(slotRef.current).not.toBe(divEl)
	})
})
