describe('Button storybook', () => {
  before(() => {
    I.visitStorybook()
  })

  beforeEach(() => {
    I.loadStory('Button', 'Button')
  })

  it('should display button', () => {
    I.findByRole('button').should('exist').and('not.be.disabled')
  })

  it('should display disabled button', () => {
    I.changeArg('disabled', true)
    I.findByRole('button').should('exist').and('be.disabled')
    I.findByRole('button').get('svg').should('not.exist')
  })

  it('should display button with start icon', () => {
    I.changeArg('disabled', false)
    I.changeArg('withStartIcon', true)
    I.changeArg('withEndIcon', false)
    I.findByRole('button').should('exist').and('not.be.disabled')
    I.findByRole('button').get('svg').should('exist')
  })

  it('should display button with end icon', () => {
    I.changeArg('disabled', false)
    I.changeArg('withStartIcon', false)
    I.changeArg('withEndIcon', true)
    I.findByRole('button').should('exist').and('not.be.disabled')
    I.findByRole('button').get('svg').should('exist')
  })

  it('should display button with start and end icons', () => {
    I.changeArg('disabled', false)
    I.changeArg('withStartIcon', true)
    I.changeArg('withEndIcon', true)
    I.findByRole('button').should('exist').and('not.be.disabled')
    I.findByRole('button').children().children().first().get('svg').should('exist')
    I.findByRole('button').children().children().last().get('svg').should('exist')
  })

  it('should display disabled button with icon', () => {
    I.changeArg('disabled', true)
    I.changeArg('withStartIcon', true)
    I.changeArg('withEndIcon', true)
    I.findByRole('button').should('exist').and('be.disabled')
  })
})
