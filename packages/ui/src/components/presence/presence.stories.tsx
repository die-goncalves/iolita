import { css } from '@iolita/styled-system/css'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { Portal } from '@zag-js/react'
import { type ComponentProps, type RefObject, useRef, useState } from 'react'
import { expect, userEvent, waitFor, within } from 'storybook/test'
import { Button } from '../button'
import { Presence } from '.'

type StoryProps = ComponentProps<typeof Presence.Root> & {
	activity?: boolean
}
// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
/**
 * Controls the enter/exit lifecycle of animated elements — keeping them
 * mounted long enough to finish exit animations, then hiding or
 * unmounting them based on `unmountOnExit` and `activity`.
 */
const meta: Meta<StoryProps> = {
	title: 'Components/Presence',
	component: Presence.Root,
	parameters: {
		// Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/configure/story-layout
		layout: 'centered'
	},
	// This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/writing-docs/autodocs
	tags: ['autodocs'],
	// More on argTypes: https://storybook.js.org/docs/api/arg-types
	argTypes: {
		children: {
			description: 'Specify the presence content'
		},
		unmountOnExit: {
			control: 'boolean',
			description:
				'When true, removes the content from the DOM once the exit transition finishes. When false, the content stays mounted and is only hidden.',
			table: {
				type: {
					summary: 'boolean'
				}
			}
		},
		activity: {
			control: 'boolean',
			description:
				"When true, wraps the content in React's `Activity` component, pausing its effects while hidden instead of leaving them running.",
			table: {
				type: {
					summary: 'boolean'
				}
			}
		}
	}
	// Use `fn` to spy on the onClick arg, which will appear in the actions panel once invoked: https://storybook.js.org/docs/essentials/actions#story-args
	// args: { onClick: fn() }
} satisfies Meta<StoryProps>

export default meta
type Story = StoryObj<typeof meta>

// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args
/**
 * Toggles content visibility with animated enter/exit transitions. Whether
 * the element is removed from the DOM or just hidden after the exit
 * animation depends on `unmountOnExit` — either way, it stays in the DOM
 * long enough for the animation to finish playing.
 */
export const Overview: Story = {
	args: { children: 'presence content', unmountOnExit: false, activity: false },
	render: args => {
		const [open, setOpen] = useState(false)
		return (
			<div
				className={css({
					position: 'relative',
					display: 'grid',
					gridTemplateRows: 'min-content repeat(1, minmax(0, 1fr))',
					rowGap: '2'
				})}
			>
				<Button
					variant="ghost"
					onClick={() => setOpen(prev => !prev)}
					className={css({ width: '100%' })}
				>
					Click me
				</Button>
				<div
					className={css({
						padding: '2',
						boxSizing: 'border-box',
						borderWidth: 'thin',
						borderStyle: 'dashed',
						width: 'var(--sizes-48)',
						minHeight: 'calc(var(--sizes-14) + 1px * 2)',
						borderColor: 'violet.800'
					})}
				>
					<Presence.Root present={open} unmountOnExit={args.unmountOnExit}>
						<Presence.Gate
							activity={args.activity}
							className={css({
								_open: {
									animationName: 'fade-in',
									animationDuration: '200ms',
									animationTimingFunction: 'm3-exp-effects'
								},
								_closed: {
									animationName: 'fade-out',
									animationDuration: '150ms',
									animationTimingFunction: 'm3-exp-fast-effects'
								}
							})}
						>
							<div
								className={css({
									padding: '2',
									background: 'violet.800',
									color: 'white'
								})}
							>
								<p>
									{typeof args.children === 'function' ? null : args.children}
								</p>
							</div>
						</Presence.Gate>
					</Presence.Root>
				</div>
			</div>
		)
	},
	play: async ({ args, canvasElement }) => {
		const canvas = within(canvasElement)
		const trigger = canvas.getByRole('button')
		let presenceEl = canvasElement.querySelector('[data-scope="presence"]')

		if (args.unmountOnExit) {
			expect(presenceEl).not.toBeInTheDocument()
		} else {
			if (args.activity) {
				expect(presenceEl).toHaveStyle({ display: 'none' })
				expect(presenceEl).not.toHaveAttribute('hidden')
			} else {
				expect(presenceEl).toHaveAttribute('hidden')
			}
		}

		await userEvent.click(trigger)

		await waitFor(
			() => {
				presenceEl = canvasElement.querySelector('[data-scope="presence"]')
				expect(presenceEl).toBeVisible()
				if (args.activity) {
					expect(presenceEl).not.toHaveStyle({ display: 'none' })
				} else {
					expect(presenceEl).not.toHaveAttribute('hidden')
				}
				expect(presenceEl).toHaveAttribute('data-state', 'open')
			},
			{ timeout: 250 }
		)

		await userEvent.click(trigger)

		await waitFor(
			() => {
				presenceEl = canvasElement.querySelector('[data-scope="presence"]')
				if (args.unmountOnExit) {
					expect(presenceEl).not.toBeInTheDocument()
				} else {
					if (args.activity) {
						expect(presenceEl).toHaveStyle({ display: 'none' })
						expect(presenceEl).not.toHaveAttribute('hidden')
					} else {
						expect(presenceEl).toHaveAttribute('hidden')
					}
					expect(presenceEl).toHaveAttribute('data-state', 'closed')
				}
			},
			{ timeout: 200 }
		)
	}
}

