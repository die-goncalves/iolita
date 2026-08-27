import { composeStories } from '@storybook/react-vite'
import { createRef } from 'react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { userEvent } from 'vitest/browser'
import { cleanup, render, renderHook } from 'vitest-browser-react'
import { Popover } from '.'
import * as stories from './popover.stories'
import { usePopover } from './use-popover'
import { usePopoverContext } from './use-popover-context'

const { Overview, SharedContent } = composeStories(stories)

describe('popover', () => {
	afterEach(async () => {
		await cleanup()
		vi.useRealTimers()
		vi.restoreAllMocks()
	})

	describe('rendering', () => {
		it('renders the trigger element in the DOM', async () => {
			const screen = await render(<Overview />)
			const trigger = screen.getByScopeAndPart('popover', 'trigger')

			expect(trigger).toBeVisible()
		})

		it('merges custom classNames with styled-system recipe classes across all subcomponents', async () => {
			const screen = await render(
				<Popover.Root open={true}>
					<Popover.Trigger data-testid="trigger" className="custom-trigger">
						Trigger
					</Popover.Trigger>
					<Popover.Positioner
						data-testid="positioner"
						className="custom-positioner"
					>
						<Popover.Content data-testid="content" className="custom-content">
							<Popover.Title data-testid="title" className="custom-title">
								Title
							</Popover.Title>
							<Popover.Description
								data-testid="description"
								className="custom-description"
							>
								Description
							</Popover.Description>
							<Popover.Arrow data-testid="arrow" className="custom-arrow">
								<Popover.ArrowTip
									data-testid="arrow-tip"
									className="custom-arrow-tip"
								/>
							</Popover.Arrow>
							<Popover.CloseTrigger
								data-testid="close-trigger"
								className="custom-close-trigger"
							>
								Close
							</Popover.CloseTrigger>
						</Popover.Content>
					</Popover.Positioner>
				</Popover.Root>
			)

			expect(screen.getByTestId('trigger')).toHaveClass('custom-trigger')
			expect(screen.getByTestId('positioner')).toHaveClass('custom-positioner')
			expect(screen.getByTestId('content')).toHaveClass('custom-content')
			expect(screen.getByTestId('title')).toHaveClass('custom-title')
			expect(screen.getByTestId('description')).toHaveClass(
				'custom-description'
			)
			expect(screen.getByTestId('arrow')).toHaveClass('custom-arrow')
			expect(screen.getByTestId('arrow-tip')).toHaveClass('custom-arrow-tip')
			expect(screen.getByTestId('close-trigger')).toHaveClass(
				'custom-close-trigger'
			)
		})

		it('forwards refs to underlying DOM nodes across all subcomponents', async () => {
			const triggerRef = createRef<HTMLButtonElement>()
			const positionerRef = createRef<HTMLDivElement>()
			const contentRef = createRef<HTMLDivElement>()
			const titleRef = createRef<HTMLDivElement>()
			const descriptionRef = createRef<HTMLDivElement>()
			const arrowRef = createRef<HTMLDivElement>()
			const arrowTipRef = createRef<HTMLDivElement>()
			const closeTriggerRef = createRef<HTMLButtonElement>()

			await render(
				<Popover.Root open={true}>
					<Popover.Trigger ref={triggerRef}>Trigger</Popover.Trigger>
					<Popover.Positioner ref={positionerRef}>
						<Popover.Content ref={contentRef}>
							<Popover.Title ref={titleRef}>Title</Popover.Title>
							<Popover.Description ref={descriptionRef}>
								Description
							</Popover.Description>
							<Popover.Arrow ref={arrowRef}>
								<Popover.ArrowTip ref={arrowTipRef} />
							</Popover.Arrow>
							<Popover.CloseTrigger ref={closeTriggerRef}>
								Close
							</Popover.CloseTrigger>
						</Popover.Content>
					</Popover.Positioner>
				</Popover.Root>
			)

			expect(triggerRef.current).toBeInstanceOf(HTMLButtonElement)
			expect(positionerRef.current).toBeInstanceOf(HTMLDivElement)
			expect(contentRef.current).toBeInstanceOf(HTMLDivElement)
			expect(titleRef.current).toBeInstanceOf(HTMLDivElement)
			expect(descriptionRef.current).toBeInstanceOf(HTMLDivElement)
			expect(arrowRef.current).toBeInstanceOf(HTMLDivElement)
			expect(arrowTipRef.current).toBeInstanceOf(HTMLDivElement)
			expect(closeTriggerRef.current).toBeInstanceOf(HTMLButtonElement)
		})
	})

	describe('trigger asChild', () => {
		it('delegates rendering and popover attributes directly to the child element', async () => {
			const screen = await render(
				<Popover.Root open={true}>
					<Popover.Trigger asChild>
						<button type="button" data-testid="trigger">
							Trigger
						</button>
					</Popover.Trigger>
					<Popover.Positioner>
						<Popover.Content>Content</Popover.Content>
					</Popover.Positioner>
				</Popover.Root>
			)

			const trigger = screen.getByTestId('trigger')

			expect(trigger.element().tagName).toBe('BUTTON')
			expect(trigger).toHaveAttribute('data-scope', 'popover')
			expect(trigger).toHaveAttribute('data-part', 'trigger')
		})
	})

	describe('trigger value', () => {
		it('attaches data-value attribute when value prop is provided', async () => {
			const screen = await render(
				<Popover.Root open={true}>
					<Popover.Trigger data-testid="trigger-a" value="popover-a">
						Popover A
					</Popover.Trigger>
					<Popover.Positioner>
						<Popover.Content>Content</Popover.Content>
					</Popover.Positioner>
				</Popover.Root>
			)

			expect(screen.getByTestId('trigger-a')).toHaveAttribute(
				'data-value',
				'popover-a'
			)
		})

		it('omits the value attribute when no value is provided', async () => {
			const screen = await render(
				<Popover.Root open={true}>
					<Popover.Trigger data-testid="trigger">Popover</Popover.Trigger>
					<Popover.Positioner>
						<Popover.Content>Content</Popover.Content>
					</Popover.Positioner>
				</Popover.Root>
			)

			expect(screen.getByTestId('trigger')).not.toHaveAttribute('data-value')
		})

		it('switches the active popover and emits its new value when opened', async () => {
			const spy = vi.spyOn(SharedContent.args, 'onTriggerValueChange')
			const user = userEvent.setup()

			const screen = await render(<SharedContent />)

			await user.click(screen.getByRole('button', { name: 'Popover A' }))

			await vi.waitFor(() => {
				expect(spy).toHaveBeenCalledTimes(1)
				expect(spy).toHaveBeenCalledWith(
					expect.objectContaining({ value: 'popover-a' })
				)
			})

			await user.click(screen.getByRole('button', { name: 'Popover B' }))

			await vi.waitFor(() => {
				expect(spy).toHaveBeenCalledTimes(2)
				expect(spy).toHaveBeenCalledWith(
					expect.objectContaining({ value: 'popover-b' })
				)
			})

			await user.keyboard('{Escape}')

			screen.getByRole('button', { name: 'Popover B' }).element().blur()
		})
	})

	describe('use-popover', () => {
		it('sets placement to top by default when no positioning is configured', async () => {
			const user = userEvent.setup()
			const screen = await render(
				<div
					style={{
						position: 'relative',
						display: 'flex',
						justifyContent: 'center',
						alignItems: 'center',
						width: '496px',
						height: '496px',
						padding: '2'
					}}
				>
					<Overview />
				</div>
			)
			const trigger = screen.getByScopeAndPart('popover', 'trigger')

			await user.click(trigger)

			await vi.waitFor(() => {
				expect(screen.getByScopeAndPart('popover', 'content')).toHaveAttribute(
					'data-placement',
					'top'
				)
			})
		})

		it('generates an id when none is provided', async () => {
			const { result } = await renderHook(() => usePopover({}))

			expect(result.current.getTriggerProps().id).toBeTruthy()
		})

		it('uses the provided id instead of generating one', async () => {
			const { result } = await renderHook(() => usePopover({ id: 'custom-id' }))

			expect(result.current.getTriggerProps().id).toContain('custom-id')
		})
	})

	describe('use-popover-context', () => {
		it('returns an empty object when used outside a Popover.Provider', async () => {
			const { result } = await renderHook(() => usePopoverContext())

			expect(result.current).toEqual({})
		})

		it('returns the popover api when used inside a Popover.Provider', async () => {
			let contextValue: ReturnType<typeof usePopoverContext> | undefined

			const Consumer = () => {
				contextValue = usePopoverContext()
				return null
			}

			await render(
				<Popover.Root open={true}>
					<Consumer />
					<Popover.Trigger>Trigger</Popover.Trigger>
					<Popover.Positioner>
						<Popover.Content>Content</Popover.Content>
					</Popover.Positioner>
				</Popover.Root>
			)

			await vi.waitFor(() => {
				expect(contextValue).toBeDefined()
			})

			expect(contextValue).toMatchObject({
				open: true
			})
			expect(contextValue).toHaveProperty('getTriggerProps')
			expect(contextValue).toHaveProperty('getContentProps')
		})
	})

	describe('root provider', () => {
		it('provides popover context using an externally managed machine state', async () => {
			const { result } = await renderHook(() => usePopover({ open: true }))

			const screen = await render(
				<Popover.RootProvider {...result.current}>
					<Popover.Trigger>Trigger</Popover.Trigger>
					<Popover.Positioner>
						<Popover.Content>Content</Popover.Content>
					</Popover.Positioner>
				</Popover.RootProvider>
			)

			expect(screen.getByScopeAndPart('popover', 'trigger')).toBeInTheDocument()
			expect(screen.getByScopeAndPart('popover', 'content')).toBeVisible()
		})

		it('updates content visibility when setOpen is called imperatively outside the tree', async () => {
			const onOpenChange = vi.fn()
			const { result } = await renderHook(() => usePopover({ onOpenChange }))

			const screen = await render(
				<Popover.RootProvider {...result.current}>
					<Popover.Trigger>Trigger</Popover.Trigger>
					<Popover.Positioner>
						<Popover.Content>Content</Popover.Content>
					</Popover.Positioner>
				</Popover.RootProvider>
			)

			expect(screen.getByScopeAndPart('popover', 'content')).not.toBeVisible()

			result.current.setOpen(true)

			await vi.waitFor(() => {
				expect(result.current.open).toBe(true)
			})

			await screen.rerender(
				<Popover.RootProvider {...result.current}>
					<Popover.Trigger>Trigger</Popover.Trigger>
					<Popover.Positioner>
						<Popover.Content>Content</Popover.Content>
					</Popover.Positioner>
				</Popover.RootProvider>
			)

			await vi.waitFor(() => {
				expect(screen.getByScopeAndPart('popover', 'content')).toBeVisible()
			})

			expect(onOpenChange).toHaveBeenCalledWith(
				expect.objectContaining({ open: true })
			)
		})
	})

	describe('keyboard interaction', () => {
		it('opens content on Enter and closes it while restoring focus on Escape', async () => {
			const user = userEvent.setup()
			const screen = await render(<Overview />)

			const trigger = screen.getByScopeAndPart('popover', 'trigger')

			await user.tab()
			await expect.element(trigger).toHaveFocus()

			await user.keyboard('{Enter}')

			await vi.waitFor(() => {
				expect(screen.getByScopeAndPart('popover', 'content')).toBeVisible()
			})

			await vi.waitFor(() => {
				expect(trigger).not.toHaveFocus()
			})

			const content = screen.getByScopeAndPart('popover', 'content')
			expect(content.element().contains(document.activeElement)).toBe(true)

			await user.keyboard('{Escape}')

			await vi.waitFor(() => {
				expect(screen.getByScopeAndPart('popover', 'content')).not.toBeVisible()
			})

			await vi.waitFor(() => {
				expect(trigger).toHaveFocus()
			})
		})

		it('traps focus inside content and restores pointer events on Escape when modal', async () => {
			const user = userEvent.setup()
			const screen = await render(<Overview modal={true} />)

			const trigger = screen.getByScopeAndPart('popover', 'trigger')

			await user.tab()
			await user.keyboard('{Enter}')

			await vi.waitFor(() => {
				expect(screen.getByScopeAndPart('popover', 'content')).toBeVisible()
			})

			await vi.waitFor(() => {
				expect(trigger).not.toHaveFocus()
			})

			const content = screen.getByScopeAndPart('popover', 'content')

			await vi.waitFor(() => {
				expect(content.element().contains(document.activeElement)).toBe(true)
			})

			for (let i = 0; i < 5; i++) {
				await user.tab()
				expect(content.element().contains(document.activeElement)).toBe(true)
			}

			await user.tab({ shift: true })
			expect(content.element().contains(document.activeElement)).toBe(true)

			expect(getComputedStyle(document.body).pointerEvents).toBe('none')

			await user.keyboard('{Escape}')

			await vi.waitFor(() => {
				expect(screen.getByScopeAndPart('popover', 'content')).not.toBeVisible()
			})

			await vi.waitFor(() => {
				expect(trigger).toHaveFocus()
			})

			expect(getComputedStyle(document.body).pointerEvents).toBe('auto')
		})
	})
})
