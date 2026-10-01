import { css, cx } from '@iolita/styled-system/css'
import type { Meta, StoryObj } from '@storybook/react-vite'
import type * as zMenu from '@zag-js/menu'
import { Portal } from '@zag-js/react'
import {
	type ComponentProps,
	type ComponentPropsWithoutRef,
	type Key,
	useState
} from 'react'
import { expect, fn, screen, userEvent, waitFor, within } from 'storybook/test'
import { Button } from '../button'
import { Presence } from '../presence'
import { Menu } from '.'
import { useMenu } from './use-menu'

const Icon = ({
	className,
	name,
	...props
}: ComponentPropsWithoutRef<'span'> & { name: string }) => (
	<span
		className={cx(
			css({
				fontFamily: 'Material Symbols Sharp',
				fontWeight: 'normal',
				fontStyle: 'normal',
				fontSize: 'inherit',
				lineHeight: 1,
				letterSpacing: 'normal',
				textTransform: 'none',
				display: 'inline-block',
				whiteSpace: 'nowrap',
				wordWrap: 'normal',
				direction: 'ltr',
				fontSmoothing: 'antialiased'
			}),
			className
		)}
		aria-hidden="true"
		{...props}
	>
		{name}
	</span>
)

type MenuStoryProps = ComponentProps<typeof Menu.Root> & {
	placement?: zMenu.PositioningOptions['placement']
	gutter?: zMenu.PositioningOptions['gutter']
	overflowPadding?: zMenu.PositioningOptions['overflowPadding']
	arrowPadding?: zMenu.PositioningOptions['arrowPadding']
}

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
/**
 * An accessible menu component that displays a list of actions and options for
 * the user, triggered by a control. Provides accessible keyboard navigation,
 * focus management, adaptive floating placement, hierarchical submenus, and
 * selectable state items.
 */
const meta = {
	title: 'Components/Menu',
	component: Menu.Root,
	parameters: {
		// Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/configure/story-layout
		layout: 'fullscreen'
	},
	// This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/writing-docs/autodocs
	tags: ['autodocs'],
	// More on argTypes: https://storybook.js.org/docs/api/arg-types
	argTypes: {
		gap: {
			control: 'boolean',
			description: 'Separator type.',
			table: {
				defaultValue: { summary: 'false' },
				type: { summary: 'boolean | undefined' }
			}
		},
		dir: {
			control: 'select',
			description: "The document's text/writing direction.",
			options: ['ltr', 'rtl'],
			table: {
				defaultValue: { summary: 'ltr' },
				type: { summary: 'ltr | rtl | undefined' }
			}
		},
		onEscapeKeyDown: {
			action: 'onEscapeKeyDown',
			description: 'Function called when the escape key is pressed.',
			table: {
				type: {
					summary: '((event: KeyboardEvent) => void) | undefined'
				}
			}
		},
		onRequestDismiss: {
			action: 'onRequestDismiss',
			description:
				'Function called when this layer is closed due to a parent layer being closed.',
			table: {
				type: {
					summary: '((event: LayerDismissEvent) => void) | undefined'
				}
			}
		},
		onInteractOutside: {
			action: 'onInteractOutside',
			description:
				'Function called when an interaction happens outside the component.',
			table: {
				type: {
					summary: '((event: InteractOutsideEvent) => void) | undefined'
				}
			}
		},
		onFocusOutside: {
			action: 'onFocusOutside',
			description:
				'Function called when the focus is moved outside the component.',
			table: {
				type: {
					summary: '((event: FocusOutsideEvent) => void) | undefined'
				}
			}
		},
		onPointerDownOutside: {
			action: 'onPointerDownOutside',
			description:
				'Function called when the pointer is pressed down outside the component.',
			table: {
				type: {
					summary: '((event: PointerDownOutsideEvent) => void) | undefined'
				}
			}
		},
		id: {
			control: 'text',
			description: 'The unique identifier of the machine.',
			table: {
				type: { summary: 'string' }
			}
		},
		defaultHighlightedValue: {
			control: 'text',
			description:
				"The initial highlighted value of the menu item when rendered. Use when you don't need to control the highlighted value of the menu item.",
			table: {
				type: { summary: 'string | null | undefined' }
			}
		},
		highlightedValue: {
			control: 'text',
			description: 'The controlled highlighted value of the menu item.',
			table: {
				type: { summary: 'string | null | undefined' }
			}
		},
		onHighlightChange: {
			action: 'onHighlightChange',
			description: 'Function called when the highlighted menu item changes.',
			table: {
				type: {
					summary: '((details: HighlightChangeDetails) => void) | undefined'
				}
			}
		},
		onSelect: {
			action: 'onSelect',
			description: 'Function called when a menu item is selected.',
			table: {
				type: { summary: '((details: SelectionDetails) => void) | undefined' }
			}
		},
		loopFocus: {
			action: 'loopFocus',
			description: 'Whether to loop the keyboard navigation..',
			table: {
				defaultValue: { summary: 'false' },
				type: { summary: 'boolean | undefined' }
			}
		},
		placement: {
			control: 'select',
			description: 'The initial placement of the floating element.',
			options: [
				'top',
				'top-start',
				'top-end',
				'bottom',
				'bottom-start',
				'bottom-end',
				'left',
				'left-start',
				'left-end',
				'right',
				'right-start',
				'right-end'
			],
			table: {
				category: 'positioning',
				defaultValue: { summary: 'top' },
				type: {
					summary:
						'top | top-start | top-end | bottom | bottom-start | bottom-end | left | left-start | left-end | right | right-start | right-end'
				}
			}
		},
		gutter: {
			control: 'number',
			description:
				'The main axis offset or gap between the reference and floating elements.',
			table: {
				category: 'positioning',
				defaultValue: { summary: '8' },
				type: { summary: 'number' }
			}
		},
		overflowPadding: {
			control: 'number',
			description:
				'The virtual padding around the viewport edges to check for overflow.',
			table: {
				category: 'positioning',
				defaultValue: { summary: '8' },
				type: { summary: 'number' }
			}
		},
		arrowPadding: {
			control: 'number',
			description:
				"The minimum padding between the arrow and the floating element's corner.",
			table: {
				category: 'positioning',
				defaultValue: { summary: '0' },
				type: { summary: 'number' }
			}
		},
		closeOnSelect: {
			action: 'closeOnSelect',
			description: 'Whether to close the menu when an option is selected.',
			table: {
				defaultValue: { summary: 'true' },
				type: { summary: 'boolean | undefined' }
			}
		},
		'aria-label': {
			control: 'text',
			description: 'The accessibility label for the menu.',
			table: {
				type: { summary: 'string | undefined' }
			}
		},
		open: {
			control: 'boolean',
			description: 'The controlled open state of the menu.',
			table: {
				type: { summary: 'boolean' }
			}
		},
		defaultOpen: {
			control: 'boolean',
			description:
				"The initial open state of the menu when rendered. Use when you don't need to control the open state of the menu.",
			table: {
				defaultValue: { summary: 'true' },
				type: { summary: 'boolean | undefined' }
			}
		},
		onOpenChange: {
			action: 'onOpenChange',
			description: 'Function called when the menu opens or closes.',
			table: {
				type: { summary: '((details: OpenChangeDetails) => void) | undefined' }
			}
		},
		triggerValue: {
			control: 'text',
			description: 'The controlled trigger value.',
			table: {
				type: { summary: 'string | null | undefined' }
			}
		},
		defaultTriggerValue: {
			control: 'text',
			description:
				"The initial trigger value when rendered. Use when you don't need to control the trigger value.",
			table: {
				type: { summary: 'string | null | undefined' }
			}
		},
		onTriggerValueChange: {
			action: 'onTriggerValueChange',
			description: 'Function called when the trigger value changes.',
			table: {
				type: {
					summary: '((details: TriggerValueChangeDetails) => void) | undefined'
				}
			}
		}
	},
	// Use `fn` to spy on the onClick arg, which will appear in the actions panel once invoked: https://storybook.js.org/docs/essentials/actions#story-args
	args: {
		children: '',
		onOpenChange: fn(),
		onTriggerValueChange: fn()
	}
} satisfies Meta<MenuStoryProps>

