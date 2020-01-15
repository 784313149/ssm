// 自定义指令: 无合同台账
app.directive('ledgerNocontract', ["allService", "$rootScope", "$timeout", function (allService, $rootScope, $timeout) {
    return {
        restrict: 'E',
        replace: true,
        scope: { data: "=", requestId: "@" },
        templateUrl: "" + $rootScope.projectName + "/Scripts/app/changzu/noContract.html",
        link: function ($scope, elem, attr) {
            $scope.typeList = ["请选择", "是", "否"];
            $scope.stockornew = "请选择";
            $scope.iscost = "请选择";
            $scope.financechangtan = "请选择";
            // 监听数据
            $scope.$watch("data", function (newValue) {
                var data = newValue;
                if (!data) {
                    return;
                }
                try {
                    $scope.city = data.地市;
                    $scope.area = data.管理区域;
                    $scope.sitecode = data.站点编码;
                    $scope.stoname = data.站点名称;
                } catch (e) { }
            })


            // 上传文件点击
            $scope.selFile = function () {
                $scope.dialogTitle = "免费依据上传";
                $scope.modelUrl = false;
                $scope.isMultiple = true;
                $scope.fileAccept = "";
                $scope.uploadUrl = "" + $rootScope.projectName + "/Sub/addFilesByUser";
                $scope.uploadPostData = { fileMainId: 8, pkId: uuid, catalog: "" };
                $scope.isHintSuccess = true;
                $scope.isShowDialog = true;
            }

            // 保存
            $scope.saveOk = function () {
                var city = $scope.city;
                var area = $scope.area;
                var sitecode = $scope.sitecode;
                var stoname = $scope.stoname;
                var resourcecodie = $scope.resourcecodie;
                var stockornew = $scope.stockornew;
                var stoaddress = $scope.stoaddress;
                var computerlab = $scope.computerlab;
                var financechangtan = $scope.financechangtan;
                var basisofrent = $scope.basisofrent;
                var stationtype = $scope.stationtype;
                var natureofoccupation = $scope.natureofoccupation;
                var landownership = $scope.landownership;
                var evidence = $scope.evidence;
                var reason = $scope.reason;
                var freebasis = $scope.freebasis;
                var contractcode = $scope.contractcode;
                var iscost = $scope.iscost;
                var url = "" + $rootScope.projectName + "/Changzu/CtNocontractledgerAdd";
                var postData = $.param($.extend({ 'stationCode': stationCode }, { "contractCode": contractCode },
                    { 'taxStr': taxStr }, { "fapiaoType": fapiaoType }, { 'infoRight': infoRight },
                    { "wrongContant": wrongContant }, { "sysRentYearStr": sysRentYearStr }));
                WyContractInfoAdd(url, postData);
            }
        }
    }
}])