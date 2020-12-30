


export const dfs = async function (neighbors, start, target) {
  function pauseFunction(x) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(x);
      }, x*2);
    })
  }

  let stack = [[start, [start]]];
  let set = new Set();
  let bestPath;
  let blockedSquares = $(".blocked");

  for (let square of blockedSquares) {
    if ($(square).attr("id")!== target){
      set.add($(square).attr("id"));
      }
  }
  while (stack.length !== 0) {
    let currentNode = stack.pop();
    let path = currentNode[1];
    let current = currentNode[0];
    $(`#${current}`).toggleClass("current-node");
    await pauseFunction(10);

    if (current == target) {
      bestPath = path;
      stack = [];
      break;
    }

    $(`#${current}`).toggleClass("target-visited");
    for (let neighbor of neighbors[current]) {
      if (!set.has(neighbor)) {
        stack.push([neighbor, [...path, neighbor]]);
        set.add(`${neighbor}`);
      }
    }
  }

  for (let element of $('.square')){
    $(element).removeClass("current-node target-visited")
  }
  return bestPath;
};

