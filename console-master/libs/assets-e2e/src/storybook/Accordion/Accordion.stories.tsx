import React from 'react'

import { Accordion as MuiAccordion, AccordionDetails, AccordionSummary, Paper, Typography } from '@material-ui/core'

import { ChevronDown } from '@ues/assets'

const SimpleText = (
  <div>
    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
    Rhoncus dolor purus non enim praesent elementum facilisis leo vel. Risus at ultrices mi tempus imperdiet. Semper risus in
    hendrerit gravida rutrum quisque non tellus. Convallis convallis tellus id interdum velit laoreet id donec ultrices. Odio morbi
    quis commodo odio aenean sed adipiscing. Amet nisl suscipit adipiscing bibendum est ultricies integer quis. Cursus euismod quis
    viverra nibh cras. Metus vulputate eu scelerisque felis imperdiet proin fermentum leo. Mauris commodo quis imperdiet massa
    tincidunt. Cras tincidunt lobortis feugiat vivamus at augue. At augue eget arcu dictum varius duis at consectetur lorem. Velit
    sed ullamcorper morbi tincidunt. Lorem donec massa sapien faucibus et molestie ac.
  </div>
)

export const Accordion = storyBookArgs => {
  return (
    <div>
      <Paper elevation={0}>
        <MuiAccordion>
          <AccordionSummary
            classes={{
              expandIcon: storyBookArgs.showSubtitle && storyBookArgs.subtitle ? 'subtitle' : null,
            }}
            expandIcon={<ChevronDown />}
          >
            <div
              style={{
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'space-between',
              }}
            >
              <Typography variant="h3">{storyBookArgs.title}</Typography>
              {storyBookArgs.showAlternateTitle ? <Typography variant="h3">{storyBookArgs.alternateTitle}</Typography> : null}
            </div>
            {storyBookArgs.showSubtitle ? <Typography>{storyBookArgs.subtitle}</Typography> : null}
          </AccordionSummary>
          <AccordionDetails className={'rows'}>
            <Typography>{SimpleText}</Typography>
          </AccordionDetails>
        </MuiAccordion>
      </Paper>
    </div>
  )
}

export default {
  title: 'Accordion',
  argTypes: {
    title: {
      control: {
        type: 'text',
      },
      defaultValue: 'Accordion Title',
    },
    subtitle: {
      control: {
        type: 'text',
      },
      defaultValue: 'Subtitle',
    },
    showSubtitle: {
      control: {
        type: 'boolean',
      },
      defaultValue: true,
    },
    alternateTitle: {
      control: {
        type: 'text',
      },
      defaultValue: 'Alt',
    },
    showAlternateTitle: {
      control: {
        type: 'boolean',
      },
      defaultValue: true,
    },
  },
}
