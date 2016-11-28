/// <amd-dependency path="text!./login.html" />
/// <amd-dependency path="knockout-validation" />

import ko = require("knockout");
import hasher = require('hasher');

import services = require('../../services/services');
import models = require('../../app/models');

export var template: string = require("text!./login.html");

export class viewModel {
    public currentUser: KnockoutObservable<models.UserMsg> = ko.observable(null).syncWith('app:currentUser', true, true);
    public user: KnockoutObservable<string> = ko.observable('1203228').extend({
        required: {message: '账号不能为空'}
    });
    public pass: KnockoutObservable<string> = ko.observable('000000').extend({
        required: {message: '密码不为空'}
    });
    public errMsg: KnockoutObservable<string> = ko.observable('');
    public validationErrors = (() => ko.validation.group(this))();

    public login() {
        if (this.validationErrors().length > 0) {
            this.validationErrors.showAllMessages();
        } else {
            services.login({
                user: this.user(),
                pass: this.pass()
            })
            .then(data => {
                if (data.errCode == 1) {
                    this.currentUser(data.data);
                    this.errMsg('');
                    document.title = 'local_markdown editor';
                    hasher.setHash('');
                } else {
                    this.errMsg(data.errMsg);
                }
            })
            .catch(error => {
                this.errMsg('网络错误!');
            })
        }
    }
    public goToRegister() {
        hasher.setHash('register');
    }
}