/**
 * Same enter/exit behavior as `Overview`, but the content is rendered into
 * a separate DOM container via `Portal` — useful when an element needs to
 * escape a parent, such as **modals**, **tooltips**, and **popovers**.
 */
export const WithPortal: Story = {
	args: { children: 'presence content', unmountOnExit: false, activity: false },
	render: args => {
		const containerRef = useRef<HTMLDivElement>(null)
		const [open, setOpen] = useState(false)
		return (
			<div
				className={css({
					position: 'relative',
					display: 'grid',
					gridTemplateRows: 'min-content repeat(1, minmax(0, 1fr))',
					rowGap: '2'
				})}
			>
				<Button
					variant="ghost"
					onClick={() => setOpen(prev => !prev)}
					className={css({ width: '100%' })}
				>
					Click me
				</Button>

				<div
					ref={containerRef}
					className={css({
						padding: '2',
						boxSizing: 'border-box',
						borderWidth: 'thin',
						borderStyle: 'dashed',
						width: 'var(--sizes-48)',
						minHeight: 'calc(var(--sizes-14) + 1px * 2)',
						borderColor: 'violet.800'
					})}
				></div>
				<Presence.Root present={open} unmountOnExit={args.unmountOnExit}>
					<Portal container={containerRef as RefObject<HTMLElement>}>
						<Presence.Gate
							activity={args.activity}
							className={css({
								_open: {
									animationName: 'fade-in',
									animationDuration: '200ms',
									animationTimingFunction: 'm3-exp-effects'
								},
								_closed: {
									animationName: 'fade-out',
									animationDuration: '150ms',
									animationTimingFunction: 'm3-exp-fast-effects'
								}
							})}
						>
							<div
								className={css({
									padding: '2',
									background: 'violet.800',
									color: 'white'
								})}
							>
								<p>
									{typeof args.children === 'function' ? null : args.children}
								</p>
							</div>
						</Presence.Gate>
					</Portal>
				</Presence.Root>
			</div>
		)
	},
	play: async ({ args, canvasElement }) => {
		const canvas = within(canvasElement)
		const trigger = canvas.getByRole('button')
		let presenceEl = canvasElement.querySelector('[data-scope="presence"]')

		expect(presenceEl).not.toBeInTheDocument()

		await userEvent.click(trigger)

		await waitFor(
			() => {
				presenceEl = canvasElement.querySelector('[data-scope="presence"]')
				expect(presenceEl).toBeVisible()
				if (args.activity) {
					expect(presenceEl).not.toHaveStyle({ display: 'none' })
				} else {
					expect(presenceEl).not.toHaveAttribute('hidden')
				}
				expect(presenceEl).toHaveAttribute('data-state', 'open')
			},
			{ timeout: 250 }
		)

		await userEvent.click(trigger)

		await waitFor(
			() => {
				presenceEl = canvasElement.querySelector('[data-scope="presence"]')
				if (args.unmountOnExit) {
					expect(presenceEl).not.toBeInTheDocument()
				} else {
					if (args.activity) {
						expect(presenceEl).toHaveStyle({ display: 'none' })
						expect(presenceEl).not.toHaveAttribute('hidden')
					} else {
						expect(presenceEl).toHaveAttribute('hidden')
					}
					expect(presenceEl).toHaveAttribute('data-state', 'closed')
				}
			},
			{ timeout: 200 }
		)
	}
}

