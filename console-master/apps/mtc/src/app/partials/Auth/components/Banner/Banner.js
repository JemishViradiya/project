import React from 'react'
import ReactMarkdown from 'react-markdown'

import Button from '@material-ui/core/Button'
import Container from '@material-ui/core/Container'
import Paper from '@material-ui/core/Paper'
import { makeStyles } from '@material-ui/core/styles'
import CloseIcon from '@material-ui/icons/Close'

const useStyles = makeStyles({
  icon: {
    position: 'absolute',
    right: '0px',
    'margin-top': '5px',
    'margin-right': '10px',
    'pointer-events': 'auto',
    '&:hover': {
      color: '#E66A5E',
      background: 'none',
    },
  },
  textContainer: {
    padding: '20px',
  },
  text: {
    color: '#5C5D66',
    'text-align': 'center',
    'font-weight': '500',
    display: 'block',
    'font-size': '16px',
    '& a': {
      'font-size': '16px',
      'text-decoration': 'underline',
    },
  },
})

export default function Banner(props) {
  const classes = useStyles()
  const [displayBanner, setDisplayBanner] = React.useState(true)

  const handleClose = () => {
    setDisplayBanner(v => !v)
  }

  return (
    <Paper elevation={0}>
      {displayBanner && (
        <Container classes={{ root: classes.root }}>
          <Button classes={{ root: classes.icon }} onClick={handleClose}>
            <CloseIcon />
          </Button>
          <div className={classes.textContainer}>
            <h2 className={classes.text}>
              <ReactMarkdown>{props.description}</ReactMarkdown>
            </h2>
          </div>
        </Container>
      )}
    </Paper>
  )
}
