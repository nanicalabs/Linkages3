/* @flow */

'use strict';

var POINT_COLOR = 'black';
var LINE_COLOR = 'darkGray';
var BACKGROUND_COLOR = 'lightGray';
var POINT_RADIUS = 4;
var LINE_WIDTH = 4;

function init(canvasID: string, options: ?Object): Object {
  var pointColor = (options && options.pointColor) || POINT_COLOR;
  var lineColor = (options && options.lineColor) || LINE_COLOR;
  var pointRadius = (options && options.pointRadius) || POINT_RADIUS;
  var lineWidth = (options && options.lineWidth) || LINE_WIDTH;

  var canvas = document.getElementById(canvasID);
  var ctx = canvas.getContext('2d');
  canvas.width = document.body.clientWidth;
  canvas.height = document.body.clientHeight;
  var width = canvas.width;
  var height = canvas.height;

  function pushPopContext(f) {
    return (...args) => {
      ctx.save();
      f.apply(null, args);
      ctx.restore();
    };
  }

  var drawPoint = pushPopContext(function ({x, y}) {
    ctx.beginPath();
    ctx.arc(x, y, pointRadius, 0, 2 * Math.PI, true);
    ctx.fillStyle = pointColor;
    ctx.fill();
  });

  var drawLine = pushPopContext((p1, p2) => {
    drawPoint(p1);
    drawPoint(p2);

    ctx.beginPath();
    ctx.moveTo(p1.x, p1.y);
    ctx.lineTo(p2.x, p2.y);
    ctx.strokeStyle = lineColor;
    ctx.lineWidth = lineWidth;
    ctx.stroke();
  });

  var drawBackground = pushPopContext(() => {
    ctx.fillStyle = BACKGROUND_COLOR;
    ctx.fillRect(0, 0, width, height);
  });

  var drawLinkage = function ({points, positions}) {
    drawBackground();
    Object.keys(points).forEach((pointID) => {
      var p0 = positions[pointID];
      Object.keys(points[pointID]).forEach((pointID) => {
        var pi = positions[pointID];
        drawLine(p0, pi); 
      });
    }); 
  };

  return {drawPoint, drawLine, drawLinkage};
}

module.exports = {init};