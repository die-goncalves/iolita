import { css } from '@iolita/styled-system/css'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { type ComponentProps, useRef, useState } from 'react'
import { expect, userEvent, waitFor, within } from 'storybook/test'
import { Button } from '../button'
import { Checkbox } from '.'
import { useCheckbox } from './use-checkbox'

type CheckboxStoryProps = ComponentProps<typeof Checkbox.Root> & {}

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
/**
 * An accessible checkbox component that manages checked states, form
 * integration, and supporting or error descriptions.
 */
const meta = {
	title: 'Components/Checkbox',
	component: Checkbox.Root,
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
			description: 'Whether the checkbox is disabled.',
			table: {
				defaultValue: { summary: 'false' },
				type: { summary: 'boolean | undefined' }
			}
		},
		invalid: {
			control: 'boolean',
			description: 'Whether the checkbox is invalid.',
			table: {
				defaultValue: { summary: 'false' },
				type: { summary: 'boolean | undefined' }
			}
		},
		readOnly: {
			control: 'boolean',
			description: 'Whether the checkbox is read-only',
			table: {
				defaultValue: { summary: 'false' },
				type: { summary: 'boolean | undefined' }
			}
		},
		required: {
			control: 'boolean',
			description: 'Whether the checkbox is required.',
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
				'The ids of the elements in the checkbox. Useful for composition.',
			table: {
				type: { summary: 'ElementIds' },
				disable: true
			}
		},
		checked: {
			control: 'boolean',
			description: 'The checked state (controlled).',
			table: {
				type: { summary: 'CheckedState | undefined' }
			}
		},
		defaultChecked: {
			control: 'boolean',
			description: 'The initial checked state (uncontrolled).',
			table: {
				type: { summary: 'CheckedState | undefined' }
			}
		},
		onCheckedChange: {
			action: 'onCheckedChange',
			description: 'Function called when the checked state changes.',
			table: {
				type: {
					summary: '(details: CheckedChangeDetails) => void | undefined'
				}
			}
		},
		name: {
			control: 'text',
			description:
				'The name of the input fields in the checkbox, used when submitting an HTML form.',
			table: {
				type: { summary: 'string | undefined' }
			}
		},
		value: {
			control: 'text',
			description: 'The current value.',
			table: {
				defaultValue: { summary: 'on' },
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
} satisfies Meta<CheckboxStoryProps>

export default meta
type Story = StoryObj<typeof meta>

const Template: Pick<Story, 'decorators'> = {
	decorators: [
		(Story, context) => {
			const docsHeight = context.parameters.docsHeight ?? '288px'
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

type FieldSingleCheckbox = {
	label: string
	disabled: boolean
	required: boolean
}
const fieldTerms: FieldSingleCheckbox = {
	label: 'I accept the terms and conditions',
	disabled: false,
	required: true
}
type FormTermsValues = {
	acceptTerms: boolean
}

const hobbies = ['reading', 'gaming', 'sports', 'cooking', 'travel'] as const
type Hobbies = (typeof hobbies)[number]
type FieldHobby = {
	value: Hobbies
	label: string
	disabled: boolean
	required: boolean
}
const fieldHobby = [
	{ value: 'reading', label: 'Reading', disabled: true, required: true },
	{ value: 'gaming', label: 'Gaming', disabled: false, required: true },
	{ value: 'sports', label: 'Sports', disabled: false, required: true },
	{ value: 'cooking', label: 'Cooking', disabled: false, required: true },
	{ value: 'travel', label: 'Travel', disabled: false, required: true }
] as const satisfies readonly FieldHobby[]
type FormHobbyValues = {
	hobbies: Hobbies[]
}

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
 * The standard behavior of the checkbox component. Demonstrates toggling
 * checked states via mouse click and keyboard interaction (Space key), ensuring
 * correct focus management.
 */
export const Overview: Story = {
	...Template,
	parameters: {
		controls: {
			exclude: ['children']
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
				<Checkbox.Root>
					<Checkbox.HiddenInput />
					<Checkbox.Control>
						<Checkbox.Indicator />
					</Checkbox.Control>
					<Checkbox.Label>Label</Checkbox.Label>
				</Checkbox.Root>
			</div>
		)
	},
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement)
		const checkbox = await canvas.findByRole('checkbox', {
			name: 'Label'
		})

		await expect(checkbox).toBeInTheDocument()
		await expect(checkbox).toBeEnabled()
		await expect(checkbox).not.toBeChecked()

		await userEvent.click(checkbox)
		await expect(checkbox).toBeChecked()
		await userEvent.click(checkbox)
		await expect(checkbox).not.toBeChecked()

		checkbox.blur()
		await userEvent.tab()
		await expect(checkbox).toHaveFocus()
		await userEvent.keyboard('[Space]')
		await expect(checkbox).toBeChecked()
		await userEvent.keyboard('[Space]')
		await expect(checkbox).not.toBeChecked()
		checkbox.blur()
	}
}

/**
 * Demonstrates the integration of supporting and error texts using
 * `Checkbox.Group` as a container wrapper for a single checkbox. When the
 * checkbox group is marked invalid aggregates both identifiers
 * into `aria-describedby` and `aria-invalid="true"` on the checkbox.
 */
export const WithSupportingTextAndError: Story = {
	...Template,
	parameters: {
		controls: {
			exclude: ['children']
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
				<Checkbox.Group invalid>
					<Checkbox.Root>
						<Checkbox.HiddenInput />
						<Checkbox.Control>
							<Checkbox.Indicator />
						</Checkbox.Control>
						<Checkbox.Label>Label</Checkbox.Label>
					</Checkbox.Root>

					<Checkbox.GroupSupportingText data-testid="supporting-text">
						Some supporting text.
					</Checkbox.GroupSupportingText>

					<Checkbox.GroupErrorText data-testid="error-text">
						Some error text.
					</Checkbox.GroupErrorText>
				</Checkbox.Group>
			</div>
		)
	},
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement)
		const group = await canvas.findByRole('group')
		const checkbox = await canvas.findByRole('checkbox', {
			name: 'Label'
		})
		const supportingText = await canvas.findByTestId('supporting-text')
		const errorText = await canvas.findByTestId('error-text')

		await expect(group).toHaveAttribute('data-invalid')
		await expect(checkbox).toHaveAttribute('aria-invalid', 'true')

		await expect(supportingText).toHaveTextContent('Some supporting text.')
		await expect(errorText).toHaveTextContent('Some error text.')

		await expect(checkbox).toHaveAttribute(
			'aria-describedby',
			`${supportingText.id} ${errorText.id}`
		)
		await expect(checkbox).toHaveAccessibleDescription(
			/Some supporting text\.\s*Some error text\./
		)
	}
}

