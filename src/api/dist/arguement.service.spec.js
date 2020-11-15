"use strict";
exports.__esModule = true;
var testing_1 = require("@angular/core/testing");
var argument_service_1 = require("./argument.service");
describe('ArguementService', function () {
    var service;
    beforeEach(function () {
        testing_1.TestBed.configureTestingModule({});
        service = testing_1.TestBed.inject(argument_service_1.ArguementService);
    });
    it('should be created', function () {
        expect(service).toBeTruthy();
    });
});
