import { composeStories } from '@storybook/react-vite'
import { createRef } from 'react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { userEvent } from 'vitest/browser'
import { cleanup, render, renderHook } from 'vitest-browser-react'
import { Tooltip } from '.'
import * as stories from './tooltip.stories'
import { useTooltip } from './use-tooltip'

const { Overview, SharedContent, RootProvider } = composeStories(stories)

describe('tooltip', () => {
	afterEach(() => {
		cleanup()
		vi.useRealTimers()
		vi.restoreAllMocks()
	})

	describe('rendering', () => {
		it('renders the trigger element in the DOM', async () => {
			const screen = await render(<Overview />)
			const trigger = screen.getByScopeAndPart('tooltip', 'trigger')

			expect(trigger).toBeVisible()
		})

		it('merges custom classNames with styled-system recipe classes across all subcomponents', async () => {
			const screen = await render(
				<Tooltip.Root open={true}>
					<Tooltip.Trigger data-testid="trigger" className="custom-trigger">
						Trigger
					</Tooltip.Trigger>
					<Tooltip.Positioner
						data-testid="positioner"
						className="custom-positioner"
					>
						<Tooltip.Content data-testid="content" className="custom-content">
							Content
							<Tooltip.Arrow data-testid="arrow" className="custom-arrow">
								<Tooltip.ArrowTip
									data-testid="arrow-tip"
									className="custom-arrow-tip"
								/>
							</Tooltip.Arrow>
						</Tooltip.Content>
					</Tooltip.Positioner>
				</Tooltip.Root>
			)

			expect(screen.getByTestId('trigger')).toHaveClass('custom-trigger')
			expect(screen.getByTestId('positioner')).toHaveClass('custom-positioner')
			expect(screen.getByTestId('content')).toHaveClass('custom-content')
			expect(screen.getByTestId('arrow')).toHaveClass('custom-arrow')
			expect(screen.getByTestId('arrow-tip')).toHaveClass('custom-arrow-tip')
		})

		it('forwards refs to underlying DOM nodes across all subcomponents', async () => {
			const triggerRef = createRef<HTMLButtonElement>()
			const positionerRef = createRef<HTMLDivElement>()
			const contentRef = createRef<HTMLDivElement>()
			const arrowRef = createRef<HTMLDivElement>()
			const arrowTipRef = createRef<HTMLDivElement>()

			await render(
				<Tooltip.Root open={true}>
					<Tooltip.Trigger ref={triggerRef}>Trigger</Tooltip.Trigger>
					<Tooltip.Positioner ref={positionerRef}>
						<Tooltip.Content ref={contentRef}>
							Content
							<Tooltip.Arrow ref={arrowRef}>
								<Tooltip.ArrowTip ref={arrowTipRef} />
							</Tooltip.Arrow>
						</Tooltip.Content>
					</Tooltip.Positioner>
				</Tooltip.Root>
			)

			expect(triggerRef.current).toBeInstanceOf(HTMLButtonElement)
			expect(positionerRef.current).toBeInstanceOf(HTMLDivElement)
			expect(contentRef.current).toBeInstanceOf(HTMLDivElement)
			expect(arrowRef.current).toBeInstanceOf(HTMLDivElement)
			expect(arrowTipRef.current).toBeInstanceOf(HTMLDivElement)
		})
	})

	describe('hover interaction', () => {
		it('shows content on trigger hover and hides it on unhover', async () => {
			const spy = vi.spyOn(Overview.args, 'onOpenChange')
			const user = userEvent.setup()
			const screen = await render(<Overview openDelay={0} closeDelay={0} />)

			const trigger = screen.getByScopeAndPart('tooltip', 'trigger')

			await user.unhover(trigger)
			await vi.waitFor(() => {
				expect(screen.getByScopeAndPart('tooltip', 'content')).not.toBeVisible()
			})

			await user.hover(trigger)
			await vi.waitFor(() => {
				expect(spy).toHaveBeenCalledWith(
					expect.objectContaining({ open: true })
				)
			})
			await vi.waitFor(() => {
				expect(screen.getByScopeAndPart('tooltip', 'content')).toBeVisible()
			})

			await user.unhover(trigger)
			await vi.waitFor(() => {
				expect(spy).toHaveBeenCalledWith(
					expect.objectContaining({ open: false })
				)
			})
			await vi.waitFor(() => {
				expect(screen.getByScopeAndPart('tooltip', 'content')).not.toBeVisible()
			})
		})
	})

	describe('focus interaction', () => {
		it('shows content on trigger focus and hides it on blur', async () => {
			const user = userEvent.setup()
			const screen = await render(<Overview openDelay={0} closeDelay={0} />)

			const trigger = screen.getByScopeAndPart('tooltip', 'trigger')

			await user.unhover(trigger)
			trigger.element().blur()
			await vi.waitFor(() => {
				expect(screen.getByScopeAndPart('tooltip', 'content')).not.toBeVisible()
			})

			await user.tab()
			await expect.element(trigger).toHaveFocus()

			await vi.waitFor(() => {
				expect(screen.getByScopeAndPart('tooltip', 'content')).toBeVisible()
			})

			await user.tab()

			await vi.waitFor(() => {
				expect(screen.getByScopeAndPart('tooltip', 'content')).not.toBeVisible()
			})
		})
	})

	describe('keyboard interaction', () => {
		it('closes content on Escape keydown by default', async () => {
			const user = userEvent.setup()
			const screen = await render(<Overview openDelay={0} />)

			const trigger = screen.getByScopeAndPart('tooltip', 'trigger')

			await user.unhover(trigger)
			await vi.waitFor(() => {
				expect(screen.getByScopeAndPart('tooltip', 'content')).not.toBeVisible()
			})

			await user.hover(trigger)
			await vi.waitFor(() => {
				expect(screen.getByScopeAndPart('tooltip', 'content')).toBeVisible()
			})

			await user.keyboard('{Escape}')

			await vi.waitFor(() => {
				expect(screen.getByScopeAndPart('tooltip', 'content')).not.toBeVisible()
			})
		})

		it('keeps content visible on Escape keydown when closeOnEscape is false', async () => {
			const user = userEvent.setup()
			const screen = await render(
				<Overview openDelay={0} closeOnEscape={false} />
			)
			const trigger = screen.getByScopeAndPart('tooltip', 'trigger')

			await user.unhover(trigger)
			await vi.waitFor(() => {
				expect(screen.getByScopeAndPart('tooltip', 'content')).not.toBeVisible()
			})

			await user.hover(trigger)
			await vi.waitFor(() => {
				expect(screen.getByScopeAndPart('tooltip', 'content')).toBeVisible()
			})

			await user.keyboard('{Escape}')

			await vi.waitFor(() => {
				expect(screen.getByScopeAndPart('tooltip', 'content')).toBeVisible()
			})
		})
	})

	describe('trigger asChild', () => {
		it('delegates rendering and tooltip attributes directly to the child element', async () => {
			const screen = await render(
				<Tooltip.Root open={true}>
					<Tooltip.Trigger asChild>
						<button type="button" data-testid="trigger">
							trigger
						</button>
					</Tooltip.Trigger>
					<Tooltip.Positioner>
						<Tooltip.Content data-testid="content">content</Tooltip.Content>
					</Tooltip.Positioner>
				</Tooltip.Root>
			)

			const trigger = screen.getByTestId('trigger')

			expect(trigger.element().tagName).toBe('BUTTON')
			expect(trigger).toHaveAttribute('data-scope', 'tooltip')
			expect(trigger).toHaveAttribute('data-part', 'trigger')
		})
	})

	describe('shared trigger value', () => {
		it('switches the active tooltip and emits its new value on hover', async () => {
			const spy = vi.spyOn(SharedContent.args, 'onTriggerValueChange')
			const user = userEvent.setup()

			const screen = await render(
				<SharedContent openDelay={0} closeDelay={0} />
			)

			await vi.waitFor(() => {
				expect(screen.getByScopeAndPart('tooltip', 'content')).not.toBeVisible()
			})

			await user.hover(screen.getByText('Tooltip A'))
			await vi.waitFor(() => {
				expect(spy).toHaveBeenCalledTimes(1)
				expect(spy).toHaveBeenCalledWith(
					expect.objectContaining({ value: 'tooltip-a' })
				)
			})

			await user.unhover(screen.getByText('Tooltip A'))
			await user.hover(screen.getByText('Tooltip B'))
			await vi.waitFor(() => {
				expect(spy).toHaveBeenCalledTimes(2)
				expect(spy).toHaveBeenCalledWith(
					expect.objectContaining({ value: 'tooltip-b' })
				)
			})
		})
	})

	describe('root provider', () => {
		it('provides tooltip context using an externally managed machine state', async () => {
			const { result } = await renderHook(() => useTooltip({ open: true }))
			const screen = await render(<RootProvider {...result.current} />)

			expect(screen.getByScopeAndPart('tooltip', 'trigger')).toBeInTheDocument()
			expect(screen.getByScopeAndPart('tooltip', 'content')).toBeVisible()
		})

		it('updates content visibility when setOpen is called imperatively outside the tree', async () => {
			const user = userEvent.setup()
			const onOpenChange = vi.fn()

			const { result } = await renderHook(() =>
				useTooltip({
					openDelay: 0,
					closeDelay: 0,
					onOpenChange
				})
			)

			const screen = await render(<RootProvider {...result.current} />)

			const trigger = screen.getByScopeAndPart('tooltip', 'trigger')

			await user.unhover(trigger)
			await vi.waitFor(() => {
				expect(screen.getByScopeAndPart('tooltip', 'content')).not.toBeVisible()
			})

			result.current.setOpen(true)
			await vi.waitFor(() => {
				expect(result.current.open).toBe(true)
			})

			await screen.rerender(<RootProvider {...result.current} />)

			await vi.waitFor(() => {
				expect(screen.getByScopeAndPart('tooltip', 'content')).toBeVisible()
			})

			expect(onOpenChange).toHaveBeenCalledWith(
				expect.objectContaining({ open: true })
			)
		})
	})
})
