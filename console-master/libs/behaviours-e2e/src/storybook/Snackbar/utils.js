/*
 *   Copyright (c) 2020 BlackBerry Ltd
 *   All rights reserved.
 *   BlackBerry Limited proprietary and confidential.
 *   Do not reproduce without permission in writing.
 */
export const getRandomText = () => {
  const quotes = [
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    'Praesent sodales felis in urna tincidunt, sed venenatis risus dapibus.',
    'Aliquam commodo leo quis ornare consequat.',

    'Vivamus at massa nec dolor elementum congue vel nec enim.',
    'Donec ornare est eget aliquam imperdiet.',
    'Nulla euismod elit et leo finibus pulvinar.',
    'Suspendisse ut eros sed magna elementum dapibus.',

    'Nunc imperdiet mauris ut risus consectetur, quis tincidunt sem suscipit.',
    'Sed a mi et odio egestas congue a mollis libero.',
    'Phasellus eget sapien in ligula vestibulum pretium.',
    'Quisque tempus nisi nec dui vulputate placerat.',
    'Cras cursus sem at convallis fringilla.',
    'Lorem ipsum dolor sit amet.',
  ]

  return quotes[Math.floor(Math.random() * quotes.length)]
}
