import { css } from '@iolita/styled-system/css'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { type ComponentProps, useState } from 'react'
import { expect, userEvent, within } from 'storybook/test'
import { Button } from '../button'
import { TextInput } from '.'
import { useTextInput } from './use-text-input'

type TextInputStoryProps = ComponentProps<typeof TextInput.Root> & {}

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
/**
 * An accessible text input component that manages native input states, form
 * association, and supporting or error descriptions.
 */
const meta = {
	title: 'Components/TextInput',
	component: TextInput.Root,
	parameters: {
		// Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/configure/story-layout
		layout: 'fullscreen'
	},
	// This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/writing-docs/autodocs
	tags: ['autodocs'],
	// More on argTypes: https://storybook.js.org/docs/api/arg-types
	argTypes: {
		autoComplete: {
			control: 'text',
			description:
				'Describes the type of autocomplete functionality the input should provide if any.',
			table: {
				type: { summary: 'HTMLInputAutoCompleteAttribute | undefined' }
			}
		},
		disabled: {
			control: 'boolean',
			description: 'Whether the input is disabled.',
			table: {
				defaultValue: { summary: 'false' },
				type: { summary: 'boolean | undefined' }
			}
		},
		invalid: {
			control: 'boolean',
			description: 'Whether the value is invalid.',
			table: {
				defaultValue: { summary: 'false' },
				type: { summary: 'boolean | undefined' }
			}
		},
		readOnly: {
			control: 'boolean',
			description:
				'Whether the input can be selected but not changed by the user.',
			table: {
				defaultValue: { summary: 'false' },
				type: { summary: 'boolean | undefined' }
			}
		},
		required: {
			control: 'boolean',
			description: 'Whether the input is required.',
			table: {
				defaultValue: { summary: 'false' },
				type: { summary: 'boolean | undefined' }
			}
		},
		id: {
			control: 'text',
			description: 'The unique identifier of the machine.',
			table: {
				type: { summary: 'string' }
			}
		},
		ids: {
			control: 'text',
			description:
				'The ids of the elements in the input. Useful for composition.',
			table: {
				type: { summary: 'ElementIds' },
				disable: true
			}
		},
		name: {
			control: 'text',
			description:
				'The name of the input element, used when submitting an HTML form.',
			table: {
				type: { summary: 'string | undefined' }
			}
		}
	},
	// Use `fn` to spy on the onClick arg, which will appear in the actions panel once invoked: https://storybook.js.org/docs/essentials/actions#story-args
	args: {
		children: ''
	}
} satisfies Meta<TextInputStoryProps>

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
 * The standard behavior of the text input component. It automatically
 * associates `TextInput.Label` with `TextInput.Input` through a generated id
 * (`for`/`id`), furthermore, as long as no supporting or error text is
 * rendered, the input has neither `aria-describedby` nor `aria-invalid`,
 * ensuring correct accessibility configuration and a natural typing experience.
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
			<div
				className={css({
					width: '100%',
					maxWidth: '72'
				})}
			>
				<TextInput.Root {...args}>
					<TextInput.Label data-testid="label">Label</TextInput.Label>

					<TextInput.Input data-testid="input" />
				</TextInput.Root>
			</div>
		)
	},
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement)
		const label = await canvas.findByTestId('label')
		const input = await canvas.findByTestId('input')

		await expect(label).toBeInTheDocument()
		await expect(input).toBeInTheDocument()

		await expect(input).toBeEnabled()
		await expect(input).not.toBeRequired()
		await expect(input).not.toHaveAttribute('aria-invalid')
		await expect(input).not.toHaveAttribute('aria-describedby')

		await expect(input.id).toBeTruthy()
		await expect(label).toHaveAttribute('for', input.id)

		await userEvent.type(input, 'Hello, World!')
		await expect(input).toHaveValue('Hello, World!')

		await userEvent.clear(input)
		await expect(input).toHaveValue('')
	}
}

