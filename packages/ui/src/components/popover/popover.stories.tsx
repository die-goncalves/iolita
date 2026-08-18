import { css } from '@iolita/styled-system/css'
import type { Meta, StoryObj } from '@storybook/react-vite'
import type * as zPopover from '@zag-js/popover'
import { Portal } from '@zag-js/react'
import { type ComponentProps, useRef, useState } from 'react'
import { expect, fn, userEvent, waitFor, within } from 'storybook/test'
import { Button } from '../button'
import { Presence } from '../presence'
import { usePresence } from '../presence/use-presence'
import { Popover } from '.'
import { usePopover } from './use-popover'

type PopoverStoryProps = ComponentProps<typeof Popover.Root> & {
	placement?: zPopover.PositioningOptions['placement']
	gutter?: zPopover.PositioningOptions['gutter']
	overflowPadding?: zPopover.PositioningOptions['overflowPadding']
	arrowPadding?: zPopover.PositioningOptions['arrowPadding']
}

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
/**
 * A highly accessible floating panel that renders rich content and interactive
 * elements relative to a trigger. It manages complex focus trapping, viewport
 * boundary resolution, and standardized WAI-ARIA dialog patterns.
 */
const meta = {
	title: 'Components/Popover',
	component: Popover.Root,
	render: ({ placement, gutter, overflowPadding, arrowPadding, ...args }) => (
		<Popover.Root
			{...args}
			positioning={{ placement, gutter, overflowPadding, arrowPadding }}
		>
			<Popover.Trigger asChild>
				<Button variant="ghost">Popover</Button>
			</Popover.Trigger>
			<Popover.Positioner>
				<Popover.Content>
					<div
						className={css({
							display: 'flex',
							alignItems: 'start',
							justifyContent: 'space-between'
						})}
					>
						<Popover.Title
							className={css({
								minHeight: '10',
								justifySelf: 'center',
								textStyle: 'xl',
								paddingBlockStart: 'calc((var(--sizes-10) - 1lh) / 2)'
							})}
						>
							Esse iure
						</Popover.Title>
						<Popover.CloseTrigger asChild>
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
						</Popover.CloseTrigger>
					</div>
					<div>
						<Popover.Description>
							<p>
								Agnitio ultio censura cibus unus vos caterva ventito. Custodia
								demitto delicate textus cotidie cultellus utique.
							</p>
						</Popover.Description>
					</div>
					<div className={css({ display: 'flex', justifyContent: 'flex-end' })}>
						<Button variant="ghost">Action</Button>
					</div>
				</Popover.Content>
			</Popover.Positioner>
		</Popover.Root>
	),
	parameters: {
		// Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/configure/story-layout
		layout: 'fullscreen'
	},
	// This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/writing-docs/autodocs
	tags: ['autodocs'],
	// More on argTypes: https://storybook.js.org/docs/api/arg-types
	argTypes: {
		translations: {
			control: false,
			description:
				'Specifies the localized strings that identifies the accessibility elements and their states',
			table: { type: { summary: 'IntlTranslations | undefined' } }
		},
		ids: {
			control: false,
			description:
				'The ids of the elements in the popover. Useful for composition.',
			table: {
				type: { summary: 'ElementIds' },
				disable: true
			}
		},
		modal: {
			control: 'boolean',
			description: 'Whether the popover should be modal.',
			table: {
				defaultValue: { summary: 'false' },
				type: { summary: 'boolean' }
			}
		},
		portalled: {
			control: 'boolean',
			description:
				'Whether the popover is portalled. This will proxy the tabbing behavior regardless of the DOM position of the popover content.',
			table: {
				defaultValue: { summary: 'true' },
				type: { summary: 'boolean' }
			}
		},
		autoFocus: {
			control: 'boolean',
			description:
				'Whether to automatically set focus on the first focusable content within the popover when opened.',
			table: {
				defaultValue: { summary: 'true' },
				type: { summary: 'boolean' }
			}
		},
		initialFocusEl: {
			control: false,
			description: 'The element to focus on when the popover is opened.',
			table: {
				type: { summary: '(() => HTMLElement | null) | undefined' }
			}
		},
		finalFocusEl: {
			control: false,
			description: 'Element to receive focus when the popover is closed.',
			table: {
				type: { summary: '(() => MaybeElement) | undefined' }
			}
		},
		restoreFocus: {
			control: 'boolean',
			description:
				'Whether to restore focus to the element that had focus before the popover was opened.',
			table: {
				defaultValue: { summary: 'true' },
				type: { summary: 'boolean' }
			}
		},
		closeOnInteractOutside: {
			control: 'boolean',
			description:
				'Whether to close the popover when the user clicks outside of the popover.',
			table: {
				defaultValue: { summary: 'true' },
				type: { summary: 'boolean' }
			}
		},
		closeOnEscape: {
			control: 'boolean',
			description:
				'Whether to close the popover when the Escape key is pressed.',
			table: {
				defaultValue: { summary: 'true' },
				type: { summary: 'boolean' }
			}
		},
		onOpenChange: {
			action: 'onOpenChange',
			description: 'Function called when the popover is opened.',
			table: {
				type: { summary: '(details: OpenChangeDetails) => void' }
			}
		},
		// positioning: {
		// 	table: {
		// 		disable: true
		// 	}
		// },
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
		open: {
			control: 'boolean',
			description: 'The controlled open state of the popover.',
			table: {
				type: { summary: 'boolean' }
			}
		},
		defaultOpen: {
			control: 'boolean',
			description:
				"The initial open state of the popover when rendered. Use when you don't need to control the open state of the popover.",
			table: {
				type: { summary: 'boolean' }
			}
		},
		triggerValue: {
			control: 'text',
			description: 'The controlled trigger value.',
			table: {
				type: { summary: 'string | null' }
			}
		},
		defaultTriggerValue: {
			control: 'text',
			description:
				"The initial trigger value when rendered. Use when you don't need to control the trigger value.",
			table: {
				type: { summary: 'string | null' }
			}
		},
		onTriggerValueChange: {
			action: 'onTriggerValueChange',
			description: 'Function called when the trigger value changes.',
			table: {
				type: { summary: '(details: TriggerValueChangeDetails) => void' }
			}
		},
		children: {
			table: {
				disable: true
			}
		}
	},
	// Use `fn` to spy on the onClick arg, which will appear in the actions panel once invoked: https://storybook.js.org/docs/essentials/actions#story-args
	args: {
		children: '',
		closeOnEscape: true,
		onOpenChange: fn(),
		onTriggerValueChange: fn(),
		placement: 'top',
		gutter: 8,
		overflowPadding: 8,
		arrowPadding: 0
	}
} satisfies Meta<PopoverStoryProps>

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
 * The standard behavior of the Popover component. It toggles visibility upon
 * interacting with the trigger and automatically dismisses when clicking
 * outside or pressing the Escape key, maintaining a natural focus flow.
 */
