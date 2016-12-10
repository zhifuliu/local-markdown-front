/// <amd-dependency path="text!./tree.html" />

import ko = require("knockout");
import _ = require('underscore');
import services = require('../../services/services');
import models = require('../../app/models');
export var template: string = require('text!./tree.html');

export class TreeView {
    constructor(params: {
        treeData: Array<models.treeItem>
    }) {
        this.treeDataObservable(this.changeData(params.treeData)());

        this.currentMdFile.subscribe(val => {
            ko.postbox.publish('currentMdFile', val);
        });
    }
    public treeDataObservable: KnockoutObservableArray<models.treeItemObservable> = ko.observableArray([]);
    public currentMdFile: KnockoutObservable<models.treeItemObservable> = ko.observable(null);

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

    private changeData(dataObject: Array<models.treeItem>): KnockoutObservableArray<models.treeItemObservable> {
        var temp: KnockoutObservable<models.treeItemObservable> = ko.observable({});
        var list: KnockoutObservableArray<models.treeItemObservable> = ko.observableArray([]);
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
