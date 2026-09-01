import { composeStories } from '@storybook/react-vite'
import { createRef } from 'react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { userEvent } from 'vitest/browser'
import { cleanup, render, renderHook } from 'vitest-browser-react'
import { Dialog, type UseDialogProps, useDialog } from '.'
import * as stories from './dialog.stories'
import type { DialogApi } from './use-dialog'
import { useDialogContext } from './use-dialog-context'

const { Overview, SharedContent } = composeStories(stories)

describe('dialog', () => {
	afterEach(async () => {
		await cleanup()
		vi.useRealTimers()
		vi.restoreAllMocks()
	})

	describe('rendering', () => {
		it('renders the trigger element in the DOM', async () => {
			const screen = await render(<Overview />)
			const trigger = screen.getByScopeAndPart('dialog', 'trigger')

			expect(trigger).toBeVisible()
		})

		it('merges custom classNames with styled-system recipe classes across all subcomponents', async () => {
			const screen = await render(
				<Dialog.Root open={true}>
					<Dialog.Trigger className="custom-trigger">Trigger</Dialog.Trigger>
					<Dialog.Backdrop className="custom-backdrop" />
					<Dialog.Positioner className="custom-positioner">
						<Dialog.Content className="custom-content">
							<Dialog.Headline className="custom-headline">
								<Dialog.Title className="custom-title">Title</Dialog.Title>
								<Dialog.CloseTrigger className="custom-closeTrigger">
									CloseTrigger
								</Dialog.CloseTrigger>
							</Dialog.Headline>
							<Dialog.Description className="custom-description">
								Description
							</Dialog.Description>
							<Dialog.Action className="custom-action">Action</Dialog.Action>
						</Dialog.Content>
					</Dialog.Positioner>
				</Dialog.Root>
			)

			function expectClasses(part: string, classPart = part) {
				const element = screen.getByScopeAndPart('dialog', part)

				expect(element).toHaveClass(`dialog__${classPart}`)
				expect(element).toHaveClass(
					new RegExp(`^dialog__${classPart}--placement_`)
				)
				expect(element).toHaveClass(new RegExp(`^dialog__${classPart}--size_`))
				expect(element).toHaveClass(
					new RegExp(`^dialog__${classPart}--scrollBehavior_`)
				)
				expect(element).toHaveClass(`custom-${classPart}`)
			}

			const partClassNames = {
				trigger: 'trigger',
				backdrop: 'backdrop',
				positioner: 'positioner',
				content: 'content',
				headline: 'headline',
				title: 'title',
				'close-trigger': 'closeTrigger',
				description: 'description',
				action: 'action'
			} as const

			for (const [part, classPart] of Object.entries(partClassNames)) {
				expectClasses(part, classPart)
			}
		})

		it('forwards refs to underlying DOM nodes across all subcomponents', async () => {
			const triggerRef = createRef<HTMLButtonElement>()
			const backdropRef = createRef<HTMLDivElement>()
			const positionerRef = createRef<HTMLDivElement>()
			const contentRef = createRef<HTMLDivElement>()
			const headlineRef = createRef<HTMLDivElement>()
			const titleRef = createRef<HTMLHeadingElement>()
			const closeTriggerRef = createRef<HTMLButtonElement>()
			const descriptionRef = createRef<HTMLDivElement>()
			const actionRef = createRef<HTMLDivElement>()

			await render(
				<Dialog.Root open={true}>
					<Dialog.Trigger ref={triggerRef}>Trigger</Dialog.Trigger>
					<Dialog.Backdrop ref={backdropRef} />
					<Dialog.Positioner ref={positionerRef}>
						<Dialog.Content ref={contentRef}>
							<Dialog.Headline ref={headlineRef}>
								<Dialog.Title ref={titleRef}>Title</Dialog.Title>
								<Dialog.CloseTrigger ref={closeTriggerRef}>
									CloseTrigger
								</Dialog.CloseTrigger>
							</Dialog.Headline>
							<Dialog.Description ref={descriptionRef}>
								Description
							</Dialog.Description>
							<Dialog.Action ref={actionRef}>Action</Dialog.Action>
						</Dialog.Content>
					</Dialog.Positioner>
				</Dialog.Root>
			)

			expect(triggerRef.current).toBeInstanceOf(HTMLButtonElement)
			expect(backdropRef.current).toBeInstanceOf(HTMLDivElement)
			expect(positionerRef.current).toBeInstanceOf(HTMLDivElement)
			expect(contentRef.current).toBeInstanceOf(HTMLDivElement)
			expect(headlineRef.current).toBeInstanceOf(HTMLDivElement)
			expect(titleRef.current).toBeInstanceOf(HTMLHeadingElement)
			expect(closeTriggerRef.current).toBeInstanceOf(HTMLButtonElement)
			expect(descriptionRef.current).toBeInstanceOf(HTMLDivElement)
			expect(actionRef.current).toBeInstanceOf(HTMLDivElement)
		})

		it('defaults title tag to h3 and applies custom element tag when as prop is passed', async () => {
			const screen = await render(
				<Dialog.Root open={true}>
					<Dialog.Trigger>Trigger</Dialog.Trigger>
					<Dialog.Backdrop />
					<Dialog.Positioner>
						<Dialog.Content>
							<Dialog.Headline>
								<Dialog.Title>Title</Dialog.Title>
								<Dialog.CloseTrigger>CloseTrigger</Dialog.CloseTrigger>
							</Dialog.Headline>
							<Dialog.Description>Description</Dialog.Description>
							<Dialog.Action>Action</Dialog.Action>
						</Dialog.Content>
					</Dialog.Positioner>
				</Dialog.Root>
			)
			expect(
				screen.getByRole('heading', { level: 3, name: 'Title' })
			).toBeInTheDocument()

			await screen.rerender(
				<Dialog.Root open={true}>
					<Dialog.Trigger>Trigger</Dialog.Trigger>
					<Dialog.Backdrop />
					<Dialog.Positioner>
						<Dialog.Content>
							<Dialog.Headline>
								<Dialog.Title as="h1">Title</Dialog.Title>
								<Dialog.CloseTrigger>CloseTrigger</Dialog.CloseTrigger>
							</Dialog.Headline>
							<Dialog.Description>Description</Dialog.Description>
							<Dialog.Action>Action</Dialog.Action>
						</Dialog.Content>
					</Dialog.Positioner>
				</Dialog.Root>
			)

			expect(
				screen.getByRole('heading', { level: 1, name: 'Title' })
			).toBeInTheDocument()
		})
	})

	describe('trigger asChild', () => {
		it('delegates rendering and dialog attributes directly to the child element', async () => {
			const screen = await render(
				<Dialog.Root open={true}>
					<Dialog.Trigger asChild>
						<button type="button" data-testid="trigger">
							Trigger
						</button>
					</Dialog.Trigger>
					<Dialog.Backdrop />
					<Dialog.Positioner>
						<Dialog.Content>
							<Dialog.Headline>
								<Dialog.Title>Title</Dialog.Title>
								<Dialog.CloseTrigger>CloseTrigger</Dialog.CloseTrigger>
							</Dialog.Headline>
							<Dialog.Description>Description</Dialog.Description>
							<Dialog.Action>Action</Dialog.Action>
						</Dialog.Content>
					</Dialog.Positioner>
				</Dialog.Root>
			)

			const trigger = screen.getByTestId('trigger')

			expect(trigger.element().tagName).toBe('BUTTON')
			expect(trigger).toHaveAttribute('data-scope', 'dialog')
			expect(trigger).toHaveAttribute('data-part', 'trigger')
		})

		it('forwards the ref to the child element when asChild is used', async () => {
			const ref = createRef<HTMLButtonElement>()

			await render(
				<Dialog.Root open={true}>
					<Dialog.Trigger asChild ref={ref}>
						<button type="button">Trigger</button>
					</Dialog.Trigger>
				</Dialog.Root>
			)

			expect(ref.current).toBeInstanceOf(HTMLButtonElement)
		})
	})

	describe('mergeProps handler composition', () => {
		it('executes both user-provided onClick and state machine trigger handler', async () => {
			const onClick = vi.fn()
			const user = userEvent.setup()

			const screen = await render(
				<Dialog.Root>
					<Dialog.Trigger onClick={onClick}>Trigger</Dialog.Trigger>
					<Dialog.Backdrop />
					<Dialog.Positioner>
						<Dialog.Content>
							<Dialog.Headline>
								<Dialog.Title>Title</Dialog.Title>
								<Dialog.CloseTrigger>CloseTrigger</Dialog.CloseTrigger>
							</Dialog.Headline>
							<Dialog.Description>Description</Dialog.Description>
							<Dialog.Action>Action</Dialog.Action>
						</Dialog.Content>
					</Dialog.Positioner>
				</Dialog.Root>
			)

			await user.click(screen.getByRole('button', { name: 'Trigger' }))

			expect(onClick).toHaveBeenCalledTimes(1)
			await vi.waitFor(() => {
				expect(screen.getByScopeAndPart('dialog', 'content')).toBeVisible()
			})
		})

		it('executes both user-provided onClick and state machine close trigger handler', async () => {
			const onClick = vi.fn()
			const user = userEvent.setup()

			const screen = await render(
				<Dialog.Root>
					<Dialog.Trigger>Trigger</Dialog.Trigger>
					<Dialog.Backdrop />
					<Dialog.Positioner>
						<Dialog.Content>
							<Dialog.Headline>
								<Dialog.Title>Title</Dialog.Title>
								<Dialog.CloseTrigger onClick={onClick}>
									CloseTrigger
								</Dialog.CloseTrigger>
							</Dialog.Headline>
							<Dialog.Description>Description</Dialog.Description>
							<Dialog.Action>Action</Dialog.Action>
						</Dialog.Content>
					</Dialog.Positioner>
				</Dialog.Root>
			)

			await user.click(screen.getByRole('button', { name: 'Trigger' }))

			await vi.waitFor(() => {
				expect(screen.getByScopeAndPart('dialog', 'content')).toBeVisible()
			})

			await user.click(screen.getByRole('button', { name: 'CloseTrigger' }))

			expect(onClick).toHaveBeenCalledTimes(1)
			await vi.waitFor(() => {
				expect(screen.getByScopeAndPart('dialog', 'content')).not.toBeVisible()
			})
		})
	})

	describe('trigger value', () => {
		it('attaches data-value attribute when value prop is provided', async () => {
			const screen = await render(
				<Dialog.Root open={true}>
					<Dialog.Trigger data-testid="trigger" value="trigger-value">
						Trigger
					</Dialog.Trigger>
					<Dialog.Positioner>
						<Dialog.Content>
							<Dialog.Headline>
								<Dialog.Title>Title</Dialog.Title>
								<Dialog.CloseTrigger>CloseTrigger</Dialog.CloseTrigger>
							</Dialog.Headline>
							<Dialog.Description>Description</Dialog.Description>
							<Dialog.Action>Action</Dialog.Action>
						</Dialog.Content>
					</Dialog.Positioner>
				</Dialog.Root>
			)

			expect(screen.getByTestId('trigger')).toHaveAttribute(
				'data-value',
				'trigger-value'
			)
		})

		it('omits data-value attribute when no value prop is provided', async () => {
			const screen = await render(<Overview />)

			await vi.waitFor(() => {
				expect(
					screen.getByScopeAndPart('dialog', 'trigger')
				).not.toHaveAttribute('data-value')
			})
		})

		it('switches the active dialog and emits its new value when opened', async () => {
			const user = userEvent.setup()

			const screen = await render(<SharedContent />)

			await user.click(screen.getByRole('button', { name: 'Dialog A' }))

			await vi.waitFor(() => {
				expect(SharedContent.args.onTriggerValueChange).toHaveBeenCalledTimes(1)
				expect(SharedContent.args.onTriggerValueChange).toHaveBeenCalledWith(
					expect.objectContaining({ value: 'dialog-a' })
				)
			})

			await user.keyboard('{Escape}')

			await user.click(screen.getByRole('button', { name: 'Dialog B' }))

			await vi.waitFor(() => {
				expect(SharedContent.args.onTriggerValueChange).toHaveBeenCalledTimes(2)
				expect(SharedContent.args.onTriggerValueChange).toHaveBeenCalledWith(
					expect.objectContaining({ value: 'dialog-b' })
				)
			})

			await user.keyboard('{Escape}')

			screen.getByRole('button', { name: 'Dialog B' }).element().blur()
		})
	})

	describe('use-dialog', () => {
		it('generates an id when none is provided', async () => {
			const { result } = await renderHook(() => useDialog({}))

			await vi.waitFor(() => {
				expect(result.current.getTriggerProps().id).toBeTruthy()
				expect(result.current.getPositionerProps().id).toBeTruthy()
				expect(result.current.getBackdropProps().id).toBeTruthy()
				expect(result.current.getContentProps().id).toBeTruthy()
				expect(result.current.getTitleProps().id).toBeTruthy()
				expect(result.current.getHeadlineProps().id).toBeTruthy()
				expect(result.current.getCloseTriggerProps().id).toBeTruthy()
				expect(result.current.getDescriptionProps().id).toBeTruthy()
				expect(result.current.getActionProps().id).toBeTruthy()
			})
		})

		it('applies custom ID across all subcomponents when explicitly configured', async () => {
			const { result } = await renderHook(() => useDialog({ id: 'custom-id' }))

			await vi.waitFor(() => {
				expect(result.current.getTriggerProps().id).toContain('custom-id')
				expect(result.current.getPositionerProps().id).toContain('custom-id')
				expect(result.current.getBackdropProps().id).toContain('custom-id')
				expect(result.current.getContentProps().id).toContain('custom-id')
				expect(result.current.getTitleProps().id).toContain('custom-id')
				expect(result.current.getHeadlineProps().id).toContain('custom-id')
				expect(result.current.getCloseTriggerProps().id).toContain('custom-id')
				expect(result.current.getDescriptionProps().id).toContain('custom-id')
				expect(result.current.getActionProps().id).toContain('custom-id')
			})
		})
	})

	describe('use-dialog-context', () => {
		it('throws an error when used outside a DialogProvider', async () => {
			await expect(async () => {
				await renderHook(() => useDialogContext())
			}).rejects.toThrow(
				'useDialogContext must be used within a DialogProvider'
			)
		})

		it('returns the dialog api when used inside a Dialog.Provider', async () => {
			let contextValue: ReturnType<typeof useDialogContext> | undefined

			const Consumer = () => {
				contextValue = useDialogContext()
				return null
			}

			await render(
				<Dialog.Root open={true}>
					<Consumer />
					<Dialog.Trigger>Trigger</Dialog.Trigger>
					<Dialog.Backdrop />
					<Dialog.Positioner>
						<Dialog.Content>
							<Dialog.Headline>
								<Dialog.Title>Title</Dialog.Title>
								<Dialog.CloseTrigger>CloseTrigger</Dialog.CloseTrigger>
							</Dialog.Headline>
							<Dialog.Description>Description</Dialog.Description>
							<Dialog.Action>Action</Dialog.Action>
						</Dialog.Content>
					</Dialog.Positioner>
				</Dialog.Root>
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
		const setup = async (initialProps: UseDialogProps) => {
			const { rerender, result } = await renderHook<UseDialogProps, DialogApi>(
				init => useDialog(init ? { ...init } : {}),
				{ initialProps }
			)
			const gate = () => (
				<Dialog.RootProvider {...result.current}>
					<Dialog.Trigger>Trigger</Dialog.Trigger>
					<Dialog.Backdrop />
					<Dialog.Positioner>
						<Dialog.Content>
							<Dialog.Headline>
								<Dialog.Title>Title</Dialog.Title>
								<Dialog.CloseTrigger>CloseTrigger</Dialog.CloseTrigger>
							</Dialog.Headline>
							<Dialog.Description>Description</Dialog.Description>
							<Dialog.Action>Action</Dialog.Action>
						</Dialog.Content>
					</Dialog.Positioner>
				</Dialog.RootProvider>
			)
			const screen = await render(gate())
			const sync = async (
				props?: UseDialogProps,
				callback?: () => void | Promise<void>
			) => {
				if (props) await rerender(props)
				if (callback) await callback()
				await screen.rerender(gate())
			}
			return { result, screen, sync }
		}
		it('provides dialog context using an externally managed machine state', async () => {
			const { screen, sync } = await setup({
				open: false
			})
			await expect
				.element(screen.getByScopeAndPart('dialog', 'content'))
				.toHaveAttribute('data-state', 'closed')
			await expect
				.element(screen.getByScopeAndPart('dialog', 'content'))
				.not.toBeVisible()

			await sync({ open: true })
			await expect
				.element(screen.getByScopeAndPart('dialog', 'content'))
				.toBeInTheDocument()
			await expect
				.element(screen.getByScopeAndPart('dialog', 'content'))
				.toHaveAttribute('data-state', 'open')
		})

		it('updates content visibility when setOpen is called imperatively outside the tree', async () => {
			const onOpenChange = vi.fn()
			const { result, screen, sync } = await setup({
				onOpenChange
			})
			await expect
				.element(screen.getByScopeAndPart('dialog', 'content'))
				.toHaveAttribute('data-state', 'closed')
			await expect
				.element(screen.getByScopeAndPart('dialog', 'content'))
				.not.toBeVisible()

			result.current.setOpen(true)
			await vi.waitFor(() => {
				expect(result.current.open).toBe(true)
			})
			await sync({ onOpenChange })
			await expect
				.element(screen.getByScopeAndPart('dialog', 'content'))
				.toHaveAttribute('data-state', 'open')
			await expect
				.element(screen.getByScopeAndPart('dialog', 'content'))
				.toBeInTheDocument()

			expect(onOpenChange).toHaveBeenCalledWith(
				expect.objectContaining({ open: true })
			)
		})
	})
})
