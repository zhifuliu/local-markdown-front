import Q = require('q');
import models = require('../app/models');
import $ = require('jquery');
import _ = require('underscore');

var prefix = '/localmd/';

class Services {
    login(qd): Q.Promise<models.returnMsg> {
        return Q($.ajax({
            url: prefix + 'api/login',
            type: 'post',
            contentType: 'application/json',
            dataType: 'json',
            data: JSON.stringify(qd)
        }));
    }
    getUserMsg(): Q.Promise<models.returnMsg> {
        return Q($.ajax({
            url: prefix + 'api/getUserMsg',
            type: 'post',
            contentType: 'application/json',
            dataType: 'json'
        }));
    }
    logout(): Q.Promise<models.returnMsg> {
        return Q($.ajax({
            url: prefix + 'api/logout',
            type: 'post',
            contentType: 'application/json',
            dataType: 'json'
        }));
    }
    getProjectList(): Q.Promise<Array<models.projectItem>> {
        return Q($.ajax({
            url: prefix + 'api/getProjectList',
            type: 'post',
            contentType: 'application/json',
            dataType: 'json'
        }));
    }
    getProjectData(qd: any): Q.Promise<any> {
        return Q($.ajax({
            url: prefix + 'api/getProjectData',
            type: 'post',
            contentType: 'application/json',
            dataType: 'json',
            data: JSON.stringify(qd)
        }));
    }
    refreshProject(qd: any):Q.Promise<models.returnMsg> {
        return Q($.ajax({
            url: prefix + 'api/refreshProject',
            type: 'post',
            contentType: 'application/json',
            dataType: 'json',
            data: JSON.stringify(qd)
        }));
    }
    getJsonFile(url): Q.Promise<any> {
        return Q($.ajax({
            url: url,
            dataType: 'json'
        }));
    }
    getJsonFileRefresh(url): Q.Promise<any> {
        return Q($.ajax({
            url: url + '?t=' + (new Date().getTime()),
            dataType: 'json'
        }));
    }
    getFile(url): Q.Promise<any> {
        return Q($.ajax({
            url: url
        }));
    }
    getFileRefresh(url): Q.Promise<any> {
        return Q($.ajax({
            url: url + '?t=' + (new Date().getTime())
        }));
    }
}

export = new Services();
