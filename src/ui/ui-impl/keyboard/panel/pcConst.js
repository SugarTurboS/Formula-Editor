/*
 * @Author: Demian
 * @Date: 2020-04-15 10:11:11
 * @LastEditor: Demian
 * @LastEditTime: 2020-05-18 14:36:33
 */

define(function (require) {
  const kity = require('kity'),
    data = require('ui/ui-impl/keyboard/panel/position.data'),
    START_INDEX_POSITION = data.pcStartIndex,
    url = data.pcSprite,
    Constant = [
      { type: 'common', title: '常用', index: 0, items: [] },
      { type: 'algebra', title: '代数', index: 1, items: [] },
      { type: 'geometry', title: '几何', index: 2, items: [] },
      { type: 'letter', title: '字母', index: 3, items: [] },
      { type: 'other', title: '其他', index: 4, items: [] },
    ];

  // ----------------------------取雪碧图icon
  // 常用
  (function () {
    const list = [
      '<',
      '\\frac \\placeholder\\placeholder',
      '\\sqrt \\placeholder',
      'a',
      '+',
      '7',
      '8',
      '9',
      '>',
      '\\left|\\placeholder\\right|',
      '\\placeholder^2',
      'b',
      '-',
      '4',
      '5',
      '6',
      '\\leq',
      '\\left(\\placeholder\\right)',
      '\\sqrt [3] \\placeholder',
      'x',
      '\\pm',
      '1',
      '2',
      '3',
      '\\geq',
      '%',
      '\\placeholder^3',
      'y',
      ',',
      '0',
      '.',
      '=',
    ];

    Constant[0].items = getIconContents(
      list,
      url,
      START_INDEX_POSITION[Constant[0].type]
    );
  })();
  // 代数
  (function () {
    const list = [
      '\\times',
      '\\div',
      '\\approx',
      '\\neq',
      '\\sqrt [\\placeholder] \\placeholder',
      '\\pi',
      '\\delta',
      '\\left[\\placeholder\\right]',
      '\\placeholder^\\placeholder',
      '\\placeholder_\\placeholder',
      '{^\\placeholder_\\placeholder\\placeholder}',
      '\\placeholder^\\placeholder_\\placeholder',
      '\\sum\\placeholder',
      '\\sum_\\placeholder\\placeholder',
      '\\sum^\\placeholder_\\placeholder\\placeholder',
      '\\int \\placeholder',
      '\\int^\\placeholder_\\placeholder\\placeholder',
      '\\iint\\placeholder',
      '\\iint^\\placeholder_\\placeholder\\placeholder',
      '\\iiint\\placeholder',
      '\\iiint^\\placeholder_\\placeholder\\placeholder',
      '\\log\\placeholder',
      '\\ln\\placeholder',
      '\\overrightarrow \\placeholder',
      '\\land',
      '\\lor',
      '\\neg',
      '\\forall',
      '\\exists',
      '\\infty',
      '\\cup',
      '\\cap',
      '\\in',
      '\\notin',
      '\\subset',
      '\\subseteq',
      '\\supset',
      '\\supseteq',
      '\\varnothing',
      '\\cdot',
      '\\colon'
    ];

    Constant[1].items = getIconContents(
      list,
      url,
      START_INDEX_POSITION[Constant[1].type]
    );
  })();
  // 几何
  (function () {
    const list = [
      '\\sin\\placeholder',
      '\\cos\\placeholder',
      '\\tan\\placeholder',
      '\\sec\\placeholder',
      '\\csc\\placeholder',
      '\\cot\\placeholder',
      '\\arcsin\\placeholder',
      '\\arccos\\placeholder',
      '\\arctan\\placeholder',
      '\\triangle',
      '\\sim',
      '\\cong',
      '\\angle',
      '\\bot',
      '\\alpha',
      '\\beta',
      '\\gamma',
      '\\theta',
      '\\degree',
      '\\bigcirc'
    ];

    Constant[2].items = getIconContents(
      list,
      url,
      START_INDEX_POSITION[Constant[2].type]
    );
  })();
  // 单位
  (function () {
    const list = [
      'a',
      'b',
      'c',
      'd',
      'e',
      'f',
      'g',
      'h',
      'i',
      'j',
      'k',
      'l',
      'm',
      'n',
      'o',
      'p',
      'q',
      'r',
      's',
      't',
      'u',
      'v',
      'w',
      'x',
      'y',
      'z',
    ];

    Constant[3].items = getIconContents(
      list,
      url,
      START_INDEX_POSITION[Constant[3].type]
    );
  })();
  // 其他
  (function () {
    const list = [
      '\\Omega',
      '\\because',
      '\\therefore',
      '\\Longrightarrow',
      '\\Leftrightarrow',
      '\\uparrow',
      '\\downarrow',
      '\\lambda',
      '\\kappa',
      '\\mu',
      '\\rho',
      '\\sigma',
      '\\tau',
      '\\upsilon',
      '\\varphi',
      '\\Psi',
      '\\omega',
      '\\varepsilon',
      '\\zeta',
      '\\eta',
      '\\nu',
      '\\xi',
      '\\chi',
    ];

    Constant[4].items = getIconContents(
      list,
      url,
      START_INDEX_POSITION[Constant[4].type]
    );
  })();

  function getIconContents(keySet, imgSrc, startLineIndex) {
    const result = [];

    kity.Utils.each(keySet, function (key, index) {
      const point = { x: index % 8, y: Math.floor(index / 8) + startLineIndex };
      const pos = { x: point.x * 83, y: point.y * 65 };
      result.push({
        key: key,
        img: imgSrc,
        pos,
      });
    });

    return result;
  }

  return Constant;
});