/**
 * Integrates auxiliary text (`TextInput.SupportingText`) to provide hints or
 * format instructions. While it is mounted, its id is added to the input's
 * `aria-describedby`. The `asChild` prop renders custom markup, such as a list,
 * keeping the same id and styling.
 */
export const WithSupportingText: Story = {
	...Template,
	parameters: {
		controls: {
			disable: true
		}
	},
	render: () => {
		return (
			<div
				className={css({
					width: '100%',
					maxWidth: '72'
				})}
			>
				<TextInput.Root>
					<TextInput.Label>Label</TextInput.Label>

					<TextInput.Input data-testid="input" />

					<TextInput.SupportingText data-testid="supporting-text" asChild>
						<ul
							className={css({
								listStyleType: 'disc',
								paddingInlineStart: '4',
								'& li::marker': {
									color: 'violet.800'
								}
							})}
						>
							<li>Some supporting text.</li>
							<li>Another supporting text.</li>
						</ul>
					</TextInput.SupportingText>
				</TextInput.Root>
			</div>
		)
	},
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement)
		const input = await canvas.findByTestId('input')
		const supportingText = await canvas.findByTestId('supporting-text')

		await expect(
			within(supportingText).getByText('Some supporting text.')
		).toBeVisible()
		await expect(
			within(supportingText).getByText('Another supporting text.')
		).toBeVisible()

		await expect(supportingText.id).toBeTruthy()
		await expect(input).toHaveAttribute('aria-describedby', supportingText.id)
		await expect(input).toHaveAccessibleDescription(
			/Some supporting text\.\s*Another supporting text\./
		)
	}
}

/**
 * Demonstrates the invalid state. When the root is marked as `invalid`, the
 * input receives `aria-invalid="true"` and `data-invalid` (the latter is also
 * applied to the root and the label). `TextInput.ErrorText` is rendered with
 * `role="alert"`, so the message is announced right away, and it is linked
 * to the input through `aria-describedby`.
 */
export const WithErrorText: Story = {
	...Template,
	parameters: {
		controls: {
			disable: true
		}
	},
	render: () => {
		return (
			<div
				className={css({
					width: '100%',
					maxWidth: '72'
				})}
			>
				<TextInput.Root invalid>
					<TextInput.Label>Label</TextInput.Label>

					<TextInput.Input data-testid="input" />

					<TextInput.ErrorText data-testid="error-text">
						Some error text.
					</TextInput.ErrorText>
				</TextInput.Root>
			</div>
		)
	},
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement)
		const input = await canvas.findByTestId('input')
		const errorText = await canvas.findByTestId('error-text')

		await expect(input).toBeInvalid()
		await expect(input).toHaveAttribute('aria-invalid', 'true')
		await expect(input).toHaveAttribute('data-invalid')

		await expect(errorText).toHaveTextContent('Some error text.')
		await expect(input).toHaveAttribute('aria-describedby', errorText.id)
		await expect(input).toHaveAccessibleDescription('Some error text.')
	}
}

/**
 * Illustrates the combination of `TextInput.SupportingText` and
 * `TextInput.ErrorText`. Both ids are aggregated into a single
 * `aria-describedby`, with the supporting text first and the error text
 * second. The error text is only referenced (and rendered) while the field is
 * `invalid`, so the hint remains as the only description otherwise.
 */
