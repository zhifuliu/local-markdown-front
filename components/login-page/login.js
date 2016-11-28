define(["require", "exports", "knockout", "text!./login.html"], function (require, exports, ko) {
    "use strict";
    exports.template = require("text!./login.html");
    var viewModel = (function () {
        function viewModel() {
            this.message = ko.observable("Welcome to example-ko-ts!");
        }
        viewModel.prototype.doSomething = function () {
            this.message('You invoked doSomething() on the viewmodel.');
        };
        return viewModel;
    }());
    exports.viewModel = viewModel;
});
//# sourceMappingURL=login.js.map