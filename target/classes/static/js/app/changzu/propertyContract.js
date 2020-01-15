// 自定义指令: 物业合同基础信息
app.directive('ledgerProperty', ["allService", "$rootScope", "$timeout", function (allService, $rootScope, $timeout) {
    return {
        restrict: 'E',
        replace: true,
        scope: { data: "=", imgList: "=" },
        templateUrl: "" + $rootScope.projectName + "/Scripts/app/changzu/propertyContract.html",
        link: function ($scope, elem, attr) {
            $scope.isNoDBList = [{ Value: "请选择", Text: "请选择" }, { Value: "是", Text: "是" }, { Value: "否", Text: "否" }];
            $scope.infoRight = "请选择";
            $scope.deleteUrl = "" + $rootScope.projectName + "/Sub/delFiles";           // 删除文件的 url
            $scope.isDelete = true;                                                     // 是否有删除文件按钮
            var ddlsList = ["ddls_fapiao"];
            var uuid = "";
            angular.forEach(ddlsList, function (elt, index) {
                getSelectList(elt, "");
            });

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
                var taxStr = $scope.taxStr;
                var fapiaoType = $scope.fapiaoType;
                var infoRight = $scope.infoRight;
                var wrongContant = $scope.wrongContant;
                var sysRentYearStr = $scope.sysRentYearStr;
                var url = "" + $rootScope.projectName + "/Changzu/WyContractInfoAdd";
                var postData = $.param($.extend({ 'stationCode': stationCode }, { "contractCode": contractCode },
                    { 'taxStr': taxStr }, { "fapiaoType": fapiaoType }, { 'infoRight': infoRight },
                    { "wrongContant": wrongContant }, { "sysRentYearStr": sysRentYearStr }));
                WyContractInfoAdd(url, postData);
            }
            // 上传文件点击
            $scope.selFile = function (data) {
                $scope.dialogTitle = "文件上传";                                            // 弹出框title名
                $scope.modelUrl = false;                                                    // 是否显示下载模板
                $scope.isMultiple = true;                                                   // 是否可多选
                $scope.fileAccept = "";                                                     // 设置上传文件类型(.xls,.xlsx,.txt)之类的
                $scope.uploadUrl = "" + $rootScope.projectName + "/Sub/addFilesByUser";     // 文件上传路径
                $scope.uploadPostData = { fileMainId: 9, pkId: uuid, catalog: "" };         // 上传所带参数
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
                    uuid = data[0].SITECODE + data[0].CONTRACTCODE + "wy-info";
                    $scope.contractCode = data[0].CONTRACTCODE;
                    $scope.contractName = data[0].CONTRACTNAME;
                    $scope.stationCode = data[0].SITECODE;
                    $scope.stationName = data[0].SITENAME;
                    $scope.basicYearrent = data[0].BASIC_YEARRENT;
                    $scope.dwdw = data[0].DWDW;
                    $scope.sfhs = data[0].SFHS;
                    $scope.cardMonthJe = data[0].CARD_MONTH_JE;
                    $scope.cardStartDate = data[0].CARD_START_DATE;
                    $scope.cardEndDate = data[0].CARD_END_DATE;
                    $scope.tax = data[0].TAX;
                    $scope.sysRentYear = data[0].SYS_RENT_YEAR;
                    $scope.fapiaoType = data[0].FAPIAO_TYPE;
                    $scope.infoRight = data[0].INFO_RIGHT;
                    $scope.wrongContant = data[0].WRONG_CONTANT;
                    getSubList();
                } catch (e) { }
            })
            // 获取下拉列表
            function getSelectList(fieldId, cityName) {
                var url = "" + $rootScope.projectName + "/Field/getSelectList";
                var postData = $.param($.extend({ "fieldId": fieldId }, { "cityName": cityName }));
                allService.post(url, postData).then(function successCallback(resp) {
                    if (resp.ErrCode == "200") {
                        var data = resp.Data;
                        if (fieldId == "ddls_fapiao") {
                            $scope.fapiaoList = data;
                            if (!$scope.fapiaoType) $scope.fapiaoType = data[0].Value;
                        }
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
            // 保存
            function WyContractInfoAdd(url, postData) {
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
    }
}])