export const WithSupportingTextAndError: Story = {
	...Template,
	parameters: {
		controls: {
			disable: true
		}
	},
	render: () => {
		return (
			<div
				className={css({
					width: '100%',
					maxWidth: '72'
				})}
			>
				<TextInput.Root invalid>
					<TextInput.Label>Label</TextInput.Label>

					<TextInput.Input data-testid="input" />

					<TextInput.SupportingText data-testid="supporting-text" asChild>
						<ul
							className={css({
								listStyleType: 'disc',
								paddingInlineStart: '4',
								'& li::marker': {
									color: 'violet.800'
								}
							})}
						>
							<li>Some supporting text.</li>
							<li>Another supporting text.</li>
						</ul>
					</TextInput.SupportingText>

					<TextInput.ErrorText data-testid="error-text">
						Some error text.
					</TextInput.ErrorText>
				</TextInput.Root>
			</div>
		)
	},
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement)
		const input = await canvas.findByTestId('input')
		const supportingText = await canvas.findByTestId('supporting-text')
		const errorText = await canvas.findByTestId('error-text')

		await expect(input).toBeInvalid()
		await expect(input).toHaveAttribute('aria-invalid', 'true')
		await expect(input).toHaveAttribute('data-invalid')

		await expect(
			within(supportingText).getByText('Some supporting text.')
		).toBeVisible()
		await expect(
			within(supportingText).getByText('Another supporting text.')
		).toBeVisible()
		await expect(errorText).toHaveTextContent('Some error text.')

		await expect(input).toHaveAttribute(
			'aria-describedby',
			`${supportingText.id} ${errorText.id}`
		)
		await expect(input).toHaveAccessibleDescription(
			/Some supporting text\.\s*Another supporting text\.\s*Some error text\./
		)
	}
}

/**
 * Demonstrates the required field pattern. The `required` prop applies the
 * native `required` attribute to the input and exposes `data-required` on the
 * input and the label, enabling visual indicators.
 */
export const Required: Story = {
	...Template,
	parameters: {
		controls: {
			disable: true
		}
	},
	render: () => {
		return (
			<div
				className={css({
					width: '100%',
					maxWidth: '72'
				})}
			>
				<TextInput.Root required>
					<TextInput.Label data-testid="label">Label</TextInput.Label>

					<TextInput.Input data-testid="input" />
				</TextInput.Root>
			</div>
		)
	},
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement)
		const label = await canvas.findByTestId('label')
		const input = await canvas.findByTestId('input')

		await expect(input).toBeRequired()
		await expect(input).toHaveAttribute('data-required')
		await expect(label).toHaveAttribute('data-required')

		await userEvent.type(input, 'Hello, World!')
		await expect(input).toHaveValue('Hello, World!')

		await userEvent.clear(input)
		await expect(input).toHaveValue('')
	}
}

/**
 * Demonstrates the disabled state. The input becomes non-interactive and is
 * removed from the tab sequence, while `data-disabled` is applied to the root,
 * the label and the input to support disabled styling.
 */
export const Disabled: Story = {
	...Template,
	parameters: {
		controls: {
			disable: true
		}
	},
	render: () => {
		return (
			<div
				className={css({
					width: '100%',
					maxWidth: '72'
				})}
			>
				<TextInput.Root disabled>
					<TextInput.Label data-testid="label">Label</TextInput.Label>

					<TextInput.Input data-testid="input" />
				</TextInput.Root>
			</div>
		)
	},
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement)
		const label = await canvas.findByTestId('label')
		const input = await canvas.findByTestId('input')

		await expect(input).toBeDisabled()
		await expect(input).toHaveAttribute('data-disabled')
		await expect(label).toHaveAttribute('data-disabled')

		await userEvent.click(input)
		await expect(input).not.toHaveFocus()
		await userEvent.type(input, 'Hello, World!')
		await expect(input).toHaveValue('')
	}
}

/**
 * Demonstrates the read-only state. Unlike `disabled`, the input remains
 * focusable and its content can be selected and copied, but the user cannot
 * change the value. The native `readonly` attribute is applied to the input,
 * and `data-readonly` to the root, the label and the input.
 */
