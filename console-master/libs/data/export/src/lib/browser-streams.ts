// "web-streams-polyfill" for firefox or older browsers
async function browserStreamsWithPolyfill(): Promise<
  Pick<typeof globalThis, 'ReadableStream' | 'TransformStream' | 'CountQueuingStrategy' | 'ByteLengthQueuingStrategy'>
> {
  if (!globalThis.TransformStream) {
    return await import(/* webpackChunkName: "web-streams-polyfill" */ 'web-streams-polyfill/ponyfill/es2018')
  }
  return globalThis
}

export { browserStreamsWithPolyfill }
