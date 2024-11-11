module.exports = {
  client: {
    service: {
      name: 'directus',
      // URL to the GraphQL API
      url: 'http://localhost:8055/graphql',
    },
    // Files processed by the extension
    includes: ['src/**/*.vue', 'src/**/*.ts', 'src/**/*.gql'],
  },
}
