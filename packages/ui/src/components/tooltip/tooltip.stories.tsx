import { css } from '@iolita/styled-system/css'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { Portal } from '@zag-js/react'
import type * as zTooltip from '@zag-js/tooltip'
import { type ComponentProps, type ReactNode, useState } from 'react'
import { expect, fn, userEvent, waitFor, within } from 'storybook/test'
import { Button } from '../button'
import { Presence } from '../presence'
import { Tooltip } from '.'
import { useTooltip } from './use-tooltip'

type TooltipStoryProps = ComponentProps<typeof Tooltip.Root> & {
	tooltipText?: string
	placement?: zTooltip.PositioningOptions['placement']
	gutter?: zTooltip.PositioningOptions['gutter']
	overflowPadding?: zTooltip.PositioningOptions['overflowPadding']
	arrowPadding?: zTooltip.PositioningOptions['arrowPadding']
}

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
/**
 * A non-blocking, accessible floating element that provides contextual
 * information for interactive triggers. Automatically handles viewport
 * boundaries, keyboard focus management, and positioning constraints.
 */
const meta = {
	title: 'Components/Tooltip',
	component: Tooltip.Root,
	render: ({
		tooltipText,
		placement,
		gutter,
		overflowPadding,
		arrowPadding,
		...args
	}) => (
		<Tooltip.Root
			{...args}
			positioning={{ placement, gutter, overflowPadding, arrowPadding }}
		>
			<Tooltip.Trigger asChild>
				<Button variant="ghost">Tooltip</Button>
			</Tooltip.Trigger>
			<Tooltip.Positioner>
				<Tooltip.Content>{tooltipText}</Tooltip.Content>
			</Tooltip.Positioner>
		</Tooltip.Root>
	),
	parameters: {
		// Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/configure/story-layout
		layout: 'centered'
	},
	// This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/writing-docs/autodocs
	tags: ['autodocs'],
	// More on argTypes: https://storybook.js.org/docs/api/arg-types
	argTypes: {
		ids: {
			control: false,
			description:
				'The ids of the elements in the tooltip. Useful for composition.',
			table: {
				type: { summary: 'ElementIds' },
				disable: true
			}
		},
		openDelay: {
			control: 'number',
			description: 'The open delay of the tooltip.',
			table: {
				defaultValue: { summary: '400' },
				type: { summary: 'number' }
			}
		},
		closeDelay: {
			control: 'number',
			description: 'The close delay of the tooltip.',
			table: {
				defaultValue: { summary: '150' },
				type: { summary: 'number' }
			}
		},
		closeOnPointerDown: {
			control: 'boolean',
			description: 'Whether to close the tooltip on pointerdown.',
			table: {
				defaultValue: { summary: 'true' },
				type: { summary: 'boolean' }
			}
		},
		closeOnEscape: {
			control: 'boolean',
			description:
				'Whether to close the tooltip when the Escape key is pressed.',
			table: {
				defaultValue: { summary: 'true' },
				type: { summary: 'boolean' }
			}
		},
		closeOnScroll: {
			control: 'boolean',
			description: 'Whether the tooltip should close on scroll.',
			table: {
				defaultValue: { summary: 'true' },
				type: { summary: 'boolean' }
			}
		},
		closeOnClick: {
			control: 'boolean',
			description: 'Whether the tooltip should close on click.',
			table: {
				defaultValue: { summary: 'true' },
				type: { summary: 'boolean' }
			}
		},
		interactive: {
			control: 'boolean',
			description:
				"Whether the tooltip's content is interactive. In this mode, the tooltip will remain open when user hovers over the content.",
			table: {
				defaultValue: { summary: 'false' },
				type: { summary: 'boolean' }
			}
		},
		onOpenChange: {
			action: 'onOpenChange',
			description: 'Function called when the tooltip is opened.',
			table: {
				type: { summary: '(details: OpenChangeDetails) => void' }
			}
		},
		'aria-label': {
			control: 'text',
			description: 'Custom label for the tooltip.',
			table: {
				type: { summary: 'string' }
			}
		},
		positioning: {
			table: {
				disable: true
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
		disabled: {
			control: 'boolean',
			description: 'Whether the tooltip is disabled.',
			table: {
				defaultValue: { summary: 'false' },
				type: { summary: 'boolean' }
			}
		},
		open: {
			control: 'boolean',
			description: 'The controlled open state of the tooltip.',
			table: {
				type: { summary: 'boolean' }
			}
		},
		defaultOpen: {
			control: 'boolean',
			description:
				"The initial open state of the tooltip when rendered. Use when you don't need to control the open state of the tooltip.",
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
		tooltipText: {
			description: 'Specify the tooltip content.',
			table: {
				type: { summary: 'string' }
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
		openDelay: 400,
		closeDelay: 150,
		closeOnPointerDown: true,
		closeOnEscape: true,
		closeOnScroll: true,
		closeOnClick: true,
		interactive: true,
		onOpenChange: fn(),
		disabled: false,
		onTriggerValueChange: fn(),
		placement: 'top',
		gutter: 8,
		overflowPadding: 8,
		arrowPadding: 0,
		tooltipText: 'tooltip content'
	}
} satisfies Meta<TooltipStoryProps>

export default meta
type Story = StoryObj<typeof meta>

// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args
/**
 * The standard behavior of the Tooltip component. It leverages built-in timing
 * delays to prevent accidental triggers and positions the floating content
 * relative to the trigger element based on its default configuration.
 */
export const Overview: Story = {
	args: { children: '' },
	decorators: [
		Story => (
			<div
				className={css({
					position: 'relative',
					display: 'flex',
					justifyContent: 'center',
					alignItems: 'center',
					padding: '2',
					boxSizing: 'border-box',
					borderWidth: 'thin',
					borderStyle: 'dashed',
					width: 'var(--sizes-64)',
					minHeight: 'calc(var(--sizes-48) + 1px * 2)',
					borderColor: 'violet.800'
				})}
			>
				<Story />
			</div>
		)
	],
	play: async ({ args, canvasElement }) => {
		const canvas = within(canvasElement)
		const trigger = canvas.getByRole('button', { name: 'Tooltip' })

		const MAX_EXTRA = 150
		const openDelay = args.openDelay ?? 0
		const closeDelay = args.closeDelay ?? 0

		await userEvent.unhover(trigger)

		await waitFor(() => {
			const content = canvasElement.querySelector('[data-part="content"]')
			expect(content).not.toBeVisible()
		})

		await userEvent.hover(trigger)

		await waitFor(
			() => {
				const content = canvasElement.querySelector('[data-part="content"]')
				expect(content).toBeVisible()
			},
			{ timeout: openDelay + MAX_EXTRA }
		)

		await userEvent.unhover(trigger)

		await waitFor(
			() => {
				const content = canvasElement.querySelector('[data-part="content"]')
				expect(content).not.toBeVisible()
			},
			{ timeout: closeDelay + MAX_EXTRA }
		)
	}
}

/**
 * Customizes the interaction timing behaviors. By setting `openDelay` and
 * `closeDelay` to `0`, the debounce mechanism is bypassed, causing the tooltip
 * to appear and disappear instantaneously upon hover intent or focus changes.
 */
export const Timing: Story = {
	args: { children: '', openDelay: 0, closeDelay: 0 },
	parameters: {
		controls: {
			include: ['openDelay', 'closeDelay', 'tooltipText']
		}
	},
	render: args => {
		return (
			<div
				className={css({
					position: 'relative',
					display: 'flex',
					justifyContent: 'center',
					alignItems: 'center',
					padding: '2',
					boxSizing: 'border-box',
					borderWidth: 'thin',
					borderStyle: 'dashed',
					width: 'var(--sizes-64)',
					minHeight: 'calc(var(--sizes-48) + 1px * 2)',
					borderColor: 'violet.800'
				})}
			>
				<Tooltip.Root
					{...args}
					positioning={{
						placement: args.placement,
						gutter: args.gutter,
						overflowPadding: args.overflowPadding,
						arrowPadding: args.arrowPadding
					}}
				>
					<Tooltip.Trigger asChild>
						<Button variant="ghost">Tooltip</Button>
					</Tooltip.Trigger>
					<Tooltip.Positioner>
						<Tooltip.Content>tooltip content</Tooltip.Content>
					</Tooltip.Positioner>
				</Tooltip.Root>
			</div>
		)
	},
	play: async ({ args, canvasElement }) => {
		const canvas = within(canvasElement)
		const trigger = canvas.getByRole('button', { name: 'Tooltip' })

		const MAX_EXTRA = 150
		const openDelay = args.openDelay ?? 0
		const closeDelay = args.closeDelay ?? 0

		const openStart = performance.now()
		await userEvent.hover(trigger)

		await waitFor(
			() => {
				const content = canvasElement.querySelector('[data-part="content"]')
				expect(content).toBeVisible()
			},
			{ timeout: openDelay + MAX_EXTRA }
		)

		expect(performance.now() - openStart).toBeGreaterThanOrEqual(openDelay)
		expect(performance.now() - openStart).toBeLessThan(openDelay + MAX_EXTRA)

		const closeStart = performance.now()
		await userEvent.unhover(trigger)

		await waitFor(
			() => {
				const content = canvasElement.querySelector('[data-part="content"]')
				expect(content).not.toBeVisible()
			},
			{ timeout: closeDelay + MAX_EXTRA }
		)

		expect(performance.now() - closeStart).toBeGreaterThanOrEqual(closeDelay)
		expect(performance.now() - closeStart).toBeLessThan(closeDelay + MAX_EXTRA)
	}
}

/**
 * Incorporates a visual directional indicator (`Tooltip.Arrow`) that points
 * back toward the trigger. This enhances spatial context, remaining aligned
 * with the trigger even as the component shifts or flips to stay within the
 * viewport.
 */
export const WithArrow: Story = {
	args: { children: '' },
	parameters: {
		controls: {
			include: ['placement', 'arrowPadding', 'tooltipText']
		}
	},
	render: args => {
		return (
			<div
				className={css({
					position: 'relative',
					display: 'flex',
					justifyContent: 'center',
					alignItems: 'center',
					padding: '2',
					boxSizing: 'border-box',
					borderWidth: 'thin',
					borderStyle: 'dashed',
					width: 'var(--sizes-64)',
					minHeight: 'calc(var(--sizes-48) + 1px * 2)',
					borderColor: 'violet.800'
				})}
			>
				<Tooltip.Root
					{...args}
					positioning={{
						placement: args.placement,
						gutter: args.gutter,
						overflowPadding: args.overflowPadding,
						arrowPadding: args.arrowPadding
					}}
				>
					<Tooltip.Trigger asChild>
						<Button variant="ghost">Tooltip</Button>
					</Tooltip.Trigger>
					<Tooltip.Positioner>
						<Tooltip.Content>tooltip content</Tooltip.Content>
						<Tooltip.Arrow>
							<Tooltip.ArrowTip />
						</Tooltip.Arrow>
					</Tooltip.Positioner>
				</Tooltip.Root>
			</div>
		)
	},
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement)
		const trigger = canvas.getByRole('button', { name: 'Tooltip' })

		await userEvent.hover(trigger)

		await waitFor(() => {
			const content = canvasElement.querySelector('[data-part="content"]')
			expect(content).toBeVisible()
			const arrow = canvasElement.querySelector('[data-part="arrow"]')
			expect(arrow).toBeVisible()
			const arrowTip = canvasElement.querySelector('[data-part="arrow-tip"]')
			expect(arrowTip).toBeVisible()
		})

		await userEvent.unhover(trigger)
	}
}

/**
 * Demonstrates manual control over the floating element's initial placement.
 * While the built-in collision detection may override this value if necessary,
 * `placement` strictly defines the preferred primary alignment.
 */
export const Placement: Story = {
	args: { children: '' },
	parameters: {
		controls: {
			include: ['placement', 'tooltipText']
		}
	},
	render: args => {
		return (
			<div
				className={css({
					position: 'relative',
					display: 'flex',
					justifyContent: 'center',
					alignItems: 'center',
					padding: '2',
					boxSizing: 'border-box',
					borderWidth: 'thin',
					borderStyle: 'dashed',
					width: 'var(--sizes-64)',
					minHeight: 'calc(var(--sizes-48) + 1px * 2)',
					borderColor: 'violet.800'
				})}
			>
				<Tooltip.Root
					{...args}
					positioning={{
						placement: args.placement,
						gutter: args.gutter,
						overflowPadding: args.overflowPadding,
						arrowPadding: args.arrowPadding
					}}
				>
					<Tooltip.Trigger asChild>
						<Button variant="ghost">Tooltip</Button>
					</Tooltip.Trigger>
					<Tooltip.Positioner>
						<Tooltip.Content>tooltip content</Tooltip.Content>
					</Tooltip.Positioner>
				</Tooltip.Root>
			</div>
		)
	},
	play: async ({ args, canvasElement }) => {
		const canvas = within(canvasElement)
		const trigger = canvas.getByRole('button', { name: 'Tooltip' })

		await userEvent.hover(trigger)

		await waitFor(() => {
			const content = canvasElement.querySelector('[data-part="content"]')
			expect(content).toHaveAttribute('data-placement', args.placement ?? 'top')
		})

		await userEvent.unhover(trigger)
	}
}

/**
 * Shows how the component behaves when reaching boundary limits. It
 * automatically overrides the preferred placement, shifting or flipping the
 * tooltip to fit within the available safe area.
 */
export const Collision: Story = {
	args: { children: '' },
	parameters: {
		controls: {
			include: ['placement', 'gutter', 'overflowPadding', 'tooltipText']
		}
	},
	render: args => {
		const [container, setContainer] = useState<HTMLDivElement | null>(null)
		return (
			<div
				className={css({
					position: 'relative',
					padding: '2',
					boxSizing: 'border-box',
					borderWidth: 'thin',
					borderStyle: 'dashed',
					width: 'var(--sizes-64)',
					minHeight: 'calc(var(--sizes-64) + 1px * 2)',
					borderColor: 'violet.800'
				})}
				data-testid="container"
				ref={setContainer}
			>
				<Tooltip.Root
					{...args}
					positioning={{
						boundary: () => (container ? [container] : []),
						gutter: args.gutter,
						overflowPadding: args.overflowPadding,
						placement: args.placement
					}}
				>
					<Tooltip.Trigger asChild>
						<Button
							variant="ghost"
							className={css({ position: 'absolute', top: '2', left: '2' })}
						>
							Tooltip
						</Button>
					</Tooltip.Trigger>
					<Tooltip.Positioner>
						<Tooltip.Content>{args.tooltipText}</Tooltip.Content>
					</Tooltip.Positioner>
				</Tooltip.Root>

				<Tooltip.Root
					{...args}
					positioning={{
						boundary: () => (container ? [container] : []),
						gutter: args.gutter,
						overflowPadding: args.overflowPadding,
						placement: args.placement
					}}
				>
					<Tooltip.Trigger asChild>
						<Button
							variant="ghost"
							className={css({ position: 'absolute', top: '2', right: '2' })}
						>
							Tooltip
						</Button>
					</Tooltip.Trigger>
					<Tooltip.Positioner>
						<Tooltip.Content>{args.tooltipText}</Tooltip.Content>
					</Tooltip.Positioner>
				</Tooltip.Root>

				<Tooltip.Root
					{...args}
					positioning={{
						boundary: () => (container ? [container] : []),
						gutter: args.gutter,
						overflowPadding: args.overflowPadding,
						placement: args.placement
					}}
				>
					<Tooltip.Trigger asChild>
						<Button
							variant="ghost"
							className={css({ position: 'absolute', bottom: '2', left: '2' })}
						>
							Tooltip
						</Button>
					</Tooltip.Trigger>
					<Tooltip.Positioner>
						<Tooltip.Content>{args.tooltipText}</Tooltip.Content>
					</Tooltip.Positioner>
				</Tooltip.Root>

				<Tooltip.Root
					{...args}
					positioning={{
						boundary: () => (container ? [container] : []),
						gutter: args.gutter,
						overflowPadding: args.overflowPadding,
						placement: args.placement
					}}
				>
					<Tooltip.Trigger asChild>
						<Button
							variant="ghost"
							className={css({ position: 'absolute', bottom: '2', right: '2' })}
						>
							Tooltip
						</Button>
					</Tooltip.Trigger>
					<Tooltip.Positioner>
						<Tooltip.Content>{args.tooltipText}</Tooltip.Content>
					</Tooltip.Positioner>
				</Tooltip.Root>
			</div>
		)
	},
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement)
		const triggers = canvas.getAllByRole('button', { name: 'Tooltip' })
		expect(triggers).toHaveLength(4)

		const container = canvas.getByTestId('container')
		const containerRect = container.getBoundingClientRect()

		for (const [i, trigger] of triggers.entries()) {
			await userEvent.hover(trigger)

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

			await userEvent.unhover(trigger)

			await waitFor(() => {
				const contents = canvasElement.querySelectorAll('[data-part="content"]')
				expect(contents[i]).not.toBeVisible()
			})
		}
	}
}

/**
 * An advanced composition pattern where a single `Tooltip.Root` manages
 * multiple triggers simultaneously. This yields significant performance gains
 * for rendering lists, as it dynamically swaps the content node based on the
 * active trigger's `value`.
 */
export const SharedContent: Story = {
	args: { children: '' },
	parameters: {
		controls: {
			include: ['placement', 'gutter']
		}
	},
	render: args => {
		const [activeTooltip, setActiveTooltip] = useState<{
			value: string
			content: ReactNode
		}>()

		const tooltips = [
			{
				value: 'tooltip-a',
				content: (
					<>
						tooltip <strong>a</strong> content
					</>
				)
			},
			{
				value: 'tooltip-b',
				content: (
					<>
						tooltip <strong>b</strong> content
					</>
				)
			}
		]

		return (
			<div
				className={css({
					position: 'relative',
					display: 'flex',
					justifyContent: 'center',
					alignItems: 'center',
					padding: '2',
					boxSizing: 'border-box',
					borderWidth: 'thin',
					borderStyle: 'dashed',
					width: 'var(--sizes-64)',
					minHeight: 'calc(var(--sizes-64) + 1px * 2)',
					borderColor: 'violet.800'
				})}
			>
				<Tooltip.Root
					{...args}
					positioning={{
						placement: args.placement,
						gutter: args.gutter,
						overflowPadding: args.overflowPadding
					}}
					onTriggerValueChange={({ triggerElement, value }) => {
						args.onTriggerValueChange?.({ triggerElement, value })
						setActiveTooltip(tooltips.find(t => t.value === value))
					}}
				>
					<div className={css({ display: 'flex', gap: '2' })}>
						<Tooltip.Trigger asChild value="tooltip-a">
							<Button variant="ghost">Tooltip A</Button>
						</Tooltip.Trigger>
						<Tooltip.Trigger asChild value="tooltip-b">
							<Button variant="ghost">Tooltip B</Button>
						</Tooltip.Trigger>
					</div>

					<Tooltip.Positioner>
						<Tooltip.Content>{activeTooltip?.content}</Tooltip.Content>
					</Tooltip.Positioner>
				</Tooltip.Root>
			</div>
		)
	},
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement)
		const triggerA = canvas.getByRole('button', { name: 'Tooltip A' })
		const triggerB = canvas.getByRole('button', { name: 'Tooltip B' })

		await userEvent.hover(triggerA)

		await waitFor(() => {
			const content = canvasElement.querySelector('[data-part="content"]')
			expect(content).toBeVisible()
			expect(content).toHaveTextContent('tooltip a content')
		})

		await userEvent.unhover(triggerA)

		await userEvent.hover(triggerB)

		await waitFor(() => {
			const content = canvasElement.querySelector('[data-part="content"]')
			expect(content).toBeVisible()
			expect(content).toHaveTextContent('tooltip b content')
		})

		await userEvent.unhover(triggerB)
	}
}