/**
 * Demonstrates native HTML form integration and constraint validation for a
 * required single checkbox. Handles invalid event capture, dynamic error
 * message display, and state clearing upon user selection.
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
		const [formData, setFormData] = useState<FormTermsValues>()
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
				? 'Please accept the terms and conditions to continue.'
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

				first?.focus()
				return
			}

			const values = Object.fromEntries(
				new FormData(form)
			) as unknown as FormTermsValues
			setFormData(values)
		}

		function handleChange(evt: React.ChangeEvent<HTMLFormElement, Element>) {
			if (!submitted.current) return

			const field: EventTarget = evt.target
			if (!(field instanceof HTMLInputElement) || !field.name) return

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
					data-testid="form"
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
					<Checkbox.Group invalid={!!errors.acceptTerms}>
						<Checkbox.Root
							name="acceptTerms"
							required={fieldTerms.required}
							disabled={fieldTerms.disabled}
						>
							<Checkbox.HiddenInput />
							<Checkbox.Control>
								<Checkbox.Indicator />
							</Checkbox.Control>
							<Checkbox.Label>{fieldTerms.label}</Checkbox.Label>
						</Checkbox.Root>

						<Checkbox.GroupSupportingText data-testid="supporting-text">
							By clicking this checkbox, you agree to the terms and conditions.
						</Checkbox.GroupSupportingText>

						<Checkbox.GroupErrorText data-testid="error-text">
							{errors.acceptTerms?.message}
						</Checkbox.GroupErrorText>
					</Checkbox.Group>

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
		const checkbox = await canvas.findByRole('checkbox', {
			name: fieldTerms.label
		})
		const group = await canvas.findByRole('group')
		const supportingText = await canvas.findByTestId('supporting-text')
		const submit = await canvas.findByRole('button', { name: 'Send' })

		await expect(checkbox).toBeRequired()
		await expect(checkbox).not.toBeChecked()
		await expect(group).not.toHaveAttribute('data-invalid')
		await expect(checkbox).toHaveAttribute(
			'aria-describedby',
			supportingText.id
		)

		await userEvent.click(submit)

		const errorText = await canvas.findByTestId('error-text')
		await expect(errorText).toHaveTextContent(
			'Please accept the terms and conditions to continue.'
		)
		await expect(group).toHaveAttribute('data-invalid')
		await expect(checkbox).toHaveFocus()
		await expect(checkbox).toHaveAttribute(
			'aria-describedby',
			`${supportingText.id} ${errorText.id}`
		)
		await expect(canvasElement.querySelector('pre')).not.toBeInTheDocument()

		await userEvent.click(checkbox)
		await expect(checkbox).toBeChecked()

		await waitFor(async () => {
			await expect(group).not.toHaveAttribute('data-invalid')
			await expect(checkbox).toHaveAttribute(
				'aria-describedby',
				supportingText.id
			)
		})

		await userEvent.click(submit)

		const output = await canvas.findByText(/"acceptTerms"/)
		await expect(output).toHaveTextContent('"acceptTerms": "on"')
	}
}

/**
 * Demonstrates a checkbox group containing multiple independent option
 * checkboxes. Allows multiple items to be selected simultaneously under a
 * unified group structure.
 */
