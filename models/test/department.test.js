const Department = require('../department.model.js');
const expect = require('chai').expect;

describe('Department', () => {

  it('should throw an error if no "name" arg', () => {

    const dep = new Department({}); 

    dep.validateSync(err => {
        expect(err.errors.name).to.exist;
    });

  });

});