export const Overview: Story = {
	...Template,
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement)
		const trigger = canvas.getByRole('button', { name: 'Popover' })

		await waitFor(() => {
			const content = canvasElement.querySelector('[data-part="content"]')
			expect(content).not.toBeVisible()
		})

		await userEvent.click(trigger)

		await waitFor(() => {
			const content = canvasElement.querySelector('[data-part="content"]')
			expect(content).toBeVisible()
		})

		await userEvent.click(trigger)

		await waitFor(() => {
			const content = canvasElement.querySelector('[data-part="content"]')
			expect(content).not.toBeVisible()
		})
	}
}

/**
 * Demonstrates the modal interaction pattern. When enabled, the popover traps
 * focus within its content, locks background scrolling, and prevents pointer
 * events outside the floating element to enforce explicit user dismissal.
 */
export const Modal: Story = {
	...Template,
	args: { modal: true },
	parameters: {
		controls: {
			include: ['modal']
		}
	},
	play: async ({ args, canvasElement }) => {
		const canvas = within(canvasElement)
		const trigger = canvas.getByRole('button', { name: 'Popover' })

		await userEvent.click(trigger)

		await waitFor(() => {
			const content = canvasElement.querySelector('[data-part="content"]')

			expect(content).toBeInTheDocument()

			if (args.modal) {
				expect(content).toHaveAttribute('aria-modal', 'true')
			} else {
				expect(content).not.toHaveAttribute('aria-modal')
			}
		})

		if (args.modal) {
			expect(getComputedStyle(document.body).pointerEvents).toBe('none')
			expect(getComputedStyle(document.body).overflow).toBe('hidden')
			expect(document.body).toHaveAttribute('data-scroll-lock')
			expect(document.body).toHaveAttribute('data-inert')
		}

		const closeButton = canvas.getByLabelText('close')
		await userEvent.click(closeButton)

		if (args.modal) {
			expect(getComputedStyle(document.body).pointerEvents).toBe('auto')
			expect(getComputedStyle(document.body).overflow).toBe('visible')
			expect(document.body).not.toHaveAttribute('data-scroll-lock')
			expect(document.body).not.toHaveAttribute('data-inert')
		}
	}
}

