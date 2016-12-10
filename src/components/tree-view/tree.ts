/// <amd-dependency path="text!./tree.html" />

import ko = require("knockout");
import _ = require('underscore');
import models = require('../../app/models');
export var template: string = require('text!./tree.html');

export class TreeView {
    constructor(params: any) {
        this.treeData(params);
        this.treeData.subscribe(val => console.log(val));
    }
    public treeData: KnockoutObservableArray<models.treeItem> = ko.observableArray([]);
}

ko.components.register('treeview', {
  viewModel: TreeView,
  template: template
});
