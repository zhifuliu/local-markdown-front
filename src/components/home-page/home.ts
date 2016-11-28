/// <amd-dependency path="text!./home.html" />

import ko = require("knockout");
import models = require('../../app/models');

export var template: string = require("text!./home.html");

export class viewModel {
    constructor() {
        this.currentProject.subscribe(val => {
            console.log(val);
        });
    }
    public projectList: KnockoutObservableArray<models.projectItem> = ko.observableArray([]).syncWith('app:projectList', true, true);
    public currentProject: KnockoutObservable<models.projectItem> = ko.observable(null).syncWith('app:currentProject', true, true);
}
