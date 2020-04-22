/*
 * @Author: Demian
 * @Date: 2020-04-22 14:54:26
 * @LastEditor: Demian
 * @LastEditTime: 2020-04-22 16:17:29
 */
define(function () {
  return transverse({
    '<': {
      x: 0,
      y: 0,
    },
    '\\frac \\placeholder\\placeholder': {
      x: 1,
      y: 0,
    },
    '\\sqrt \\placeholder': {
      x: 2,
      y: 0,
    },
    a: {
      x: 3,
      y: 0,
    },
    '+': {
      x: 4,
      y: 0,
    },
    '7': {
      x: 5,
      y: 0,
    },
    '8': {
      x: 6,
      y: 0,
    },
    '9': {
      x: 7,
      y: 0,
    },
    '>': {
      x: 0,
      y: 1,
    },
    '||': {
      x: 1,
      y: 1,
    },
    '\\placeholder^2': {
      x: 2,
      y: 1,
    },
    b: {
      x: 3,
      y: 1,
    },
    '-': {
      x: 4,
      y: 1,
    },
    '4': {
      x: 5,
      y: 1,
    },
    '5': {
      x: 6,
      y: 1,
    },
    '6': {
      x: 7,
      y: 1,
    },
    '\\leq': {
      x: 0,
      y: 2,
    },
    '\\left(\\placeholder\\right)': {
      x: 1,
      y: 2,
    },
    '\\sqrt [3] \\placeholder': {
      x: 2,
      y: 2,
    },
    x: {
      x: 3,
      y: 2,
    },
    '\\pm': {
      x: 4,
      y: 2,
    },
    '1': {
      x: 5,
      y: 2,
    },
    '2': {
      x: 6,
      y: 2,
    },
    '3': {
      x: 7,
      y: 2,
    },
    '\\geq': {
      x: 0,
      y: 3,
    },
    '%': {
      x: 1,
      y: 3,
    },
    '\\placeholder^3': {
      x: 2,
      y: 3,
    },
    y: {
      x: 3,
      y: 3,
    },
    ',': {
      x: 4,
      y: 3,
    },
    '0': {
      x: 5,
      y: 3,
    },
    '.': {
      x: 6,
      y: 3,
    },
    '=': {
      x: 7,
      y: 3,
    },
    '\\times': {
      x: 0,
      y: 4,
    },
    '\\div': {
      x: 1,
      y: 4,
    },
    '%0': {
      x: 2,
      y: 4,
    },
    '\\approx': {
      x: 3,
      y: 4,
    },
    '\\neq': {
      x: 4,
      y: 4,
    },
    '\\sqrt [\\placeholder] \\placeholder': {
      x: 5,
      y: 4,
    },
    '\\pi': {
      x: 6,
      y: 4,
    },
    '\\sigma': {
      x: 7,
      y: 4,
    },
    '\\left[\\placeholder\\right]': {
      x: 0,
      y: 5,
    },
    '\\placeholder^\\placeholder': {
      x: 1,
      y: 5,
    },
    '\\placeholder_\\placeholder': {
      x: 2,
      y: 5,
    },
    '{^\\placeholder_\\placeholder\\placeholder}': {
      x: 3,
      y: 5,
    },
    '\\placeholder^\\placeholder_\\placeholder': {
      x: 4,
      y: 5,
    },
    排: {
      x: 5,
      y: 5,
    },
    组: {
      x: 6,
      y: 5,
    },
    '\\sum\\placeholder': {
      x: 7,
      y: 5,
    },
    '\\sum_\\placeholder\\placeholder': {
      x: 0,
      y: 6
    },
    '\\sum^\\placeholder_\\placeholder\\placeholder': {
      x: 1,
      y: 6
    },
    '\\int \\placeholder': {
      x: 2,
      y: 6
    },
    '\\int^\\placeholder_\\placeholder\\placeholder': {
      x: 3,
      y: 6
    },
    '\\iint\\placeholder': {
      x: 4,
      y: 6
    },
    '\\iint^\\placeholder_\\placeholder\\placeholder': {
      x: 5,
      y: 6
    },
    '\\iiint\\placeholder': {
      x: 6,
      y: 6
    },
    '\\iiint^\\placeholder_\\placeholder\\placeholder': {
      x: 7,
      y: 6
    },
    'log': {
      x: 0,
      y: 7
    },
    'ln': {
      x: 1,
      y: 7
    },
    '\\to': {
      x: 2,
      y: 7
    },
    '\\cup': {
      x: 3,
      y: 7
    },
    '\\neg': {
      x: 4,
      y: 7
    },
    '\\forall': {
      x: 5,
      y: 7
    },
    '\\exists': {
      x: 6,
      y: 7
    },
    '': {
      x: 7,
      y: 6
    },
  });

  function transverse(obj) {
    for (let i in obj) {
      obj[i] = {
        x: obj[i].x * 83,
        y: obj[i].y * 65,
      };
    }
    return obj;
  }
});
