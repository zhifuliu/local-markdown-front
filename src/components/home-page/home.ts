/// <amd-dependency path="text!./home.html" />

import ko = require("knockout");
import models = require('../../app/models');
import services = require('../../services/services');

export var template: string = require("text!./home.html");

export class viewModel {
    constructor() {
        this.currentProject.subscribe(val => {
            this.getProjectData();
        });
    }
    public projectList: KnockoutObservableArray<models.projectItem> = ko.observableArray([]).syncWith('app:projectList', true, true);
    public currentProject: KnockoutObservable<models.projectItem> = ko.observable(null).syncWith('app:currentProject', true, true);
    public isEditing: KnockoutObservable<Boolean> = ko.observable(false);

    public refreshProject() {
        if (this.currentProject()) {
            services.refreshProject(this.currentProject())
                .then(data => {
                    if (data.errCode == 1) {
                        this.getProjectData();
                    } else {
                        console.log(data);
                    }
                })
                .catch(error => {
                    console.log(error);
                })
        } else {
            console.log('未选任何工程');
        }
    }
    public getProjectData() {
        if (this.currentProject()) {
            services.getProjectData(this.currentProject())
                .then(data => {
                    console.log(data);
                })
                .catch(error => {
                    console.log(error);
                });
        }
    }
    public editProjectList() {
        this.isEditing(true);
    }
    public deleteProject(obj) {
        console.log(obj);
    }
}
