// {
//   "plugins": ["source-map-support", "@babel/plugin-proposal-optional-chaining"],
//   "presets": [
//     [
//       "@babel/preset-env",
//       {
//         "targets": {
//           "node": "12"
//         }
//       }
//     ]
//   ]
// }

module.exports = function (api) {
  api.cache(true);
  const presets = ["@babel/preset-env", ];
  const plugins = ["@babel/plugin-proposal-optional-chaining", "source-map-support"];
  return { presets, plugins };
};