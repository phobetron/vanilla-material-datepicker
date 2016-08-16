var expect = chai.expect;

describe('boilerplate', function () {
  it('outputs instructive text', function () {
    var logger = sinon.stub(console, 'log')

    console.log('YAY!');

    logger.should.have.been.called;
  });
});

