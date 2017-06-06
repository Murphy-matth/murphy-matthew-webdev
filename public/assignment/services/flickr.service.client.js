(function () {
    angular
        .module('WebAppMaker')
        .service('flickrService', flickrService);

    function flickrService($http) {

        this.searchPhotos = searchPhotos;

        var key = "e650c7a4a3fcdaad94406f5ec647d7b6";
        var secret = "3272826459e78985";
        var urlBase = "https://api.flickr.com/services/rest/?method=flickr.photos.search&format=json&api_key=API_KEY&text=TEXT";

        function searchPhotos(searchTerm) {
            var url = urlBase
                .replace("API_KEY", key)
                .replace("TEXT", searchTerm);
            return $http.get(url);
        }
    }
})();