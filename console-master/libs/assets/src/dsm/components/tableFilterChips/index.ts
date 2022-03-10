// import { theme } from '@ues/assets'
import { boxFlexBetweenProps } from './../box'

const chipsRootProps = {
  ...boxFlexBetweenProps,
  // bgcolor: theme.props.colors.grey[100],
  pt: 6,
}

const chipsTransitionProps = {
  timeout: 350,
}

const chipTransitionProps = {
  timeout: 250,
  in: true,
}

const clearLinkProps = {
  href: '#',
  variant: 'body2',
}

export { chipsRootProps, chipsTransitionProps, chipTransitionProps, clearLinkProps }
