import React from 'react'

import centered from '@storybook/addon-centered'
import { storiesOf } from '@storybook/react'

import TextareaField from '../TextareaField'

const stories = storiesOf('TextareaField', module)

stories.addDecorator(centered)

const textareaValue =
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit. ' +
  'Donec bibendum est in elementum euismod. Vivamus non elementum nunc, non ' +
  'faucibus augue. Mauris eget feugiat libero. Nullam id felis at lectus lobortis ' +
  'commodo. Curabitur sodales orci non condimentum suscipit. Fusce lacinia eget quam ' +
  'id interdum. Praesent tristique felis ac dui rhoncus, porttitor hendrerit ipsum sodales. Mauris malesuada ' +
  'rhoncus odio quis consequat. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas tempor turpis ' +
  'leo, vitae sodales velit scelerisque a. Vivamus in velit sem.Donec feugiat, augue ut porttitor pellentesque, ' +
  'felis dolor consectetur est, eu mollis nisi mi non augue. Donec pharetra cursus elit et pulvinar. Pellentesque ' +
  'maximus turpis tellus, nec venenatis lectus gravida sed. Sed at neque ac orci tincidunt malesuada. Integer ut ' +
  'justo rhoncus, dignissim mi at, hendrerit diam. In nibh turpis, posuere ac nisl eget, dapibus cursus quam. ' +
  'Nullam sagittis sem vitae pretium cursus. In pulvinar magna nibh, sit amet condimentum justo egestas id.'

stories.add('edit mode', () => <TextareaField value={textareaValue} edit />)

stories.add('read mode', () => <TextareaField value={textareaValue} edit={false} />)
