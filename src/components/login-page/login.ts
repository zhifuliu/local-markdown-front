/// <amd-dependency path="text!./login.html" />
import ko = require("knockout");
export var template: string = require("text!./login.html");

export class viewModel {
    public message = ko.observable("Welcome to example-ko-ts!");

    public doSomething() {
        this.message('You invoked doSomething() on the viewmodel.');
    }
}
