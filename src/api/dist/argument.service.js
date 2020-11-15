"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.ArgumentService = void 0;
var core_1 = require("@angular/core");
var collection = 'arguments';
var ArgumentService = /** @class */ (function () {
    function ArgumentService(functions, db) {
        this.functions = functions;
        this.db = db;
    }
    ArgumentService.prototype.sendSms = function (message) {
        var sendSmsRequest = this.functions.httpsCallable('sendSms');
        return sendSmsRequest({
            message: message.message,
            numbers: message.numbers
        }).toPromise();
    };
    ArgumentService.prototype.submitArgument = function (argument) {
        var _this = this;
        this.db
            .collection(collection)
            .add(argument)
            .then(function (response) {
            var message = {
                message: argument.message.replace('{{link}}', "told-ya.com/" + response.id),
                numbers: argument.numbers
            };
            _this.sendSms(message);
            console.log(response.id);
        });
    };
    ArgumentService.prototype.getArgument = function (id) {
        return this.db.doc("arguments/" + id).get().toPromise();
    };
    ArgumentService.prototype.castVote = function (voterId, voteTotal, docId, person) {
        var _a;
        var voter = "voter" + voterId;
        var votes = "votes" + person;
        console.log(voter);
        this.db.doc(collection + "/" + docId).update((_a = {},
            _a[voter] = true,
            _a[votes] = voteTotal,
            _a));
    };
    ArgumentService = __decorate([
        core_1.Injectable({
            providedIn: 'root'
        })
    ], ArgumentService);
    return ArgumentService;
}());
exports.ArgumentService = ArgumentService;
