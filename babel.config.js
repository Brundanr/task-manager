module.exports = function(api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      // Transform import.meta to avoid errors in Storybook
      function() {
        return {
          visitor: {
            MetaProperty(path) {
              if (
                path.node.meta &&
                path.node.meta.name === 'import' &&
                path.node.property &&
                path.node.property.name === 'meta'
              ) {
                // Replace import.meta with an empty object
                path.replaceWithSourceString('({})');
              }
            },
          },
        };
      },
    ],
  };
};
