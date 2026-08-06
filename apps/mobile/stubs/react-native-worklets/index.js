// No-op runtime stub for react-native-worklets
module.exports = {
  runOnJS: (fn) => fn,
  runOnUI: (fn) => fn,
  isWorklet: () => false,
};
