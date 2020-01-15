// 自定义指令: 运营商租户信息
app.directive('ledgerYys', ["allService", "$rootScope", "$timeout", function (allService, $rootScope, $timeout) {
    return {
        restrict: 'E',
        replace: true,
        scope: { data: "=", contractCode: "=", stationCode: "=" },
        templateUrl: "" + $rootScope.projectName + "/Scripts/app/changzu/yysZuHuInfo.html",
        link: function ($scope, elem, attr) {
            $scope.isNoDBList = [{ Value: "请选择", Text: "请选择" }, { Value: "是", Text: "是" }, { Value: "否", Text: "否" }];
            $scope.infoRight = "请选择";
            var uuid = "";
            $scope.deleteUrl = "" + $rootScope.projectName + "/Sub/delFiles";           // 删除文件的 url
            $scope.isDelete = true;                                                     // 是否有删除文件按钮

            // 监听上传文件返回的参数
            $scope.$watch("returnResp", function (newValue) {
                if (newValue) {
                    console.log(newValue);
                    var data = newValue.Data;
                    getSubList();
                }
            })
            // 保存
            $scope.saveOk = function () {
                var stationCode = $scope.stationCode;
                var contractCode = $scope.contractCode;
                var operatortenant = $scope.operatortenant;
                var isShare = $scope.isShare;
                var changQun = $scope.changQun;
                var bak = $scope.bak;
                var dxYearRent = $scope.dxYearRentStr;
                var ydYearRent = $scope.ydYearRentStr;
                var ltYearRent = $scope.ltYearRentStr;
                var url = "" + $rootScope.projectName + "/Changzu/CtOperatortenantAdd";
                var postData = $.param($.extend({ 'stationCode': stationCode }, { "contractCode": contractCode },
                    { 'operatortenant': operatortenant }, { "isShare": isShare }, { 'changQun': changQun },
                    { "bak": bak }, { "dxYearRent": dxYearRent }, { "ydYearRent": ydYearRent }, { "ltYearRent": ltYearRent }));
                addOrEdit(url, postData);
            }
            // 上传文件点击
            $scope.selFile = function (data) {
                $scope.dialogTitle = "文件上传";                                            // 弹出框title名
                $scope.modelUrl = false;                                                    // 是否显示下载模板
                $scope.isMultiple = true;                                                   // 是否可多选
                $scope.fileAccept = "";                                                     // 设置上传文件类型(.xls,.xlsx,.txt)之类的
                $scope.uploadUrl = "" + $rootScope.projectName + "/Sub/addFilesByUser";     // 文件上传路径
                $scope.uploadPostData = { fileMainId: 8, pkId: uuid, catalog: "" };         // 上传所带参数
                $scope.isHintSuccess = true;                                                // 上传成功是否弹出框提醒
                $scope.isShowDialog = true;                                                 // 点击弹出选择文件框
            }
            // 监听数据
            $scope.$watch("data", function (newValue) {
                var data = newValue;
                if (!data) {
                    return;
                }
                try {
                    uuid = data.SITECODE + data.CONTRACTCODE + "yys-info";
                    $scope.operatortenant = data.OPERATORTENANT;
                    $scope.isShare = data.ISSHARE;
                    $scope.changQun = data.CHANGQUN;
                    $scope.bak = data.BAK;
                    $scope.dxYearRentStr = data.DX_YEAR_RENT;
                    $scope.ydYearRentStr = data.YD_YEAR_RENT;
                    $scope.ltYearRentStr = data.LT_YEAR_RENT;
                    getSubList();
                } catch (e) { }
            })
            // 保存
            function addOrEdit(url, postData) {
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

            // 获取文件列表
            function getSubList() {
                var url = "" + $rootScope.projectName + "/Sub/getSubList";
                var postData = $.param($.extend({ 'fileMainId': 9 }, { "pkId": uuid }));
                allService.post(url, postData).then(function successCallback(resp) {
                    if (resp.ErrCode == "200") {
                        var data = resp.Data;
                        angular.forEach(data, function (elt, index) {
                            elt.src = "" + $rootScope.projectName + "/Sub/downFile?" + "subId=" + elt.SUB_ID + "&" + "fileMainId=" + elt.FILE_MAIN_ID;
                            elt.name = elt.FILE_SUB_NAME;
                        })
                        $scope.imgList = data;
                    }
                });
            }
        }
    }
}])