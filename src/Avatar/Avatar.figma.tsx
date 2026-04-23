import figma from '@figma/code-connect/react'

import { Avatar } from '.'

figma.connect(
  Avatar,
  'https://www.figma.com/design/QsrZZc5TVZe5mk3oUihpwE/WIP-UI?node-id=59-52806',
  {
    props: {
      size: figma.enum('Size', {
        XS: 'xs',
        S: 's',
        M: 'm',
        L: 'l',
      }),
    },
    example: ({ size }) => <Avatar size={size} src="/avatar.png" alt="name" />,
  }
)
