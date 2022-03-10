const successResponse = () => {
  const mockResponse = {
    status: 200,
  }
  return new Promise(resolve => {
    resolve(mockResponse)
  })
}

export { successResponse }
