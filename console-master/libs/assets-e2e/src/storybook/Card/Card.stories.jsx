import React from 'react'

import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import CardHeader from '@material-ui/core/CardHeader'
import Paper from '@material-ui/core/Paper'
import Typography from '@material-ui/core/Typography'

import markdown from './Card.md'

export const CardWithHeader = args => {
  return (
    <Paper elevation={0}>
      <Card>
        {args.showHeader && <CardHeader title={<Typography variant="h2">Card Header</Typography>} />}
        <CardContent>
          <Typography>
            This is the content used for a card. Lorem ipsum dolor sit amet consectetur adipisicing elit. Quas, fuga? Numquam ipsum
            quaerat sequi eligendi explicabo temporibus obcaecati nisi voluptate. Neque unde eaque amet facilis. Consectetur tempora
            aliquid odio ipsa.
          </Typography>
        </CardContent>
      </Card>
    </Paper>
  )
}

CardWithHeader.args = {
  showHeader: true,
}

export default {
  title: 'Card',
  parameters: {
    notes: markdown,
    'in-dsm': { id: '5f8ef80bc5dd5c7347e03069' },
    controls: {
      showHeader: {
        control: {
          type: 'boolean',
        },
        defaultValue: { summary: true },
        description: 'With header',
      },
    },
  },
}
