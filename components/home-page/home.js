define(["require", "exports", "knockout", "text!./home.html"], function (require, exports, ko) {
    "use strict";
    exports.template = require("text!./home.html");
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
//# sourceMappingURL=home.js.map