export default meta
type Story = StoryObj<typeof meta>

const Template: Pick<Story, 'decorators'> = {
	decorators: [
		(Story, context) => (
			<div
				className={css({
					width: '100%',
					height: context.viewMode === 'docs' ? '384px' : '100dvh',
					padding: '2'
				})}
			>
				<div
					className={css({
						position: 'relative',
						display: 'flex',
						justifyContent: 'center',
						alignItems: 'center',
						width: '100%',
						height: '100%'
					})}
				>
					<Story />
				</div>
			</div>
		)
	]
}

// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args
/**
 * The standard behavior of the Menu component. It toggles visibility upon
 * interacting with the trigger, renders a simple list of actions on a single
 * surface, and automatically dismisses when pressing the Escape key or
 * selecting an item.
 */
export const Overview: Story = {
	...Template,
	parameters: {
		controls: {
			exclude: ['children']
		}
	},
	render: args => {
		return (
			<Menu.Root {...args}>
				<Menu.Trigger asChild>
					<Button variant="ghost">Menu</Button>
				</Menu.Trigger>

				<Portal>
					<Menu.Positioner>
						<Menu.Content>
							<Menu.Surface>
								<Menu.Item value="note_add">New file</Menu.Item>
								<Menu.Item value="file_open">Open file...</Menu.Item>
								<Menu.Item value="folder_open">Open folder...</Menu.Item>
							</Menu.Surface>
						</Menu.Content>
					</Menu.Positioner>
				</Portal>
			</Menu.Root>
		)
	},
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement)
		const trigger = canvas.getByRole('button', { name: 'Menu' })

		await expect(trigger).toHaveAttribute('aria-haspopup', 'menu')
		await expect(trigger).toHaveAttribute('aria-expanded', 'false')
		await expect(
			await screen.findByRole('menu', { hidden: true })
		).not.toBeVisible()

		await userEvent.click(trigger)

		const menu = await screen.findByRole('menu')
		await expect(menu).toBeVisible()
		await expect(trigger).toHaveAttribute('aria-expanded', 'true')
		await expect(within(menu).getAllByRole('menuitem')).toHaveLength(3)

		await userEvent.keyboard('{ArrowDown}')
		await waitFor(
			async () =>
				await expect(
					screen.getByRole('menuitem', { name: 'New file' })
				).toHaveAttribute('data-highlighted')
		)

		await userEvent.keyboard('{Escape}')

		await waitFor(async () => {
			await expect(screen.queryByRole('menu')).toBeNull()
		})

		await waitFor(async () => {
			await expect(trigger).toHaveFocus()
			await expect(trigger).toHaveAttribute('aria-expanded', 'false')
		})

		trigger.blur()
	}
}

/**
 * Demonstrates the use of the gap property in the `Menu.Root` component. It
 * applies visual spacing (a 2px gap) between multiple
 * `Menu.Surface`/`Menu.ItemGroup` elements rendered sequentially within the
 * same content container.
 */
export const WithGap: Story = {
	...Template,
	args: { gap: true },
	parameters: {
		controls: {
			include: ['gap']
		}
	},
	render: args => {
		return (
			<Menu.Root gap={args.gap}>
				<Menu.Trigger asChild>
					<Button variant="ghost">Menu</Button>
				</Menu.Trigger>

				<Portal>
					<Menu.Positioner>
						<Menu.Content data-testid="content">
							<Menu.Surface>
								<Menu.Item value="note_add">New file</Menu.Item>
								<Menu.Item value="file_open">Open file...</Menu.Item>
								<Menu.Item value="folder_open">Open folder...</Menu.Item>
							</Menu.Surface>

							<Menu.Surface>
								<Menu.Item value="save">Save</Menu.Item>
								<Menu.Item value="save_as">Save as...</Menu.Item>
							</Menu.Surface>
						</Menu.Content>
					</Menu.Positioner>
				</Portal>
			</Menu.Root>
		)
	},
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement)
		const trigger = canvas.getByRole('button', { name: 'Menu' })

		trigger.focus()

		await userEvent.keyboard('{Enter}')

		const content = await screen.findByTestId('content')
		await expect(content).toBeVisible()

		await waitFor(
			async () =>
				await expect(
					within(content).getByRole('menuitem', { name: /New file/ })
				).toHaveAttribute('data-highlighted')
		)

		await expect(content).toHaveStyle({ gap: '2px' })

		await userEvent.keyboard('{Escape}')

		await waitFor(async () => {
			await expect(screen.queryByRole('menu')).toBeNull()
		})

		await waitFor(async () => {
			await expect(trigger).toHaveFocus()
		})

		trigger.blur()
	}
}

/**
 * Illustrates the visual organization of menu items using the `Menu.Separator`
 * component. It is used to logically divide groups of actions (e.g., file
 * actions vs. save actions) within the same surface structure.
 */
export const WithSeparator: Story = {
	...Template,
	parameters: {
		controls: {
			disable: true
		}
	},
	render: () => {
		return (
			<Menu.Root>
				<Menu.Trigger asChild>
					<Button variant="ghost">Menu</Button>
				</Menu.Trigger>

				<Portal>
					<Menu.Positioner>
						<Menu.Content data-testid="content">
							<Menu.Surface>
								<Menu.Item value="note_add">New file</Menu.Item>
								<Menu.Item value="file_open">Open file...</Menu.Item>
								<Menu.Item value="folder_open">Open folder...</Menu.Item>

								<Menu.Separator data-testid="separator" />

								<Menu.Item value="save">Save</Menu.Item>
								<Menu.Item value="save_as">Save as...</Menu.Item>
							</Menu.Surface>
						</Menu.Content>
					</Menu.Positioner>
				</Portal>
			</Menu.Root>
		)
	},
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement)
		const trigger = canvas.getByRole('button', { name: 'Menu' })

		trigger.focus()

		await userEvent.keyboard('{Enter}')

		const content = await screen.findByTestId('content')
		await expect(content).toBeVisible()

		await waitFor(
			async () =>
				await expect(
					within(content).getByRole('menuitem', { name: /New file/ })
				).toHaveAttribute('data-highlighted')
		)

		const separator = await screen.findByTestId('separator')
		await expect(separator).toBeVisible()

		const validParent = separator.closest(
			'[data-part="surface"], [data-part="item-group"]'
		)
		await expect(validParent).not.toBeNull()
		await expect(validParent).toContainElement(separator)

		const newFileItem = screen.getByRole('menuitem', {
			name: 'Open folder...'
		})
		const saveItem = screen.getByRole('menuitem', { name: 'Save' })
		await expect(newFileItem).toBeVisible()
		await expect(saveItem).toBeVisible()

		const previousElement = separator.previousElementSibling
		const nextElement = separator.nextElementSibling
		await expect(previousElement).toBe(newFileItem)
		await expect(nextElement).toBe(saveItem)

		await userEvent.keyboard('{Escape}')

		await waitFor(async () => {
			await expect(screen.queryByRole('menu')).toBeNull()
		})

		await waitFor(async () => {
			await expect(trigger).toHaveFocus()
		})

		trigger.blur()
	}
}

/**
 * Presents the composition of visually enriched menu items. It demonstrates the
 * integration of custom icons on the left (`leadingIcon`) and keyboard shortcut
 * indicators on the right (`trailingText`) to optimize the interface.
 */
