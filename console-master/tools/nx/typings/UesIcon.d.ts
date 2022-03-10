import type { ElementType } from 'react'

import type { OverridableComponent, OverrideProps } from '@material-ui/core/OverridableComponent'

export interface UesIconTypeMap<P = {}, D extends React.ElementType = 'svg'> {
  props: P & {
    /**
     * The color of the component. It supports those theme colors that make sense for this component.
     * You can use the `htmlColor` prop to apply a color attribute to the SVG element.
     */
    color?: 'inherit' | 'primary' | 'secondary' | 'action' | 'disabled' | 'error'
    /**
     * The fontSize applied to the icon. Defaults to 24px, but can be configure to inherit font size.
     */
    fontSize?: 'inherit' | 'default' | 'small' | 'large'
    /**
     * Applies a color attribute to the SVG element.
     */
    htmlColor?: string
    /**
     * The shape-rendering attribute. The behavior of the different options is described on the
     * [MDN Web Docs](https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/shape-rendering).
     * If you are having issues with blurry icons you should investigate this prop.
     * @document
     */
    shapeRendering?: string
    /**
     * Provides a human-readable title for the element that contains it.
     * https://www.w3.org/TR/SVG-access/#Equivalent
     */
    titleAccess?: string
    /**
     * Allows you to redefine what the coordinates without units mean inside an SVG element.
     * For example, if the SVG element is 500 (width) by 200 (height), and you pass viewBox="0 0 50 20",
     * this means that the coordinates inside the SVG will go from the top left corner (0,0)
     * to bottom right (50,20) and each unit will be worth 10px.
     */
    viewBox?: string
  }
  defaultComponent: D
  classKey: UesIconClassKey
}

export const UesIcon: OverridableComponent<UesIconTypeMap>

export type UesIconClassKey =
  | 'root'
  | 'colorSecondary'
  | 'colorAction'
  | 'colorDisabled'
  | 'colorError'
  | 'colorPrimary'
  | 'fontSizeInherit'
  | 'fontSizeSmall'
  | 'fontSizeLarge'

export type UesIconProps<D extends ElementType = UesIconTypeMap['defaultComponent'], P = {}> = OverrideProps<
  UesIconTypeMap<P, D>,
  D
>
