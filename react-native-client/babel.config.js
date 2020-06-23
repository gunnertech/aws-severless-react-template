module.exports = function(api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      ["module-resolver", {
        "root": ["./"],
        "alias": {
          "Components": "./src/Components",
          "Contexts": "./src/Contexts",
          "Hooks": "./src/Hooks",
          "Screens": "./src/Screens",
          "Navigators": "./src/Navigators",
          "Styles": "./src/Styles",
          "Util": "./src/Util",
          "react-shared": "./src/react-shared"
        }
      }]
    ]
  };
};