export const WithIcons: Story = {
	...Template,
	parameters: {
		controls: {
			disable: true
		}
	},
	render: () => {
		return (
			<Menu.Root>
				<Menu.Trigger asChild>
					<Button variant="ghost">Menu</Button>
				</Menu.Trigger>

				<Portal>
					<Menu.Positioner>
						<Menu.Content data-testid="content">
							<Menu.Surface>
								<Menu.Item
									value="note_add"
									leadingIcon={<Icon name="note_add" />}
									trailingText="Ctrl+N"
								>
									New file
								</Menu.Item>
								<Menu.Item
									value="file_open"
									leadingIcon={<Icon name="file_open" />}
									trailingText="Ctrl+O"
								>
									Open file...
								</Menu.Item>
								<Menu.Item
									value="folder_open"
									leadingIcon={<Icon name="folder_open" />}
									trailingText="Ctrl+K+O"
								>
									Open folder...
								</Menu.Item>

								<Menu.Separator />

								<Menu.Item
									value="save"
									leadingIcon={<Icon name="save" />}
									trailingText="Ctrl+S"
								>
									Save
								</Menu.Item>
								<Menu.Item
									value="save_as"
									leadingIcon={<Icon name="save_as" />}
									trailingText="Ctrl+Shift+S"
								>
									Save as...
								</Menu.Item>
							</Menu.Surface>
						</Menu.Content>
					</Menu.Positioner>
				</Portal>
			</Menu.Root>
		)
	},
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement)
		const trigger = canvas.getByRole('button', { name: 'Menu' })

		trigger.focus()

		await userEvent.keyboard('{Enter}')

		const content = await screen.findByTestId('content')
		await expect(content).toBeVisible()

		await waitFor(
			async () =>
				await expect(
					within(content).getByRole('menuitem', { name: /New file/ })
				).toHaveAttribute('data-highlighted')
		)

		const items = [
			{ label: 'New file', icon: 'note_add', shortcut: 'Ctrl+N' },
			{ label: 'Open file...', icon: 'file_open', shortcut: 'Ctrl+O' },
			{ label: 'Open folder...', icon: 'folder_open', shortcut: 'Ctrl+K+O' },
			{ label: 'Save', icon: 'save', shortcut: 'Ctrl+S' },
			{ label: 'Save as...', icon: 'save_as', shortcut: 'Ctrl+Shift+S' }
		]

		const menuItems = await screen.findAllByRole('menuitem')
		await expect(menuItems).toHaveLength(items.length)

		for (const item of items) {
			const menuItem = menuItems.find(el => within(el).queryByText(item.label))
			await expect(menuItem).toBeDefined()
			if (!menuItem) continue

			await expect(within(menuItem).getByText(item.label)).toBeVisible()
			await expect(within(menuItem).getByText(item.shortcut)).toBeVisible()

			const iconEl = menuItem.querySelector('[aria-hidden="true"]')
			await expect(iconEl).toBeInTheDocument()
			await expect(iconEl).toHaveTextContent(item.icon)
		}

		await userEvent.keyboard('{Escape}')

		await waitFor(async () => {
			await expect(screen.queryByRole('menu')).toBeNull()
		})

		await waitFor(async () => {
			await expect(trigger).toHaveFocus()
		})

		trigger.blur()
	}
}

/**
 * Demonstrates the semantic grouping of items using `Menu.ItemGroup` and
 * `Menu.ItemGroupLabel`. It logically structures items under specific labels
 * (e.g., "File" and "Edit"), ensuring correct accessibility through
 * `role="group"` and `aria-labelledby` attributes.
 */
export const Group: Story = {
	...Template,
	args: { gap: true },
	parameters: {
		controls: {
			include: ['gap']
		}
	},
	render: args => {
		return (
			<Menu.Root gap={args.gap}>
				<Menu.Trigger asChild>
					<Button variant="ghost">Menu</Button>
				</Menu.Trigger>

				<Portal>
					<Menu.Positioner>
						<Menu.Content data-testid="content">
							<Menu.ItemGroup>
								<Menu.ItemGroupLabel>File</Menu.ItemGroupLabel>
								<Menu.Item value="note_add">New file</Menu.Item>
								<Menu.Item value="file_open">Open file...</Menu.Item>
								<Menu.Item value="folder_open">Open folder...</Menu.Item>
							</Menu.ItemGroup>

							<Menu.ItemGroup>
								<Menu.ItemGroupLabel>Edit</Menu.ItemGroupLabel>
								<Menu.Item value="save">Undo</Menu.Item>
								<Menu.Item value="save_as">Redo</Menu.Item>
							</Menu.ItemGroup>
						</Menu.Content>
					</Menu.Positioner>
				</Portal>
			</Menu.Root>
		)
	},
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement)
		const trigger = canvas.getByRole('button', { name: 'Menu' })

		trigger.focus()

		await userEvent.keyboard('{Enter}')

		const rootContent = await screen.findByTestId('content')
		await expect(rootContent).toBeVisible()

		await waitFor(
			async () =>
				await expect(
					within(rootContent).getByRole('menuitem', { name: 'New file' })
				).toHaveAttribute('data-highlighted')
		)

		const groups = rootContent.querySelectorAll('[role="group"]')
		await expect(groups).toHaveLength(2)

		const fileGroup = within(rootContent).getByRole('group', {
			name: /file/i
		})
		await expect(fileGroup).toBeVisible()

		const fileLabel = within(fileGroup).getByText('File')
		await expect(fileLabel).toBeVisible()
		await expect(fileGroup).toHaveAttribute('aria-labelledby', fileLabel.id)

		const newFileItem = within(fileGroup).getByRole('menuitem', {
			name: 'New file'
		})
		const openFileItem = within(fileGroup).getByRole('menuitem', {
			name: 'Open file...'
		})
		const openFolderItem = within(fileGroup).getByRole('menuitem', {
			name: 'Open folder...'
		})

		await expect(newFileItem).toBeVisible()
		await expect(openFileItem).toBeVisible()
		await expect(openFolderItem).toBeVisible()

		const editGroup = within(rootContent).getByRole('group', {
			name: /edit/i
		})
		await expect(editGroup).toBeVisible()

		const editLabel = within(editGroup).getByText('Edit')
		expect(editLabel).toBeVisible()
		expect(editGroup).toHaveAttribute('aria-labelledby', editLabel.id)

		const undoItem = within(editGroup).getByRole('menuitem', {
			name: 'Undo'
		})
		const redoItem = within(editGroup).getByRole('menuitem', {
			name: 'Redo'
		})

		await expect(undoItem).toBeVisible()
		await expect(redoItem).toBeVisible()

		expect(
			within(fileGroup).queryByRole('menuitem', { name: 'Undo' })
		).not.toBeInTheDocument()
		expect(
			within(editGroup).queryByRole('menuitem', {
				name: 'New file'
			})
		).not.toBeInTheDocument()

		await userEvent.keyboard('{Escape}')

		await waitFor(async () => {
			await expect(screen.queryByRole('menu')).toBeNull()
		})

		await waitFor(async () => {
			await expect(trigger).toHaveFocus()
		})

		trigger.blur()
	}
}

/**
 * Implements state selection patterns within the menu using `Menu.OptionItem`.
 * It demonstrates multiple selection (`checkbox` style for font styles) and
 * single selection (`radio` style for paragraph alignment), displaying a check
 * icon when active.
 */
