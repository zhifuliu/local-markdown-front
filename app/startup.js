define(["require", "exports", "knockout", "./router", "../services/services", "bootstrap", "knockout-postbox", "knockout-validation"], function (require, exports, ko, router, services) {
    "use strict";
    ko.components.register('home-page', { require: 'components/home-page/home' });
    ko.components.register('about-page', {
        template: { require: 'text!components/about-page/about.html' }
    });
    ko.components.register('login-page', { require: 'components/login-page/login' });
    ko.validation.init({
        errorElementClass: 'has-error',
        errorMessageClass: 'help-block',
        decorateElement: true,
        insertMessages: false
    });
    ko.validation.rules['EncodeMaxLength'] = {
        validator: function (value, otherVal) {
            if (_.isUndefined(value) || _.isNull(value)) {
                return true;
            }
            else {
                return value.length + (encodeURIComponent(value).match(/%[89ABab]/g) ? encodeURIComponent(value).match(/%[89ABab]/g).length / 2 : 0) <= otherVal;
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
    var App = (function () {
        function App() {
            this.route = router.currentRoute;
            this.currentUser = ko.observable(null).syncWith('app:currentUser', true, true);
            services.getUserMsg()
                .then(function (data) {
                console.log(data);
            })
                .catch(function (error) {
                console.log(error);
            });
        }
        return App;
    }());
    var app = new App();
    ko.applyBindings(app);
    return app;
});
//# sourceMappingURL=startup.js.map