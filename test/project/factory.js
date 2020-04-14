/*
 * @Author: Demian
 * @Date: 2020-04-14 10:31:00
 * @LastEditor: Demian
 * @LastEditTime: 2020-04-14 10:39:36
 */

var factory = kf.EditorFactory.create($('#kfEditorContainer')[0], {
  render: {
    fontsize: 40,
  },
  resource: {
    path: '../resource/',
  },
});
