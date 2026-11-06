import { css } from '@iolita/styled-system/css'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { type ComponentProps, useRef, useState } from 'react'
import { expect, userEvent, within } from 'storybook/test'
import { Button } from '../button'
import { RadioGroup } from '.'
import { useRadioGroup } from './use-radio-group'

type RadioGroupStoryProps = ComponentProps<typeof RadioGroup.Root> & {}

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
/**
 * An accessible radio group component that manages mutually exclusive options,
 * form integration, and supporting or error descriptions.
 */
const meta = {
	title: 'Components/RadioGroup',
	component: RadioGroup.Root,
	parameters: {
		// Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/configure/story-layout
		layout: 'fullscreen'
	},
	// This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/writing-docs/autodocs
	tags: ['autodocs'],
	// More on argTypes: https://storybook.js.org/docs/api/arg-types
	argTypes: {
		disabled: {
			control: 'boolean',
			description: 'Whether the radio group is disabled.',
			table: {
				defaultValue: { summary: 'false' },
				type: { summary: 'boolean | undefined' }
			}
		},
		invalid: {
			control: 'boolean',
			description: 'Whether the radio group is invalid.',
			table: {
				defaultValue: { summary: 'false' },
				type: { summary: 'boolean | undefined' }
			}
		},
		readOnly: {
			control: 'boolean',
			description: 'Whether the radio group is read-only',
			table: {
				defaultValue: { summary: 'false' },
				type: { summary: 'boolean | undefined' }
			}
		},
		required: {
			control: 'boolean',
			description: 'Whether the radio group is required.',
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
				'The ids of the elements in the radio group. Useful for composition.',
			table: {
				type: { summary: 'ElementIds' },
				disable: true
			}
		},
		name: {
			control: 'text',
			description:
				'The name of the input fields in the radio group, used when submitting an HTML form.',
			table: {
				type: { summary: 'string | undefined' }
			}
		},
		onValueChange: {
			action: 'onValueChange',
			description: 'Function called when the value changes.',
			table: {
				type: {
					summary: '(details: ValueChangeDetails) => void | undefined'
				}
			}
		},
		value: {
			control: 'text',
			description: 'The current value (controlled).',
			table: {
				type: { summary: 'string | null | undefined' }
			}
		},
		defaultValue: {
			control: 'text',
			description: 'The initial value (uncontrolled).',
			table: {
				type: { summary: 'string | null | undefined' }
			}
		},
		form: {
			control: 'text',
			description: `The id of the form to associate the input with.`,
			table: {
				type: { summary: 'string | undefined' }
			}
		}
	},
	// Use `fn` to spy on the onClick arg, which will appear in the actions panel once invoked: https://storybook.js.org/docs/essentials/actions#story-args
	args: {
		children: ''
	}
} satisfies Meta<RadioGroupStoryProps>

export default meta
type Story = StoryObj<typeof meta>

