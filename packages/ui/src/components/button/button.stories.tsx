import { css } from '@iolita/styled-system/css'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'
import { expect, fn, userEvent, waitFor, within } from 'storybook/test'
import { Button } from './button'

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
/**
 * A clickable element used to trigger an action or event, such as
 * submitting a form or opening a dialog.
 */
const meta = {
	title: 'Components/Button',
	component: Button,
	parameters: {
		// Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/configure/story-layout
		layout: 'centered'
	},
	// This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/writing-docs/autodocs
	tags: ['autodocs'],
	// More on argTypes: https://storybook.js.org/docs/api/arg-types
	argTypes: {
		variant: {
			control: 'select',
			options: ['solid', 'ghost'],
			description: 'Specify the button kind',
			table: {
				type: {
					summary: 'solid | ghost'
				}
			}
		},
		size: {
			control: 'select',
			options: ['sm', 'md'],
			description: 'Specify the button size',
			table: {
				type: {
					summary: 'sm | md'
				}
			}
		},
		loading: {
			description: 'Whether the button is in a loading state.'
		},
		children: {
			description: 'Specify the button content'
		},
		icon: {
			control: false,
			description: 'Icon element rendered alongside the label'
		},
		iconPlacement: {
			description: 'Position of the icon relative to the label',
			table: {
				type: {
					summary: 'left | right'
				}
			}
		},
		onClick: {
			control: false,
			description: 'Callback function to run when the button is clicked'
		}
	},
	// Use `fn` to spy on the onClick arg, which will appear in the actions panel once invoked: https://storybook.js.org/docs/essentials/actions#story-args
	args: { onClick: fn() }
} satisfies Meta<typeof Button>

export default meta
type Story = StoryObj<typeof meta>

// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args
/**
 * Default configuration: solid variant, medium size, icon on the left.
 */
export const Overview: Story = {
	args: {
		variant: 'solid',
		size: 'md',
		iconPlacement: 'left',
		children: 'Button'
	}
}

/**
 * Renders both variants side by side for visual comparison, `solid` for primary actions, `ghost` for secondary or low-emphasis actions.
 */
export const Variant: Story = {
	argTypes: {
		children: { table: { disable: true } },
		icon: { table: { disable: true } },
		iconPlacement: { table: { disable: true } },
		onClick: { table: { disable: true } },
		variant: { table: { disable: true } }
	},
	args: { size: 'md' },
	render: args => (
		<div
			className={css({
				display: 'flex',
				gap: '4',
				alignItems: 'flex-start'
			})}
		>
			<Button {...args} variant="solid">
				Solid
			</Button>
			<Button {...args} variant="ghost">
				Ghost
			</Button>
		</div>
	),
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement)
		const solidButton = canvas.getByRole('button', { name: 'Solid' })
		await expect(solidButton).toBeInTheDocument()
		await expect(solidButton).toHaveClass('button--variant_solid')
		const ghostButton = canvas.getByRole('button', { name: 'Ghost' })
		await expect(ghostButton).toBeInTheDocument()
		await expect(ghostButton).toHaveClass('button--variant_ghost')
	}
}

/**
 * Renders both sizes side by side for visual comparison, `sm` for compact layouts, `md` for standard use.
 */
export const Size: Story = {
	argTypes: {
		children: { table: { disable: true } },
		icon: { table: { disable: true } },
		iconPlacement: { table: { disable: true } },
		onClick: { table: { disable: true } },
		size: { table: { disable: true } }
	},
	args: { variant: 'solid' },
	render: args => (
		<div
			className={css({
				display: 'flex',
				gap: '4',
				alignItems: 'flex-start'
			})}
		>
			<Button {...args} size="sm">
				Small
			</Button>
			<Button {...args} size="md">
				Medium
			</Button>
		</div>
	),
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement)
		const smallButton = canvas.getByRole('button', { name: 'Small' })
		await expect(smallButton).toBeInTheDocument()
		await expect(smallButton).toHaveClass('button--size_sm')
		const mediumButton = canvas.getByRole('button', { name: 'Medium' })
		await expect(mediumButton).toBeInTheDocument()
		await expect(mediumButton).toHaveClass('button--size_md')
	}
}

/**
 * A disabled button ignores clicks and swaps its icon/text color, regardless of variant.
 */