export const WithGroup: Story = {
	...Template,
	parameters: {
		controls: {
			exclude: ['children']
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
				<Checkbox.Group>
					<Checkbox.GroupLabel>Group Label</Checkbox.GroupLabel>

					{fieldOptions.map(f => (
						<Checkbox.Root key={f.value} value={f.value}>
							<Checkbox.HiddenInput />
							<Checkbox.Control>
								<Checkbox.Indicator />
							</Checkbox.Control>
							<Checkbox.Label>{f.label}</Checkbox.Label>
						</Checkbox.Root>
					))}
				</Checkbox.Group>
			</div>
		)
	},
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement)
		const group = await canvas.findByRole('group')
		const checkboxes = await canvas.findAllByRole('checkbox')

		await expect(group).toBeInTheDocument()
		await expect(within(group).getByText('Group Label')).toBeVisible()
		await expect(checkboxes).toHaveLength(fieldOptions.length)

		for (const checkbox of checkboxes) {
			await expect(checkbox).not.toBeChecked()
		}

		for (const { label } of fieldOptions) {
			const checkbox = canvas.getByRole('checkbox', { name: label })
			await userEvent.click(checkbox)
			await expect(checkbox).toBeChecked()
		}

		for (const checkbox of canvas.getAllByRole('checkbox')) {
			await expect(checkbox).toBeChecked()
		}

		const option2 = canvas.getByRole('checkbox', { name: 'Option 2' })
		await userEvent.click(option2)
		await expect(option2).not.toBeChecked()
		await expect(
			canvas.getByRole('checkbox', { name: 'Option 1' })
		).toBeChecked()
		await expect(
			canvas.getByRole('checkbox', { name: 'Option 3' })
		).toBeChecked()
	}
}

/**
 * Demonstrates a checkbox group in an invalid state with both supporting text
 * and error text. Aggregates descriptive element IDs into the group's
 * `aria-describedby` attribute and propagates validation states to all group
 * items.
 */