/**
 * Illustrates custom focus management upon opening. By defining an `initialFocusEl`,
 * the component bypasses the default behavior of focusing the first interactive
 * element, directing the user's attention to a specific functional target.
 */
export const InitialFocus: Story = {
	...Template,
	parameters: {
		controls: {
			include: ['placement', 'gutter', 'overflowPadding']
		}
	},
	render: ({ placement, gutter, overflowPadding, ...args }) => {
		const buttonRef = useRef<HTMLButtonElement>(null)

		return (
			<Popover.Root
				{...args}
				initialFocusEl={() => buttonRef.current}
				positioning={{ placement, gutter, overflowPadding }}
			>
				<Popover.Trigger asChild>
					<Button variant="ghost">Popover</Button>
				</Popover.Trigger>
				<Popover.Positioner>
					<Popover.Content>
						<div
							className={css({
								display: 'flex',
								alignItems: 'start',
								justifyContent: 'space-between'
							})}
						>
							<Popover.Title
								className={css({
									minHeight: '10',
									justifySelf: 'center',
									textStyle: 'xl',
									paddingBlockStart: 'calc((var(--sizes-10) - 1lh) / 2)'
								})}
							>
								Esse iure
							</Popover.Title>
							<Popover.CloseTrigger asChild>
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
							</Popover.CloseTrigger>
						</div>
						<div>
							<Popover.Description>
								<p>
									Agnitio ultio censura cibus unus vos caterva ventito. Custodia
									demitto delicate textus cotidie cultellus utique.
								</p>
							</Popover.Description>
						</div>
						<div
							className={css({ display: 'flex', justifyContent: 'flex-end' })}
						>
							<Button variant="ghost" ref={buttonRef}>
								Action
							</Button>
						</div>
					</Popover.Content>
				</Popover.Positioner>
			</Popover.Root>
		)
	},
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement)
		const trigger = canvas.getByRole('button', { name: 'Popover' })

		await userEvent.tab()

		await expect(trigger).toHaveFocus()

		await userEvent.keyboard('{Enter}')

		await waitFor(() => {
			expect(canvas.getByRole('button', { name: 'Action' })).toHaveFocus()
		})

		await expect(canvas.getByLabelText('close')).not.toHaveFocus()

		await userEvent.keyboard('{Escape}')
	}
}

/**
 * Incorporates a visual directional indicator (`Popover.Arrow`) that bridges
 * the spatial relationship between the floating content and its reference trigger,
 * adapting automatically to placement shifts.
 */
