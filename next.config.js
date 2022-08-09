const withGraphql = require("next-graphql-loader");

module.exports = withGraphql({
  redirects: () => {
    return [
      {
        source: "/map",
        destination: "/map/1/6/0/0",
        permanent: true,
      },
    ];
  },
});