export const Selection: Story = {
	...Template,
	args: { gap: true },
	parameters: {
		controls: {
			include: ['gap']
		}
	},
	render: args => {
		const [style, setStyle] = useState<Set<string | number> | 'all'>(
			new Set(['bold'])
		)
		const [align, setAlign] = useState<Key | null>('left')

		return (
			<Menu.Root gap={args.gap}>
				<Menu.Trigger asChild>
					<Button variant="ghost">Menu</Button>
				</Menu.Trigger>

				<Portal>
					<Menu.Positioner>
						<Menu.Content data-testid="content">
							<Menu.ItemGroup>
								<Menu.ItemGroupLabel>Font style</Menu.ItemGroupLabel>
								<Menu.OptionItem
									checked={style !== 'all' && style.has('bold')}
									type="checkbox"
									value="bold"
									onCheckedChange={checked => {
										setStyle(prev => {
											const next = new Set(prev === 'all' ? [] : prev)

											if (checked) {
												next.add('bold')
											} else {
												next.delete('bold')
											}

											return next
										})
									}}
									closeOnSelect={false}
								>
									<Menu.ItemIndicator>
										<Icon name="check" />
									</Menu.ItemIndicator>
									<Menu.ItemText>Bold</Menu.ItemText>
								</Menu.OptionItem>

								<Menu.OptionItem
									checked={style !== 'all' && style.has('italic')}
									type="checkbox"
									value="italic"
									onCheckedChange={checked => {
										setStyle(prev => {
											const next = new Set(prev === 'all' ? [] : prev)

											if (checked) {
												next.add('italic')
											} else {
												next.delete('italic')
											}

											return next
										})
									}}
									closeOnSelect={false}
								>
									<Menu.ItemIndicator>
										<Icon name="check" />
									</Menu.ItemIndicator>
									<Menu.ItemText>Italic</Menu.ItemText>
								</Menu.OptionItem>

								<Menu.OptionItem
									checked={style !== 'all' && style.has('underline')}
									type="checkbox"
									value="underline"
									onCheckedChange={checked => {
										setStyle(prev => {
											const next = new Set(prev === 'all' ? [] : prev)

											if (checked) {
												next.add('underline')
											} else {
												next.delete('underline')
											}

											return next
										})
									}}
									closeOnSelect={false}
								>
									<Menu.ItemIndicator>
										<Icon name="check" />
									</Menu.ItemIndicator>
									<Menu.ItemText>Underline</Menu.ItemText>
								</Menu.OptionItem>
							</Menu.ItemGroup>

							<Menu.ItemGroup>
								<Menu.ItemGroupLabel>Paragraph alignment</Menu.ItemGroupLabel>
								<Menu.OptionItem
									checked={align === 'left'}
									type="radio"
									value="left"
									onCheckedChange={checked => {
										if (checked) setAlign('left')
									}}
									closeOnSelect={false}
								>
									<Menu.ItemIndicator>
										<Icon name="check" />
									</Menu.ItemIndicator>
									<Menu.ItemText>Left</Menu.ItemText>
								</Menu.OptionItem>

								<Menu.OptionItem
									checked={align === 'center'}
									type="radio"
									value="center"
									onCheckedChange={checked => {
										if (checked) setAlign('center')
									}}
									closeOnSelect={false}
								>
									<Menu.ItemIndicator>
										<Icon name="check" />
									</Menu.ItemIndicator>
									<Menu.ItemText>Center</Menu.ItemText>
								</Menu.OptionItem>

								<Menu.OptionItem
									checked={align === 'right'}
									type="radio"
									value="right"
									onCheckedChange={checked => {
										if (checked) setAlign('right')
									}}
									closeOnSelect={false}
								>
									<Menu.ItemIndicator>
										<Icon name="check" />
									</Menu.ItemIndicator>
									<Menu.ItemText>Right</Menu.ItemText>
								</Menu.OptionItem>
							</Menu.ItemGroup>
						</Menu.Content>
					</Menu.Positioner>
				</Portal>
			</Menu.Root>
		)
	},
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement)
		const trigger = canvas.getByRole('button', { name: 'Menu' })

		trigger.focus()

		await userEvent.keyboard('{Enter}')

		const menu = await screen.findByTestId('content')
		await expect(menu).toBeVisible()

		const boldItem = screen.getByRole('menuitemcheckbox', { name: 'Bold' })
		const italicItem = screen.getByRole('menuitemcheckbox', {
			name: 'Italic'
		})
		const underlineItem = screen.getByRole('menuitemcheckbox', {
			name: 'Underline'
		})

		await expect(boldItem).toHaveAttribute('aria-checked', 'true')
		await expect(italicItem).toHaveAttribute('aria-checked', 'false')
		await expect(underlineItem).toHaveAttribute('aria-checked', 'false')

		await userEvent.click(italicItem)
		await expect(italicItem).toHaveAttribute('aria-checked', 'true')
		await userEvent.click(underlineItem)
		await expect(underlineItem).toHaveAttribute('aria-checked', 'true')

		await userEvent.click(italicItem)
		await expect(italicItem).toHaveAttribute('aria-checked', 'false')
		await userEvent.click(underlineItem)
		await expect(underlineItem).toHaveAttribute('aria-checked', 'false')

		const leftItem = screen.getByRole('menuitemradio', { name: 'Left' })
		const centerItem = screen.getByRole('menuitemradio', { name: 'Center' })
		const rightItem = screen.getByRole('menuitemradio', { name: 'Right' })

		await expect(leftItem).toHaveAttribute('aria-checked', 'true')
		await expect(centerItem).toHaveAttribute('aria-checked', 'false')
		await expect(rightItem).toHaveAttribute('aria-checked', 'false')

		await userEvent.click(centerItem)
		await expect(leftItem).toHaveAttribute('aria-checked', 'false')
		await expect(centerItem).toHaveAttribute('aria-checked', 'true')
		await expect(rightItem).toHaveAttribute('aria-checked', 'false')

		await userEvent.click(leftItem)
		await expect(leftItem).toHaveAttribute('aria-checked', 'true')
		await expect(rightItem).toHaveAttribute('aria-checked', 'false')
		await expect(centerItem).toHaveAttribute('aria-checked', 'false')

		await userEvent.keyboard('{Escape}')

		await waitFor(async () => {
			await expect(screen.queryByRole('menu')).toBeNull()
		})

		await waitFor(async () => {
			await expect(trigger).toHaveFocus()
		})

		trigger.blur()
	}
}

/**
 * Demonstrates the creation of cascading submenus. It uses the
 * `Menu.TriggerItem` component alongside new `Menu.Root` and `Portal` contexts to
 * reveal additional options across multiple navigable hierarchical layers.
 */