const Template: Pick<Story, 'decorators'> = {
	decorators: [
		(Story, context) => {
			const docsHeight = context.parameters.docsHeight ?? '288px'
			console.log({ docsHeight })
			return (
				<div
					style={{
						height: context.viewMode === 'docs' ? docsHeight : '100dvh'
					}}
					className={css({
						width: '100%',
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
		}
	]
}

const pets = ['no-pets', 'cat', 'dog', 'bird', 'fish'] as const
type Pets = (typeof pets)[number]
type FieldPet = { value: Pets; label: string; disabled: boolean }
const fieldPet = [
	{ value: 'no-pets', label: 'No pets', disabled: true },
	{ value: 'cat', label: 'Cat', disabled: false },
	{ value: 'dog', label: 'Dog', disabled: false },
	{ value: 'bird', label: 'Bird', disabled: false },
	{ value: 'fish', label: 'Fish', disabled: false }
] as const satisfies readonly FieldPet[]
type FormValues = { pet: Pets }

const options = ['option-1', 'option-2', 'option-3'] as const
type Options = (typeof options)[number]
const fieldOptions: {
	value: Options
	label: string
	disabled?: boolean
	'data-testid'?: string
}[] = [
	{
		value: 'option-1',
		label: 'Option 1',
		'data-testid': 'option-1'
	},
	{
		value: 'option-2',
		label: 'Option 2',
		'data-testid': 'option-2'
	},
	{ value: 'option-3', label: 'Option 3' }
]

// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args
/**
 * The standard behavior of the radio group component. Demonstrates a set of
 * mutually exclusive radio buttons where selecting one automatically
 * deselects any previously active item.
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
				<RadioGroup.Root {...args}>
					<RadioGroup.Label>Label</RadioGroup.Label>

					{fieldOptions.map(f => (
						<RadioGroup.Item key={f.value} value={f.value}>
							<RadioGroup.ItemHiddenInput />
							<RadioGroup.ItemControl>
								<RadioGroup.ItemIndicator />
							</RadioGroup.ItemControl>
							<RadioGroup.ItemText>{f.label}</RadioGroup.ItemText>
						</RadioGroup.Item>
					))}
				</RadioGroup.Root>
			</div>
		)
	},
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement)
		const radioGroup = await canvas.findByRole('radiogroup')
		const radios = await canvas.findAllByRole('radio')

		await expect(radioGroup).toBeInTheDocument()
		await expect(radios).toHaveLength(fieldOptions.length)

		for (const { label } of fieldOptions) {
			const radio = canvas.getByRole('radio', { name: label })

			await userEvent.click(radio)
			await expect(radio).toBeChecked()

			const checked = canvas
				.getAllByRole('radio')
				.filter(r => (r as HTMLInputElement).checked)
			await expect(checked).toHaveLength(1)
		}
	}
}

/**
 * Demonstrates the integration of contextual supporting text
 * (`RadioGroup.SupportingText`). Automatically links the supporting text
 * element to the radio group container via `aria-describedby` to provide
 * accessible hints for screen reader users.
 */
export const WithSupportingText: Story = {
	...Template,
	parameters: {
		controls: {
			disable: true
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
				<RadioGroup.Root {...args}>
					<RadioGroup.Label>Label</RadioGroup.Label>

					{fieldOptions.map(f => (
						<RadioGroup.Item key={f.value} value={f.value}>
							<RadioGroup.ItemHiddenInput />
							<RadioGroup.ItemControl>
								<RadioGroup.ItemIndicator />
							</RadioGroup.ItemControl>
							<RadioGroup.ItemText>{f.label}</RadioGroup.ItemText>
						</RadioGroup.Item>
					))}

					<RadioGroup.SupportingText data-testid="supporting-text">
						Some supporting text.
					</RadioGroup.SupportingText>
				</RadioGroup.Root>
			</div>
		)
	},
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement)
		const group = await canvas.findByRole('radiogroup')
		const supportingText = await canvas.findByTestId('supporting-text')

		await expect(
			within(supportingText).getByText('Some supporting text.')
		).toBeVisible()

		await expect(supportingText.id).toBeTruthy()
		await expect(group).toHaveAttribute('aria-describedby', supportingText.id)
		await expect(group).toHaveAccessibleDescription(/Some supporting text\./)
	}
}

/**
 * Demonstrates the invalid state using the `invalid` prop. Sets `data-invalid`
 * on the root container, applies `aria-invalid="true"` to all
 * child radio inputs, and associates the error message (`RadioGroup.ErrorText`)
 * via `aria-describedby`.
 */
export const WithErrorText: Story = {
	...Template,
	args: { invalid: true },
	parameters: {
		controls: {
			disable: true
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
				<RadioGroup.Root {...args}>
					<RadioGroup.Label>Label</RadioGroup.Label>

					{fieldOptions.map(f => (
						<RadioGroup.Item key={f.value} value={f.value}>
							<RadioGroup.ItemHiddenInput />
							<RadioGroup.ItemControl>
								<RadioGroup.ItemIndicator />
							</RadioGroup.ItemControl>
							<RadioGroup.ItemText>{f.label}</RadioGroup.ItemText>
						</RadioGroup.Item>
					))}

					<RadioGroup.ErrorText data-testid="error-text">
						Some error text.
					</RadioGroup.ErrorText>
				</RadioGroup.Root>
			</div>
		)
	},
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement)
		const group = await canvas.findByRole('radiogroup')
		const radios = await canvas.findAllByRole('radio')
		const errorText = await canvas.findByTestId('error-text')

		await expect(group).toHaveAttribute('data-invalid')
		for (const radio of radios) {
			await expect(radio).toHaveAttribute('aria-invalid', 'true')
		}

		await expect(errorText).toHaveTextContent('Some error text.')
		await expect(group).toHaveAttribute('aria-describedby', errorText.id)
		await expect(group).toHaveAccessibleDescription('Some error text.')
	}
}

/**
 * Demonstrates the simultaneous inclusion of supporting text and error text.
 * Combines both element ID's in the container's `aria-describedby` attribute,
 * allowing screen readers announce both the contextual hint and the validation
 * error.
 */