export const WithGroupSupportingTextAndError: Story = {
	...Template,
	parameters: {
		controls: {
			exclude: ['children']
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
				<Checkbox.Group invalid>
					<Checkbox.GroupLabel>Group Label</Checkbox.GroupLabel>

					{fieldOptions.map(f => (
						<Checkbox.Root key={f.value} value={f.value}>
							<Checkbox.HiddenInput />
							<Checkbox.Control>
								<Checkbox.Indicator />
							</Checkbox.Control>
							<Checkbox.Label>{f.label}</Checkbox.Label>
						</Checkbox.Root>
					))}

					<Checkbox.GroupSupportingText data-testid="supporting-text">
						Some supporting text.
					</Checkbox.GroupSupportingText>

					<Checkbox.GroupErrorText data-testid="error-text">
						Some error text.
					</Checkbox.GroupErrorText>
				</Checkbox.Group>
			</div>
		)
	},
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement)
		const group = await canvas.findByRole('group')
		const checkboxes = await canvas.findAllByRole('checkbox')
		const supportingText = await canvas.findByTestId('supporting-text')
		const errorText = await canvas.findByTestId('error-text')

		await expect(group).toHaveAttribute('data-invalid')
		for (const checkbox of checkboxes) {
			await expect(checkbox).toHaveAttribute('aria-invalid', 'true')
		}

		await expect(supportingText).toHaveTextContent('Some supporting text.')
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
 * Demonstrates a form validation pattern where at least one checkbox in a group
 * must be selected. Handles group-level constraint validation, dynamic error
 * updating, and multi-value form submission.
 */
export const WithFormGroupAtLeastOne: Story = {
	...Template,
	parameters: {
		docsHeight: '512px',
		controls: {
			exclude: ['children']
		}
	},
	render: () => {
		const [formData, setFormData] = useState<FormHobbyValues>()
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

			const message = field.validationMessage

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

				first?.focus()
				return
			}

			const values = new FormData(form).getAll(
				'hobby'
			) as unknown as FormHobbyValues

			setFormData(values)
		}

		function handleChange(evt: React.ChangeEvent<HTMLFormElement, Element>) {
			if (!submitted.current) return

			const form = evt.currentTarget
			const name = evt.target.name
			if (!name) return

			const inputs = form.querySelectorAll<HTMLInputElement>(
				`input[name="${name}"]:not(:disabled)`
			)
			const groupIsValid = Array.from(inputs).some(i => i.checked)

			if (groupIsValid) {
				setErrors(prev => {
					const { [name]: _removed, ...rest } = prev
					return rest
				})
			} else {
				setTimeout(() => {
					const invalid = form.querySelector<HTMLInputElement>(
						`input[name="${name}"]:invalid`
					)

					setErrors(prev => {
						if (!invalid) {
							const { [name]: _removed, ...rest } = prev
							return rest
						}
						return { ...prev, [name]: { message: invalid.validationMessage } }
					})
				}, 0)
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
					<Checkbox.Group name="hobby" required invalid={!!errors.hobby}>
						<Checkbox.GroupLabel>Select your hobbies</Checkbox.GroupLabel>

						{fieldHobby.map(f => (
							<Checkbox.Root
								key={f.value}
								value={f.value}
								disabled={f.disabled}
							>
								<Checkbox.HiddenInput />
								<Checkbox.Control>
									<Checkbox.Indicator />
								</Checkbox.Control>
								<Checkbox.Label>{f.label}</Checkbox.Label>
							</Checkbox.Root>
						))}

						<Checkbox.GroupSupportingText data-testid="supporting-text">
							Used to personalize your feed and recommendations.
						</Checkbox.GroupSupportingText>

						<Checkbox.GroupErrorText data-testid="error-text">
							{errors.hobby?.message}
						</Checkbox.GroupErrorText>
					</Checkbox.Group>

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
		const group = await canvas.findByRole('group')
		const supportingText = await canvas.findByTestId('supporting-text')
		const submit = await canvas.findByRole('button', { name: 'Send' })

		const reading = canvas.getByRole('checkbox', { name: 'Reading' })
		const gaming = canvas.getByRole('checkbox', { name: 'Gaming' })
		const sports = canvas.getByRole('checkbox', { name: 'Sports' })

		await expect(reading).toBeDisabled()
		await expect(group).not.toHaveAttribute('data-invalid')
		await expect(group).toHaveAttribute('aria-describedby', supportingText.id)

		await userEvent.click(submit)

		const errorText = await canvas.findByTestId('error-text')
		await expect(errorText).not.toBeEmptyDOMElement()
		await expect(group).toHaveAttribute('data-invalid')
		await expect(group).toHaveAttribute(
			'aria-describedby',
			`${supportingText.id} ${errorText.id}`
		)
		await expect(canvasElement.querySelector('pre')).not.toBeInTheDocument()

		await userEvent.click(gaming)
		await expect(gaming).toBeChecked()

		await waitFor(async () => {
			await expect(group).not.toHaveAttribute('data-invalid')
			await expect(group).toHaveAttribute('aria-describedby', supportingText.id)
		})

		await userEvent.click(gaming)
		await expect(gaming).not.toBeChecked()

		await waitFor(async () => {
			await expect(group).toHaveAttribute('data-invalid')
		})

		await userEvent.click(gaming)
		await userEvent.click(sports)

		await waitFor(async () => {
			await expect(group).not.toHaveAttribute('data-invalid')
		})

		await userEvent.click(submit)

		const output = await waitFor(() => {
			const code = canvasElement.querySelector('pre code')
			expect(code).toBeInTheDocument()
			return code as HTMLElement
		})
		await expect(output).toHaveTextContent('gaming')
		await expect(output).toHaveTextContent('sports')
		await expect(output).not.toHaveTextContent('reading')
	}
}