function Movies() {
	const [isExpanded, setIsExpanded] = useState(false)
	return (
		<nav className={css({ width: '100%' })}>
			<Button
				variant="solid"
				onClick={() => setIsExpanded(prev => !prev)}
				iconPlacement="right"
				icon={
					<svg
						aria-hidden="true"
						xmlns="http://www.w3.org/2000/svg"
						height="24px"
						viewBox="0 -960 960 960"
						width="24px"
						fill="#000000"
					>
						<path d="M480-360 280-559h400L480-360Z" />
					</svg>
				}
				className={css({ width: '100%' })}
			>
				Sci-Fi Movie List
			</Button>

			{isExpanded && (
				<ul className={css({ marginBlockStart: '2' })}>
					<li>Project Hail Mary</li>
					<li>Disclosure Day</li>
					<li>Arrival</li>
					<li>Starship Troopers</li>
					<li>Signs</li>
					<li>Fire in the Sky</li>
					<li>District 9</li>
					<li>The Vast of Night</li>
				</ul>
			)}
		</nav>
	)
}

/**
 * Toggling `activity` and `unmountOnExit` below changes what happens to
 * the content once it's hidden or unmounted— not just whether it looks the
 * same, but whether it's really still "alive" underneath.
 *
 * `activity` decides if the content's effects (timers, subscriptions, etc.)
 * keep running while hidden or get paused along with it, using React's
 * `Activity` under the hood. `unmountOnExit` decides if the content
 * survives being closed at all, or gets torn down for good once the exit
 * animation ends.
 * - `activity={false}` + `unmountOnExit={false}`: State is preserved, but
 * effects continue running while hidden.
 * - `activity={true}` + `unmountOnExit={false}` **(recommended default)**: Effects
 * are paused while hidden and local state is preserved.
 * - `activity={true}` + `unmountOnExit={true}`: Effects are paused as soon
 * as the content is hidden; once the exit animation ends, it's unmounted
 * and state is discarded too.
 * - `activity={false}` + `unmountOnExit={true}`: State and effects are
 * discarded on every close — the other common choice.
 */
