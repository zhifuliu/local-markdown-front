/// <amd-dependency path="text!./tree.html" />

import ko = require("knockout");
import _ = require('underscore');
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
        treeData: Array<treeItem>
    }) {
        this.treeDataObservable(this.changeData(params.treeData)());
    }
    public treeDataObservable: KnockoutObservableArray<treeItemObservable> = ko.observableArray([]);

    public clickItem = () => {
        console.log('zhifu');
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
