import figma from '@figma/code-connect/react'

import { Typography } from '.'

figma.connect(
  Typography,
  'https://www.figma.com/design/QsrZZc5TVZe5mk3oUihpwE/WIP-UI?node-id=108-10392',
  {
    props: {
      size: figma.enum('size', {
        xxs: 'xxs',
        xs: 'xs',
        s: 's',
        m: 'm',
        l: 'l',
        xl: 'xl',
        xxl: 'xxl',
        xxxl: 'xxxl',
      }),
      density: figma.enum('density', {
        comfort: 'comfort',
        normal: 'normal',
        dense: 'dense',
      }),
      fontWeight: figma.enum('bold', {
        normal: 'normal',
        bold: 'bold',
      }),
      text: figma.string('text'),
    },
    example: ({ size, density, fontWeight, text }) => (
      <Typography size={size} density={density} fontWeight={fontWeight}>
        {text}
      </Typography>
    ),
  }
)