/**
 * Demonstrates the inversion of control pattern via `useTooltip` +
 * `Tooltip.RootProvider`. This is particularly useful when the tooltip state
 * logic must be hoisted, managed by an external component, or deeply integrated
 * with decoupled contexts.
 */
export const RootProvider: Story = {
	args: { children: '' },
	render: args => {
		const [container, setContainer] = useState<HTMLDivElement | null>(null)
		const tooltipApi = useTooltip({
			...args,
			positioning: {
				strategy: 'absolute',
				boundary: () => (container ? [container] : []),
				placement: args.placement,
				gutter: args.gutter,
				overflowPadding: args.overflowPadding,
				arrowPadding: args.arrowPadding
			}
		})

		return (
			<div
				className={css({
					position: 'relative',
					display: 'flex',
					justifyContent: 'center',
					alignItems: 'center',
					padding: '2',
					boxSizing: 'border-box',
					borderWidth: 'thin',
					borderStyle: 'dashed',
					width: 'var(--sizes-64)',
					minHeight: 'calc(var(--sizes-48) + 1px * 2)',
					borderColor: 'violet.800'
				})}
				data-testid="container"
				ref={setContainer}
			>
				<Tooltip.RootProvider {...tooltipApi}>
					<Tooltip.Trigger asChild>
						<Button variant="ghost">tooltip</Button>
					</Tooltip.Trigger>
					<Tooltip.Positioner>
						<Tooltip.Arrow data-testid="arrow">
							<Tooltip.ArrowTip />
						</Tooltip.Arrow>
						<Tooltip.Content>{args.tooltipText}</Tooltip.Content>
					</Tooltip.Positioner>
				</Tooltip.RootProvider>
			</div>
		)
	},
	play: async ({ args, canvasElement }) => {
		const canvas = within(canvasElement)
		const trigger = canvas.getByRole('button', { name: 'tooltip' })

		const MAX_EXTRA = 150
		const openDelay = args.openDelay ?? 0
		const closeDelay = args.closeDelay ?? 0

		await userEvent.hover(trigger)

		await waitFor(
			() => {
				const content = canvasElement.querySelector('[data-part="content"]')
				expect(content).toBeVisible()
			},
			{ timeout: openDelay + MAX_EXTRA }
		)

		await userEvent.unhover(trigger)

		await waitFor(
			() => {
				const content = canvasElement.querySelector('[data-part="content"]')
				expect(content).not.toBeVisible()
			},
			{ timeout: closeDelay + MAX_EXTRA }
		)
	}
}