export const ReadOnly: Story = {
	...Template,
	parameters: {
		controls: {
			disable: true
		}
	},
	render: () => {
		return (
			<div
				className={css({
					width: '100%',
					maxWidth: '72'
				})}
			>
				<TextInput.Root readOnly>
					<TextInput.Label>Label</TextInput.Label>

					<TextInput.Input data-testid="input" />
				</TextInput.Root>
			</div>
		)
	},
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement)
		const input = await canvas.findByTestId('input')

		await expect(input).toHaveAttribute('readonly')
		await expect(input).toHaveAttribute('data-readonly')
		await expect(input).toBeEnabled()

		await userEvent.click(input)
		await expect(input).toHaveFocus()
		await userEvent.type(input, 'Hello, World!')
		await expect(input).toHaveValue('')
	}
}

/**
 * Illustrates manual identifier customization through the `ids` prop, which
 * overrides the DOM id of each part (`Root`, `Label`,
 * `Input`, `SupportingText` and `ErrorText`). Without it, ids are derived from `id`
 * (e.g. `text-input:{id}:input`). The `for` and `aria-describedby` wiring
 * automatically follows the custom ids.
 */
export const CustomIds: Story = {
	...Template,
	parameters: {
		controls: {
			disable: true
		}
	},
	render: () => {
		return (
			<div
				className={css({
					width: '100%',
					maxWidth: '72'
				})}
			>
				<TextInput.Root
					invalid
					ids={{
						root: 'custom-root-id',
						label: 'custom-label-id',
						input: 'custom-input-id',
						supportingText: 'custom-supporting-text-id',
						errorText: 'custom-error-text-id'
					}}
				>
					<TextInput.Label data-testid="label">Label</TextInput.Label>

					<TextInput.Input data-testid="input" />

					<TextInput.SupportingText data-testid="supporting-text" asChild>
						<ul
							className={css({
								listStyleType: 'disc',
								paddingInlineStart: '4',
								'& li::marker': {
									color: 'violet.800'
								}
							})}
						>
							<li>Some supporting text.</li>
							<li>Another supporting text.</li>
						</ul>
					</TextInput.SupportingText>

					<TextInput.ErrorText data-testid="error-text">
						Some error text.
					</TextInput.ErrorText>
				</TextInput.Root>
			</div>
		)
	},
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement)
		const label = await canvas.findByTestId('label')
		const input = await canvas.findByTestId('input')

		await expect(
			canvasElement.querySelector('#custom-root-id')
		).toBeInTheDocument()
		await expect(
			canvasElement.querySelector('#custom-label-id')
		).toBeInTheDocument()
		await expect(
			canvasElement.querySelector('#custom-input-id')
		).toBeInTheDocument()
		await expect(
			canvasElement.querySelector('#custom-supporting-text-id')
		).toBeInTheDocument()
		await expect(
			canvasElement.querySelector('#custom-error-text-id')
		).toBeInTheDocument()

		await expect(input).toHaveAttribute('id', 'custom-input-id')
		await expect(label).toHaveAttribute('for', 'custom-input-id')
		await expect(input).toHaveAttribute(
			'aria-describedby',
			'custom-supporting-text-id custom-error-text-id'
		)
	}
}

/**
 * Demonstrates integration with a native HTML form. It relies on browser
 * constraint validation (`required`, `minLength`) and the `invalid` event to
 * update the `invalid` state and render `TextInput.ErrorText` with the
 * native validation message.
 */
