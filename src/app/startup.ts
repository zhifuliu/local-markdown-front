/// <amd-dependency path="bootstrap" />
/// <amd-dependency path="knockout-postbox" />
/// <amd-dependency path="knockout-validation" />
/// <amd-dependency path="components/tree-view/tree" />

import $ = require("jquery");
import ko = require("knockout");
import bootstrap = require("bootstrap");
import hasher = require('hasher');

import router = require("./router");
import models = require('./models');
import services = require('../services/services');

ko.components.register('home-page', { require: 'components/home-page/home' });
ko.components.register('about-page', {
    template: { require: 'text!components/about-page/about.html' }
});
ko.components.register('login-page', { require: 'components/login-page/login' });
ko.validation.init({
    insertMessages: true,
    errorElementClass: 'has-error',
    errorMessageClass: 'help-block',
    decorateElement: true,
    messagesOnModified: true,
    grouping: {
        deep: false,
        observable: true
    }
});
ko.validation.rules['EncodeMaxLength'] = {
    validator: (value, otherVal) => {
        if (_.isUndefined(value) || _.isNull(value)) {
            return true;
        } else {
            return value.length + (encodeURIComponent(value).match(/%[89ABab]/g) ? encodeURIComponent(value).match(/%[89ABab]/g).length/2 : 0) <= otherVal;
        }
    },
    message: '长度不能超过{0}'
};
ko.validation.registerExtenders();
ko.validation.localize({
    required: '必填字段',
    min: '必须大于等于 {0}',
    max: '必须小于等于 {0}',
    minLength: '至少输入 {0} 个字符',
    maxLength: '字符数不能超过 {0} 个',
    pattern: '请检查此值',
    step: '每次步进值是 {0}',
    email: 'email格式不正确',
    date: '日期格式不正确',
    dateISO: '日期格式不正确',
    number: '请输入数字',
    digit: '请输入数字',
    phoneUS: '手机号(US)不合法',
    equal: '输入值不一样',
    notEqual: '请选择另一个值',
    unique: '此值应该是唯一的'
});

class App {
    constructor() {
        // $('html').css('fontSize', (document.body.offsetWidth * 5 / 750) + 'px');
        services.getUserMsg()
            .then(data => {
                this.currentUser(data.data);
            })
            .catch(error => {
                if (error.status == 401) {
                    document.title = '登录';
                    hasher.setHash('login');
                } else {
                    console.log(error.responseText);
                }
            });
        this.currentUser.subscribe(val => {
            console.log("currentUser: " + JSON.stringify(val));
            if (val) {
                services.getProjectList()
                    .then(data => {
                        this.projectList(data);
                    })
                    .catch(error => {
                        console.log(error);
                    });
            }
        });
        setInterval(() => {
            var notScanPages = ['login-page', 'register'];
            if (notScanPages.indexOf(this.route()['page']) == -1) {
                services.getUserMsg()
                    .catch(error => {
                        console.log(error);
                        document.title = '登录';
                        hasher.setHash('login');
                    });
            }
        }, 3000);
    }
    public route = router.currentRoute;
    public currentUser: KnockoutObservable<models.UserMsg> = ko.observable(null).syncWith('app:currentUser', true, true);
    public projectList: KnockoutObservableArray<models.projectItem> = ko.observableArray([]).syncWith('app:projectList', true, true);

    public logout() {
        if (this.currentUser()) {
            services.logout()
                .then(data => {
                    if (data.errCode == 1) {
                        this.currentUser(null);
                        document.title = '登录';
                        hasher.setHash('login');
                    }
                })
                .catch(error => {
                    console.log(error);
                    this.currentUser(null);
                    document.title = '登录';
                    hasher.setHash('login');
                });
        } else {
            console.log('并没有登录，退出个毛啊');
        }
    }
}

var app = new App();
ko.applyBindings(app);
export = app;
