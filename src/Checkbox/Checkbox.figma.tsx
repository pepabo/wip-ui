import figma from '@figma/code-connect/react'

import { Checkbox } from '.'

figma.connect(
  Checkbox,
  'https://www.figma.com/design/QsrZZc5TVZe5mk3oUihpwE/WIP-UI?node-id=59-52462',
  {
    props: {
      label: figma.string('label'),
      isIndeterminate: figma.enum('selected', {
        mixed: true,
      }),
      isSelected: figma.enum('selected', {
        true: true,
      }),
      isDisabled: figma.enum('state', {
        disabled: true,
      }),
    },
    example: ({ label, isSelected, isIndeterminate, isDisabled }) => (
      <Checkbox isSelected={isSelected} isIndeterminate={isIndeterminate} isDisabled={isDisabled}>
        {label}
      </Checkbox>
    ),
  }
)