export const Disabled: Story = {
	argTypes: {
		icon: { table: { disable: true } },
		loading: { table: { disable: true } }
	},
	args: {
		variant: 'solid',
		size: 'md',
		disabled: true,
		children: 'Button',
		iconPlacement: 'left',
		icon: (
			<svg
				xmlns="http://www.w3.org/2000/svg"
				height="24px"
				viewBox="0 -960 960 960"
				width="24px"
				fill="currentColor"
				aria-hidden="true"
			>
				<path d="m480-121-41-37q-105.77-97.12-174.88-167.56Q195-396 154-451.5T96.5-552Q80-597 80-643q0-90.15 60.5-150.58Q201-854 290-854q57 0 105.5 27t84.5 78q42-54 89-79.5T670-854q89 0 149.5 60.42Q880-733.15 880-643q0 46-16.5 91T806-451.5Q765-396 695.88-325.56 626.77-255.12 521-158l-41 37Zm0-79q101.24-93 166.62-159.5Q712-426 750.5-476t54-89.14q15.5-39.13 15.5-77.72 0-66.14-42-108.64T670.22-794q-51.52 0-95.37 31.5T504-674h-49q-26-56-69.85-88-43.85-32-95.37-32Q224-794 182-751.5t-42 108.82q0 38.68 15.5 78.18 15.5 39.5 54 90T314-358q66 66 166 158Zm0-297Z" />
			</svg>
		)
	},
	play: async ({ args, canvasElement }) => {
		const canvas = within(canvasElement)
		const button = canvas.getByRole('button')
		const icon = button.querySelector('svg')
		await expect(icon).toHaveAttribute('aria-hidden', 'true')
		await expect(button).toBeDisabled()
		await userEvent.click(button)
		await expect(args.onClick).not.toHaveBeenCalled()
	}
}

/**
 * The loading state uses `aria-busy` and `aria-disabled` to prevent interaction while keeping the button focusable for accessibility. **The component does not announce state changes automatically** — if the button label or a status message needs to be announced by screen readers, provide a separate `aria-live` element (see the `Loading (with status announcement)` story).
 */
export const Loading: Story = {
	argTypes: { icon: { table: { disable: true } } },
	args: {
		variant: 'solid',
		size: 'md',
		children: 'Button',
		iconPlacement: 'left',
		icon: (
			<svg
				xmlns="http://www.w3.org/2000/svg"
				height="24px"
				viewBox="0 -960 960 960"
				width="24px"
				fill="currentColor"
				aria-hidden="true"
			>
				<path d="M323-111q-73-31-127-85t-85-127q-31-73-31-157t31-157q31-73 85-127t127-85q73-31 157-31 12 0 21 9t9 21q0 12-9 21t-21 9q-141 0-240.5 99.5T140-480q0 141 99.5 240.5T480-140q141 0 240.5-99.5T820-480q0-12 9-21t21-9q12 0 21 9t9 21q0 84-31 157t-85 127q-54 54-127 85T480-80q-84 0-157-31Z" />
			</svg>
		),
		loading: true
	},
	play: async ({ args, canvasElement }) => {
		const canvas = within(canvasElement)
		const button = canvas.getByRole('button')
		const icon = button.querySelector('svg')
		await expect(icon).toHaveAttribute('aria-hidden', 'true')
		await expect(button).toHaveAttribute('aria-disabled', 'true')
		await expect(button).toHaveAttribute('aria-busy', 'true')
		await expect(button).not.toBeDisabled()
		button.focus()
		await expect(button).toHaveFocus()
		await userEvent.click(button)
		await expect(args.onClick).not.toHaveBeenCalled()
	}
}

/**
 * Recommended pattern when the button label remains unchanged during loading. A separate element with `role="status"` ensures that assistive technologies announce the loading state.
 */
export const LoadingWithStatusAnnouncement: Story = {
	name: 'Loading (with status announcement)',
	argTypes: {
		children: { table: { disable: true } },
		icon: { table: { disable: true } },
		loading: { table: { disable: true } },
		onClick: { table: { disable: true } }
	},
	args: {
		variant: 'solid',
		iconPlacement: 'left',
		size: 'md',
		onClick: fn(() => new Promise(resolve => setTimeout(resolve, 2000)))
	},
	render: ({ onClick, iconPlacement = 'left', variant, size }) => {
		const [loading, setLoading] = useState(false)

		const handleClick = async () => {
			setLoading(true)
			try {
				await onClick?.()
			} finally {
				setLoading(false)
			}
		}

		return (
			<>
				<Button
					variant={variant}
					size={size}
					loading={loading}
					onClick={handleClick}
					icon={
						loading ? (
							<svg
								xmlns="http://www.w3.org/2000/svg"
								height="24px"
								viewBox="0 -960 960 960"
								width="24px"
								fill="currentColor"
								aria-hidden="true"
							>
								<path d="M323-111q-73-31-127-85t-85-127q-31-73-31-157t31-157q31-73 85-127t127-85q73-31 157-31 12 0 21 9t9 21q0 12-9 21t-21 9q-141 0-240.5 99.5T140-480q0 141 99.5 240.5T480-140q141 0 240.5-99.5T820-480q0-12 9-21t21-9q12 0 21 9t9 21q0 84-31 157t-85 127q-54 54-127 85T480-80q-84 0-157-31Z" />
							</svg>
						) : undefined
					}
					iconPlacement={iconPlacement}
				>
					Salvar
				</Button>
				<span className={css({ srOnly: true })} role="status">
					{loading ? 'Salvando alterações' : ''}
				</span>
			</>
		)
	},
	play: async ({ args, canvasElement }) => {
		const canvas = within(canvasElement)
		const button = canvas.getByRole('button')
		const status = await canvas.findByRole('status')
		await expect(button).not.toHaveAttribute('aria-busy')
		await expect(status).toHaveTextContent('')
		await userEvent.click(button)
		await expect(button).toHaveAttribute('aria-busy', 'true')
		await expect(status).toHaveTextContent('Salvando alterações')
		await expect(args.onClick).toHaveBeenCalledOnce()
		await waitFor(
			() => {
				expect(button).not.toHaveAttribute('aria-busy')
				expect(status).toHaveTextContent('')
			},
			{ timeout: 2500 }
		)
	}
}

