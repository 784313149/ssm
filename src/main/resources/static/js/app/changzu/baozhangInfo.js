// 自定义指令: 报账信息
app.directive('ledgerBaozhang', ["allService", "$rootScope", "$timeout", "Upload", function (allService, $rootScope, $timeout, Upload) {
    return {
        restrict: 'E',
        replace: true,
        scope: { baozhangList: "=" },
        templateUrl: "" + $rootScope.projectName + "/Scripts/app/changzu/baozhangInfo.html",
        link: function ($scope, elem, attr) {
            dataTimes();
            $scope.isexact = 1;
            var uuid = "";
            $scope.deleteUrl = "" + $rootScope.projectName + "/Sub/delFiles";           // 删除文件的 url
            $scope.isDelete = true;                                                     // 是否有删除文件按钮
            // 操作
            $scope.itemEdit = function (item) {
                $scope.dialogTitle = "报账信息编辑";
                $scope.isBaozhangInfo = true;
                $scope.detailList = [item];
                uuid = item.PAY_NUM;
                var postData = $.param($.extend({ 'fieldrentpayment': item.PAY_NUM }, { "contractCode": item.CONTRACT_CODE },
                    { 'stationCode': item.SITE_CODE }));
                getCtPayAccountInfo(postData);
                getSubList();
            }

            // 文件上传
            $scope.uploadExcelFile = function (files) {
                if (files && files.length) {
                    angular.forEach(files, function (elt, i) {
                        if (1024 <= elt.size && elt.size < 1048576) {
                            elt.length = (elt.size / 1024).toFixed(2) + "KB";
                        } else if (1048576 <= elt.size && elt.size < 20971520) {
                            elt.length = (elt.size / 1048576).toFixed(2) + "MB";
                        } else if (1024 > elt.size) {
                            elt.length = elt.size + "b";
                        } else {
                            layer.msg("" + elt.name + "文件过大");
                            files.splice(i, 1);
                        }
                    })
                    $scope.fileList = files;
                    $scope.sureUpload();
                }
            }
            // 报账附件上传
            $scope.sureUpload = function () {
                $scope.isUploadFile = true;
                var postData = { fileMainId: 9, pkId: uuid, catalog: "", files: $scope.fileList };
                var url = "" + $rootScope.projectName + "/Sub/addFilesByUser";
                Upload.upload({ url: url, data: postData }).then(function (response) {
                    $timeout(function () {
                        var resp = response.data;
                        if (resp.ErrCode == 200) {
                            layer.alert('保存成功', {
                                title: "提示信息",
                                icon: 1,
                                skin: 'layer-ext-moon',
                                closeBtn: 0
                            }, function (index) {
                                layer.close(index);
                                getSubList();
                            });
                        } else {
                            layer.alert(resp.ErrMsg, {
                                title: "提示信息",
                                icon: 2,
                                skin: 'layer-ext-moon',
                                closeBtn: 0
                            }, function (index) {
                                layer.close(index);
                            });
                        }
                    });
                }, function (response) {
                    $scope.isUploadFile = false;
                }, function (evt) {
                    var progressPercentage = Math.min(100, parseInt(100.0 *
                        evt.loaded / evt.total));
                });
            }
            // 保存
            $scope.saveOk = function () {
                $scope.isUploadClick = true;
                var fieldrentpayment = $scope.detailList[0].PAY_NUM;
                var contractCode = $scope.detailList[0].CONTRACT_CODE;
                var contractName = $scope.detailList[0].CONTRACT_NAME;
                var payment = $scope.detailList[0].TOTAL_PAYMENT_LIST;
                var sitecode = $scope.detailList[0].SITE_CODE;
                var sitename = $scope.detailList[0].SITE_NAME;
                var paydate = $scope.detailList[0].ZDMC;
                var verificationdate = $scope.detailList[0].BILL_DATE;
                var payStartDatesys = $scope.detailList[0].PAYMENT_START;
                var payEndDatesys = $scope.detailList[0].PAYMENT_END;
                var systax = $scope.detailList[0].TAX_TOTAL_PRICE;
                var payStartDate = $scope.payStartDate;
                var payEndDate = $scope.payEndDate;
                var isexact = $scope.isexact;
                var bak = $scope.bak;
                var tax = $scope.tax;
                var url = "" + $rootScope.projectName + "/Changzu/CtPayAccountInfoAdd";
                var postData = $.param($.extend({ 'fieldrentpayment': fieldrentpayment }, { "contractCode": contractCode }, { 'contractName': contractName }, { "payment": payment },
                    { 'sitecode': sitecode }, { "sitename": sitename }, { "paydate": paydate }, { "verificationdate": verificationdate },
                    { "payStartDatesys": payStartDatesys }, { "payEndDatesys": payEndDatesys }, { "payStartDate": payStartDate }, { "payEndDate": payEndDate },
                    { "isexact": isexact }, { "bak": bak }, { "tax": tax }, { "systax": systax }));
                CtPayAccountInfoAdd(url, postData);
            }
            // 关闭弹出框
            $scope.backoff = function () {
                layer.confirm('关闭窗口将会清除本次填写的数据，确定关闭吗？', {
                    title: '温馨提示',
                    icon: 0,
                    btn: ['确定', '取消']
                }, function (index) {
                    layer.close(index);
                    $scope.$apply(function () {
                        $scope.isClose = true;
                        $timeout(function () {
                            $scope.isClose = false;
                            $scope.isBaozhangInfo = false;
                        }, 400);
                    })
                })
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
                        $scope.isUploadFile = false;
                    }
                });
            }
            // 保存
            function CtPayAccountInfoAdd(url, postData) {
                allService.post(url, postData).then(function successCallback(resp) {
                    if (resp.ErrCode == "200") {
                        layer.alert('保存成功', {
                            title: "提示信息",
                            icon: 1,
                            skin: 'layer-ext-moon',
                            closeBtn: 0
                        }, function (index) {
                            layer.close(index);
                            $scope.$apply(function () {
                                $scope.isClose = true;
                                $timeout(function () {
                                    $scope.isClose = false;
                                    $scope.isBaozhangInfo = false;
                                }, 400);
                            })
                        });
                    }
                    $scope.isUploadClick = false;
                });
            }
            // 获取修改信息
            function getCtPayAccountInfo(postData) {
                var url = "" + $rootScope.projectName + "/Changzu/getCtPayAccountInfo";
                allService.post(url, postData).then(function successCallback(resp) {
                    if (resp.ErrCode == "200") {
                        var data = resp.Data;
                        try {
                            $scope.payStartDate = getFormatDateByLong(data.PAYMENT_START, "yyyy-MM-dd");
                            $scope.payEndDate = getFormatDateByLong(data.PAYMENT_END, "yyyy-MM-dd");
                            $scope.isexact = data.ISEXACT;
                            $scope.bak = data.BAK;
                            $scope.tax = data.TAX;
                        } catch(e){}
                    }
                });
            }
            // 时间
            function dataTimes() {
                $.datetimepicker.setLocale('ch');
                $(".date-time").datetimepicker({
                    format: 'Y-m-d',
                    timepicker: false,
                    timepickerScrollbar: false,
                    scrollMonth: false,
                    scrollTime: false,
                    scrollInput: false
                });
            }
        }
    }
}])