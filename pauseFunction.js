export function pauseFunction(x) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(x);
    }, x);
  })
}