/**
 * Demonstrates a form validation pattern where all individual checkboxes within
 * a group are required. Validates that every enabled checkbox is checked before
 * allowing form submission.
 */
export const WithFormGroupAllRequired: Story = {
	...Template,
	parameters: {
		docsHeight: '512px',
		controls: {
			exclude: ['children']
		}
	},
	render: () => {
		const [formData, setFormData] = useState<FormHobbyValues>()
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

			const message = field.validationMessage

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

				first?.focus()
				return
			}

			const values = new FormData(form).getAll(
				'hobby'
			) as unknown as FormHobbyValues

			setFormData(values)
		}

		function handleChange(evt: React.ChangeEvent<HTMLFormElement, Element>) {
			if (!submitted.current) return

			const form = evt.currentTarget
			const name = evt.target.name
			if (!name) return

			const inputs = form.querySelectorAll<HTMLInputElement>(
				`input[name="${name}"]:not(:disabled)`
			)
			const groupIsValid = Array.from(inputs).every(i => i.validity.valid)

			if (groupIsValid) {
				setErrors(prev => {
					const { [name]: _removed, ...rest } = prev
					return rest
				})
			} else {
				const invalidInput = Array.from(inputs).find(i => !i.validity.valid)

				if (!invalidInput) return

				const message = invalidInput.validationMessage

				setErrors(prev => ({
					...prev,
					[invalidInput.name]: { message }
				}))
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
					<Checkbox.Group name="hobby" invalid={!!errors.hobby}>
						<Checkbox.GroupLabel>Select your hobbies</Checkbox.GroupLabel>

						{fieldHobby.map(f => (
							<Checkbox.Root
								key={f.value}
								value={f.value}
								disabled={f.disabled}
								required={f.required}
							>
								<Checkbox.HiddenInput />
								<Checkbox.Control>
									<Checkbox.Indicator />
								</Checkbox.Control>
								<Checkbox.Label>{f.label}</Checkbox.Label>
							</Checkbox.Root>
						))}

						<Checkbox.GroupSupportingText data-testid="supporting-text">
							Used to personalize your feed and recommendations.
						</Checkbox.GroupSupportingText>

						<Checkbox.GroupErrorText data-testid="error-text">
							{errors.hobby?.message}
						</Checkbox.GroupErrorText>
					</Checkbox.Group>

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
		const group = await canvas.findByRole('group')
		const supportingText = await canvas.findByTestId('supporting-text')
		const submit = await canvas.findByRole('button', { name: 'Send' })

		const reading = canvas.getByRole('checkbox', { name: 'Reading' })
		const enabled = fieldHobby.filter(f => !f.disabled)

		await expect(reading).toBeDisabled()
		for (const { label } of enabled) {
			await expect(canvas.getByRole('checkbox', { name: label })).toBeRequired()
		}

		await userEvent.click(submit)

		const errorText = await canvas.findByTestId('error-text')
		await expect(errorText).not.toBeEmptyDOMElement()
		await expect(group).toHaveAttribute('data-invalid')
		await expect(group).toHaveAttribute(
			'aria-describedby',
			`${supportingText.id} ${errorText.id}`
		)

		await userEvent.click(canvas.getByRole('checkbox', { name: 'Gaming' }))
		await expect(group).toHaveAttribute('data-invalid')

		for (const { label } of enabled.slice(1)) {
			await userEvent.click(canvas.getByRole('checkbox', { name: label }))
		}

		await waitFor(async () => {
			await expect(group).not.toHaveAttribute('data-invalid')
			await expect(group).toHaveAttribute('aria-describedby', supportingText.id)
		})

		await userEvent.click(submit)

		const output = await waitFor(() => {
			const code = canvasElement.querySelector('pre code')
			expect(code).toBeInTheDocument()
			return code as HTMLElement
		})
		for (const { value } of enabled) {
			await expect(output).toHaveTextContent(value)
		}
		await expect(output).not.toHaveTextContent('reading')
	}
}

