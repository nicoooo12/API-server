const sinon = require('sinon');
const moks = require('../moks');

const getAllStub = sinon.stub();
getAllStub.withArgs('test').resolves(moks.get('ordenes'));
