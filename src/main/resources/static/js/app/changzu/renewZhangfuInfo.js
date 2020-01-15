// 自定义指令: 续签涨幅信息
app.directive('ledgerRenew', ["allService", "$rootScope", "$timeout", function (allService, $rootScope, $timeout) {
    return {
        restrict: 'E',
        replace: true,
        scope: { data: "=" },
        templateUrl: "" + $rootScope.projectName + "/Scripts/app/changzu/renewZhangfuInfo.html",
        link: function ($scope, elem, attr) {
            $scope.isNoDBList = [{ Value: "请选择", Text: "请选择" }, { Value: "是", Text: "是" }, { Value: "否", Text: "否" }];
            $scope.isTax = "请选择";
            // 保存
            $scope.saveOk = function () {
                var contractCode = $scope.contractCode;
                var totalltfe = $scope.totalltfe;
                var isTax = $scope.isTax;
                var tax = $scope.tax;
                var annualrent = $scope.annualrent;
                var totalMoney = $scope.totalMoney;
                var appreciate = $scope.appreciate;
                var beforeCode = $scope.beforeCode;
                var bak = $scope.bak;
                var url = "" + $rootScope.projectName + "/Changzu/WyContractInfoAdd";
                var postData = $.param($.extend({ 'totalltfe': totalltfe }, { "contractCode": contractCode },
                    { 'isTax': isTax }, { "tax": tax }, { 'annualrent': annualrent },
                    { "totalMoney": totalMoney }, { "appreciate": appreciate }, { "beforeCode": beforeCode }, { "bak": bak }));
                CtRenewalrateAdd(url, postData);
                // 保存
                function CtRenewalrateAdd(url, postData) {
                    allService.post(url, postData).then(function successCallback(resp) {
                        if (resp.ErrCode == "200") {
                            layer.alert('保存成功', {
                                title: "提示信息",
                                icon: 1,
                                skin: 'layer-ext-moon',
                                closeBtn: 0
                            }, function (index) {
                                layer.close(index);
                            });
                        }
                    });
                }
            }
            // 监听数据
            $scope.$watch("data", function (newValue) {
                var data = newValue;
                if (!data) {
                    return;
                }
                try {
                    $scope.contractCode = data.CONTRACTCODE;
                    $scope.totalltfe = data.TOTALLIFE;
                    $scope.isTax = data.ISTAX;
                    $scope.tax = data.TAX;
                    $scope.annualrent = data.ANNUALRENT;
                    $scope.totalMoney = data.TOTALMONEY;
                    $scope.appreciate = data.APPRECIATE;
                    $scope.beforeCode = data.BEFORECODE;
                    $scope.bak = data.BAK;
                } catch (e) { }
            })
        }
    }
}])