export const WithForm: Story = {
	...Template,
	parameters: {
		controls: {
			disable: true
		}
	},
	render: () => {
		const [name, setName] = useState('')
		const [errors, setErrors] = useState<{
			name?: { message: string }
		}>({})

		const clearErrors = () => {
			setErrors({})
		}

		return (
			<div
				className={css({
					width: '100%',
					maxWidth: '72'
				})}
			>
				<form
					className={css({
						display: 'flex',
						flexDirection: 'column',
						gap: '4',
						width: '100%'
					})}
					noValidate
					onInvalid={event => {
						event.preventDefault()
						const field = event.target as HTMLInputElement
						setErrors(prev => ({
							...prev,
							[field.name]: { message: field.validationMessage }
						}))
						console.log('error', { message: field.validationMessage })
					}}
					onSubmit={event => {
						event.preventDefault()
						clearErrors()
						if (!event.currentTarget.checkValidity()) return
						console.log('submitted')
					}}
				>
					<TextInput.Root
						name="name"
						autoComplete="name"
						invalid={!!errors.name}
						required
					>
						<TextInput.Label>Full name</TextInput.Label>

						<TextInput.Input
							onChange={el => {
								setName(el.currentTarget.value)
							}}
							minLength={2}
							data-testid="input"
						/>

						<TextInput.SupportingText asChild>
							<ul
								className={css({
									listStyleType: 'disc',
									paddingInlineStart: '4',
									'& li::marker': {
										color: 'violet.800'
									}
								})}
							>
								<li>{`Please enter at least 2 characters. You currently have ${name.length}.`}</li>
							</ul>
						</TextInput.SupportingText>

						<TextInput.ErrorText data-testid="error-text">
							{errors.name?.message}
						</TextInput.ErrorText>
					</TextInput.Root>

					<Button type="submit" variant="solid">
						Send
					</Button>
				</form>
			</div>
		)
	},
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement)
		const input = await canvas.findByTestId('input')
		const submit = canvas.getByRole('button', { name: 'Send' })

		await expect(input).not.toHaveAttribute('aria-invalid')
		await expect(input).not.toHaveAttribute('data-invalid')
		await expect(canvas.queryByTestId('error-text')).not.toBeInTheDocument()

		await userEvent.click(submit)

		await expect(await canvas.findByTestId('error-text')).toBeVisible()
		await expect(input).toHaveAttribute('aria-invalid', 'true')
		await expect(input).toHaveAttribute('data-invalid')

		await userEvent.type(input, 'Hello, World!')
		await expect(input).toHaveValue('Hello, World!')

		await userEvent.click(submit)

		await expect(canvas.queryByTestId('error-text')).not.toBeInTheDocument()
		await expect(input).not.toHaveAttribute('aria-invalid')
		await expect(input).not.toHaveAttribute('data-invalid')

		await userEvent.clear(input)
		await expect(input).toHaveValue('')
	}
}

/**
 * Demonstrates the inversion of control pattern via `useTextInput` and
 * `TextInput.RootProvider`. Essential for when the input's state logic
 * must be hoisted, managed externally, or integrated with decoupled contexts.
 */
export const RootProvider: Story = {
	...Template,
	parameters: {
		controls: {
			exclude: ['children']
		}
	},
	render: ({
		autoComplete,
		disabled,
		id,
		ids,
		invalid,
		name,
		readOnly,
		required
	}) => {
		const textInput = useTextInput({
			autoComplete,
			disabled,
			id,
			ids,
			invalid,
			name,
			readOnly,
			required
		})

		return (
			<div
				className={css({
					width: '100%',
					maxWidth: '72'
				})}
			>
				<TextInput.RootProvider {...textInput}>
					<TextInput.Label data-testid="label">Label</TextInput.Label>

					<TextInput.Input data-testid="input" />
				</TextInput.RootProvider>
			</div>
		)
	},
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement)
		const label = await canvas.findByTestId('label')
		const input = await canvas.findByTestId('input')

		await expect(label).toBeInTheDocument()
		await expect(input).toBeInTheDocument()

		await expect(input).toBeEnabled()
		await expect(input).not.toBeRequired()
		await expect(input).not.toHaveAttribute('aria-invalid')
		await expect(input).not.toHaveAttribute('aria-describedby')

		await expect(input.id).toBeTruthy()
		await expect(label).toHaveAttribute('for', input.id)

		await userEvent.type(input, 'Hello, World!')
		await expect(input).toHaveValue('Hello, World!')

		await userEvent.clear(input)
		await expect(input).toHaveValue('')
	}
}