export const Nested: Story = {
	...Template,
	parameters: {
		controls: {
			disable: true
		}
	},
	render: () => {
		return (
			<Menu.Root>
				<Menu.Trigger asChild>
					<Button variant="ghost">Menu</Button>
				</Menu.Trigger>

				<Portal>
					<Menu.Positioner>
						<Menu.Content data-testid="content-root">
							<Menu.Surface>
								<Menu.Item value="note_add">New file</Menu.Item>
								<Menu.Item value="file_open">Open file...</Menu.Item>
								<Menu.Item value="folder_open">Open folder...</Menu.Item>

								<Menu.Separator />

								<Menu.Root>
									<Menu.TriggerItem trailingIcon={<Icon name="arrow_right" />}>
										Edit
									</Menu.TriggerItem>
									<Portal>
										<Menu.Positioner>
											<Menu.Content data-testid="content-edit">
												<Menu.Surface>
													<Menu.Item value="undo">Undo</Menu.Item>
													<Menu.Item value="redo">Redo</Menu.Item>

													<Menu.Root>
														<Menu.TriggerItem
															trailingIcon={<Icon name="arrow_right" />}
														>
															Clipboard
														</Menu.TriggerItem>

														<Portal>
															<Menu.Positioner>
																<Menu.Content data-testid="content-clipboard">
																	<Menu.Surface>
																		<Menu.Item value="content_cut">
																			Cut
																		</Menu.Item>
																		<Menu.Item value="content_copy">
																			Copy
																		</Menu.Item>
																		<Menu.Item value="content_paste">
																			Paste
																		</Menu.Item>
																	</Menu.Surface>
																</Menu.Content>
															</Menu.Positioner>
														</Portal>
													</Menu.Root>
												</Menu.Surface>
											</Menu.Content>
										</Menu.Positioner>
									</Portal>
								</Menu.Root>

								<Menu.Root>
									<Menu.TriggerItem trailingIcon={<Icon name="arrow_right" />}>
										Selection
									</Menu.TriggerItem>

									<Portal>
										<Menu.Positioner>
											<Menu.Content data-testid="content-selection">
												<Menu.Surface>
													<Menu.Item value="select_all">Select all</Menu.Item>
													<Menu.Item value="open_in_full">
														Expand selection
													</Menu.Item>
													<Menu.Item value="close_fullscreen">
														Shrink selection
													</Menu.Item>
												</Menu.Surface>
											</Menu.Content>
										</Menu.Positioner>
									</Portal>
								</Menu.Root>
							</Menu.Surface>
						</Menu.Content>
					</Menu.Positioner>
				</Portal>
			</Menu.Root>
		)
	},
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement)
		const rootTrigger = canvas.getByRole('button', { name: 'Menu' })

		rootTrigger.focus()

		await userEvent.keyboard('{Enter}')

		const rootContent = await screen.findByTestId('content-root')
		await expect(rootContent).toBeVisible()

		await waitFor(
			async () =>
				await expect(
					within(rootContent).getByRole('menuitem', { name: 'New file' })
				).toHaveAttribute('data-highlighted')
		)

		await userEvent.keyboard('{ArrowDown}')
		await waitFor(
			async () =>
				await expect(
					within(rootContent).getByRole('menuitem', { name: 'Open file...' })
				).toHaveAttribute('data-highlighted')
		)
		await userEvent.keyboard('{ArrowDown}')
		await waitFor(async () => {
			await expect(
				within(rootContent).getByRole('menuitem', { name: 'Open folder...' })
			).toHaveAttribute('data-highlighted')
		})
		await userEvent.keyboard('{ArrowDown}')
		await waitFor(async () => {
			await expect(
				within(rootContent).getByRole('menuitem', { name: 'Edit' })
			).toHaveAttribute('data-highlighted')
		})

		await userEvent.keyboard('{Enter}')

		const editContent = await screen.findByTestId('content-edit')
		await expect(editContent).toBeVisible()

		await waitFor(
			async () =>
				await expect(
					within(editContent).getByRole('menuitem', { name: 'Undo' })
				).toHaveAttribute('data-highlighted')
		)

		await userEvent.keyboard('{ArrowDown}')
		await waitFor(
			async () =>
				await expect(
					within(editContent).getByRole('menuitem', { name: 'Redo' })
				).toHaveAttribute('data-highlighted')
		)
		await userEvent.keyboard('{ArrowDown}')
		await waitFor(async () => {
			await expect(
				within(editContent).getByRole('menuitem', { name: 'Clipboard' })
			).toHaveAttribute('data-highlighted')
		})

		await userEvent.keyboard('{Enter}')

		const clipboardContent = await screen.findByTestId('content-clipboard')
		await expect(clipboardContent).toBeVisible()

		await waitFor(
			async () =>
				await expect(
					within(clipboardContent).getByRole('menuitem', { name: 'Cut' })
				).toHaveAttribute('data-highlighted')
		)

		await userEvent.keyboard('{Escape}')
		await waitFor(async () => {
			await expect(
				within(editContent).getByRole('menuitem', { name: 'Clipboard' })
			).toHaveAttribute('data-highlighted')
		})
		await userEvent.keyboard('{Escape}')
		await waitFor(async () => {
			await expect(
				within(rootContent).getByRole('menuitem', { name: 'Edit' })
			).toHaveAttribute('data-highlighted')
		})
		await userEvent.keyboard('{ArrowDown}')
		await waitFor(async () => {
			await expect(
				within(rootContent).getByRole('menuitem', { name: 'Selection' })
			).toHaveAttribute('data-highlighted')
		})

		await userEvent.keyboard('{Enter}')

		const selectionContent = await screen.findByTestId('content-selection')
		await expect(selectionContent).toBeVisible()

		await waitFor(async () => {
			await expect(
				within(selectionContent).getByRole('menuitem', { name: 'Select all' })
			).toHaveAttribute('data-highlighted')
		})

		await userEvent.keyboard('{Escape}')
		await waitFor(async () => {
			await expect(
				within(rootContent).getByRole('menuitem', { name: 'Selection' })
			).toHaveAttribute('data-highlighted')
		})
		await userEvent.keyboard('{Escape}')

		await waitFor(async () => {
			await expect(screen.queryByTestId('content-clipboard')).not.toBeVisible()
			await expect(screen.queryByTestId('content-edit')).not.toBeVisible()
			await expect(screen.queryByTestId('content-selection')).not.toBeVisible()
			await expect(screen.queryByTestId('content-root')).not.toBeVisible()
		})

		await waitFor(async () => {
			await expect(rootTrigger).toHaveFocus()
		})

		rootTrigger.blur()
	}
}

/**
 * Incorporates a visual directional indicator (`Menu.Arrow`) that bridges the
 * spatial relationship between the floating menu and its reference trigger,
 * adapting automatically to placement shifts across nested submenus.
 */
