var expect = chai.expect;

describe('测试add函数', function () {
  it('1加1等于2', function () {
    var sum = add(1, 1);
    expect(sum).to.equal(2);
  });

  it('1加2等于3', function () {
    var sum = add(1, 2);
    expect(sum).to.equal(3);
  });
});