/**
 * Integrates Tooltip with a `Presence` wrapper to orchestrate smooth, CSS-based
 * entrance and exit animations. By tapping into `data-placement` attributes,
 * the transitions intelligently align with the direction the tooltip opened
 * from.
 */
export const WithAnimation: Story = {
	args: {
		children: '',
		tooltipText:
			'Tenuis solum minima vestrum. Comprehendo quibusdam nobis veritatis sopor benigne. Usque dignissimos audeo reprehenderit admitto amplitudo crepusculum cimentarius. Sapiente auctus vulnus tergo virgo nisi tardus cognatus blanditiis brevis. Tabesco delectus tempora ex vae crepusculum venia. Veritas sodalitas commemoro coepi sulum sollers pecus supplanto texo.',
		closeOnScroll: false
	},
	parameters: {
		controls: {
			include: [
				'openDelay',
				'closeDelay',
				'closeOnPointerDown',
				'closeOnEscape',
				'closeOnScroll',
				'closeOnClick',
				'interative',
				'placement',
				'gutter',
				'overflowPadding',
				'arrowPadding',
				'disabled',
				'tooltipText'
			]
		}
	},
	render: args => {
		const [open, setOpen] = useState(false)
		const [container, setContainer] = useState<HTMLDivElement | null>(null)

		return (
			<div
				className={css({
					position: 'relative',
					padding: '2',
					boxSizing: 'border-box',
					borderWidth: 'thin',
					borderStyle: 'dashed',
					width: 'var(--sizes-64)',
					minHeight: 'calc(var(--sizes-64) + 1px * 2)',
					borderColor: 'violet.800'
				})}
				ref={setContainer}
			>
				<Tooltip.Root
					{...args}
					open={open}
					onOpenChange={({ open }) => setOpen(open)}
					positioning={{
						strategy: 'absolute',
						boundary: () => (container ? [container] : []),
						gutter: args.gutter,
						overflowPadding: args.overflowPadding,
						arrowPadding: args.arrowPadding
					}}
				>
					<Tooltip.Trigger asChild>
						<Button variant="ghost">tooltip</Button>
					</Tooltip.Trigger>

					{container && (
						<Presence.Root present={open}>
							<Portal container={{ current: container }}>
								<Tooltip.Positioner>
									<Presence.Gate
										className={css({
											_open: {
												willChange: 'translate, opacity',
												animationDuration: '500ms, 200ms',
												animationTimingFunction:
													'var(--easings-m3-exp-spatial), var(--easings-m3-exp-effects)',
												'&:has([data-placement^=top])': {
													animationName: 'slide-from-bottom, fade-in'
												},
												'&:has([data-placement^=right])': {
													animationName: 'slide-from-left, fade-in'
												},
												'&:has([data-placement^=bottom])': {
													animationName: 'slide-from-top, fade-in'
												},
												'&:has([data-placement^=left])': {
													animationName: 'slide-from-right, fade-in'
												}
											},
											_closed: {
												animationDuration: '350ms, 150ms',
												animationTimingFunction:
													'var(--easings-m3-exp-fast-spatial), var(--easings-m3-exp-fast-effects)',
												'&:has([data-placement^=top])': {
													animationName: 'slide-to-bottom, fade-out'
												},
												'&:has([data-placement^=right])': {
													animationName: 'slide-to-left, fade-out'
												},
												'&:has([data-placement^=bottom])': {
													animationName: 'slide-to-top, fade-out'
												},
												'&:has([data-placement^=left])': {
													animationName: 'slide-to-right, fade-out'
												}
											}
										})}
									>
										{props => (
											<>
												<Tooltip.Arrow {...props}>
													<Tooltip.ArrowTip />
												</Tooltip.Arrow>
												<Tooltip.Content {...props}>
													{args.tooltipText}
												</Tooltip.Content>
											</>
										)}
									</Presence.Gate>
								</Tooltip.Positioner>
							</Portal>
						</Presence.Root>
					)}
				</Tooltip.Root>
			</div>
		)
	},
	play: async ({ args, canvasElement }) => {
		const canvas = within(canvasElement)
		const trigger = canvas.getByRole('button', { name: 'tooltip' })

		const MAX_EXTRA = 1000
		const openDelay = args.openDelay ?? 0
		const closeDelay = args.closeDelay ?? 0

		await waitFor(() => {
			const presenceEl = canvasElement.querySelector('[data-scope="presence"]')
			expect(presenceEl).toBeInTheDocument()
		})

		await userEvent.unhover(trigger)

		await userEvent.hover(trigger)

		await waitFor(
			() => {
				const presenceEl = canvasElement.querySelector(
					'[data-scope="presence"]'
				)
				expect(presenceEl).toBeVisible()
				expect(presenceEl).not.toHaveStyle({ display: 'none' })
				expect(presenceEl).toHaveAttribute('data-state', 'open')
			},
			{ timeout: openDelay + MAX_EXTRA }
		)

		await userEvent.unhover(trigger)

		await waitFor(
			() => {
				const presenceEl = canvasElement.querySelector(
					'[data-scope="presence"]'
				)
				expect(presenceEl).toHaveStyle({ display: 'none' })
				expect(presenceEl).toHaveAttribute('data-state', 'closed')
			},
			{ timeout: closeDelay + MAX_EXTRA }
		)
	}
}