export const WithArrow: Story = {
	...Template,
	parameters: {
		controls: {
			include: ['placement', 'arrowPadding']
		}
	},
	render: args => {
		return (
			<Popover.Root
				{...args}
				positioning={{
					placement: args.placement,
					gutter: args.gutter,
					overflowPadding: args.overflowPadding,
					arrowPadding: args.arrowPadding
				}}
			>
				<Popover.Trigger asChild>
					<Button variant="ghost">Popover</Button>
				</Popover.Trigger>
				<Popover.Positioner>
					<Popover.Content>
						<Popover.Arrow>
							<Popover.ArrowTip />
						</Popover.Arrow>
						<div
							className={css({
								display: 'flex',
								alignItems: 'start',
								justifyContent: 'space-between'
							})}
						>
							<Popover.Title
								className={css({
									minHeight: '10',
									justifySelf: 'center',
									textStyle: 'xl',
									paddingBlockStart: 'calc((var(--sizes-10) - 1lh) / 2)'
								})}
							>
								Esse iure
							</Popover.Title>
							<Popover.CloseTrigger asChild>
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
							</Popover.CloseTrigger>
						</div>
						<div>
							<Popover.Description>
								<p>
									Agnitio ultio censura cibus unus vos caterva ventito. Custodia
									demitto delicate textus cotidie cultellus utique.
								</p>
							</Popover.Description>
						</div>
						<div
							className={css({ display: 'flex', justifyContent: 'flex-end' })}
						>
							<Button variant="ghost">Action</Button>
						</div>
					</Popover.Content>
				</Popover.Positioner>
			</Popover.Root>
		)
	},
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement)
		const trigger = canvas.getByRole('button', { name: 'Popover' })

		await userEvent.click(trigger)

		await waitFor(() => {
			const content = canvasElement.querySelector('[data-part="content"]')
			expect(content).toBeVisible()
			const arrow = canvasElement.querySelector('[data-part="arrow"]')
			expect(arrow).toBeVisible()
			const arrowTip = canvasElement.querySelector('[data-part="arrow-tip"]')
			expect(arrowTip).toBeVisible()
		})

		await userEvent.click(trigger)
	}
}

/**
 * Demonstrates manual control over the floating element's initial placement.
 * While the built-in collision detection may override this value if necessary,
 * `placement` strictly defines the preferred primary alignment.
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
		const trigger = canvas.getByRole('button', { name: 'Popover' })

		await userEvent.click(trigger)

		await waitFor(() => {
			const content = canvasElement.querySelector('[data-part="content"]')
			expect(content).toHaveAttribute('data-placement', args.placement ?? 'top')
		})

		await userEvent.click(trigger)
	}
}

/**
 * Highlights the collision resolution strategy. As the popover approaches boundary
 * limits, it automatically overrides its preferred placement, shifting or flipping
 * the content to remain entirely visible within the available safe area.
 */
