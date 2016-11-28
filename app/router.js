define(["require", "exports", "knockout", "crossroads", "hasher"], function (require, exports, ko, crossroads, hasher) {
    "use strict";
    var router;
    (function (router) {
        router.currentRoute = ko.observable({});
        var allRoutes = [
            {
                url: '',
                params: { page: 'home-page' }
            }, {
                url: 'about',
                params: { page: 'about-page' }
            }, {
                url: 'login',
                params: { page: 'login-page' }
            }
        ];
        ko.utils.arrayForEach(allRoutes, function (route) {
            crossroads.addRoute(route.url, function (requestParams) {
                router.currentRoute(ko.utils.extend(requestParams, route.params));
            });
        });
        function parseHash(newHash, oldHash) { crossroads.parse(newHash); }
        crossroads.normalizeFn = crossroads.NORM_AS_OBJECT;
        hasher.initialized.add(parseHash);
        hasher.changed.add(parseHash);
        hasher.init();
    })(router || (router = {}));
    return router;
});
//# sourceMappingURL=router.js.map