import Q = require('q');
import models = require('../app/models');
import $ = require('jquery');
import _ = require('underscore');

class Services {
    login(qd): Q.Promise<models.returnMsg> {
        return Q($.ajax({
            url: '/api/login',
            type: 'post',
            contentType: 'application/json',
            data: JSON.stringify(qd)
        }));
    }
    getJsonFileRefresh(url): Q.Promise<any> {
        return Q($.ajax({
            url: url + '?t=' + (new Date().getTime()),
            dataType: 'json'
        }));
    }
    getJsonFile(url): Q.Promise<any> {
        return Q($.ajax({
            url: url,
            dataType: 'json'
        }));
    }
}