export const Collision: Story = {
	...Template,
	parameters: {
		controls: {
			include: ['placement', 'gutter', 'overflowPadding']
		}
	},
	render: args => {
		const [container, setContainer] = useState<HTMLDivElement | null>(null)
		return (
			<div
				className={css({
					position: 'relative',
					width: '100%',
					height: '100%'
				})}
				data-testid="container"
				ref={setContainer}
			>
				<Popover.Root
					{...args}
					positioning={{
						boundary: () => (container ? [container] : []),
						gutter: args.gutter,
						overflowPadding: args.overflowPadding,
						placement: args.placement
					}}
				>
					<Popover.Trigger asChild>
						<Button
							variant="ghost"
							className={css({ position: 'absolute', top: '2', left: '2' })}
						>
							Popover
						</Button>
					</Popover.Trigger>
					<Popover.Positioner>
						<Popover.Content>
							<div
								className={css({
									display: 'flex',
									alignItems: 'start',
									justifyContent: 'space-between'
								})}
							>
								<Popover.Title
									className={css({
										minHeight: '10',
										justifySelf: 'center',
										textStyle: 'xl',
										paddingBlockStart: 'calc((var(--sizes-10) - 1lh) / 2)'
									})}
								>
									Esse iure
								</Popover.Title>
								<Popover.CloseTrigger asChild>
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
								</Popover.CloseTrigger>
							</div>
							<div>
								<Popover.Description>
									<p>
										Agnitio ultio censura cibus unus vos caterva ventito.
										Custodia demitto delicate textus cotidie cultellus utique.
									</p>
								</Popover.Description>
							</div>
							<div
								className={css({ display: 'flex', justifyContent: 'flex-end' })}
							>
								<Button variant="ghost">Action</Button>
							</div>
						</Popover.Content>
					</Popover.Positioner>
				</Popover.Root>

				<Popover.Root
					{...args}
					positioning={{
						boundary: () => (container ? [container] : []),
						gutter: args.gutter,
						overflowPadding: args.overflowPadding,
						placement: args.placement
					}}
				>
					<Popover.Trigger asChild>
						<Button
							variant="ghost"
							className={css({ position: 'absolute', top: '2', right: '2' })}
						>
							Popover
						</Button>
					</Popover.Trigger>
					<Popover.Positioner>
						<Popover.Content>
							<div
								className={css({
									display: 'flex',
									alignItems: 'start',
									justifyContent: 'space-between'
								})}
							>
								<Popover.Title
									className={css({
										minHeight: '10',
										justifySelf: 'center',
										textStyle: 'xl',
										paddingBlockStart: 'calc((var(--sizes-10) - 1lh) / 2)'
									})}
								>
									Esse iure
								</Popover.Title>
								<Popover.CloseTrigger asChild>
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
								</Popover.CloseTrigger>
							</div>
							<div>
								<Popover.Description>
									<p>
										Agnitio ultio censura cibus unus vos caterva ventito.
										Custodia demitto delicate textus cotidie cultellus utique.
									</p>
								</Popover.Description>
							</div>
							<div
								className={css({ display: 'flex', justifyContent: 'flex-end' })}
							>
								<Button variant="ghost">Action</Button>
							</div>
						</Popover.Content>
					</Popover.Positioner>
				</Popover.Root>

				<Popover.Root
					{...args}
					positioning={{
						boundary: () => (container ? [container] : []),
						gutter: args.gutter,
						overflowPadding: args.overflowPadding,
						placement: args.placement
					}}
				>
					<Popover.Trigger asChild>
						<Button
							variant="ghost"
							className={css({ position: 'absolute', bottom: '2', left: '2' })}
						>
							Popover
						</Button>
					</Popover.Trigger>
					<Popover.Positioner>
						<Popover.Content>
							<div
								className={css({
									display: 'flex',
									alignItems: 'start',
									justifyContent: 'space-between'
								})}
							>
								<Popover.Title
									className={css({
										minHeight: '10',
										justifySelf: 'center',
										textStyle: 'xl',
										paddingBlockStart: 'calc((var(--sizes-10) - 1lh) / 2)'
									})}
								>
									Esse iure
								</Popover.Title>
								<Popover.CloseTrigger asChild>
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
								</Popover.CloseTrigger>
							</div>
							<div>
								<Popover.Description>
									<p>
										Agnitio ultio censura cibus unus vos caterva ventito.
										Custodia demitto delicate textus cotidie cultellus utique.
									</p>
								</Popover.Description>
							</div>
							<div
								className={css({ display: 'flex', justifyContent: 'flex-end' })}
							>
								<Button variant="ghost">Action</Button>
							</div>
						</Popover.Content>
					</Popover.Positioner>
				</Popover.Root>

				<Popover.Root
					{...args}
					positioning={{
						boundary: () => (container ? [container] : []),
						gutter: args.gutter,
						overflowPadding: args.overflowPadding,
						placement: args.placement
					}}
				>
					<Popover.Trigger asChild>
						<Button
							variant="ghost"
							className={css({ position: 'absolute', bottom: '2', right: '2' })}
						>
							Popover
						</Button>
					</Popover.Trigger>
					<Popover.Positioner>
						<Popover.Content>
							<div
								className={css({
									display: 'flex',
									alignItems: 'start',
									justifyContent: 'space-between'
								})}
							>
								<Popover.Title
									className={css({
										minHeight: '10',
										justifySelf: 'center',
										textStyle: 'xl',
										paddingBlockStart: 'calc((var(--sizes-10) - 1lh) / 2)'
									})}
								>
									Esse iure
								</Popover.Title>
								<Popover.CloseTrigger asChild>
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
								</Popover.CloseTrigger>
							</div>
							<div>
								<Popover.Description>
									<p>
										Agnitio ultio censura cibus unus vos caterva ventito.
										Custodia demitto delicate textus cotidie cultellus utique.
									</p>
								</Popover.Description>
							</div>
							<div
								className={css({ display: 'flex', justifyContent: 'flex-end' })}
							>
								<Button variant="ghost">Action</Button>
							</div>
						</Popover.Content>
					</Popover.Positioner>
				</Popover.Root>
			</div>
		)
	},
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement)
		const triggers = canvas.getAllByRole('button', { name: 'Popover' })
		expect(triggers).toHaveLength(4)

		const container = canvas.getByTestId('container')
		const containerRect = container.getBoundingClientRect()

		for (const [i, trigger] of triggers.entries()) {
			await userEvent.click(trigger)

			await waitFor(() => {
				const contents = canvasElement.querySelectorAll('[data-part="content"]')
				const content = contents[i] as Element | null
				expect(content).toBeVisible()

				const contentRect = content?.getBoundingClientRect()

				expect(contentRect?.left).toBeGreaterThanOrEqual(containerRect.left)
				expect(contentRect?.right).toBeLessThanOrEqual(containerRect.right)
				expect(contentRect?.top).toBeGreaterThanOrEqual(containerRect.top)
				expect(contentRect?.bottom).toBeLessThanOrEqual(containerRect.bottom)
			})

			await userEvent.click(trigger)

			await waitFor(() => {
				const contents = canvasElement.querySelectorAll('[data-part="content"]')
				expect(contents[i]).not.toBeVisible()
			})
		}
	}
}

