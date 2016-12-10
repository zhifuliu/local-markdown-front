/// <amd-dependency path="text!./tree.html" />

import ko = require("knockout");
import _ = require('underscore');
import services = require('../../services/services');
import models = require('../../app/models');
export var template: string = require('text!./tree.html');

export interface treeItem {
    path: string,
    file?: string,
    children?: Array<treeItem>
}
export interface treeItemObservable {
    path?: KnockoutObservable<string>,
    file?: KnockoutObservable<string>,
    children?: KnockoutObservableArray<treeItemObservable>,
    opened?: KnockoutObservable<boolean>,
    checked?: KnockoutObservable<boolean>
}

export class TreeView {
    constructor(params: {
        treeData: Array<treeItem>,
        currentProject: models.projectItem
    }) {
        this.treeDataObservable(this.changeData(params.treeData)());
        this.currentProject(params.currentProject);

        this.currentMdFile.subscribe(val => {
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

        // this.currentMdFileData.subscribe(val => console.log(val));
    }
    public treeDataObservable: KnockoutObservableArray<treeItemObservable> = ko.observableArray([]);
    public currentMdFile: KnockoutObservable<treeItemObservable> = ko.observable(null);
    public currentProject: KnockoutObservable<models.projectItem> = ko.observable({
        name: '',
        url: '',
        lastUpdateTime: '',
        isGit: false
    });
    public currentMdFileData: KnockoutObservable<string> = ko.observable('');

    public clickItem = (item) => {
        if (this.currentMdFile()) {
            if (this.currentMdFile() != item) {
                if (confirm('目前正在修改“'+this.currentMdFile().path() + this.currentMdFile().file() + '”，是否取消，并修改“'+item.path() + item.file() + '”')) {
                    this.currentMdFile().checked(false);
                    this.currentMdFile(item);
                    this.currentMdFile().checked(true);
                }
            }
        } else {
            this.currentMdFile(item);
            this.currentMdFile().checked(true);
        }
    }

    private changeData(dataObject: Array<treeItem>): KnockoutObservableArray<treeItemObservable> {
        var temp: KnockoutObservable<treeItemObservable> = ko.observable({});
        var list: KnockoutObservableArray<treeItemObservable> = ko.observableArray([]);
        _.each(dataObject, item => {
            if (item.path != undefined) {
                temp()['path'] = ko.observable(item.path);
            } else {
                delete temp()['path'];
            }
            if (item.file != undefined) {
                temp()['file'] = ko.observable(item.file);
            } else {
                delete temp()['file'];
            }
            if (item.children != undefined) {
                temp()['children'] = this.changeData(item.children);
            } else {
                delete temp()['children'];
            }
            temp()['opened'] = ko.observable(false);
            temp()['checked'] = ko.observable(false);
            list.push(_.clone(temp()));
        });
        return list;
    }
}

ko.components.register('treeview', {
  viewModel: TreeView,
  template: template
});
