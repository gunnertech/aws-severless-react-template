module.exports = function(api) {
  api.cache(true);
  return {
    presets: ["@babel/preset-env"],
    plugins: [
      "@babel/plugin-proposal-optional-chaining", 
      "@babel/plugin-proposal-nullish-coalescing-operator", 
      "source-map-support",
      ["@babel/plugin-proposal-pipeline-operator", { "proposal": "fsharp" }],
      ["module-resolver", {
        "root": ["./"],
        "alias": {
          "handlers": "./handlers",
          "utils": "./utils",
          "react-shared": "../../react-shared",
          "aws-exports": ["../../amplify/src/aws-exports"]
        }
      }]
    ]
  };
};