export const WithArrow: Story = {
	...Template,
	parameters: {
		controls: {
			disable: true
		}
	},
	render: () => {
		return (
			<Menu.Root>
				<Menu.Trigger asChild>
					<Button variant="ghost">Menu</Button>
				</Menu.Trigger>

				<Portal>
					<Menu.Positioner>
						<Menu.Content data-testid="content-root">
							<Menu.Arrow>
								<Menu.ArrowTip />
							</Menu.Arrow>

							<Menu.Surface>
								<Menu.Item value="note_add">New file</Menu.Item>
								<Menu.Item value="file_open">Open file...</Menu.Item>
								<Menu.Item value="folder_open">Open folder...</Menu.Item>

								<Menu.Separator />

								<Menu.Root>
									<Menu.TriggerItem trailingIcon={<Icon name="arrow_right" />}>
										Edit
									</Menu.TriggerItem>

									<Portal>
										<Menu.Positioner>
											<Menu.Content data-testid="content-edit">
												<Menu.Arrow>
													<Menu.ArrowTip />
												</Menu.Arrow>

												<Menu.Surface>
													<Menu.Item value="undo">Undo</Menu.Item>
													<Menu.Item value="redo">Redo</Menu.Item>

													<Menu.Root>
														<Menu.TriggerItem
															trailingIcon={<Icon name="arrow_right" />}
														>
															Clipboard
														</Menu.TriggerItem>

														<Portal>
															<Menu.Positioner>
																<Menu.Content data-testid="content-clipboard">
																	<Menu.Arrow>
																		<Menu.ArrowTip />
																	</Menu.Arrow>

																	<Menu.Surface>
																		<Menu.Item value="content_cut">
																			Cut
																		</Menu.Item>
																		<Menu.Item value="content_copy">
																			Copy
																		</Menu.Item>
																		<Menu.Item value="content_paste">
																			Paste
																		</Menu.Item>
																	</Menu.Surface>
																</Menu.Content>
															</Menu.Positioner>
														</Portal>
													</Menu.Root>
												</Menu.Surface>
											</Menu.Content>
										</Menu.Positioner>
									</Portal>
								</Menu.Root>

								<Menu.Root>
									<Menu.TriggerItem trailingIcon={<Icon name="arrow_right" />}>
										Selection
									</Menu.TriggerItem>

									<Portal>
										<Menu.Positioner>
											<Menu.Content data-testid="content-selection">
												<Menu.Arrow>
													<Menu.ArrowTip />
												</Menu.Arrow>

												<Menu.Surface>
													<Menu.Item value="select_all">Select all</Menu.Item>
													<Menu.Item value="open_in_full">
														Expand selection
													</Menu.Item>
													<Menu.Item value="close_fullscreen">
														Shrink selection
													</Menu.Item>
												</Menu.Surface>
											</Menu.Content>
										</Menu.Positioner>
									</Portal>
								</Menu.Root>
							</Menu.Surface>
						</Menu.Content>
					</Menu.Positioner>
				</Portal>
			</Menu.Root>
		)
	},
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement)
		const rootTrigger = canvas.getByRole('button', { name: 'Menu' })

		rootTrigger.focus()

		await userEvent.keyboard('{Enter}')

		const rootContent = await screen.findByTestId('content-root')
		await expect(rootContent).toBeVisible()
		const rootArrow = rootContent.querySelector('[data-part="arrow"]')
		const rootArrowTip = rootContent.querySelector('[data-part="arrow-tip"]')
		await expect(rootArrow).toBeVisible()
		await expect(rootArrowTip).toBeVisible()

		await waitFor(
			async () =>
				await expect(
					within(rootContent).getByRole('menuitem', { name: 'New file' })
				).toHaveAttribute('data-highlighted')
		)

		await userEvent.keyboard('{ArrowDown}')
		await waitFor(
			async () =>
				await expect(
					within(rootContent).getByRole('menuitem', { name: 'Open file...' })
				).toHaveAttribute('data-highlighted')
		)
		await userEvent.keyboard('{ArrowDown}')
		await waitFor(async () => {
			await expect(
				within(rootContent).getByRole('menuitem', { name: 'Open folder...' })
			).toHaveAttribute('data-highlighted')
		})
		await userEvent.keyboard('{ArrowDown}')
		await waitFor(async () => {
			await expect(
				within(rootContent).getByRole('menuitem', { name: 'Edit' })
			).toHaveAttribute('data-highlighted')
		})

		await userEvent.keyboard('{Enter}')

		const editContent = await screen.findByTestId('content-edit')
		await expect(editContent).toBeVisible()
		const editArrow = editContent.querySelector('[data-part="arrow"]')
		const editArrowTip = editContent.querySelector('[data-part="arrow-tip"]')
		await expect(editArrow).toBeVisible()
		await expect(editArrowTip).toBeVisible()

		await waitFor(
			async () =>
				await expect(
					within(editContent).getByRole('menuitem', { name: 'Undo' })
				).toHaveAttribute('data-highlighted')
		)

		await userEvent.keyboard('{ArrowDown}')
		await waitFor(
			async () =>
				await expect(
					within(editContent).getByRole('menuitem', { name: 'Redo' })
				).toHaveAttribute('data-highlighted')
		)
		await userEvent.keyboard('{ArrowDown}')
		await waitFor(async () => {
			await expect(
				within(editContent).getByRole('menuitem', { name: 'Clipboard' })
			).toHaveAttribute('data-highlighted')
		})

		await userEvent.keyboard('{Enter}')

		const clipboardContent = await screen.findByTestId('content-clipboard')
		await expect(clipboardContent).toBeVisible()
		const clipboardArrow = clipboardContent.querySelector('[data-part="arrow"]')
		const clipboardArrowTip = clipboardContent.querySelector(
			'[data-part="arrow-tip"]'
		)
		await expect(clipboardArrow).toBeVisible()
		await expect(clipboardArrowTip).toBeVisible()

		await waitFor(
			async () =>
				await expect(
					within(clipboardContent).getByRole('menuitem', { name: 'Cut' })
				).toHaveAttribute('data-highlighted')
		)

		await userEvent.keyboard('{Escape}')
		await waitFor(async () => {
			await expect(
				within(editContent).getByRole('menuitem', { name: 'Clipboard' })
			).toHaveAttribute('data-highlighted')
		})
		await userEvent.keyboard('{Escape}')
		await waitFor(async () => {
			await expect(
				within(rootContent).getByRole('menuitem', { name: 'Edit' })
			).toHaveAttribute('data-highlighted')
		})
		await userEvent.keyboard('{ArrowDown}')
		await waitFor(async () => {
			await expect(
				within(rootContent).getByRole('menuitem', { name: 'Selection' })
			).toHaveAttribute('data-highlighted')
		})

		await userEvent.keyboard('{Enter}')

		const selectionContent = await screen.findByTestId('content-selection')
		await expect(selectionContent).toBeVisible()
		const selectionArrow = selectionContent.querySelector('[data-part="arrow"]')
		const selectionArrowTip = selectionContent.querySelector(
			'[data-part="arrow-tip"]'
		)
		await expect(selectionArrow).toBeVisible()
		await expect(selectionArrowTip).toBeVisible()

		await waitFor(async () => {
			await expect(
				within(selectionContent).getByRole('menuitem', { name: 'Select all' })
			).toHaveAttribute('data-highlighted')
		})

		await userEvent.keyboard('{Escape}')
		await waitFor(async () => {
			await expect(
				within(rootContent).getByRole('menuitem', { name: 'Selection' })
			).toHaveAttribute('data-highlighted')
		})
		await userEvent.keyboard('{Escape}')

		await waitFor(async () => {
			await expect(screen.queryByTestId('content-clipboard')).not.toBeVisible()
			await expect(screen.queryByTestId('content-edit')).not.toBeVisible()
			await expect(screen.queryByTestId('content-selection')).not.toBeVisible()
			await expect(screen.queryByTestId('content-root')).not.toBeVisible()
		})

		await waitFor(async () => {
			await expect(rootTrigger).toHaveFocus()
		})

		rootTrigger.blur()
	}
}

type MenuItem = {
	value: string
	label: string
	items?: MenuItem[]
}

/**
 * An advanced composition pattern where a single `Menu.Root` manages multiple
 * triggers simultaneously. It dynamically swaps the rendered content based on
 * the onTriggerValueChange event and the active trigger's value, optimizing DOM
 * nodes for iterative lists.
 */
export const SharedContent: Story = {
	...Template,
	parameters: {
		controls: {
			include: ['onTriggerValueChange']
		}
	},
	render: args => {
		const [activeMenu, setActiveMenu] = useState<MenuItem>()

		const menus: MenuItem[] = [
			{
				value: 'file',
				label: 'File',
				items: [
					{ value: 'note_add', label: 'New file' },
					{ value: 'file_open', label: 'Open file...' },
					{ value: 'folder_open', label: 'Open folder...' }
				]
			},
			{
				value: 'edit',
				label: 'Edit',
				items: [
					{ value: 'content_cut', label: 'Cut' },
					{ value: 'content_copy', label: 'Copy' },
					{ value: 'content_paste', label: 'Paste' }
				]
			}
		]

		function renderItem(item: MenuItem) {
			if (item.items?.length) {
				return (
					<Menu.Root key={item.value}>
						<Menu.TriggerItem trailingIcon={<Icon name="arrow_right" />}>
							{item.label}
						</Menu.TriggerItem>

						<Portal>
							<Menu.Positioner>
								<Menu.Content>
									<Menu.Surface>{item.items.map(renderItem)}</Menu.Surface>
								</Menu.Content>
							</Menu.Positioner>
						</Portal>
					</Menu.Root>
				)
			}

			return (
				<Menu.Item key={item.value} value={item.value}>
					{item.label}
				</Menu.Item>
			)
		}

		return (
			<Menu.Root
				onTriggerValueChange={({ triggerElement, value }) => {
					args.onTriggerValueChange?.({ triggerElement, value })
					setActiveMenu(menus.find(t => t.value === value))
				}}
			>
				<div className={css({ display: 'flex', gap: '2' })}>
					{menus.map(menu => (
						<Menu.Trigger asChild key={menu.value} value={menu.value}>
							<Button variant="ghost">{menu.label}</Button>
						</Menu.Trigger>
					))}
				</div>

				<Portal>
					<Menu.Positioner>
						<Menu.Content>
							<Menu.Surface>{activeMenu?.items?.map(renderItem)}</Menu.Surface>
						</Menu.Content>
					</Menu.Positioner>
				</Portal>
			</Menu.Root>
		)
	},
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement)
		const fileTrigger = canvas.getByRole('button', { name: 'File' })
		const editTrigger = canvas.getByRole('button', { name: 'Edit' })

		await userEvent.click(fileTrigger)

		const content = await screen.findByRole('menu')
		await expect(content).toBeVisible()

		await expect(
			await within(content).findByRole('menuitem', { name: 'New file' })
		).toBeInTheDocument()

		await userEvent.click(editTrigger)

		await expect(
			await within(content).findByRole('menuitem', { name: 'Cut' })
		).toBeInTheDocument()

		await userEvent.click(editTrigger)

		await waitFor(async () => {
			await expect(screen.queryByRole('menu')).toBeNull()
		})

		await waitFor(async () => {
			await expect(editTrigger).toHaveFocus()
		})

		editTrigger.blur()
	}
}

