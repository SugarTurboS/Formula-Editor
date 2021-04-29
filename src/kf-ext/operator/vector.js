/**
 * 占位符操作符
 */

define(function (require, exports, modules) {
  var kity = require("kity"),
    baseHeight = 12,
    originHeight = 1024,
    ratio = originHeight / baseHeight,
    arrowHeight = 1024 / ratio,
    halfArrowHeight = arrowHeight / 2,
    arrowBorderWidth = 213.333334 / ratio,
    arrowMoveX = 421.632 / ratio,
    arrowWidth = arrowMoveX + arrowBorderWidth,
    arrowOffsetX = 127.996667 / ratio,
    lineHeight = 170.666666 / ratio;

  return kity.createClass("VectorOperator", {
    base: require("kf").Operator,

    constructor: function () {
      this.callBase("Vector");
    },

    /* 操作 */
    applyOperand: function (radicand) {
      generateOperator.call(this, radicand);
    },
  });

  // 根据给定的操作数生成操作符的pathData
  // radicand 表示被开方数
  // exponent 表示指数
  function generateOperator(radicand) {
    var arrow = generateArrow(),
      padding = 5,
      hLine = generateHLine(radicand);
    this.addOperatorShape(arrow);
    this.addOperatorShape(hLine);
    mergeShape(arrow, hLine)
    adjustmentPosition(radicand);
    this.parentExpression.expand(0, padding * 2);
    this.parentExpression.translateElement(0, padding);
  }


  function generateArrow() {
    var shape = new kity.Path(); // 命名为a以便于精简表达式
    var drawer = shape.getDrawer();
    drawer.moveTo(0, 0);
    drawer.horizontalLineBy(arrowBorderWidth);
    drawer.lineTo(arrowWidth, halfArrowHeight);
    drawer.lineBy(-arrowMoveX, halfArrowHeight);
    drawer.horizontalLineBy(-arrowBorderWidth);
    drawer.lineTo(arrowMoveX, halfArrowHeight);
    drawer.close();
    return shape.fill("black");
  }

  // 根据操作数生成根号的水平线部分
  function generateHLine(operand) {
    // 表达式宽度
    var w = operand.getWidth();
    return new kity.Rect(w + arrowWidth, lineHeight).fill("black");
  }
  // 合并根号的各个部分， 并返回根号的关键点位置数据
  function mergeShape(arrow, hLine) {
    var hLineBox = hLine.getFixRenderBox();
    hLine.translate(0, (baseHeight - hLineBox.height) / 2);
    var arrowBox = arrow.getFixRenderBox();
    arrow.translate(hLineBox.width - arrowBox.width + arrowOffsetX, 0);
    // 返回关键点数据
    return {
      x: 0,
      y: 0,
    };
  }
  // 调整开方数位置
  function adjustmentPosition(radicand) {
    radicand.translate(0, arrowHeight);
  }
});