export const WithSupportingTextAndError: Story = {
	...Template,
	args: { invalid: true },
	parameters: {
		controls: {
			disable: true
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
				<RadioGroup.Root {...args}>
					<RadioGroup.Label>Label</RadioGroup.Label>

					{fieldOptions.map(f => (
						<RadioGroup.Item key={f.value} value={f.value}>
							<RadioGroup.ItemHiddenInput />
							<RadioGroup.ItemControl>
								<RadioGroup.ItemIndicator />
							</RadioGroup.ItemControl>
							<RadioGroup.ItemText>{f.label}</RadioGroup.ItemText>
						</RadioGroup.Item>
					))}

					<RadioGroup.SupportingText data-testid="supporting-text">
						Some supporting text.
					</RadioGroup.SupportingText>

					<RadioGroup.ErrorText data-testid="error-text">
						Some error text.
					</RadioGroup.ErrorText>
				</RadioGroup.Root>
			</div>
		)
	},
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement)
		const group = await canvas.findByRole('radiogroup')
		const radios = await canvas.findAllByRole('radio')
		const supportingText = await canvas.findByTestId('supporting-text')
		const errorText = await canvas.findByTestId('error-text')

		await expect(group).toHaveAttribute('data-invalid')
		for (const radio of radios) {
			await expect(radio).toHaveAttribute('aria-invalid', 'true')
		}

		await expect(
			within(supportingText).getByText('Some supporting text.')
		).toBeVisible()
		await expect(errorText).toHaveTextContent('Some error text.')

		await expect(group).toHaveAttribute(
			'aria-describedby',
			`${supportingText.id} ${errorText.id}`
		)
		await expect(group).toHaveAccessibleDescription(
			/Some supporting text\.\s*Some error text\./
		)
	}
}

/**
 * Demonstrates the globally disabled state. Applies `aria-disabled="true"` to
 * the root container and disables all underlying radio inputs, preventing user
 * interaction and selection changes.
 */
export const Disabled: Story = {
	...Template,
	args: { disabled: true },
	parameters: {
		controls: {
			disable: true
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
				<RadioGroup.Root {...args}>
					<RadioGroup.Label>Label</RadioGroup.Label>

					{fieldOptions.map(f => (
						<RadioGroup.Item key={f.value} value={f.value}>
							<RadioGroup.ItemHiddenInput />
							<RadioGroup.ItemControl>
								<RadioGroup.ItemIndicator />
							</RadioGroup.ItemControl>
							<RadioGroup.ItemText>{f.label}</RadioGroup.ItemText>
						</RadioGroup.Item>
					))}
				</RadioGroup.Root>
			</div>
		)
	},
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement)
		const group = await canvas.findByRole('radiogroup')

		await expect(group).toHaveAttribute('aria-disabled', 'true')

		for (const { label } of fieldOptions) {
			const radio = canvas.getByRole('radio', { name: label })

			await expect(radio).toBeDisabled()

			await userEvent.click(radio)

			await expect(radio).not.toBeChecked()

			const checked = canvas
				.getAllByRole('radio')
				.filter(r => (r as HTMLInputElement).checked)
			await expect(checked).toHaveLength(0)
		}
	}
}

/**
 * Demonstrates native HTML form integration and browser constraint validation.
 * Handles required field validation, invalid event capture and dynamic error
 * messaging.
 */
