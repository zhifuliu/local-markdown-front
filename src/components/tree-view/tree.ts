/// <amd-dependency path="text!./tree.html" />

import ko = require("knockout");
import _ = require('underscore');
export var template: string = require('text!./tree.html');

export class TreeView {
    constructor(params: any) {
        console.log(params);
    }
}

ko.components.register('treeview', {
  viewModel: TreeView,
  template: template
});
