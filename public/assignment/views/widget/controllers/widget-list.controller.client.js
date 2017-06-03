(function () {
    angular
        .module('WebAppMaker')
        .controller('widgetListController', widgetListController);

    function widgetListController($sce, $routeParams, WidgetService) {

        var vm = this;

        function init() {
            vm.userId = $routeParams['uid'];
            vm.websiteId = $routeParams['wid'];
            vm.pageId = $routeParams['pid'];
            WidgetService
                .findWidgetsByPageId(vm.pageId)
                .then(function(widgets) {
                    vm.widgets = widgets;
                })
        }
        init();

        vm.trustThisContent = trustThisContent;
        vm.getYouTubeEmbedUrl = getYouTubeEmbedUrl;
        vm.getWidgetUrlForType = getWidgetUrlForType;

        function getWidgetUrlForType(type) {
            return 'views/widget/templates/widgets/widget-'+type.toLowerCase()+'.view.client.html';
        }

        function getYouTubeEmbedUrl(youTubeLink) {
            var embedUrl = 'https://www.youtube.com/embed/';
            var youTubeLinkParts = youTubeLink.split('/');
            var id = youTubeLinkParts[youTubeLinkParts.length - 1];
            embedUrl += id;
            return $sce.trustAsResourceUrl(embedUrl);
        }

        function trustThisContent(html) {
            // diligence to scrub any unsafe content
            return $sce.trustAsHtml(html);
        }
    }
})();