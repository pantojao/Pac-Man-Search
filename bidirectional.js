export const bidirectional = async function (neighbors, start, target, speed) {
  function pauseFunction(x) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(x);
      }, 110 * (1 / speed));
    });
  }

  let queue1 = [start],
    queue2 = [target],
    dic1 = {},
    dic2 = {},
    lastNumber,
    blockedSquares = $(".blocked");

  for (let square of blockedSquares) {
    let boxNumber = $(square).attr("id");
    if (boxNumber !== target) {
      dic1[boxNumber] = null;
      dic2[boxNumber] = null;
    }
  }

  while (queue1.length !==0 && queue2.length!==0) {
    if (queue1) {
      let current = queue1.shift();
      
      $(`#${current}`).toggleClass("current-node");
      await pauseFunction();
      $(`#${current}`).toggleClass("target-visited");

      if (dic2.hasOwnProperty(`#${current}`) || current == target) {
        lastNumber = current;
        $(`#${current}`).addClass("best-path");
        break;
      }

      for (let neighbor of neighbors[current]) {
        if (!dic1.hasOwnProperty(`${neighbor}`)) {
          queue1.push(neighbor);
          dic1[`${neighbor}`] = current;
        }
      }
      dic1[start] = null;
    }

    if (queue2) {
      let current = queue2.shift();
      $(`#${current}`).toggleClass("current-node");
      await pauseFunction();
      $(`#${current}`).toggleClass("target-visited");
      if (dic1.hasOwnProperty(`${current}`) || current == start) {
        lastNumber = current;
        $(`#${current}`).addClass("best-path");
        break;
      }

      for (let neighbor of neighbors[current]) {
        if (!dic2.hasOwnProperty(`${neighbor}`)) {
          queue2.push(neighbor);
          dic2[`${neighbor}`] = current;
        }
      }
      dic2[target] = null;
    }
  }

  let bestPath = [];

  let recurse = function (currentNode, parents = {}, count = 0 ) {
    const parent = parents[`${currentNode}`];
    if (parent !== null && count < 1000) {
      bestPath.push(parent);
      count++
      recurse(parent, parents, count);
    }

    return;
  };

  recurse(lastNumber, dic1);
  recurse(lastNumber, dic2);

  for (let element of $(".square")) {
    $(element).removeClass("current-node target-visited");
  }

  return bestPath;
};
