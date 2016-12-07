/// <amd-dependency path="text!./home.html" />

import ko = require("knockout");
import _ = require('underscore');
import $ = require('jquery');
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
    public tempName: KnockoutObservable<string> = ko.observable('记事本所有文档工程').extend({
        required: {message: '项目名不能为空'}
    });
    public tempUrl: KnockoutObservable<string> = ko.observable('/Users/zhifu/Documents/note/odds').extend({
        required: {message: '项目本地地址不能为空'}
    });
    public validationErrors = (() => ko.validation.group(this))();
    public addErrorMessage: KnockoutObservable<string> = ko.observable('');
    public projectData: KnockoutObservableArray<models.treeItem> = ko.observableArray([]);
    public treeHtml: KnockoutObservable<string> = ko.observable('');

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
                    // console.log(data);
                    if (data.errCode == 1) {
                        console.log(data.data);
                        this.projectData(data.data);
                        this.treeHtml(this.generateTreeHtml(data.data));
                        // $('.dirName').on('click', function() {
                        //     console.log(this);
                        //     console.log(event);
                        // });
                        $('.fileName').on('click', function() {
                            // console.log(this);
                            // console.log($(this));
                            // console.log($(this)[0]);
                            // console.log($(this)[0].text());
                            // console.log($(this)[0]['file']);
                            // console.log($(this)[0]['path']);

                            var context = ko.contextFor(this);
                            console.log(context);
                            // console.log(context.$data);
                            console.log(context.$element);
                            // console.log(context.$data.isEditing());
                        });
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
    public generateTreeHtml(items: Array<models.treeItem>) {
        // console.log(this.projectData());
        var temp = '';
        _.each(items, item => {
            if (item.children) {
                temp += '<div class="dir"><div class="dirName">' + (item.path && item.path.length != 0 ? item.path : '跟目录') + '</div>' + this.generateTreeHtml(item.children) + '</div>';
            } else {
                temp += '<span class="fileName" path="'+item.path+'" file="'+item.file+'">' + item.file + '</span>'
            }
        })
        return temp;
    }
    // public clickMdFile() {
    //     // console.log(item);
    //     console.log(event);
    //     console.log(event.srcElement);
    //     console.log(event.target);
    //     console.log(typeof event.target);
    // }
}