/**
 * An advanced composition pattern where a single `Popover.Root` manages
 * multiple triggers simultaneously. This dynamically swaps the rendered content
 * based on the active trigger's `value`, optimizing DOM node rendering for
 * lists.
 */
export const SharedContent: Story = {
	...Template,
	parameters: {
		controls: {
			include: ['placement', 'gutter']
		}
	},
	render: args => {
		const [activePopover, setActivePopover] = useState<{
			value: string
			content: { title: string; description: string }
		}>()

		const popovers = [
			{
				value: 'popover-a',
				content: {
					title: 'Esse iure',
					description:
						'Agnitio ultio censura cibus unus vos caterva ventito. Custodia demitto delicate textus cotidie cultellus utique.'
				}
			},
			{
				value: 'popover-b',
				content: {
					title: 'Vado temeritas',
					description:
						'Possimus aqua arx carpo spiculum suscipit claustrum. Velum solium debeo commodo deporto tonsor.'
				}
			}
		]

		return (
			<Popover.Root
				{...args}
				positioning={{
					placement: args.placement,
					gutter: args.gutter,
					overflowPadding: args.overflowPadding
				}}
				onTriggerValueChange={({ triggerElement, value }) => {
					args.onTriggerValueChange?.({ triggerElement, value })
					setActivePopover(popovers.find(t => t.value === value))
				}}
			>
				<div className={css({ display: 'flex', gap: '2' })}>
					<Popover.Trigger asChild value="popover-a">
						<Button variant="ghost">Popover A</Button>
					</Popover.Trigger>
					<Popover.Trigger asChild value="popover-b">
						<Button variant="ghost">Popover B</Button>
					</Popover.Trigger>
				</div>

				<Popover.Positioner>
					<Popover.Content>
						<div
							className={css({
								display: 'flex',
								alignItems: 'start',
								justifyContent: 'space-between'
							})}
						>
							<Popover.Title
								className={css({
									minHeight: '10',
									justifySelf: 'center',
									textStyle: 'xl',
									paddingBlockStart: 'calc((var(--sizes-10) - 1lh) / 2)'
								})}
							>
								{activePopover?.content.title}
							</Popover.Title>
							<Popover.CloseTrigger asChild>
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
							</Popover.CloseTrigger>
						</div>
						<div>
							<Popover.Description>
								<p>{activePopover?.content.description}</p>
							</Popover.Description>
						</div>
						<div
							className={css({ display: 'flex', justifyContent: 'flex-end' })}
						>
							<Button variant="ghost">Action</Button>
						</div>
					</Popover.Content>
				</Popover.Positioner>
			</Popover.Root>
		)
	},
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement)
		const triggerA = canvas.getByRole('button', { name: 'Popover A' })
		const triggerB = canvas.getByRole('button', { name: 'Popover B' })

		await userEvent.click(triggerA)

		await waitFor(() => {
			const content = canvasElement.querySelector('[data-part="content"]')
			expect(content).toBeVisible()
			expect(content).toHaveTextContent('Esse iure')
		})

		await userEvent.click(triggerA)

		await userEvent.click(triggerB)

		await waitFor(() => {
			const content = canvasElement.querySelector('[data-part="content"]')
			expect(content).toBeVisible()
			expect(content).toHaveTextContent('Vado temeritas')
		})

		await userEvent.click(triggerB)
	}
}

