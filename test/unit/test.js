var expect = chai.expect;

describe('测试工厂', function () {

  it('1加2等于3', function () {
    console.log(factory);
    expect(factory).to.have.property('ready');
  });
});