export const WithForm: Story = {
	...Template,
	parameters: {
		docsHeight: '512px',
		controls: {
			exclude: ['children']
		}
	},
	render: () => {
		const [formData, setFormData] = useState<FormValues>()
		const submitted = useRef(false)
		const [errors, setErrors] = useState<Record<string, { message: string }>>(
			{}
		)

		const clearErrors = () => {
			setErrors({})
		}

		function handleInvalidCapture(
			evt: React.SyntheticEvent<HTMLFormElement, Event>
		) {
			evt.preventDefault()

			const field = evt.target as HTMLInputElement

			const message = field.validity.valueMissing
				? 'Select a pet to continue.'
				: field.validationMessage

			setErrors(prev => ({
				...prev,
				[field.name]: { message }
			}))
		}

		function handleSubmit(evt: React.SubmitEvent<HTMLFormElement>) {
			evt.preventDefault()
			const form = evt.currentTarget

			submitted.current = true
			clearErrors()

			if (!form.checkValidity()) {
				const first = Array.from(form.elements).find(
					(el): el is HTMLInputElement =>
						el instanceof HTMLInputElement &&
						el.willValidate &&
						!el.validity.valid
				)
				console.log(first)
				first?.focus()
				return
			}

			const values = Object.fromEntries(
				new FormData(form)
			) as unknown as FormValues
			setFormData(values)
		}

		function handleChange(evt: React.ChangeEvent<HTMLFormElement, Element>) {
			if (!submitted.current) return

			const field = evt.target

			if (field.checkValidity()) {
				setErrors(prev => {
					const { [field.name]: _removed, ...rest } = prev
					return rest
				})
			}
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
					onInvalidCapture={handleInvalidCapture}
					onSubmit={handleSubmit}
					onChange={handleChange}
				>
					<RadioGroup.Root
						name="pet"
						required
						onValueChange={() => {
							if (!submitted.current) return
							setErrors(prev => {
								const { pet: _removed, ...rest } = prev
								return rest
							})
						}}
						invalid={!!errors.pet}
					>
						<RadioGroup.Label>Pets at home</RadioGroup.Label>

						{fieldPet.map(f => (
							<RadioGroup.Item
								key={f.value}
								value={f.value}
								disabled={f.disabled}
							>
								<RadioGroup.ItemHiddenInput />
								<RadioGroup.ItemControl>
									<RadioGroup.ItemIndicator />
								</RadioGroup.ItemControl>
								<RadioGroup.ItemText>{f.label}</RadioGroup.ItemText>
							</RadioGroup.Item>
						))}

						<RadioGroup.SupportingText data-testid="supporting-text">
							Choose the pet you spend the most time with.
						</RadioGroup.SupportingText>

						<RadioGroup.ErrorText data-testid="error-text">
							{errors.pet?.message}
						</RadioGroup.ErrorText>
					</RadioGroup.Root>

					<Button type="submit" variant="solid">
						Send
					</Button>
				</form>

				{formData && (
					<pre
						className={css({
							marginBlockStart: '4',
							padding: '2',
							background: 'token(colors.violet.50)',
							borderWidth: 'thin',
							borderStyle: 'dashed',
							borderColor: 'token(colors.violet.800)',
							fontSize: 'sm'
						})}
					>
						<code>{JSON.stringify(formData, null, 2)}</code>
					</pre>
				)}
			</div>
		)
	},
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement)
		const group = await canvas.findByRole('radiogroup')
		const supportingText = await canvas.findByTestId('supporting-text')
		const submit = await canvas.findByRole('button', { name: 'Send' })

		await expect(supportingText).toHaveTextContent(
			'Choose the pet you spend the most time with.'
		)

		await expect(group).toHaveAttribute(
			'aria-describedby',
			`${supportingText.id}`
		)
		await expect(group).toHaveAccessibleDescription(
			/Choose the pet you spend the most time with\./
		)

		await userEvent.click(submit)
		const errorText = await canvas.findByTestId('error-text')
		await expect(errorText).toHaveTextContent('Select a pet to continue.')

		await expect(group).toHaveAttribute(
			'aria-describedby',
			`${supportingText.id} ${errorText.id}`
		)
		await expect(group).toHaveAccessibleDescription(
			/Choose the pet you spend the most time with\.\s*Select a pet to continue\./
		)

		const [noPets, cat] = fieldPet
		await userEvent.click(canvas.getByText(noPets.label))
		await expect(
			canvas.getByRole('radio', { name: noPets.label })
		).not.toBeChecked()
		await userEvent.click(canvas.getByText(cat.label))
		await expect(canvas.getByRole('radio', { name: cat.label })).toBeChecked()

		await expect(group).toHaveAttribute(
			'aria-describedby',
			`${supportingText.id}`
		)
		await expect(group).toHaveAccessibleDescription(
			/Choose the pet you spend the most time with\./
		)

		await userEvent.click(submit)
		const output = await canvas.findByText(/"pet"/)
		await expect(output).toHaveTextContent(cat.value)
	}
}

/**
 * Demonstrates the inversion of control pattern via `useRadioGroup` and
 * `RadioGroup.RootProvider`. Essential for when the radio group's state logic
 * must be hoisted, managed externally, or integrated with decoupled contexts.
 */
export const RootProvider: Story = {
	...Template,
	parameters: {
		controls: {
			exclude: ['children']
		}
	},
	render: ({ disabled, ids, invalid, name, readOnly, required }) => {
		const radioGroup = useRadioGroup({
			disabled,
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
				<RadioGroup.RootProvider {...radioGroup}>
					<RadioGroup.Label>Label</RadioGroup.Label>

					{fieldOptions.map(f => (
						<RadioGroup.Item key={f.value} value={f.value}>
							<RadioGroup.ItemHiddenInput />
							<RadioGroup.ItemControl>
								<RadioGroup.ItemIndicator />
							</RadioGroup.ItemControl>
							<RadioGroup.ItemText>{f.label}</RadioGroup.ItemText>
						</RadioGroup.Item>
					))}
				</RadioGroup.RootProvider>
			</div>
		)
	},
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement)
		const radioGroup = await canvas.findByRole('radiogroup')
		const radios = await canvas.findAllByRole('radio')

		await expect(radioGroup).toBeInTheDocument()
		await expect(radios).toHaveLength(fieldOptions.length)

		for (const { label } of fieldOptions) {
			const radio = canvas.getByRole('radio', { name: label })

			await userEvent.click(radio)
			await expect(radio).toBeChecked()

			const checked = canvas
				.getAllByRole('radio')
				.filter(r => (r as HTMLInputElement).checked)
			await expect(checked).toHaveLength(1)
		}
	}
}
