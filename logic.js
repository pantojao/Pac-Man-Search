import { dfs } from "./depth-first.js";
import { bfs } from "./breadth-first.js";
import { bidirectional } from "./bidirectional.js";

$(document).ready(function () {
  const info = `
    <p>1) Click & Drag to Setup Road Blocks</p>
    <p>2) Drag & Drop PAC-MAN or Ghost</p>
    <p>3) Pick Your Algorithm</p>
    <p>4) Adjust The Speed</p>
  `;

  $(".more-info").popover({
    trigger: "focus",
    content: info,
    html: true,
  });

  let boxCount = 900;
  function pauseFunction(x) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(x);
      }, x);
    });
  }

  let speed = 5;
  let squares = [];
  for (let i = 0; i < boxCount; i++) {
    squares.push(`<div class='square' id=${i + 1}></div>`);
  }

  $(".main").append(squares.join(""));

  const ghost = '<img src="./ghost.png" id="ghost" class="draggable ghost"/>';
  const pac =
    '<img src="./pac-man.png" id="pac-man"  class="draggable pac-man"/>';

  $("#38").append(pac);
  $("#122").append(ghost);

  $(".ghost").draggable({
    addClasses: false,
    containment: ".main",
    helper: "clone",
  });

  $(".pac-man").draggable({
    addClasses: false,
    containment: ".main",
    helper: "clone",
  });

  let start = 38;
  let target = 122;

  $(".square").droppable({
    addClasses: false,
    drop: function (event, ui) {
      ui.draggable.detach().appendTo($(this));

      if (ui.draggable.attr("id") == "ghost") {
        target = $(this).attr("id");
      } else {
        start = $(this).attr("id");
      }
    },
  });

  let drawPath = async function (bestPath = []) {
    for (let number of bestPath) {
      number = parseInt(number);
      $(`#${number}`).addClass("best-path");
      await pauseFunction(20);
    }
  };

  let getNeighbors = function () {
    let neighbors = Array(boxCount + 1).fill(0);
    for (let i = 1; i < neighbors.length; i++) {
      let boxPosition = $(`#${i}`).position();

      let below = $(
        document.elementFromPoint(boxPosition.left, boxPosition.top + 35)
      );
      let above = $(
        document.elementFromPoint(boxPosition.left, boxPosition.top - 15)
      );
      let right = $(
        document.elementFromPoint(boxPosition.left + 35, boxPosition.top)
      );
      let left = $(
        document.elementFromPoint(boxPosition.left - 15, boxPosition.top)
      );
      let temp = [];

      if ($(above).hasClass("square")) {
        temp.push($(above).attr("id"));
      } else if ($(above).hasClass("ghost")) {
        temp.push(target);
      }

      if ($(below).hasClass("square")) {
        temp.push($(below).attr("id"));
      } else if ($(below).hasClass("ghost")) {
        temp.push(target);
      }

      if ($(right).hasClass("square")) {
        temp.push($(right).attr("id"));
      } else if ($(right).hasClass("ghost")) {
        temp.push(target);
      }

      if ($(left).hasClass("square")) {
        temp.push($(left).attr("id"));
      } else if ($(left).hasClass("ghost")) {
        temp.push(target);
      }
      neighbors[i] = temp;
    }
    return neighbors;
  };

  $(".square").on("mousedown mouseover", function (e) {
    if (
      e.buttons == 1 &&
      !$(".pac-man").is(".ui-draggable-dragging") &&
      !$(".ghost").is(".ui-draggable-dragging")
    ) {
      $(this).toggleClass("blocked");
    }
  });

  $(".reset-blocked").click(function () {
    $(".blocked").each(function () {
      $(this).removeClass("blocked");
    });
  });

  $(".slider").click(function () {
    speed = $(".slider").val();
  });

  $(".run-algorithm").click(async function () {
    $(".btn").attr("disabled", "disabled");
    let neighbors = getNeighbors();
    $(".best-path").each(function () {
      $(this).removeClass("best-path");
    });
    $(".target-visited").each(function () {
      $(this).removeClass("best-path");
    });
    let currentAlgorithm = $(".form-control").val();
    if (currentAlgorithm == "breadth") {
      let path = await bfs(neighbors, start, target, (speed = speed));
      if (!path) {
        $(".messages").text("PAC-MAN Could Not Find The Ghost!");
      } else {
        drawPath(path);
        $(".messages").text("PAC-MAN Found The Ghost!");
      }
    } else if (currentAlgorithm == "depth") {
      let path = await dfs(neighbors, start, target, (speed = speed));
      if (!path) {
        $(".messages").text("PAC-MAN Could Not Find The Ghost!");
      } else {
        drawPath(path);
        $(".messages").text("PAC-MAN Found The Ghost!");
      }
      drawPath(path);
    } else if (currentAlgorithm == "Bidirectional") {
      let path = await bidirectional(neighbors, start, target, (speed = speed));
      if (!path || !path.length) {
        $(".messages").text("PAC-MAN Could Not Find The Ghost!");
      } else {
        drawPath(path);
        $(".messages").text("PAC-MAN Found The Ghost!");
      }
      drawPath(path);
    }
    $(".btn").removeAttr("disabled");
  });
});
