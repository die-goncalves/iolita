import { composeStories } from '@storybook/react-vite'
import { createRef, StrictMode } from 'react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { userEvent } from 'vitest/browser'
import { cleanup, render, renderHook } from 'vitest-browser-react'
import { Menu, type UseMenuProps, useMenu } from '.'
import * as stories from './menu.stories'
import type { UseMenuReturn } from './use-menu'
import { useMenuContext } from './use-menu-context'
import { useItemGroupContext } from './use-menu-item-group-context'
import { useMenuOptionItemContext } from './use-menu-option-item-context'

const { Overview } = composeStories(stories)

describe('menu', () => {
	afterEach(async () => {
		await cleanup()
		vi.useRealTimers()
		vi.restoreAllMocks()
	})

	describe('rendering', () => {
		it('renders the trigger closed by default', async () => {
			const screen = await render(<Overview />)
			const trigger = screen.getByScopeAndPart('menu', 'trigger')

			await expect.element(trigger).toBeInTheDocument()
			await expect.element(trigger).toHaveAttribute('aria-expanded', 'false')
		})

		it('merges custom classNames with styled-system recipe classes across all subcomponents', async () => {
			const screen = await render(
				<Menu.Root open={true}>
					<Menu.Trigger className="custom-trigger">Trigger</Menu.Trigger>
					<Menu.Positioner className="custom-positioner">
						<Menu.Content className="custom-content">
							<Menu.Surface className="custom-surface">
								<Menu.Item className="custom-item" value="item">
									Item
								</Menu.Item>
							</Menu.Surface>
						</Menu.Content>
					</Menu.Positioner>
				</Menu.Root>
			)

			function expectClasses(part: string, classPart = part) {
				const element = screen.getByScopeAndPart('menu', part)

				expect(element).toHaveClass(`menu__${classPart}`)
				expect(element).toHaveClass(new RegExp(`^menu__${classPart}--gap_`))
				expect(element).toHaveClass(`custom-${classPart}`)
			}

			const partClassNames = {
				trigger: 'trigger',
				positioner: 'positioner',
				content: 'content',
				surface: 'surface',
				item: 'item'
			} as const

			for (const [part, classPart] of Object.entries(partClassNames)) {
				expectClasses(part, classPart)
			}
		})

		it('forwards refs to underlying DOM nodes across all subcomponents', async () => {
			const triggerRef = createRef<HTMLButtonElement>()
			const positionerRef = createRef<HTMLDivElement>()
			const contentRef = createRef<HTMLDivElement>()
			const surfaceRef = createRef<HTMLDivElement>()
			const itemARef = createRef<HTMLDivElement>()
			const groupRef = createRef<HTMLDivElement>()
			const labelRef = createRef<HTMLDivElement>()
			const itemBRef = createRef<HTMLDivElement>()
			const separatorRef = createRef<HTMLDivElement>()
			const itemCRef = createRef<HTMLDivElement>()

			await render(
				<Menu.Root>
					<Menu.Trigger ref={triggerRef}>Trigger</Menu.Trigger>

					<Menu.Positioner ref={positionerRef}>
						<Menu.Content ref={contentRef}>
							<Menu.Surface ref={surfaceRef}>
								<Menu.Item ref={itemARef} value="item-a">
									Item A
								</Menu.Item>
							</Menu.Surface>
							<Menu.ItemGroup ref={groupRef}>
								<Menu.ItemGroupLabel ref={labelRef}>Label</Menu.ItemGroupLabel>
								<Menu.Item ref={itemBRef} value="item-b">
									Item B
								</Menu.Item>
								<Menu.Separator ref={separatorRef} />
								<Menu.Item ref={itemCRef} value="item-c">
									Item C
								</Menu.Item>
							</Menu.ItemGroup>
						</Menu.Content>
					</Menu.Positioner>
				</Menu.Root>
			)

			expect(triggerRef.current).toBeInstanceOf(HTMLButtonElement)
			expect(positionerRef.current).toBeInstanceOf(HTMLDivElement)
			expect(contentRef.current).toBeInstanceOf(HTMLDivElement)
			expect(surfaceRef.current).toBeInstanceOf(HTMLDivElement)
			expect(itemARef.current).toBeInstanceOf(HTMLDivElement)
			expect(groupRef.current).toBeInstanceOf(HTMLDivElement)
			expect(labelRef.current).toBeInstanceOf(HTMLDivElement)
			expect(itemBRef.current).toBeInstanceOf(HTMLDivElement)
			expect(separatorRef.current).toBeInstanceOf(HTMLDivElement)
			expect(itemCRef.current).toBeInstanceOf(HTMLDivElement)
		})
	})

	describe('trigger asChild', () => {
		it('delegates rendering and menu attributes directly to the child element', async () => {
			const screen = await render(
				<Menu.Root open={true}>
					<Menu.Trigger asChild>
						<button type="button" data-testid="trigger">
							Trigger
						</button>
					</Menu.Trigger>
					<Menu.Positioner>
						<Menu.Content>
							<Menu.Surface>
								<Menu.Item value="item-a">Item A</Menu.Item>
							</Menu.Surface>
						</Menu.Content>
					</Menu.Positioner>
				</Menu.Root>
			)

			const trigger = screen.getByTestId('trigger')
			expect(trigger.element().tagName).toBe('BUTTON')
			expect(trigger).toHaveAttribute('data-scope', 'menu')
			expect(trigger).toHaveAttribute('data-part', 'trigger')
		})

		it('forwards the ref to the child element when asChild is used', async () => {
			const ref = createRef<HTMLButtonElement>()
			await render(
				<Menu.Root open={true}>
					<Menu.Trigger asChild ref={ref}>
						<button type="button">Trigger</button>
					</Menu.Trigger>
				</Menu.Root>
			)
			expect(ref.current).toBeInstanceOf(HTMLButtonElement)
		})
	})

	describe('mergeProps handler composition', () => {
		it('executes both user-provided onClick and state machine trigger handler', async () => {
			const onClick = vi.fn()

			const user = userEvent.setup()

			const screen = await render(
				<Menu.Root>
					<Menu.Trigger onClick={onClick}>Trigger</Menu.Trigger>
				</Menu.Root>
			)
			await user.click(screen.getByRole('button', { name: 'Trigger' }))
			expect(onClick).toHaveBeenCalledTimes(1)
		})
	})

	describe('parent/child linking', () => {
		it('links parent and child services exactly once, even under StrictMode double-invocation', async () => {
			const setChildSpy = vi.fn()
			const setParentSpy = vi.fn()

			function TestWrapper() {
				const parentMenu = useMenu({ id: 'parent' })
				const childMenu = useMenu({ id: 'child' })

				const originalSetChild = parentMenu.api.setChild
				parentMenu.api.setChild = (...args) => {
					setChildSpy()
					return originalSetChild(...args)
				}
				const originalSetParent = childMenu.api.setParent
				childMenu.api.setParent = (...args) => {
					setParentSpy()
					return originalSetParent(...args)
				}

				return (
					<Menu.RootProvider {...parentMenu}>
						<Menu.Trigger>Parent</Menu.Trigger>
						<Menu.Positioner>
							<Menu.Content>
								<Menu.Surface>
									<Menu.RootProvider {...childMenu}>
										<Menu.TriggerItem>Child</Menu.TriggerItem>
										<Menu.Positioner>
											<Menu.Content>
												<Menu.Surface>
													<Menu.Item value="item">Item</Menu.Item>
												</Menu.Surface>
											</Menu.Content>
										</Menu.Positioner>
									</Menu.RootProvider>
								</Menu.Surface>
							</Menu.Content>
						</Menu.Positioner>
					</Menu.RootProvider>
				)
			}

			const screen = await render(
				<StrictMode>
					<TestWrapper />
				</StrictMode>
			)

			await expect.element(screen.getByText('Child')).toBeInTheDocument()

			expect(setChildSpy).toHaveBeenCalledTimes(1)
			expect(setParentSpy).toHaveBeenCalledTimes(1)
		})
	})

	describe('context guards', () => {
		it('throws error when useMenuContext is used outside a MenuProvider', async () => {
			await expect(async () => {
				await renderHook(() => useMenuContext())
			}).rejects.toThrow('useMenuContext must be used within a MenuProvider')
		})

		it('throws error when useItemGroupContext is used outside Menu.ItemGroup', async () => {
			await expect(async () => {
				await renderHook(() => useItemGroupContext())
			}).rejects.toThrow(
				'useItemGroupContext must be used within ItemGroupContext.Provider'
			)
		})

		it('throws error when useMenuOptionItemContext is used outside Menu.OptionItem', async () => {
			await expect(async () => {
				await renderHook(() => useMenuOptionItemContext())
			}).rejects.toThrow(
				'useMenuOptionItemContext must be used within a MenuOptionItemProvider'
			)
		})
	})

	describe('use-menu', () => {
		it('generates auto-incremented fallback IDs for all subcomponents when none is provided', async () => {
			const { result } = await renderHook(() => useMenu({}))
			await vi.waitFor(() => {
				expect(result.current.api.getTriggerProps().id).toBeTruthy()
				expect(result.current.api.getPositionerProps().id).toBeTruthy()
				expect(result.current.api.getContentProps().id).toBeTruthy()
				expect(result.current.api.getSurfaceProps().id).toBeTruthy()
				expect(
					result.current.api.getItemProps({ value: 'Item A' }).id
				).toBeTruthy()
			})
		})

		it('applies custom ID across all subcomponents when explicitly configured', async () => {
			const { result } = await renderHook(() => useMenu({ id: 'custom-id' }))
			await vi.waitFor(() => {
				expect(result.current.api.getTriggerProps().id).toContain('custom-id')
				expect(result.current.api.getPositionerProps().id).toContain(
					'custom-id'
				)
				expect(result.current.api.getContentProps().id).toContain('custom-id')
				expect(result.current.api.getSurfaceProps().id).toContain('custom-id')
				expect(
					result.current.api.getItemProps({ value: 'Item A' }).id
				).toContain('custom-id')
			})
		})
	})

	describe('use-menu-context', () => {
		it('returns the menu api when used inside a Menu.Provider', async () => {
			let contextValue: ReturnType<typeof useMenuContext> | undefined
			const Consumer = () => {
				contextValue = useMenuContext()
				return null
			}
			await render(
				<Menu.Root open={true}>
					<Consumer />
					<Menu.Trigger>Trigger</Menu.Trigger>
					<Menu.Positioner>
						<Menu.Content>
							<Menu.Surface>
								<Menu.Item value="item-a">Item A</Menu.Item>
							</Menu.Surface>
						</Menu.Content>
					</Menu.Positioner>
				</Menu.Root>
			)
			await vi.waitFor(() => {
				expect(contextValue).toBeDefined()
			})
			expect(contextValue?.api).toMatchObject({
				open: true
			})
			expect(contextValue?.api).toHaveProperty('getTriggerProps')
			expect(contextValue?.api).toHaveProperty('getContentProps')
		})
	})

	describe('root provider', () => {
		const setup = async (initialProps: UseMenuProps) => {
			const { rerender, result } = await renderHook<
				UseMenuProps,
				UseMenuReturn
			>(init => useMenu(init ? { ...init } : {}), { initialProps })

			const gate = () => (
				<Menu.RootProvider {...result.current}>
					<Menu.Trigger>Trigger</Menu.Trigger>
					<Menu.Positioner>
						<Menu.Content>
							<Menu.Surface>
								<Menu.Item value="item-a">Item A</Menu.Item>
							</Menu.Surface>
						</Menu.Content>
					</Menu.Positioner>
				</Menu.RootProvider>
			)

			const screen = await render(gate())

			const sync = async (
				props?: UseMenuProps,
				callback?: () => void | Promise<void>
			) => {
				if (props) await rerender(props)
				if (callback) await callback()
				await screen.rerender(gate())
			}

			return { result, screen, sync }
		}

		it('consumes external machine state to sync open state and DOM visibility', async () => {
			const { screen, sync } = await setup({
				open: false
			})
			await expect
				.element(screen.getByScopeAndPart('menu', 'content'))
				.toHaveAttribute('data-state', 'closed')
			await expect
				.element(screen.getByScopeAndPart('menu', 'content'))
				.not.toBeVisible()
			await sync({ open: true })
			await expect
				.element(screen.getByScopeAndPart('menu', 'content'))
				.toBeInTheDocument()
			await expect
				.element(screen.getByScopeAndPart('menu', 'content'))
				.toHaveAttribute('data-state', 'open')
		})

		it('updates content visibility when setOpen is called imperatively outside the tree', async () => {
			const onOpenChange = vi.fn()
			const { result, screen, sync } = await setup({
				onOpenChange
			})
			await expect
				.element(screen.getByScopeAndPart('menu', 'content'))
				.toHaveAttribute('data-state', 'closed')
			await expect
				.element(screen.getByScopeAndPart('menu', 'content'))
				.not.toBeVisible()
			result.current.api.setOpen(true)
			await vi.waitFor(() => {
				expect(result.current.api.open).toBe(true)
			})
			await sync({ onOpenChange })
			await expect
				.element(screen.getByScopeAndPart('menu', 'content'))
				.toHaveAttribute('data-state', 'open')
			await expect
				.element(screen.getByScopeAndPart('menu', 'content'))
				.toBeInTheDocument()
			expect(onOpenChange).toHaveBeenCalledWith(
				expect.objectContaining({ open: true })
			)
		})
	})
})
