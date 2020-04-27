/*
 * @Author: Demian
 * @Date: 2020-04-22 18:00:32
 * @LastEditor: Demian
 * @LastEditTime: 2020-04-27 15:23:10
 */

define(function (require) {
  const kity = require('kity'),
    CHAR_POSITION = require('ui/ui-impl/keyboard/panel/position.data'),
    Constant = [
      { type: 'common', title: '常用', index: 0, items: [] },
      { type: 'algebra', title: '代数', index: 1, items: [] },
      { type: 'geometry', title: '几何', index: 2, items: [] },
      { type: 'unit', title: '单位', index: 3, items: [] },
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
      '||',
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
      '\\times',
      '\\div',
      '%0',
      '\\approx',
      '\\neq',
      '\\sqrt [\\placeholder] \\placeholder',
      '\\pi',
      '\\sigma',
      '\\left[\\placeholder\\right]',
      '\\placeholder^\\placeholder',
      '\\placeholder_\\placeholder',
      '{^\\placeholder_\\placeholder\\placeholder}',
      '\\placeholder^\\placeholder_\\placeholder',
      '排',
      '组',
      '\\sum\\placeholder',
      '\\sum_\\placeholder\\placeholder',
      '\\sum^\\placeholder_\\placeholder\\placeholder',
      '\\int \\placeholder',
      '\\int^\\placeholder_\\placeholder\\placeholder',
      '\\iint\\placeholder',
      '\\iint^\\placeholder_\\placeholder\\placeholder',
      '\\iiint\\placeholder',
      '\\iiint^\\placeholder_\\placeholder\\placeholder',
      'log',
      'ln',
      '\\to',
      '\\cup',
      '\\neg',
      '\\forall',
      '\\exists',
    ];

    Constant[0].items = getIconContents(list, 'assets/images/android/keyboard.png');
  })();

  // 希腊字符配置
  (function () {
    var greekList = [
      {
        title: '小写',
        values: [
          'alpha',
          'beta',
          'gamma',
          'delta',
          'epsilon',
          'zeta',
          'eta',
          'theta',
          'iota',
          'kappa',
          'lambda',
          'mu',
          'nu',
          'xi',
          'omicron',
          'pi',
          'rho',
          'sigma',
          'tau',
          'upsilon',
          'phi',
          'chi',
          'psi',
          'omega',
        ],
      },
      {
        title: '大写',
        values: [
          'Alpha',
          'Beta',
          'Gamma',
          'Delta',
          'Epsilon',
          'Zeta',
          'Eta',
          'Theta',
          'Iota',
          'Kappa',
          'Lambda',
          'Mu',
          'Nu',
          'Xi',
          'Omicron',
          'Pi',
          'Rho',
          'Sigma',
          'Tau',
          'Upsilon',
          'Phi',
          'Chi',
          'Psi',
          'Omega',
        ],
      },
      {
        title: '变体',
        values: [
          'digamma',
          'varepsilon',
          'varkappa',
          'varphi',
          'varpi',
          'varrho',
          'varsigma',
          'vartheta',
        ],
      },
    ];

    Constant[1].items = getIconContents(
      greekList[0].values,
      'assets/images/android/keyboard.png'
    );
  })();

  function getIconContents(keySet, imgSrc) {
    const result = [];

    kity.Utils.each(keySet, function (key) {
      const point = CHAR_POSITION[key] || { x: 0, y: 0 };
      const pos = { x: point.x * 148, y: -point.y * 122 };
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