/**
 * Demonstrates the inversion of control pattern via `useMenu` and
 * `Menu.RootProvider`. Essential for when the menu's state logic
 * must be hoisted, managed externally, or integrated with decoupled contexts.
 */
export const RootProvider: Story = {
	...Template,
	parameters: {
		controls: {
			exclude: ['children']
		}
	},
	render: args => {
		const menuApi = useMenu(args)

		return (
			<Menu.RootProvider {...menuApi}>
				<Menu.Trigger asChild>
					<Button variant="ghost">Menu</Button>
				</Menu.Trigger>

				<Portal>
					<Menu.Positioner>
						<Menu.Content data-testid="content">
							<Menu.Surface>
								<Menu.Item value="note_add">New file</Menu.Item>
								<Menu.Item value="file_open">Open file...</Menu.Item>
								<Menu.Item value="folder_open">Open folder...</Menu.Item>
							</Menu.Surface>
						</Menu.Content>
					</Menu.Positioner>
				</Portal>
			</Menu.RootProvider>
		)
	},
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement)
		const trigger = canvas.getByRole('button', { name: 'Menu' })

		await expect(trigger).toHaveAttribute('aria-haspopup', 'menu')
		await expect(trigger).toHaveAttribute('aria-expanded', 'false')
		await expect(
			await screen.findByRole('menu', { hidden: true })
		).not.toBeVisible()

		await userEvent.click(trigger)

		const menu = await screen.findByRole('menu')
		await expect(menu).toBeVisible()
		await expect(trigger).toHaveAttribute('aria-expanded', 'true')
		await expect(within(menu).getAllByRole('menuitem')).toHaveLength(3)

		await userEvent.keyboard('{ArrowDown}')
		await waitFor(
			async () =>
				await expect(
					screen.getByRole('menuitem', { name: 'New file' })
				).toHaveAttribute('data-highlighted')
		)

		await userEvent.keyboard('{Escape}')

		await waitFor(async () => {
			await expect(screen.queryByRole('menu')).toBeNull()
		})

		await waitFor(async () => {
			await expect(trigger).toHaveFocus()
			await expect(trigger).toHaveAttribute('aria-expanded', 'false')
		})

		trigger.blur()
	}
}

/**
 * Integrates the menu with a `Presence.Root` wrapper and a `Portal` to
 * orchestrate smooth, CSS-based entrance and exit animations. Transitions are
 * intelligently choreographed to adapt to the `data-placement` spatial
 * orientation (e.g., slide-from-bottom, scale-in).
 */
