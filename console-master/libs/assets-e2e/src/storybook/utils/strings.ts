const loremIpsumStrings = [
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
  'Integer ac felis porttitor, elementum erat ut, tincidunt eros.',
  'Donec ut erat at tortor sollicitudin faucibus quis at arcu.',
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum egestas imperdiet velit. Ut vel volutpat tellus. Fusce efficitur felis eu ligula facilisis dictum. ',
  'Maecenas fringilla purus in risus gravida, vitae scelerisque mauris elementum.',
  'Aenean luctus urna sed sem tincidunt, at dapibus quam gravida.',
  'Fusce suscipit nisl sit amet enim vulputate egestas.',
  'Vivamus a leo non augue ultricies fermentum.',
  'Curabitur tincidunt dui vel dolor interdum, sed mollis massa sodales.',
  'Curabitur non felis sit amet nunc sagittis lobortis.',
]

export const reallyLongString =
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed nec ultricies tellus, sed sollicitudin urna. Quisque condimentum placerat interdum. Pellentesque non ornare purus. Sed consequat elementum ante, a placerat tellus volutpat nec. Suspendisse potenti. Mauris posuere diam id velit lacinia cursus quis sed diam. Vivamus pretium sapien a tortor tempus dapibus. In hac habitasse platea dictumst. Morbi pellentesque sollicitudin quam, at tincidunt arcu lacinia a. Vestibulum dolor turpis, eleifend vel est a, dignissim vestibulum nisi. In tristique urna ac elit pulvinar, sit amet lacinia ipsum sodales. Ut dignissim mauris posuere enim cursus lacinia. Donec venenatis justo non enim aliquet euismod.'

export const randomString = (index?: number) => {
  if (index === undefined) index = Math.floor(Math.random() * loremIpsumStrings.length)
  return loremIpsumStrings[index % loremIpsumStrings.length]
}