/**
 * Demonstrates the globally disabled state for a checkbox group. Applies
 * `data-disabled` and disables all child checkboxes, preventing pointer
 * interactions and removing them from the keyboard focus sequence.
 */
export const Disabled: Story = {
	...Template,
	args: { disabled: true },
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
				<Checkbox.Group disabled={args.disabled}>
					<Checkbox.GroupLabel>Group Label</Checkbox.GroupLabel>

					{fieldOptions.map(f => (
						<Checkbox.Root key={f.value} value={f.value}>
							<Checkbox.HiddenInput />
							<Checkbox.Control>
								<Checkbox.Indicator />
							</Checkbox.Control>
							<Checkbox.Label>{f.label}</Checkbox.Label>
						</Checkbox.Root>
					))}
				</Checkbox.Group>
			</div>
		)
	},
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement)
		const group = await canvas.findByRole('group')
		const checkboxes = await canvas.findAllByRole('checkbox')

		await expect(group).toHaveAttribute('data-disabled')
		await expect(checkboxes).toHaveLength(fieldOptions.length)

		for (const { label } of fieldOptions) {
			const checkbox = canvas.getByRole('checkbox', { name: label })

			await expect(checkbox).toBeDisabled()

			await userEvent.click(checkbox)
			await expect(checkbox).not.toBeChecked()
			await expect(checkbox).not.toHaveFocus()
		}

		await userEvent.tab()
		for (const checkbox of canvas.getAllByRole('checkbox')) {
			await expect(checkbox).not.toHaveFocus()
		}
	}
}

/**
 * Demonstrates the inversion of control pattern via the `useCheckbox` hook and
 * `Checkbox.RootProvider`, enabling externalized state management and headless
 * integration.
 */
export const RootProvider: Story = {
	...Template,
	parameters: {
		controls: {
			exclude: ['children']
		}
	},
	render: args => {
		const checkbox = useCheckbox(args)

		return (
			<div
				className={css({
					width: '100%',
					maxWidth: '72'
				})}
			>
				<Checkbox.RootProvider {...checkbox}>
					<Checkbox.HiddenInput />
					<Checkbox.Control>
						<Checkbox.Indicator />
					</Checkbox.Control>
					<Checkbox.Label>Label</Checkbox.Label>
				</Checkbox.RootProvider>
			</div>
		)
	},
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement)
		const checkbox = await canvas.findByRole('checkbox', {
			name: 'Label'
		})

		await expect(checkbox).toBeInTheDocument()
		await expect(checkbox).toBeEnabled()
		await expect(checkbox).not.toBeChecked()

		await userEvent.click(checkbox)
		await expect(checkbox).toBeChecked()
		await userEvent.click(checkbox)
		await expect(checkbox).not.toBeChecked()

		checkbox.blur()
		await userEvent.tab()
		await expect(checkbox).toHaveFocus()
		await userEvent.keyboard('[Space]')
		await expect(checkbox).toBeChecked()
		await userEvent.keyboard('[Space]')
		await expect(checkbox).not.toBeChecked()
		checkbox.blur()
	}
}