export const WithAnimation: Story = {
	...Template,
	parameters: {
		controls: {
			disable: true
		}
	},
	render: () => {
		return (
			<Menu.Root>
				{({ open }) => {
					return (
						<>
							<Menu.Trigger asChild>
								<Button variant="ghost">Menu</Button>
							</Menu.Trigger>

							<Presence.Root present={open}>
								{({ shouldUnmount }) => {
									return (
										!shouldUnmount && (
											<Portal>
												<Menu.Positioner>
													<Presence.Gate
														asChild
														className={css({
															'&[data-placement^=top]': {
																'--slide-offset-y': 'var(--spacing-2)'
															},
															'&[data-placement^=bottom]': {
																'--slide-offset-y':
																	'calc(var(--spacing-2) * -1)'
															},
															'&[data-placement^=left]': {
																'--slide-offset-x': 'var(--spacing-2)'
															},
															'&[data-placement^=right]': {
																'--slide-offset-x':
																	'calc(var(--spacing-2) * -1)'
															},
															_open: {
																willChange:
																	'inset-block-start, inset-inline-start, opacity',
																animationDuration: '500ms, 200ms',
																animationName: 'slide-in, fade-in',
																animationTimingFunction:
																	'var(--easings-m3-exp-spatial), var(--easings-m3-exp-effects)'
															},
															_closed: {
																animationDuration: '350ms, 150ms',
																animationName: 'slide-out, fade-out',
																animationTimingFunction:
																	'var(--easings-m3-exp-fast-spatial), var(--easings-m3-exp-fast-effects)'
															}
														})}
													>
														<Menu.Content data-testid="content">
															<Menu.Surface>
																<Menu.Item
																	value="note_add"
																	leadingIcon={<Icon name="note_add" />}
																	trailingText="Ctrl+N"
																>
																	New file
																</Menu.Item>
																<Menu.Item
																	value="file_open"
																	leadingIcon={<Icon name="file_open" />}
																	trailingText="Ctrl+O"
																>
																	Open file...
																</Menu.Item>
																<Menu.Item
																	value="folder_open"
																	leadingIcon={<Icon name="folder_open" />}
																	trailingText="Ctrl+K+O"
																>
																	Open folder...
																</Menu.Item>

																<Menu.Separator />

																<Menu.Root>
																	{({ open }) => {
																		return (
																			<>
																				<Menu.TriggerItem
																					leadingIcon={<Icon name="edit" />}
																					trailingIcon={
																						<Icon name="arrow_right" />
																					}
																				>
																					Edit
																				</Menu.TriggerItem>

																				<Presence.Root present={open}>
																					{({ shouldUnmount }) => {
																						return (
																							!shouldUnmount && (
																								<Portal>
																									<Menu.Positioner>
																										<Presence.Gate
																											asChild
																											className={css({
																												'&[data-placement^=top]':
																													{
																														'--slide-offset-y':
																															'var(--spacing-2)'
																													},
																												'&[data-placement^=bottom]':
																													{
																														'--slide-offset-y':
																															'calc(var(--spacing-2) * -1)'
																													},
																												'&[data-placement^=left]':
																													{
																														'--slide-offset-x':
																															'var(--spacing-2)'
																													},
																												'&[data-placement^=right]':
																													{
																														'--slide-offset-x':
																															'calc(var(--spacing-2) * -1)'
																													},
																												_open: {
																													willChange:
																														'inset-block-start, inset-inline-start, opacity',
																													animationDuration:
																														'500ms, 200ms',
																													animationName:
																														'slide-in, fade-in',
																													animationTimingFunction:
																														'var(--easings-m3-exp-spatial), var(--easings-m3-exp-effects)'
																												},
																												_closed: {
																													animationDuration:
																														'350ms, 150ms',
																													animationName:
																														'slide-out, fade-out',
																													animationTimingFunction:
																														'var(--easings-m3-exp-fast-spatial), var(--easings-m3-exp-fast-effects)'
																												}
																											})}
																										>
																											<Menu.Content>
																												<Menu.Surface>
																													<Menu.Item
																														leadingIcon={
																															<Icon name="undo" />
																														}
																														value="undo"
																														trailingText="Ctrl+Z"
																													>
																														Undo
																													</Menu.Item>
																													<Menu.Item
																														leadingIcon={
																															<Icon name="redo" />
																														}
																														value="redo"
																														trailingText="Ctrl+Shift+Z"
																													>
																														Redo
																													</Menu.Item>

																													<Menu.Root>
																														{({ open }) => {
																															return (
																																<>
																																	<Menu.TriggerItem
																																		leadingIcon={
																																			<Icon name="assignment" />
																																		}
																																		trailingIcon={
																																			<Icon name="arrow_right" />
																																		}
																																	>
																																		Clipboard
																																	</Menu.TriggerItem>

																																	<Presence.Root
																																		present={
																																			open
																																		}
																																	>
																																		{({
																																			shouldUnmount
																																		}) => {
																																			return (
																																				!shouldUnmount && (
																																					<Portal>
																																						<Menu.Positioner>
																																							<Presence.Gate
																																								asChild
																																								className={css(
																																									{
																																										'&[data-placement^=top]':
																																											{
																																												'--slide-offset-y':
																																													'var(--spacing-2)'
																																											},
																																										'&[data-placement^=bottom]':
																																											{
																																												'--slide-offset-y':
																																													'calc(var(--spacing-2) * -1)'
																																											},
																																										'&[data-placement^=left]':
																																											{
																																												'--slide-offset-x':
																																													'var(--spacing-2)'
																																											},
																																										'&[data-placement^=right]':
																																											{
																																												'--slide-offset-x':
																																													'calc(var(--spacing-2) * -1)'
																																											},
																																										_open:
																																											{
																																												willChange:
																																													'inset-block-start, inset-inline-start, opacity',
																																												animationDuration:
																																													'500ms, 200ms',
																																												animationName:
																																													'slide-in, fade-in',
																																												animationTimingFunction:
																																													'var(--easings-m3-exp-spatial), var(--easings-m3-exp-effects)'
																																											},
																																										_closed:
																																											{
																																												animationDuration:
																																													'350ms, 150ms',
																																												animationName:
																																													'slide-out, fade-out',
																																												animationTimingFunction:
																																													'var(--easings-m3-exp-fast-spatial), var(--easings-m3-exp-fast-effects)'
																																											}
																																									}
																																								)}
																																							>
																																								<Menu.Content>
																																									<Menu.Surface>
																																										<Menu.Item
																																											leadingIcon={
																																												<Icon name="content_cut" />
																																											}
																																											value="content_cut"
																																											trailingText="Ctrl+X"
																																										>
																																											Cut
																																										</Menu.Item>
																																										<Menu.Item
																																											leadingIcon={
																																												<Icon name="content_copy" />
																																											}
																																											value="content_copy"
																																											trailingText="Ctrl+C"
																																										>
																																											Copy
																																										</Menu.Item>
																																										<Menu.Item
																																											leadingIcon={
																																												<Icon name="content_paste" />
																																											}
																																											value="content_paste"
																																											trailingText="Ctrl+V"
																																										>
																																											Paste
																																										</Menu.Item>
																																									</Menu.Surface>
																																								</Menu.Content>
																																							</Presence.Gate>
																																						</Menu.Positioner>
																																					</Portal>
																																				)
																																			)
																																		}}
																																	</Presence.Root>
																																</>
																															)
																														}}
																													</Menu.Root>
																												</Menu.Surface>
																											</Menu.Content>
																										</Presence.Gate>
																									</Menu.Positioner>
																								</Portal>
																							)
																						)
																					}}
																				</Presence.Root>
																			</>
																		)
																	}}
																</Menu.Root>
																<Menu.Root>
																	{({ open }) => {
																		return (
																			<>
																				<Menu.TriggerItem
																					leadingIcon={<Icon name="select" />}
																					trailingIcon={
																						<Icon name="arrow_right" />
																					}
																				>
																					Selection
																				</Menu.TriggerItem>

																				<Presence.Root present={open}>
																					{({ shouldUnmount }) => {
																						return (
																							!shouldUnmount && (
																								<Portal>
																									<Menu.Positioner>
																										<Presence.Gate
																											asChild
																											className={css({
																												'&[data-placement^=top]':
																													{
																														'--slide-offset-y':
																															'var(--spacing-2)'
																													},
																												'&[data-placement^=bottom]':
																													{
																														'--slide-offset-y':
																															'calc(var(--spacing-2) * -1)'
																													},
																												'&[data-placement^=left]':
																													{
																														'--slide-offset-x':
																															'var(--spacing-2)'
																													},
																												'&[data-placement^=right]':
																													{
																														'--slide-offset-x':
																															'calc(var(--spacing-2) * -1)'
																													},
																												_open: {
																													willChange:
																														'inset-block-start, inset-inline-start, opacity',
																													animationDuration:
																														'500ms, 200ms',
																													animationName:
																														'slide-in, fade-in',
																													animationTimingFunction:
																														'var(--easings-m3-exp-spatial), var(--easings-m3-exp-effects)'
																												},
																												_closed: {
																													animationDuration:
																														'350ms, 150ms',
																													animationName:
																														'slide-out, fade-out',
																													animationTimingFunction:
																														'var(--easings-m3-exp-fast-spatial), var(--easings-m3-exp-fast-effects)'
																												}
																											})}
																										>
																											<Menu.Content>
																												<Menu.Surface>
																													<Menu.Item
																														leadingIcon={
																															<Icon name="select_all" />
																														}
																														value="select_all"
																														trailingText="Ctrl+A"
																													>
																														Select all
																													</Menu.Item>
																													<Menu.Item
																														leadingIcon={
																															<Icon name="open_in_full" />
																														}
																														value="open_in_full"
																														trailingText="Shift+Alt+→"
																													>
																														Expand selection
																													</Menu.Item>
																													<Menu.Item
																														leadingIcon={
																															<Icon name="close_fullscreen" />
																														}
																														value="close_fullscreen"
																														trailingText="Shift+Alt+←"
																													>
																														Shrink selection
																													</Menu.Item>
																												</Menu.Surface>
																											</Menu.Content>
																										</Presence.Gate>
																									</Menu.Positioner>
																								</Portal>
																							)
																						)
																					}}
																				</Presence.Root>
																			</>
																		)
																	}}
																</Menu.Root>
															</Menu.Surface>
														</Menu.Content>
													</Presence.Gate>
												</Menu.Positioner>
											</Portal>
										)
									)
								}}
							</Presence.Root>
						</>
					)
				}}
			</Menu.Root>
		)
	},
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement)
		const trigger = canvas.getByRole('button', { name: 'Menu' })

		const onanimationstart = fn()
		const onanimationend = fn()
		document.addEventListener('animationstart', onanimationstart)
		document.addEventListener('animationend', onanimationend)

		try {
			await expect(screen.queryByRole('menu')).toBeNull()

			await userEvent.tab()

			await expect(trigger).toHaveFocus()

			await userEvent.keyboard('{Enter}')

			await waitFor(async () => {
				await expect(onanimationstart).toHaveBeenCalled()
				await expect(onanimationend).toHaveBeenCalled()
			})

			onanimationstart.mockClear()
			onanimationend.mockClear()

			const content = await screen.findByRole('menu')
			await expect(content).toBeVisible()
			await expect(content).toHaveAttribute('data-state', 'open')

			await expect(
				await within(content).findByRole('menuitem', { name: /New file/ })
			).toBeInTheDocument()

			await userEvent.keyboard('{Escape}')

			await expect(content).toHaveAttribute('data-state', 'closed')

			await waitFor(async () => {
				await expect(onanimationstart).toHaveBeenCalled()
				await expect(onanimationend).toHaveBeenCalled()
			})

			await waitFor(async () => {
				await expect(screen.queryByRole('menu')).toBeNull()
			})

			await waitFor(async () => {
				await expect(trigger).toHaveFocus()
				await expect(trigger).toHaveAttribute('aria-expanded', 'false')
			})

			trigger.blur()
		} finally {
			document.removeEventListener('animationstart', onanimationstart)
			document.removeEventListener('animationend', onanimationend)
		}
	}
}
