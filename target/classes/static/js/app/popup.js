// 自定义指令: 角色、作用域的列表
app.directive('directiveLeftList2', ["$timeout", "$window", "$document", "$rootScope", "allService", function ($timeout, $window, $document, $rootScope, allService) {
    return {
        restrict: 'E',
        replace: true,
        scope: { listType: "=", ngModel: "=", hideRightList: '=', selName: "=", appSysType: "=" },
        templateUrl: "" + $rootScope.projectName + "/Scripts/app/templateUrl/searchList.html",
        link: function ($scope, elem, attr) {
            var page = 1;
            var pages = 0;
            var allList = [];
            var isGetLoading = false;
            $scope.isNoScroll = false;
            $scope.isLoading = true;       // 是否需要加载     false: 加载到最后一页
            getWidthHeight();
            // item点击
            $scope.itemClick = function (item) {
                $scope.selName = item.name;
                $scope.selClick = item;
                $scope.isClick(item);
                $scope.ngModel = item.id;
            }
            $scope.isClick = function (item) {
                return $scope.selClick == item;
            }

            // 收缩、显示
            $scope.hideLeft = function () {
                $scope.hideRightList = !$scope.hideRightList;
            }
            // 监听是需要加载哪个列表
            $scope.$watch("listType", function (newValue) {
                if (newValue) {
                    if (newValue == "role") {
                        getPlatformRoleListByPages(1);
                    } else if (newValue == "action") {
                        getPlatformActionAreaListByPages(1);
                    } else if (newValue == "gzh") {
                        getGZHListByPages(1);
                    }
                }
            })
            // 搜索
            $scope.btnSearch = function () {
                if (!isGetLoading) {
                    isGetLoading = true;
                    allList = [];
                    page = 1;
                    if ($scope.listType == "role") {
                        getPlatformRoleListByPages(page);
                    } else if ($scope.listType == "action") {
                        getPlatformActionAreaListByPages(page);
                    } else if ($scope.listType == "gzh") {
                        getGZHListByPages(page);
                    }
                }
            }
			/**
			 * 回车键事件
			 */
            $scope.enterEvent = function (e) {
                var keycode = window.event ? e.keyCode : e.which;
                if (keycode == 13) {
                    $scope.btnSearch();
                }
            }
            // 监听是否需要加载下一页
            angular.element(".directive-data-list").on('scroll', function () {
                var outerHeight = Math.round($(".directive-ul-list").outerHeight());
                var height = $(".directive-data-list").height(); //可视高度
                var hh = outerHeight - height;
                var srollPos = $(".directive-data-list").scrollTop();
                if (srollPos >= (hh - 50) && srollPos <= hh) {
                    if (page < pages) {
                        page++;
                        isGetLoading = true;
                        if ($scope.listType == "role") {
                            getPlatformRoleListByPages(page);
                        } else if ($scope.listType == "action") {
                            getPlatformActionAreaListByPages(page);
                        } else if ($scope.listType == "gzh") {
                            getGZHListByPages(page);
                        }
                        $scope.isLoading = true;
                    }
                }
            })
            /**
			 * 获取宽高，自定义元素宽高
			 */
            function getWidthHeight() {
                var userAgent = navigator.userAgent; //取得浏览器的userAgent字符串
                if (userAgent.indexOf("Chrome") > -1) {
                    $(".directive-data-list").css("width", "100%");
                }
                var height = $(".content-wrapper").height();
                if ($scope.corpMin) {
                    height = $(".content-wrapper").height() - 110;
                }
                $(".directive-left-list").css("height", height + "px");
                $(".directive-data-list").css("height", (height - 50) + "px");
            }
            window.onresize = function () {
                var userAgent = navigator.userAgent; //取得浏览器的userAgent字符串
                if (userAgent.indexOf("Chrome") > -1) {
                    $(".directive-data-list").css("width", "100%");
                }
                var height = $(".content-wrapper").height();
                if ($scope.corpMin) {
                    height = $(".content-wrapper").height() - 110;
                }
                $(".directive-left-list").css("height", height + "px");
                $(".directive-data-list").css("height", (height - 50) + "px");
            }
            // ng-repeat执行渲染完毕
            $scope.renderFinish = function () {
                var outerHeight = Math.round($(".directive-ul-list").outerHeight());
                var height = $(".directive-data-list").height(); //可视高度
                if (outerHeight <= height) {
                    if (page < pages && !isGetLoading) {
                        page++;
                        isGetLoading = true;
                        $scope.isLoading = true;
                        if ($scope.listType == "role") {
                            getPlatformRoleListByPages(page);
                        } else if ($scope.listType == "action") {
                            getPlatformActionAreaListByPages(page);
                        } else if ($scope.listType == "gzh") {
                            getGZHListByPages(page);
                        }
                    } else {
                        $scope.isLoading = false;
                        $scope.isNoScroll = true;
                    }
                }
            }

            // 获取角色列表
            function getPlatformRoleListByPages(page) {
                var count = 20;
                var searchName = $scope.searchName;
                if (!searchName) searchName = "";
                var postData = $.param($.extend({ 'count': count }, { 'number': page }, { 'roleName': searchName }, { "appSys": $scope.appSysType }));
                allService.getPlatformRoleListByPages(postData).then(function successCallback(response) {
                    var resp = response.data;
                    if (resp.ErrCode == "200") {
                        var data = resp.Data;
                        var dataList = data.DATALIST;
                        angular.forEach(dataList, function (elt, index) {
                            elt.CREATE_DATE = $rootScope.getTimeStamp(elt.CREATE_DATE, false);
                            elt.name = elt.ROLE_NAME;
                            elt.id = elt.ROLE_ID;
                            allList.push(elt);
                        })
                        if (allList.length == 0) {
                            $scope.isNoStaff = true;
                            $scope.isNoScroll = true;
                        } else {
                            $scope.isNoStaff = false;
                            $scope.isNoScroll = false;
                        }
                        $scope.dataList = allList;
                        var dataPages = parseInt(data.AllCOUNT / count);
                        if (data.allCount % count != 0) {
                            dataPages = dataPages + 1; //总页数
                        }
                        pages = dataPages;
                        isGetLoading = false;
                        if (page == pages) {
                            $scope.isLoading = false;
                        }
                    } else {
                        layer.msg(resp.ErrMsg);
                    }
                }, function errorCallback(status) { });
            }
            // 获取作用域列表
            function getPlatformActionAreaListByPages(page) {
                var count = 20;
                var searchName = $scope.searchName;
                if (!searchName) searchName = "";
                var postData = $.param($.extend({ 'count': count }, { 'number': page }, { 'searchStr': searchName }));
                allService.getPlatformActionAreaListByPages(postData).then(function successCallback(response) {
                    var resp = response.data;
                    if (resp.ErrCode == "200") {
                        var data = resp.Data;
                        var dataList = data.DATALIST;
                        angular.forEach(dataList, function (elt, index) {
                            elt.CREATE_DATE = $rootScope.getTimeStamp(elt.CREATE_DATE, false);
                            elt.name = elt.ACTION_NAME;
                            elt.id = elt.ACTION_ID;
                            allList.push(elt);
                        })
                        if (allList.length == 0) {
                            $scope.isNoStaff = true;
                            $scope.isNoScroll = true;
                        } else {
                            $scope.isNoStaff = false;
                            $scope.isNoScroll = false;
                        }
                        $scope.dataList = allList;
                        var dataPages = parseInt(data.AllCOUNT / count);
                        if (data.allCount % count != 0) {
                            dataPages = dataPages + 1; //总页数
                        }
                        pages = dataPages;
                        isGetLoading = false;
                        if (page == pages) {
                            $scope.isLoading = false;
                        }
                    } else {
                        layer.msg(resp.ErrMsg);
                    }
                }, function errorCallback(status) { });
            }

            // 获取公众号列表
            function getGZHListByPages(page) {
                var count = 20;
                var searchName = $scope.searchName;
                if (!searchName) searchName = "";
                var postData = $.param($.extend({ 'count': count }, { 'number': page }, { 'appName': searchName }));
                var url = "" + $rootScope.projectName + "/WXManage/getWxGZHListByName";
                allService.post(url, postData).then(function successCallback(resp) {
                    //var resp = response.data;
                    if (resp.ErrCode == "200") {
                        var data = resp.Data;
                        var dataList = data.DATALIST;
                        angular.forEach(dataList, function (elt, index) {
                            elt.CREATE_DATE = $rootScope.getTimeStamp(elt.CREATE_DATE, false);
                            elt.name = elt.APPNAME;
                            elt.id = elt.appid;
                            allList.push(elt);
                        })
                        if (allList.length == 0) {
                            $scope.isNoStaff = true;
                            $scope.isNoScroll = true;
                        } else {
                            $scope.isNoStaff = false;
                            $scope.isNoScroll = false;
                        }
                        $scope.dataList = allList;
                        var dataPages = parseInt(data.AllCOUNT / count);
                        if (data.allCount % count != 0) {
                            dataPages = dataPages + 1; //总页数
                        }
                        pages = dataPages;
                        isGetLoading = false;
                        if (page == pages) {
                            $scope.isLoading = false;
                        }
                    } else {
                        layer.msg(resp.ErrMsg);
                    }
                }, function errorCallback(status) { });
            }
        }
    }
}])