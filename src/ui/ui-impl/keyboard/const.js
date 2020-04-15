/*
 * @Author: Demian
 * @Date: 2020-04-15 10:11:11
 * @LastEditor: Demian
 * @LastEditTime: 2020-04-15 11:05:42
 */

define(function (require) {
  const kity = require('kity'),
    CHAR_POSITION = require('ui/char-position.data'),
    Constant = {
      Type: {
        Common: 'common',
        Algebra: 'algebra',
        Geometry: 'geometry',
        Unit: 'unit',
        Other: 'other',
      },
      Menu: [
        { type: 'common', title: '常用', index: 0 },
        { type: 'algebra', title: '代数', index: 1 },
        { type: 'geometry', title: '几何', index: 2 },
        { type: 'unit', title: '单位', index: 3 },
        { type: 'other', title: '其他', index: 4 },
      ],
      Panel: [
        { type: 'common', title: '常用', index: 0, items: [] },
        { type: 'algebra', title: '代数', index: 1, items: [] },
        { type: 'geometry', title: '几何', index: 2, items: [] },
        { type: 'unit', title: '单位', index: 3, items: [] },
        { type: 'other', title: '其他', index: 4, items: [] },
      ],
    };

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

    Constant.Panel[0].items = getIconContents(list, 'assets/images/toolbar/char.png');
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