export const StatePreservedWithActivity: Story = {
	argTypes: {
		children: { table: { disable: true } }
	},
	args: { children: <Movies />, unmountOnExit: false, activity: true },
	parameters: {
		docs: {
			source: {
				code: `
function Movies() {
  const [isExpanded, setIsExpanded] = useState(false)
  return (
  	<nav className={css({ width: '100%' })}>
      <Button
        variant="solid"
        onClick={() => setIsExpanded(prev => !prev)}
        iconPlacement="right"
        icon={
          <svg
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            height="24px"
            viewBox="0 -960 960 960"
            width="24px"
            fill="#000000"
          >
            <path d="M480-360 280-559h400L480-360Z" />
          </svg>
        }
        className={css({ width: '100%' })}
      >
        Sci-Fi Movie List
      </Button>

      {isExpanded && (
        <ul className={css({ marginBlockStart: '2' })}>
          <li>Project Hail Mary</li>
          <li>Disclosure Day</li>
          <li>Arrival</li>
          <li>Starship Troopers</li>
          <li>Signs</li>
          <li>Fire in the Sky</li>
          <li>District 9</li>
          <li>The Vast of Night</li>
        </ul>
      )}
  	</nav>
  )
}

function StatePreservedWithActivity() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [open, setOpen] = useState(false)
  return (
    <div
      className={css({
        position: 'relative',
        display: 'grid',
        gridTemplateRows: 'min-content repeat(1, minmax(0, 1fr))',
        rowGap: '2'
      })}
    >
      <Button
        variant="ghost"
        onClick={() => setOpen(prev => !prev)}
        className={css({ width: '100%' })}
      >
        Click me
      </Button>

      <div
        ref={containerRef}
        className={css({
          padding: '2',
          boxSizing: 'border-box',
          borderWidth: 'thin',
          borderStyle: 'dashed',
          width: 'var(--sizes-48)',
          minHeight: 'calc(var(--sizes-64) + 1px * 2)',
          borderColor: 'violet.800'
        })}
      ></div>
      <Presence.Root
        present={open}
        unmountOnExit={args.unmountOnExit}
        activity={args.activity}
      >
        <Portal container={containerRef as RefObject<HTMLElement>}>
          <Presence.Gate
            className={css({
              _open: {
                animationName: 'fade-in',
                animationDuration: '200ms',
                animationTimingFunction: 'm3-exp-effects'
              },
              _closed: {
                animationName: 'fade-out',
                animationDuration: '150ms',
                animationTimingFunction: 'm3-exp-fast-effects'
              }
            })}
          >
            <Movies />
          </Presence.Gate>
        </Portal>
      </Presence.Root>
    </div>
  )
}
				`.trim(),
				language: 'tsx',
				type: 'code'
			}
		}
	},
	render: args => {
		const containerRef = useRef<HTMLDivElement>(null)
		const [open, setOpen] = useState(false)
		return (
			<div
				className={css({
					position: 'relative',
					display: 'grid',
					gridTemplateRows: 'min-content repeat(1, minmax(0, 1fr))',
					rowGap: '2'
				})}
			>
				<Button
					variant="ghost"
					onClick={() => setOpen(prev => !prev)}
					className={css({ width: '100%' })}
				>
					Click me
				</Button>

				<div
					ref={containerRef}
					className={css({
						padding: '2',
						boxSizing: 'border-box',
						borderWidth: 'thin',
						borderStyle: 'dashed',
						width: 'var(--sizes-48)',
						minHeight: 'calc(var(--sizes-64) + 1px * 2)',
						borderColor: 'violet.800'
					})}
				></div>
				<Presence.Root present={open} unmountOnExit={args.unmountOnExit}>
					<Portal container={containerRef as RefObject<HTMLElement>}>
						<Presence.Gate
							activity={args.activity}
							className={css({
								_open: {
									animationName: 'fade-in',
									animationDuration: '200ms',
									animationTimingFunction: 'm3-exp-effects'
								},
								_closed: {
									animationName: 'fade-out',
									animationDuration: '150ms',
									animationTimingFunction: 'm3-exp-fast-effects'
								}
							})}
						>
							{typeof args.children === 'function' ? null : args.children}
						</Presence.Gate>
					</Portal>
				</Presence.Root>
			</div>
		)
	},
	play: async ({ args, canvasElement }) => {
		const canvas = within(canvasElement)
		const trigger = canvas.getByRole('button')
		let presenceEl = canvasElement.querySelector('[data-scope="presence"]')

		expect(presenceEl).not.toBeInTheDocument()

		await userEvent.click(trigger)

		await waitFor(
			() => {
				expect(canvas.getByText('Sci-Fi Movie List')).toBeVisible()
			},
			{ timeout: 250 }
		)

		await userEvent.click(canvas.getByText('Sci-Fi Movie List'))

		await waitFor(() => {
			expect(canvas.queryByRole('list')).toBeInTheDocument()
		})

		await userEvent.click(trigger)

		await waitFor(
			() => {
				presenceEl = canvasElement.querySelector('[data-scope="presence"]')
				if (args.unmountOnExit) {
					expect(presenceEl).not.toBeInTheDocument()
				} else {
					if (args.activity) {
						expect(presenceEl).toHaveStyle({ display: 'none' })
						expect(presenceEl).not.toHaveAttribute('hidden')
					} else {
						expect(presenceEl).toHaveAttribute('hidden')
					}
					expect(presenceEl).toHaveAttribute('data-state', 'closed')
				}
			},
			{ timeout: 200 }
		)

		await userEvent.click(trigger)

		await waitFor(
			() => {
				presenceEl = canvasElement.querySelector('[data-scope="presence"]')
				expect(presenceEl).toHaveAttribute('data-state', 'open')
			},
			{ timeout: 250 }
		)

		await waitFor(() => {
			if (args.unmountOnExit) {
				expect(canvas.queryByRole('list')).not.toBeInTheDocument()
			} else {
				expect(canvas.queryByRole('list')).toBeInTheDocument()
			}
		})
	}
}