/**
 * Demonstrates the inversion of control pattern via `usePopover` +
 * `Popover.RootProvider`. This is essential when the popover's state logic
 * must be hoisted, managed externally, or integrated with decoupled contexts.
 */
export const RootProvider: Story = {
	...Template,
	render: args => {
		const popoverApi = usePopover({
			...args,
			positioning: {
				strategy: 'absolute',
				placement: args.placement,
				gutter: args.gutter,
				overflowPadding: args.overflowPadding,
				arrowPadding: args.arrowPadding
			}
		})

		return (
			<Popover.RootProvider {...popoverApi}>
				<Popover.Trigger asChild>
					<Button variant="ghost">Popover</Button>
				</Popover.Trigger>
				<Popover.Positioner>
					<Popover.Content>
						<div
							className={css({
								display: 'flex',
								alignItems: 'start',
								justifyContent: 'space-between'
							})}
						>
							<Popover.Title
								className={css({
									minHeight: '10',
									justifySelf: 'center',
									textStyle: 'xl',
									paddingBlockStart: 'calc((var(--sizes-10) - 1lh) / 2)'
								})}
							>
								Esse iure
							</Popover.Title>
							<Popover.CloseTrigger asChild>
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
							</Popover.CloseTrigger>
						</div>
						<div>
							<Popover.Description>
								<p>
									Agnitio ultio censura cibus unus vos caterva ventito. Custodia
									demitto delicate textus cotidie cultellus utique.
								</p>
							</Popover.Description>
						</div>
						<div
							className={css({
								display: 'flex',
								justifyContent: 'flex-end'
							})}
						>
							<Button variant="ghost">Action</Button>
						</div>
					</Popover.Content>
				</Popover.Positioner>
			</Popover.RootProvider>
		)
	},
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement)
		const trigger = canvas.getByRole('button', { name: 'Popover' })

		await waitFor(() => {
			const content = canvasElement.querySelector('[data-part="content"]')
			expect(content).not.toBeVisible()
		})

		await userEvent.click(trigger)

		await waitFor(() => {
			const content = canvasElement.querySelector('[data-part="content"]')
			expect(content).toBeVisible()
		})

		await userEvent.click(trigger)

		await waitFor(() => {
			const content = canvasElement.querySelector('[data-part="content"]')
			expect(content).not.toBeVisible()
		})
	}
}

/**
 * Integrates the popover with a `Presence` wrapper to orchestrate smooth,
 * CSS-based entrance and exit animations. Transitions are intelligently
 * choreographed based on the `data-placement` attribute to slide from the
 * correct spatial direction.
 */
