"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.ArguementService = void 0;
var core_1 = require("@angular/core");
var collection = 'arguments';
var ArguementService = /** @class */ (function () {
    function ArguementService(functions, db) {
        this.functions = functions;
        this.db = db;
    }
    ArguementService.prototype.sendSms = function (message) {
        var sendSmsRequest = this.functions.httpsCallable('sendSms');
        return sendSmsRequest({
            message: message.message,
            numbers: message.numbers
        }).toPromise();
    };
    ArguementService.prototype.submitArgument = function (argument) {
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
    ArguementService.prototype.getArgument = function (id) {
        return this.db.doc("arguments/" + id).get().toPromise();
    };
    ArguementService.prototype.castVote = function (voterId, argument, docId) {
        var voter = "voter" + voterId;
        this.db.doc(collection + "/" + docId).update({
            voter: true
        });
    };
    ArguementService = __decorate([
        core_1.Injectable({
            providedIn: 'root'
        })
    ], ArguementService);
    return ArguementService;
}());
exports.ArguementService = ArguementService;
