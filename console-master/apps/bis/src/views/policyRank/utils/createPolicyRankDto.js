const mapPolicyToId = ({ id }) => id

export default policies => ({
  ids: policies.map(mapPolicyToId),
})
