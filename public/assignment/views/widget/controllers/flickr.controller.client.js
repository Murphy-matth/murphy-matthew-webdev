(function () {
    angular
        .module('WebAppMaker')
        .controller('flickrController', flickrController);

    function flickrController($routeParams, $location, flickrService, WidgetService) {
        var vm = this;

        function init() {
            vm.userId = $routeParams['uid'];
            vm.websiteId = $routeParams['wid'];
            vm.pageId = $routeParams['pid'];
            vm.widgetId = $routeParams['wigid'];
        }
        init();

        vm.searchPhotos = searchPhotos;
        vm.selectPhoto = selectPhoto;

        function selectPhoto(photo) {
            console.log(photo);
            var url = "https://farm" + photo.farm + ".staticflickr.com/" + photo.server;
            url += "/" + photo.id + "_" + photo.secret + "_b.jpg";
            WidgetService
                .updateWidgetUrl(vm.widgetId, url)
                .then(function(response) {
                    $location.url("/user/" + vm.userId + "/website/" + vm.websiteId + "/page/" + vm.pageId + "/widget/" + vm.widgetId);
                });
        }

        function searchPhotos(searchTerm) {
            flickrService
                .searchPhotos(searchTerm)
                .then(function(response) {
                    data = response.data.replace("jsonFlickrApi(","");
                    data = data.substring(0,data.length - 1);
                    data = JSON.parse(data);
                    vm.photos = data.photos;
                });
        }
    }
})();