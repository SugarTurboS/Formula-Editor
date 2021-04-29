/**
 * 向量表达式， 扩展KF自有的Empty表达式
 */

define(function (require, exports, module) {
  var kity = require("kity"),
    kf = require("kf"),
    VectorOperator = require("kf-ext/operator/vector");

  return kity.createClass("VectorExpression", {
    base: kf.RadicalExpression,
    constructor: function (exponent) {
      this.callBase(exponent);
      this.setFlag("Vector");
      this.setOperator(new VectorOperator());
    },
  });
});