/**
 * The icon can be rendered on either side of the label via `iconPlacement`.
 */
export const IconPlacement: Story = {
	name: 'Icon Placement',
	argTypes: {
		children: { table: { disable: true } },
		icon: { table: { disable: true } },
		iconPlacement: { table: { disable: true } },
		onClick: { table: { disable: true } }
	},
	args: {
		variant: 'solid',
		size: 'md',
		icon: (
			<svg
				xmlns="http://www.w3.org/2000/svg"
				height="24px"
				viewBox="0 -960 960 960"
				width="24px"
				fill="currentColor"
				aria-hidden="true"
			>
				<path d="m480-121-41-37q-105.77-97.12-174.88-167.56Q195-396 154-451.5T96.5-552Q80-597 80-643q0-90.15 60.5-150.58Q201-854 290-854q57 0 105.5 27t84.5 78q42-54 89-79.5T670-854q89 0 149.5 60.42Q880-733.15 880-643q0 46-16.5 91T806-451.5Q765-396 695.88-325.56 626.77-255.12 521-158l-41 37Zm0-79q101.24-93 166.62-159.5Q712-426 750.5-476t54-89.14q15.5-39.13 15.5-77.72 0-66.14-42-108.64T670.22-794q-51.52 0-95.37 31.5T504-674h-49q-26-56-69.85-88-43.85-32-95.37-32Q224-794 182-751.5t-42 108.82q0 38.68 15.5 78.18 15.5 39.5 54 90T314-358q66 66 166 158Zm0-297Z" />
			</svg>
		)
	},
	render: args => (
		<div
			className={css({
				display: 'flex',
				gap: '4',
				alignItems: 'flex-start'
			})}
		>
			<Button {...args} iconPlacement="left">
				Left
			</Button>
			<Button {...args} iconPlacement="right">
				Right
			</Button>
		</div>
	),
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement)
		await expect(
			canvas.getByRole('button', { name: 'Left' })
		).toBeInTheDocument()
		const left = canvas.getByRole('button', { name: 'Left' })
		const leftIcon = left.querySelector('svg')
		await expect(leftIcon).toHaveAttribute('aria-hidden', 'true')
		await expect(left).toHaveAttribute('data-icon-placement', 'left')
		await expect(
			canvas.getByRole('button', { name: 'Right' })
		).toBeInTheDocument()
		const right = canvas.getByRole('button', { name: 'Right' })
		const rightIcon = left.querySelector('svg')
		await expect(rightIcon).toHaveAttribute('aria-hidden', 'true')
		await expect(right).toHaveAttribute('data-icon-placement', 'right')
	}
}

/**
 * The button invokes `onClick` exactly once per click.
 */
export const ClickInteraction: Story = {
	argTypes: {
		icon: { table: { disable: true } },
		iconPlacement: { table: { disable: true } }
	},
	args: {
		children: 'Click me',
		disabled: false,
		loading: false,
		size: 'md',
		variant: 'solid'
	},
	play: async ({ args, canvasElement }) => {
		const canvas = within(canvasElement)
		const button = canvas.getByRole('button', { name: 'Click me' })

		await userEvent.click(button)

		await expect(args.onClick).toHaveBeenCalledOnce()
	}
}

/**
 * A focused button activates on both `Enter` and `Space`, per native button keyboard semantics.
 */
export const KeyboardNavigation: Story = {
	name: 'Keyboard Navigation',
	argTypes: {
		icon: { table: { disable: true } },
		iconPlacement: { table: { disable: true } }
	},
	args: {
		children: 'Button',
		disabled: false,
		loading: false,
		size: 'md',
		variant: 'solid'
	},
	play: async ({ args, canvasElement }) => {
		const canvas = within(canvasElement)
		const button = canvas.getByRole('button', { name: 'Button' })

		await userEvent.tab()
		await expect(button).toHaveFocus()

		await userEvent.keyboard('{Enter}')
		await expect(args.onClick).toHaveBeenCalledOnce()

		await userEvent.keyboard(' ')
		await expect(args.onClick).toHaveBeenCalledTimes(2)
	}
}

/**
 * A disabled button never receives keyboard focus during `Tab` navigation.
 */
export const DisabledSkipsFocus: Story = {
	name: 'Disabled Skips Focus',
	argTypes: {
		icon: { table: { disable: true } },
		iconPlacement: { table: { disable: true } }
	},
	args: {
		children: 'Button',
		disabled: true,
		loading: false,
		size: 'md',
		variant: 'solid'
	},
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement)
		const button = canvas.getByRole('button', { name: 'Button' })

		await userEvent.tab()
		await expect(button).not.toHaveFocus()
	}
}
