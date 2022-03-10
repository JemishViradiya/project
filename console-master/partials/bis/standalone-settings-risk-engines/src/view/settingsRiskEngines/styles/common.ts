import { makeStyles } from '@material-ui/core/styles'

export const useLinkStyles = makeStyles((theme: any) => ({
  link: {
    color: theme?.palette?.link?.default?.main,
    textDecoration: 'none',
  },
}))
