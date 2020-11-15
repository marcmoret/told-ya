"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.ArgumentComponent = exports.MyTel = void 0;
var core_1 = require("@angular/core");
var forms_1 = require("@angular/forms");
var MyTel = /** @class */ (function () {
    function MyTel(area, exchange, subscriber) {
        this.area = area;
        this.exchange = exchange;
        this.subscriber = subscriber;
    }
    return MyTel;
}());
exports.MyTel = MyTel;
var ArgumentComponent = /** @class */ (function () {
    function ArgumentComponent(formBuilder, arguementService) {
        this.formBuilder = formBuilder;
        this.arguementService = arguementService;
        this.Object = Object;
        this.personForm = this.formBuilder.group({
            personA: ['', [forms_1.Validators.required]],
            personB: ['', [forms_1.Validators.required]]
        });
        this.topicForm = this.formBuilder.group({
            topic: ['', [forms_1.Validators.required]]
        });
        this.argumentForm = this.formBuilder.group({
            argumentA: [''],
            argumentB: ['']
        });
        this.contactsForm = this.formBuilder.group({
            contact0: [
                '',
                [
                    forms_1.Validators.required,
                    forms_1.Validators.maxLength(10),
                    forms_1.Validators.minLength(10),
                    forms_1.Validators.pattern(/^-?(0|[1-9]\d*)?$/),
                ],
            ]
        });
    }
    ArgumentComponent.prototype.ngOnInit = function () { };
    ArgumentComponent.prototype.addPhone = function (index) {
        this.contactsForm.addControl("contact" + index, new forms_1.FormControl(''));
        this.contactsForm.controls["contact" + index].setValidators([
            forms_1.Validators.maxLength(10),
            forms_1.Validators.minLength(10),
            forms_1.Validators.required,
            forms_1.Validators.pattern(/^-?(0|[1-9]\d*)?$/),
        ]);
        this.contactsForm.controls["contact" + index].updateValueAndValidity();
    };
    ArgumentComponent.prototype.deletePhone = function (index) {
        this.contactsForm.removeControl("contact" + index);
    };
    ArgumentComponent.prototype.onTopicChange = function (quill) {
        this.topic = quill.text;
    };
    ArgumentComponent.prototype.onArgueA = function (quill) {
        this.arguementA = quill.text;
    };
    ArgumentComponent.prototype.onArgueB = function (quill) {
        this.arguementB = quill.text;
    };
    ArgumentComponent.prototype.submit = function () {
        if (this.contactsForm.valid &&
            this.personForm.valid &&
            this.argumentForm.valid &&
            this.topicForm.valid) {
            var numbers = Object.values(this.contactsForm.value);
            var personA = this.personForm.get('personA').value;
            var personB = this.personForm.get('personB').value;
            // Quilljs sends the HTML tags so I had to remove the <p> tags.
            var topic = this.topicForm
                .get('topic')
                .value.replace('<p>', '')
                .replace('</p>', '');
            var argumentA = this.argumentForm
                .get('argumentA')
                .value.replace('<p>', '')
                .replace('</p>', '');
            var argumentB = this.argumentForm
                .get('argumentB')
                .value.replace('<p>', '')
                .replace('</p>', '');
            var message = "\n      Hey!\n" + personA + " and " + personB + " need you to settle an argument. Click the link below and vote who you think is right!\n{{link}}";
            var argument_1 = {
                topic: topic,
                personA: personA,
                argumentA: argumentA,
                votesA: 0,
                personB: personB,
                argumentB: argumentB,
                votesB: 0,
                numbers: numbers,
                message: message,
                createdDate: new Date()
            };
            numbers.forEach(function (number, i) {
                argument_1["voter" + (i + 1)] = false;
            });
            this.arguementService.submitArgument(argument_1);
        }
    };
    ArgumentComponent = __decorate([
        core_1.Component({
            selector: 'app-arguement',
            templateUrl: './argument.component.html',
            styleUrls: ['./argument.component.scss']
        })
    ], ArgumentComponent);
    return ArgumentComponent;
}());
exports.ArgumentComponent = ArgumentComponent;
