"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.AppModule = void 0;
var platform_browser_1 = require("@angular/platform-browser");
var core_1 = require("@angular/core");
var app_routing_module_1 = require("./app-routing.module");
var app_component_1 = require("./app.component");
var ng_bootstrap_1 = require("@ng-bootstrap/ng-bootstrap");
var head_component_1 = require("./head/head.component");
var footer_component_1 = require("./footer/footer.component");
var main_component_1 = require("./main/main.component");
var argument_component_1 = require("./argument/argument.component");
var animations_1 = require("@angular/platform-browser/animations");
var MdModule_module_1 = require("./MdModule.module");
var forms_1 = require("@angular/forms");
var ngx_quill_1 = require("ngx-quill");
var fire_1 = require("@angular/fire");
var firestore_1 = require("@angular/fire/firestore");
var environment_1 = require("../environments/environment");
var phone_input_component_1 = require("./phone-input/phone-input.component");
var voting_component_1 = require("./voting/voting.component");
var cast_vote_component_1 = require("./voting/cast-vote/cast-vote.component");
var AppModule = /** @class */ (function () {
    function AppModule() {
    }
    AppModule = __decorate([
        core_1.NgModule({
            declarations: [
                app_component_1.AppComponent,
                head_component_1.HeadComponent,
                footer_component_1.FooterComponent,
                main_component_1.MainComponent,
                voting_component_1.VotingComponent,
                argument_component_1.ArgumentComponent,
                cast_vote_component_1.CastVoteComponent,
                phone_input_component_1.PhoneInputComponent,
            ],
            imports: [
                platform_browser_1.BrowserModule,
                forms_1.ReactiveFormsModule,
                app_routing_module_1.AppRoutingModule,
                ng_bootstrap_1.NgbModule,
                animations_1.BrowserAnimationsModule,
                fire_1.AngularFireModule.initializeApp(environment_1.environment.firebase),
                firestore_1.AngularFirestoreModule,
                MdModule_module_1.MyMaterialModule,
                ngx_quill_1.QuillModule.forRoot(),
            ],
            providers: [],
            bootstrap: [app_component_1.AppComponent],
            entryComponents: []
        })
    ], AppModule);
    return AppModule;
}());
exports.AppModule = AppModule;
