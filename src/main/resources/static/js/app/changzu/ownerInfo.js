// 自定义指令: 业主信息
app.directive('ledgerOwner', ["allService", "$rootScope", "$timeout", function (allService, $rootScope, $timeout) {
    return {
        restrict: 'E',
        replace: true,
        scope: { data: "=", requestId: "@" },
        templateUrl: "" + $rootScope.projectName + "/Scripts/app/changzu/ownerInfo.html",
        link: function ($scope, elem, attr) {
            
        }
    }
}])