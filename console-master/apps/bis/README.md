# BIS Portal data-testid naming convention

We are creating data-testid strings based on the UI's tree.

Example for a riskEngines' label in Settings tab:
e.g "settings.riskengines.riskSettingsLabel"

# Using data-testid

In order to choose an element by its data-testid use methods like:
getAllByTestId and getByTestId provided by react-testing-library

# List data-testids

To list available data-testid's values use the package.json script:
yarn list-testids
