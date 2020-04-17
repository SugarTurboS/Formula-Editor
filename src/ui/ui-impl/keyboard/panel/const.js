/*
 * @Author: Demian
 * @Date: 2020-04-15 10:11:11
 * @LastEditor: Demian
 * @LastEditTime: 2020-04-17 09:30:03
 */

define(function (require) {
  const kity = require('kity'),
    CHAR_POSITION = require('ui/char-position.data'),
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
      'pm',
      'infty',
      '=',
      'sim',
      'times',
      'div',
      '!',
      '<',
      'll',
      '>',
      'gg',
      'leq',
      'geq',
      'mp',
      'cong',
      'equiv',
      'propto',
      'approx',
      'forall',
      'partial',
      'surd',
      'cup',
      'cap',
      'varnothing',
      '%',
      'circ',
      'exists',
      'nexists',
      'in',
      'ni',
      'gets',
      'uparrow',
      'to',
      'downarrow',
      'leftrightarrow',
      'therefore',
      'because',
      '+',
      '-',
      'neg',
      'ast',
      'cdot',
      'vdots',
      /* "ddots",*/ 'aleph',
      'beth',
      'blacksquare',
    ];

    Constant[0].items = getIconContents(list, 'assets/images/toolbar/char.png');
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
        values: ['digamma', 'varepsilon', 'varkappa', 'varphi', 'varpi', 'varrho', 'varsigma', 'vartheta'],
      },
    ];

    Constant[1].items = getIconContents(greekList[0].values, 'assets/images/toolbar/char.png');
  })();

  function getIconContents(keySet, imgSrc) {
    const result = [];

    kity.Utils.each(keySet, function (key) {
      if (key.length > 1) {
        key = '\\' + key;
      }

      result.push({
        key: key,
        img: imgSrc,
        pos: CHAR_POSITION[key],
      });
    });

    return result;
  }

  return Constant;
});