export const WithAnimation: Story = {
	...Template,
	parameters: {
		controls: {
			include: [
				'closeOnEscape',
				'placement',
				'gutter',
				'overflowPadding',
				'arrowPadding'
			]
		}
	},
	render: args => {
		const [open, setOpen] = useState(false)
		const [container, setContainer] = useState<HTMLDivElement | null>(null)
		const api = usePresence({
			present: open,
			activity: true
		})

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
				<Popover.Root
					{...args}
					open={open}
					onOpenChange={({ open }) => setOpen(open)}
					positioning={{
						strategy: 'absolute',
						boundary: () => (container ? [container] : []),
						placement: args.placement,
						gutter: args.gutter,
						overflowPadding: args.overflowPadding,
						arrowPadding: args.arrowPadding
					}}
				>
					<Popover.Trigger asChild>
						<Button variant="ghost">Popover</Button>
					</Popover.Trigger>

					{container && (
						<Presence.RootProvider {...api}>
							<Portal container={{ current: container }}>
								<Popover.Positioner>
									<Presence.Gate
										className={css({
											_open: {
												animationDuration: '500ms, 200ms',
												animationTimingFunction:
													'var(--easings-m3-exp-spatial), var(--easings-m3-exp-effects)',
												'&:has(> [data-placement^=top])': {
													animationName: 'slide-from-bottom, fade-in'
												},
												'&:has(> [data-placement^=right])': {
													animationName: 'slide-from-left, fade-in'
												},
												'&:has(> [data-placement^=bottom])': {
													animationName: 'slide-from-top, fade-in'
												},
												'&:has(> [data-placement^=left])': {
													animationName: 'slide-from-right, fade-in'
												}
											},
											_closed: {
												animationDuration: '350ms, 150ms',
												animationTimingFunction:
													'var(--easings-m3-exp-fast-spatial), var(--easings-m3-exp-fast-effects)',
												'&:has(> [data-placement^=top])': {
													animationName: 'slide-to-bottom, fade-out'
												},
												'&:has(> [data-placement^=right])': {
													animationName: 'slide-to-left, fade-out'
												},
												'&:has(> [data-placement^=bottom])': {
													animationName: 'slide-to-top, fade-out'
												},
												'&:has(> [data-placement^=left])': {
													animationName: 'slide-to-right, fade-out'
												}
											}
										})}
									>
										<Popover.Content {...api.getPresenceProps()}>
											<Popover.Arrow {...api.getPresenceProps()}>
												<Popover.ArrowTip />
											</Popover.Arrow>
											<div
												className={css({
													display: 'flex',
													alignItems: 'start',
													justifyContent: 'space-between'
												})}
											>
												<Popover.Title
													className={css({
														minHeight: '10',
														justifySelf: 'center',
														textStyle: 'xl',
														paddingBlockStart:
															'calc((var(--sizes-10) - 1lh) / 2)'
													})}
												>
													Esse iure
												</Popover.Title>
												<Popover.CloseTrigger asChild>
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
												</Popover.CloseTrigger>
											</div>
											<div>
												<Popover.Description>
													<p>
														Agnitio ultio censura cibus unus vos caterva
														ventito. Custodia demitto delicate textus cotidie
														cultellus utique.
													</p>
												</Popover.Description>
											</div>
											<div
												className={css({
													display: 'flex',
													justifyContent: 'flex-end'
												})}
											>
												<Button variant="ghost">Action</Button>
											</div>
										</Popover.Content>
									</Presence.Gate>
								</Popover.Positioner>
							</Portal>
						</Presence.RootProvider>
					)}
				</Popover.Root>
			</div>
		)
	},
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement)
		const trigger = canvas.getByRole('button', { name: 'Popover' })

		await userEvent.keyboard('{Escape}')

		await waitFor(() => {
			const presenceEl = canvasElement.querySelector('[data-scope="presence"]')
			expect(presenceEl).toBeInTheDocument()
		})

		await userEvent.click(trigger)

		await waitFor(() => {
			const presenceEl = canvasElement.querySelector('[data-scope="presence"]')
			expect(presenceEl).toBeVisible()
			expect(presenceEl).not.toHaveStyle({ display: 'none' })
			expect(presenceEl).toHaveAttribute('data-state', 'open')
		})

		await userEvent.click(trigger)

		await waitFor(() => {
			const presenceEl = canvasElement.querySelector('[data-scope="presence"]')
			expect(presenceEl).toHaveStyle({ display: 'none' })
			expect(presenceEl).toHaveAttribute('data-state', 'closed')
		})
	}
}
