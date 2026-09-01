import { css } from '@iolita/styled-system/css'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { Portal } from '@zag-js/react'
import { type ComponentProps, useRef, useState } from 'react'
import {
	expect,
	fireEvent,
	fn,
	userEvent,
	waitFor,
	within
} from 'storybook/test'
import { Button } from '../button'
import { Presence } from '../presence'
import { Dialog } from '.'
import { useDialog } from './use-dialog'

type DialogStoryProps = ComponentProps<typeof Dialog.Root>

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
/**
 * A accessible modal dialog component that interrupts the user's current task
 * to present critical information or request user input. It enforces WAI-ARIA
 * dialog and alertdialog patterns, manages focus trapping, and handles viewport
 * scroll prevention.
 */
const meta = {
	title: 'Components/Dialog',
	component: Dialog.Root,
	render: args => (
		<Dialog.Root {...args}>
			<Dialog.Trigger asChild>
				<Button variant="ghost">Dialog</Button>
			</Dialog.Trigger>
			<Dialog.Backdrop />
			<Dialog.Positioner>
				<Dialog.Content>
					<Dialog.Headline>
						<Dialog.Title
							as="h2"
							className={css({
								minHeight: '10',
								justifySelf: 'center',
								textStyle: 'xl',
								paddingBlockStart: 'calc((var(--sizes-10) - 1lh) / 2)'
							})}
						>
							Esse iure
						</Dialog.Title>
						<Dialog.CloseTrigger asChild>
							<Button
								variant="ghost"
								className={css({ padding: 0 })}
								icon={
									<svg
										xmlns="http://www.w3.org/2000/svg"
										viewBox="0 -960 960 960"
										preserveAspectRatio="xMidYMid meet"
										aria-hidden="true"
										fill="currentColor"
									>
										<path d="m249-207-42-42 231-231-231-231 42-42 231 231 231-231 42 42-231 231 231 231-42 42-231-231-231 231Z" />
									</svg>
								}
							/>
						</Dialog.CloseTrigger>
					</Dialog.Headline>
					<Dialog.Description>
						<p>
							Agnitio ultio censura cibus unus vos caterva ventito. Custodia
							demitto delicate textus cotidie cultellus utique.
						</p>
					</Dialog.Description>
					<Dialog.Action>
						<Button variant="ghost">Action</Button>
					</Dialog.Action>
				</Dialog.Content>
			</Dialog.Positioner>
		</Dialog.Root>
	),
	parameters: {
		// Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/configure/story-layout
		layout: 'fullscreen'
	},
	// This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/writing-docs/autodocs
	tags: ['autodocs'],
	// More on argTypes: https://storybook.js.org/docs/api/arg-types
	argTypes: {
		scrollBehavior: {
			control: 'select',
			description: 'Scroll behavior dialog.',
			options: ['inside', 'outside'],
			table: {
				defaultValue: { summary: 'inside' },
				type: { summary: 'inside | outside' }
			}
		},
		placement: {
			control: 'select',
			description: 'Placement dialog.',
			options: ['center', 'top', 'bottom'],
			table: {
				defaultValue: { summary: 'center' },
				type: { summary: 'center | top | bottom' }
			}
		},
		size: {
			control: 'select',
			description: 'Size dialog.',
			options: ['xs', 'sm', 'md', 'lg', 'xl', 'full'],
			table: {
				defaultValue: { summary: 'md' },
				type: { summary: 'xs | sm | md | lg | xl | full' }
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
		id: {
			control: 'text',
			description: 'The unique identifier of the machine.',
			table: {
				type: { summary: 'string' }
			}
		},
		getRootNode: {
			action: 'getRootNode',
			description:
				'A root node to correctly resolve document in custom environments. E.x.: Iframes, Electro.',
			table: {
				type: { summary: '(() => ShadowRoot | Document | Node) | undefined' }
			}
		},
		onEscapeKeyDown: {
			action: 'onEscapeKeyDown',
			description: 'Function called when the escape key is pressed.',
			table: {
				type: { summary: '((event: KeyboardEvent) => void) | undefined' }
			}
		},
		onRequestDismiss: {
			action: 'onRequestDismiss',
			description:
				'Function called when this layer is closed due to a parent layer being closed.',
			table: {
				type: { summary: '((event: LayerDismissEvent) => void) | undefined' }
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
		onFocusOutside: {
			action: 'onFocusOutside',
			description:
				'Function called when the focus is moved outside the component.',
			table: {
				type: { summary: '((event: FocusOutsideEvent) => void) | undefined' }
			}
		},
		onInteractOutside: {
			action: 'onInteractOutside',
			description:
				'Function called when an interaction happens outside the component.',
			table: {
				type: { summary: '((event: InteractOutsideEvent) => void) | undefined' }
			}
		},
		persistentElements: {
			control: false,
			description:
				'Returns the persistent elements that should neither have pointer events disabled nor trigger the dismiss event.',
			table: {
				type: { summary: 'Array<() => Element | null> | undefined' }
			}
		},
		trapFocus: {
			control: false,
			description: "Whether to trap focus inside the dialog when it's opened.",
			table: {
				type: { summary: 'boolean' },
				defaultValue: { summary: 'true' }
			}
		},
		preventScroll: {
			control: false,
			description:
				"Whether to prevent scrolling behind the dialog when it's opened.",
			table: {
				type: { summary: 'boolean' },
				defaultValue: { summary: 'true' }
			}
		},
		modal: {
			control: false,
			description:
				'Whether to prevent pointer interaction outside the element and hide all content below it.',
			table: {
				type: { summary: 'boolean' },
				defaultValue: { summary: 'true' }
			}
		},
		initialFocusEl: {
			control: false,
			description: 'Element to receive focus when the dialog is opened.',
			table: {
				type: { summary: '(() => MaybeElement) | undefined' }
			}
		},
		finalFocusEl: {
			control: false,
			description: 'Element to receive focus when the dialog is closed.',
			table: {
				type: { summary: '(() => MaybeElement) | undefined' }
			}
		},
		restoreFocus: {
			control: 'boolean',
			description:
				'Whether to restore focus to the element that had focus before the dialog was opened.',
			table: {
				type: { summary: 'boolean' }
			}
		},
		closeOnInteractOutside: {
			control: 'boolean',
			description: 'Whether to close the dialog when the outside is clicked.',
			table: {
				defaultValue: { summary: 'true' },
				type: { summary: 'boolean' }
			}
		},
		closeOnEscape: {
			control: 'boolean',
			description:
				'Whether to close the dialog when the escape key is pressed.',
			table: {
				defaultValue: { summary: 'true' },
				type: { summary: 'boolean' }
			}
		},
		'aria-label': {
			control: 'text',
			description:
				'Human readable label for the dialog, in event the dialog title is not rendered.',
			table: {
				type: { summary: 'string | undefined' }
			}
		},
		role: {
			control: 'select',
			description: "The dialog's role.",
			options: ['dialog', 'alertdialog'],
			table: {
				defaultValue: { summary: 'dialog' },
				type: { summary: 'dialog | alertdialog | undefined' }
			}
		},
		open: {
			control: 'boolean',
			description: 'The controlled open state of the dialog.',
			table: {
				type: { summary: 'boolean' }
			}
		},
		defaultOpen: {
			control: 'boolean',
			description:
				"The initial open state of the dialog when rendered. Use when you don't need to control the open state of the dialog.",
			table: {
				defaultValue: { summary: 'false' },
				type: { summary: 'boolean | undefined' }
			}
		},
		onOpenChange: {
			action: 'onOpenChange',
			description: "Function to call when the dialog's open state changes.",
			table: {
				type: { summary: '((details: OpenChangeDetails) => void) | undefined' }
			}
		},
		triggerValue: {
			control: 'text',
			description: 'The controlled active trigger value.',
			table: {
				type: { summary: 'string | null | undefined' }
			}
		},
		defaultTriggerValue: {
			control: 'text',
			description:
				"The initial active trigger value when rendered. Use when you don't need to control the active trigger value.",
			table: {
				type: { summary: 'string | null | undefined' }
			}
		},
		onTriggerValueChange: {
			action: 'onTriggerValueChange',
			description: 'Function to call when the active trigger changes.',
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
		closeOnEscape: true,
		onOpenChange: fn(),
		onTriggerValueChange: fn(),
		placement: 'center',
		size: 'md',
		scrollBehavior: 'inside'
	}
} satisfies Meta<DialogStoryProps>

export default meta
type Story = StoryObj<typeof meta>

const Template: Pick<Story, 'decorators'> = {
	decorators: [
		(Story, context) => (
			<div
				className={css({
					width: '100%',
					height: context.viewMode === 'docs' ? '496px' : '100dvh',
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
 * The standard behavior of the Dialog component. It toggles visibility upon
 * interacting with the trigger, traps focus within the active layer, and
 * automatically dismisses when pressing the Escape key or interacting outside.
 */
export const Overview: Story = {
	...Template,
	parameters: {
		controls: {
			exclude: ['children']
		}
	},
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement)
		const trigger = canvas.getByRole('button', { name: 'Dialog' })

		await waitFor(() => {
			const content = canvasElement.querySelector('[data-part="content"]')
			expect(content).not.toBeVisible()
		})

		await userEvent.tab()

		await expect(trigger).toHaveFocus()

		await userEvent.keyboard('{Enter}')

		await waitFor(() => {
			const content = canvasElement.querySelector('[data-part="content"]')
			expect(content).toBeVisible()
		})

		await userEvent.keyboard('{Escape}')

		await waitFor(() => {
			const content = canvasElement.querySelector('[data-part="content"]')
			expect(content).not.toBeVisible()
		})

		await expect(trigger).toHaveFocus()

		trigger.blur()
	}
}

/**
 * Demonstrates the internal scroll behavior strategy
 * (`scrollBehavior="inside"`). When content exceeds the maximum viewport
 * height, scrolling is contained strictly within the Dialog's description body,
 * keeping the header and footer fixed in place.
 */
export const InsideScroll: Story = {
	...Template,
	parameters: {
		controls: {
			include: ['placement', 'size']
		}
	},
	render: args => {
		return (
			<Dialog.Root {...args}>
				<Dialog.Trigger asChild>
					<Button variant="ghost">Dialog</Button>
				</Dialog.Trigger>
				<Dialog.Backdrop />
				<Dialog.Positioner data-testid="positioner">
					<Dialog.Content data-testid="content">
						<Dialog.Headline>
							<Dialog.Title
								as="h2"
								className={css({
									minHeight: '10',
									justifySelf: 'center',
									textStyle: 'xl',
									paddingBlockStart: 'calc((var(--sizes-10) - 1lh) / 2)'
								})}
							>
								Esse iure
							</Dialog.Title>
							<Dialog.CloseTrigger asChild>
								<Button
									variant="ghost"
									className={css({ padding: 0 })}
									icon={
										<svg
											xmlns="http://www.w3.org/2000/svg"
											viewBox="0 -960 960 960"
											preserveAspectRatio="xMidYMid meet"
											aria-hidden="true"
											fill="currentColor"
										>
											<path d="m249-207-42-42 231-231-231-231 42-42 231 231 231-231 42 42-231 231 231 231-42 42-231-231-231 231Z" />
										</svg>
									}
								/>
							</Dialog.CloseTrigger>
						</Dialog.Headline>
						<Dialog.Description data-testid="description">
							<p>
								Aurum tabernus comburo adulescens abundans. Vetus vel conduco
								contigo catena. Voluptatum natus anser saepe patior. Adsuesco
								timidus ara aegrus careo adiuvo clarus. Spiritus attero vobis
								thymum terminatio. Cavus aureus cado. Complectus sursum varius
								cornu adduco aeger cauda. Bos adfectus ambitus. Cur sordeo amet
								statim adduco adflicto. Volo deludo talio laborum alo averto
								thymum amita corrigo. Tricesimus uter urbs tredecim. Terminatio
								eaque copiose nihil. Caritas abstergo thorax brevis blandior.
								Commemoro minima angelus validus valens arcesso porro. Expedita
								ultio caelum virga suadeo uxor sodalitas crebro. Terebro
								adfectus contego. Videlicet vivo voluptate textus tergo quasi.
								Ex nam tenuis a repellat spiritus. Conspergo acquiro eius nisi
								bellum timor taedium collum. Teneo absens crepusculum cunae cado
								vulnus verto defaeco deludo.
							</p>
						</Dialog.Description>
						<Dialog.Action>
							<Button variant="ghost">Action</Button>
						</Dialog.Action>
					</Dialog.Content>
				</Dialog.Positioner>
			</Dialog.Root>
		)
	},
	play: async ({ args, canvasElement }) => {
		const canvas = within(canvasElement)
		const trigger = canvas.getByRole('button', { name: 'Dialog' })

		await waitFor(() => {
			expect(canvas.getByTestId('content')).not.toBeVisible()
		})

		await userEvent.tab()

		await expect(trigger).toHaveFocus()

		await userEvent.keyboard('{Enter}')

		await waitFor(() => {
			expect(canvas.getByTestId('content')).toBeInTheDocument()
			expect(canvas.getByTestId('content')).toHaveAttribute(
				'data-placement',
				args.placement ?? 'center'
			)
			expect(canvas.getByTestId('positioner')).toHaveStyle({
				overflow: 'hidden'
			})
		})

		await waitFor(() => {
			expect(canvas.getByTestId('description')).toHaveStyle({
				overflow: 'auto'
			})
		})

		const description = canvas.getByTestId('description')
		if (description.scrollHeight > description.clientHeight) {
			fireEvent.scroll(description, { target: { scrollTop: 100 } })
			await waitFor(() => {
				expect(description.scrollTop).toBeGreaterThan(0)
			})
		} else {
			expect(description.scrollHeight).toBeLessThanOrEqual(
				description.clientHeight
			)
		}
	}
}

/**
 * Demonstrates the external scroll behavior strategy
 * (`scrollBehavior="outside"`). When content exceeds the viewport height, the
 * entire Dialog container (positioner) scrolls, simulating a native page scroll
 * experience while maintaining the modal trap.
 */
export const OutsideScroll: Story = {
	...Template,
	args: { scrollBehavior: 'outside' },
	parameters: {
		controls: {
			include: ['placement', 'size']
		}
	},
	render: args => {
		return (
			<Dialog.Root {...args}>
				<Dialog.Trigger asChild>
					<Button variant="ghost">Dialog</Button>
				</Dialog.Trigger>
				<Dialog.Backdrop />
				<Dialog.Positioner data-testid="positioner">
					<Dialog.Content data-testid="content">
						<Dialog.Headline>
							<Dialog.Title
								as="h2"
								className={css({
									minHeight: '10',
									justifySelf: 'center',
									textStyle: 'xl',
									paddingBlockStart: 'calc((var(--sizes-10) - 1lh) / 2)'
								})}
							>
								Esse iure
							</Dialog.Title>
							<Dialog.CloseTrigger asChild>
								<Button
									variant="ghost"
									className={css({ padding: 0 })}
									icon={
										<svg
											xmlns="http://www.w3.org/2000/svg"
											viewBox="0 -960 960 960"
											preserveAspectRatio="xMidYMid meet"
											aria-hidden="true"
											fill="currentColor"
										>
											<path d="m249-207-42-42 231-231-231-231 42-42 231 231 231-231 42 42-231 231 231 231-42 42-231-231-231 231Z" />
										</svg>
									}
								/>
							</Dialog.CloseTrigger>
						</Dialog.Headline>
						<Dialog.Description data-testid="description">
							<p>
								Aurum tabernus comburo adulescens abundans. Vetus vel conduco
								contigo catena. Voluptatum natus anser saepe patior. Adsuesco
								timidus ara aegrus careo adiuvo clarus. Spiritus attero vobis
								thymum terminatio. Cavus aureus cado. Complectus sursum varius
								cornu adduco aeger cauda. Bos adfectus ambitus. Cur sordeo amet
								statim adduco adflicto. Volo deludo talio laborum alo averto
								thymum amita corrigo. Tricesimus uter urbs tredecim. Terminatio
								eaque copiose nihil. Caritas abstergo thorax brevis blandior.
								Commemoro minima angelus validus valens arcesso porro. Expedita
								ultio caelum virga suadeo uxor sodalitas crebro. Terebro
								adfectus contego. Videlicet vivo voluptate textus tergo quasi.
								Ex nam tenuis a repellat spiritus. Conspergo acquiro eius nisi
								bellum timor taedium collum. Teneo absens crepusculum cunae cado
								vulnus verto defaeco deludo.
							</p>
						</Dialog.Description>
						<Dialog.Action>
							<Button variant="ghost">Action</Button>
						</Dialog.Action>
					</Dialog.Content>
				</Dialog.Positioner>
			</Dialog.Root>
		)
	},
	play: async ({ args, canvasElement }) => {
		const canvas = within(canvasElement)
		const trigger = canvas.getByRole('button', { name: 'Dialog' })

		await waitFor(() => {
			expect(canvas.getByTestId('content')).not.toBeVisible()
		})

		await userEvent.tab()

		await expect(trigger).toHaveFocus()

		await userEvent.keyboard('{Enter}')

		await waitFor(() => {
			expect(canvas.getByTestId('content')).toBeInTheDocument()
			expect(canvas.getByTestId('content')).toHaveAttribute(
				'data-placement',
				args.placement ?? 'center'
			)
		})

		await waitFor(() => {
			expect(canvas.getByTestId('positioner')).toHaveStyle({ overflow: 'auto' })
		})

		await waitFor(() => {
			expect(canvas.getByTestId('content')).toHaveStyle({ maxHeight: 'none' })
		})

		const positioner = canvas.getByTestId('positioner')
		if (positioner.scrollHeight > positioner.clientHeight) {
			fireEvent.scroll(positioner, { target: { scrollTop: 100 } })
			await waitFor(() => {
				expect(positioner.scrollTop).toBeGreaterThan(0)
			})
		} else {
			expect(positioner.scrollHeight).toBeLessThanOrEqual(
				positioner.clientHeight
			)
		}
	}
}

/**
 * Illustrates custom focus management upon opening. By defining an
 * `initialFocusEl`, the component bypasses the default behavior of focusing the
 * first interactive element (often the close button), directly targeting a
 * specific call-to-action.
 */
export const InitialFocus: Story = {
	...Template,
	parameters: {
		controls: {
			include: ['placement', 'scrollBehavior', 'size']
		}
	},
	render: ({ placement, ...args }) => {
		const buttonRef = useRef<HTMLButtonElement>(null)

		return (
			<Dialog.Root
				{...args}
				initialFocusEl={() => buttonRef.current}
				placement={placement}
			>
				<Dialog.Trigger asChild>
					<Button variant="ghost">Dialog</Button>
				</Dialog.Trigger>
				<Dialog.Backdrop />
				<Dialog.Positioner>
					<Dialog.Content>
						<Dialog.Headline>
							<Dialog.Title
								as="h2"
								className={css({
									minHeight: '10',
									justifySelf: 'center',
									textStyle: 'xl',
									paddingBlockStart: 'calc((var(--sizes-10) - 1lh) / 2)'
								})}
							>
								Esse iure
							</Dialog.Title>
							<Dialog.CloseTrigger asChild>
								<Button
									variant="ghost"
									aria-label="close"
									className={css({ padding: 0 })}
									icon={
										<svg
											xmlns="http://www.w3.org/2000/svg"
											viewBox="0 -960 960 960"
											preserveAspectRatio="xMidYMid meet"
											aria-hidden="true"
											fill="currentColor"
										>
											<path d="m249-207-42-42 231-231-231-231 42-42 231 231 231-231 42 42-231 231 231 231-42 42-231-231-231 231Z" />
										</svg>
									}
								/>
							</Dialog.CloseTrigger>
						</Dialog.Headline>
						<Dialog.Description>
							<p>
								Agnitio ultio censura cibus unus vos caterva ventito. Custodia
								demitto delicate textus cotidie cultellus utique.
							</p>
						</Dialog.Description>
						<Dialog.Action>
							<Button variant="ghost" ref={buttonRef}>
								Action
							</Button>
						</Dialog.Action>
					</Dialog.Content>
				</Dialog.Positioner>
			</Dialog.Root>
		)
	},
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement)
		const trigger = canvas.getByRole('button', { name: 'Dialog' })

		await waitFor(() => {
			const content = canvasElement.querySelector('[data-part="content"]')
			expect(content).not.toBeVisible()
		})

		await userEvent.tab()

		await expect(trigger).toHaveFocus()

		await userEvent.keyboard('{Enter}')

		await waitFor(() => {
			expect(canvas.getByRole('button', { name: 'Action' })).toHaveFocus()
			expect(canvas.getByLabelText('close')).not.toHaveFocus()
		})

		await userEvent.keyboard('{Escape}')

		trigger.blur()
	}
}

/**
 * Demonstrates vertical positioning control over the Dialog content.
 * The `placement` property strictly defines the alignment of the floating
 * element relative to the viewport (e.g., center, top, bottom).
 */
export const Placement: Story = {
	...Template,
	parameters: {
		controls: {
			include: ['placement']
		}
	},
	play: async ({ args, canvasElement }) => {
		const canvas = within(canvasElement)
		const trigger = canvas.getByRole('button', { name: 'Dialog' })

		await waitFor(() => {
			const content = canvasElement.querySelector('[data-part="content"]')
			expect(content).not.toBeVisible()
		})

		await userEvent.tab()

		await expect(trigger).toHaveFocus()

		await userEvent.keyboard('{Enter}')

		await waitFor(() => {
			const content = canvasElement.querySelector('[data-part="content"]')
			expect(content).toHaveAttribute(
				'data-placement',
				args.placement ?? 'center'
			)
		})

		await userEvent.keyboard('{Escape}')

		await expect(trigger).toHaveFocus()

		trigger.blur()
	}
}

/**
 * An advanced composition pattern where a single `Dialog.Root` manages
 * multiple triggers simultaneously. It dynamically swaps the rendered content
 * based on the active trigger's `value`, optimizing DOM nodes for iterative
 * lists.
 */
export const SharedContent: Story = {
	...Template,
	parameters: {
		controls: {
			disable: true
		}
	},
	render: args => {
		const [activeDialog, setActiveDialog] = useState<{
			value: string
			content: { title: string; description: string }
		}>()

		const dialogs = [
			{
				value: 'dialog-a',
				content: {
					title: 'Esse iure',
					description:
						'Agnitio ultio censura cibus unus vos caterva ventito. Custodia demitto delicate textus cotidie cultellus utique.'
				}
			},
			{
				value: 'dialog-b',
				content: {
					title: 'Vado temeritas',
					description:
						'Possimus aqua arx carpo spiculum suscipit claustrum. Velum solium debeo commodo deporto tonsor.'
				}
			}
		]

		return (
			<Dialog.Root
				{...args}
				placement={args.placement}
				onTriggerValueChange={({ triggerElement, value }) => {
					args.onTriggerValueChange?.({ triggerElement, value })
					setActiveDialog(dialogs.find(t => t.value === value))
				}}
			>
				<div className={css({ display: 'flex', gap: '2' })}>
					<Dialog.Trigger asChild value="dialog-a">
						<Button variant="ghost">Dialog A</Button>
					</Dialog.Trigger>
					<Dialog.Trigger asChild value="dialog-b">
						<Button variant="ghost">Dialog B</Button>
					</Dialog.Trigger>
				</div>

				<Dialog.Backdrop />
				<Dialog.Positioner>
					<Dialog.Content data-testid="content">
						<Dialog.Headline>
							<Dialog.Title
								as="h2"
								className={css({
									minHeight: '10',
									justifySelf: 'center',
									textStyle: 'xl',
									paddingBlockStart: 'calc((var(--sizes-10) - 1lh) / 2)'
								})}
							>
								{activeDialog?.content.title}
							</Dialog.Title>
							<Dialog.CloseTrigger asChild>
								<Button
									variant="ghost"
									className={css({ padding: 0 })}
									icon={
										<svg
											xmlns="http://www.w3.org/2000/svg"
											viewBox="0 -960 960 960"
											preserveAspectRatio="xMidYMid meet"
											aria-hidden="true"
											fill="currentColor"
										>
											<path d="m249-207-42-42 231-231-231-231 42-42 231 231 231-231 42 42-231 231 231 231-42 42-231-231-231 231Z" />
										</svg>
									}
								/>
							</Dialog.CloseTrigger>
						</Dialog.Headline>
						<Dialog.Description>
							<p>{activeDialog?.content.description}</p>
						</Dialog.Description>
						<Dialog.Action>
							<Button variant="ghost">Action</Button>
						</Dialog.Action>
					</Dialog.Content>
				</Dialog.Positioner>
			</Dialog.Root>
		)
	},
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement)
		const triggerA = canvas.getByRole('button', { name: 'Dialog A' })
		const triggerB = canvas.getByRole('button', { name: 'Dialog B' })

		await waitFor(() => {
			expect(canvas.queryByTestId('content')).not.toBeVisible()
		})

		await userEvent.tab()

		await expect(triggerA).toHaveFocus()

		await userEvent.keyboard('{Enter}')

		await waitFor(() => {
			expect(canvas.queryByTestId('content')).toBeVisible()
			expect(canvas.queryByTestId('content')).toHaveTextContent('Esse iure')
		})

		await userEvent.keyboard('{Escape}')

		await waitFor(() => {
			expect(canvas.queryByTestId('content')).not.toBeVisible()
			expect(triggerA).toHaveFocus()
		})

		await userEvent.tab()

		await expect(triggerB).toHaveFocus()

		await userEvent.keyboard('{Enter}')

		await waitFor(() => {
			expect(canvas.queryByTestId('content')).toBeVisible()
			expect(canvas.queryByTestId('content')).toHaveTextContent(
				'Vado temeritas'
			)
		})

		await userEvent.keyboard('{Escape}')

		await expect(triggerB).toHaveFocus()

		triggerB.blur()
	}
}

/**
 * Demonstrates the inversion of control pattern via `useDialog` and
 * `Dialog.RootProvider`. Essential for when the dialog's state logic
 * must be hoisted, managed externally, or integrated with decoupled contexts.
 */
export const RootProvider: Story = {
	...Template,
	render: ({ placement, scrollBehavior, size, children, ...args }) => {
		const dialogApi = useDialog({
			...args
		})

		return (
			<Dialog.RootProvider
				placement={placement}
				scrollBehavior={scrollBehavior}
				size={size}
				{...dialogApi}
			>
				<Dialog.Trigger asChild>
					<Button variant="ghost">Dialog</Button>
				</Dialog.Trigger>
				<Dialog.Backdrop />
				<Dialog.Positioner>
					<Dialog.Content data-testid="content">
						<Dialog.Headline>
							<Dialog.Title
								as="h2"
								className={css({
									minHeight: '10',
									justifySelf: 'center',
									textStyle: 'xl',
									paddingBlockStart: 'calc((var(--sizes-10) - 1lh) / 2)'
								})}
							>
								Esse iure
							</Dialog.Title>
							<Dialog.CloseTrigger asChild>
								<Button
									variant="ghost"
									aria-label="close"
									className={css({ padding: 0 })}
									icon={
										<svg
											xmlns="http://www.w3.org/2000/svg"
											viewBox="0 -960 960 960"
											preserveAspectRatio="xMidYMid meet"
											aria-hidden="true"
											fill="currentColor"
										>
											<path d="m249-207-42-42 231-231-231-231 42-42 231 231 231-231 42 42-231 231 231 231-42 42-231-231-231 231Z" />
										</svg>
									}
								/>
							</Dialog.CloseTrigger>
						</Dialog.Headline>
						<Dialog.Description>
							<p>
								Agnitio ultio censura cibus unus vos caterva ventito. Custodia
								demitto delicate textus cotidie cultellus utique.
							</p>
						</Dialog.Description>
						<Dialog.Action>
							<Button variant="ghost">Action</Button>
						</Dialog.Action>
					</Dialog.Content>
				</Dialog.Positioner>
			</Dialog.RootProvider>
		)
	},
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement)
		const trigger = canvas.getByRole('button', { name: 'Dialog' })

		await waitFor(() => {
			expect(canvas.queryByTestId('content')).not.toBeVisible()
		})

		await userEvent.tab()

		await expect(trigger).toHaveFocus()

		await userEvent.keyboard('{Enter}')

		await waitFor(() => {
			const content = canvas.queryByTestId('content')
			expect(content).toBeVisible()
			expect(canvas.getByLabelText('close')).toHaveFocus()
		})

		await userEvent.keyboard('{Escape}')

		await waitFor(() => {
			expect(canvas.queryByTestId('content')).not.toBeVisible()
		})

		trigger.blur()
	}
}

/**
 * Integrates the dialog with a `Presence.Root` wrapper and a `Portal` to
 * orchestrate smooth, CSS-based entrance and exit animations. Transitions are
 * intelligently choreographed to adapt to the `data-placement` spatial
 * orientation (e.g., slide-from-bottom, scale-in).
 */
export const WithAnimation: Story = {
	...Template,
	args: { placement: 'center' },
	parameters: {
		controls: {
			include: ['placement']
		}
	},
	render: args => {
		const [open, setOpen] = useState(false)
		const [container, setContainer] = useState<HTMLDivElement | null>(null)
		return (
			<div
				className={css({
					position: 'relative',
					display: 'flex',
					justifyContent: 'center',
					alignItems: 'center',
					width: '100%',
					height: '100%'
				})}
				ref={setContainer}
			>
				<Dialog.Root
					{...args}
					open={open}
					onOpenChange={({ open }) => setOpen(open)}
				>
					<Dialog.Trigger asChild>
						<Button variant="ghost">Dialog</Button>
					</Dialog.Trigger>
					{container && (
						<Presence.Root present={open} unmountOnExit>
							{({ shouldUnmount }) => {
								return (
									<Portal container={{ current: container }}>
										<Presence.Gate
											asChild
											className={css({
												_open: {
													animationDuration: '500ms',
													animationTimingFunction:
														'var(--easings-m3-exp-effects)',
													animationName: 'fade-in'
												},
												_closed: {
													animationDuration: '350ms',
													animationTimingFunction:
														'var(--easings-m3-exp-fast-effects)',
													animationName: 'fade-out'
												}
											})}
										>
											<Dialog.Backdrop />
										</Presence.Gate>

										{!shouldUnmount && (
											<Dialog.Positioner>
												<Presence.Gate
													asChild
													className={css({
														_open: {
															willChange: 'scale, translate, opacity',
															animationDuration: '500ms, 200ms',
															animationTimingFunction:
																'var(--easings-m3-exp-spatial), var(--easings-m3-exp-effects)',
															'&[data-placement^=center]': {
																animationName: 'scale-in, fade-in'
															},
															'&[data-placement^=top]': {
																animationName: 'slide-from-bottom, fade-in'
															},
															'&[data-placement^=bottom]': {
																animationName: 'slide-from-top, fade-in'
															}
														},
														_closed: {
															animationDuration: '350ms, 150ms',
															animationTimingFunction:
																'var(--easings-m3-exp-spatial), var(--easings-m3-exp-effects)',
															'&[data-placement^=center]': {
																animationName: 'scale-out, fade-out'
															},
															'&[data-placement^=top]': {
																animationName: 'slide-to-bottom, fade-out'
															},
															'&[data-placement^=bottom]': {
																animationName: 'slide-to-top, fade-out'
															}
														}
													})}
												>
													<Dialog.Content data-testid="content">
														<Dialog.Headline>
															<Dialog.Title
																as="h2"
																className={css({
																	minHeight: '10',
																	justifySelf: 'center',
																	textStyle: 'xl',
																	paddingBlockStart:
																		'calc((var(--sizes-10) - 1lh) / 2)'
																})}
															>
																Esse iure
															</Dialog.Title>
															<Dialog.CloseTrigger asChild>
																<Button
																	variant="ghost"
																	className={css({ padding: 0 })}
																	icon={
																		<svg
																			xmlns="http://www.w3.org/2000/svg"
																			viewBox="0 -960 960 960"
																			preserveAspectRatio="xMidYMid meet"
																			aria-hidden="true"
																			fill="currentColor"
																		>
																			<path d="m249-207-42-42 231-231-231-231 42-42 231 231 231-231 42 42-231 231 231 231-42 42-231-231-231 231Z" />
																		</svg>
																	}
																/>
															</Dialog.CloseTrigger>
														</Dialog.Headline>
														<Dialog.Description>
															<p>
																Agnitio ultio censura cibus unus vos caterva
																ventito. Custodia demitto delicate textus
																cotidie cultellus utique.
															</p>
														</Dialog.Description>
														<Dialog.Action>
															<Button variant="ghost">Action</Button>
														</Dialog.Action>
													</Dialog.Content>
												</Presence.Gate>
											</Dialog.Positioner>
										)}
									</Portal>
								)
							}}
						</Presence.Root>
					)}
				</Dialog.Root>
			</div>
		)
	},
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement)
		const trigger = canvas.getByRole('button', { name: 'Dialog' })

		const onanimationstart = fn()
		const onanimationend = fn()
		canvasElement.addEventListener('animationstart', onanimationstart)
		canvasElement.addEventListener('animationend', onanimationend)

		await waitFor(() => {
			expect(canvas.queryByTestId('content')).not.toBeInTheDocument()
		})

		await userEvent.tab()

		await expect(trigger).toHaveFocus()

		await userEvent.keyboard('{Enter}')

		await waitFor(() => {
			expect(onanimationstart).toHaveBeenCalled()
			expect(onanimationend).toHaveBeenCalled()
		})

		onanimationstart.mockClear()
		onanimationend.mockClear()

		await waitFor(() => {
			expect(canvas.getByTestId('content')).toBeInTheDocument()
			expect(canvas.getByTestId('content')).not.toHaveStyle({
				display: 'none'
			})
			expect(canvas.getByTestId('content')).toHaveAttribute(
				'data-state',
				'open'
			)
		})

		await userEvent.keyboard('{Escape}')

		await waitFor(() => {
			expect(canvas.getByTestId('content')).toHaveAttribute(
				'data-state',
				'closed'
			)
		})

		await waitFor(() => {
			expect(onanimationstart).toHaveBeenCalled()
			expect(onanimationend).toHaveBeenCalled()
		})

		await waitFor(() => {
			expect(canvas.queryByTestId('content')).not.toBeInTheDocument()
		})

		trigger.blur()
	}
}
