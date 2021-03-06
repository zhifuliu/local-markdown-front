/// <amd-dependency path="text!./home.html" />

import ko = require("knockout");
import _ = require('underscore');
import $ = require('jquery');
import models = require('../../app/models');
import services = require('../../services/services');
import tree = require('../tree-view/tree');

export var template: string = require("text!./home.html");

export class viewModel {
    constructor() {
        this.currentProject.subscribe(val => {
            this.getProjectData();
        });
        ko.postbox.subscribe('currentMdFile', (val: models.treeItemObservable) => {
            this.currentMdFile(val);
            services.getMdFile({
                mdPath: val.path(),
                mdFileName: val.file(),
                projectName: this.currentProject().name,
                projectUrl: this.currentProject().url,
            })
                .then(data => {
                    if (data.errCode == 1) {
                        this.currentMdFileData(data.data);
                    }
                })
                .catch(error => {
                    console.log(error);
                })
        });
    }
    public projectList: KnockoutObservableArray<models.projectItem> = ko.observableArray([]).syncWith('app:projectList', true, true);
    public currentProject: KnockoutObservable<models.projectItem> = ko.observable(null).syncWith('app:currentProject', true, true);
    public isEditing: KnockoutObservable<Boolean> = ko.observable(false);
    public tempName: KnockoutObservable<string> = ko.observable('记事本所有文档工程').extend({
        required: {message: '项目名不能为空'}
    });
    public tempUrl: KnockoutObservable<string> = ko.observable('/Users/zhifu/Documents/note/odds').extend({
        required: {message: '项目本地地址不能为空'}
    });
    public validationErrors = (() => ko.validation.group(this))();
    public addErrorMessage: KnockoutObservable<string> = ko.observable('');
    public projectData: KnockoutObservableArray<models.treeItem> = ko.observableArray([]);
    public currentMdFileData: KnockoutObservable<string> = ko.observable('');
    public currentMdFile: KnockoutObservable<models.treeItemObservable> = ko.observable(null);

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
        var that = this;
        if (this.currentProject()) {
            services.getProjectData(this.currentProject())
                .then(data => {
                    if (data.errCode == 1) {
                        that.projectData(data.data);
                    } else {
                        console.log(data.errMsg);
                    }
                })
                .catch(error => {
                    console.log(error);
                });
        }
    }

    public getProjectList() {
        services.getProjectList()
            .then(data => {
                this.projectList(data);
            })
            .catch(error => {
                console.log(error);
            });
    }
    public editProjectList() {
        this.isEditing(true);
    }
    public deleteProject(obj) {
        console.log(obj);
        if (obj.name == '默认缓存') {
            console.log('系统工程，不能删除，可以将临时markdown文件放在此处编辑');
        } else {
            if (confirm('是否删除工程：' + obj.name)) {
                services.deleteProject(obj)
                    .then(data => {
                        console.log(data);
                    })
                    .catch(error => {
                        console.log(error);
                        this.getProjectList();
                    })
            }
        }
    }
    public addProject() {
        if (this.validationErrors().length > 0) {
            this.validationErrors.showAllMessages();
        } else {
            services.addProject({
                name: this.tempName(),
                url: this.tempUrl()
            })
                .then(data => {
                    if (data.errCode == 1) {
                        this.getProjectList();
                    } else {
                        this.addErrorMessage(data.errMsg);
                    }
                })
                .catch(error => {
                    console.log(error);
                })
        }
    }
    public clickItem = item => {
        console.log(item);
    }
}
