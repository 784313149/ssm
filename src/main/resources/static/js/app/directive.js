// 自定义指令: 刷新
app.directive('diHref', ['$location', function ($location) {
    return function ($scope, element, attrs) {
        $scope.$watch('diHref', function () {
            element.on('click', function (event) {
                $scope.$apply(function () {
                    if (attrs.diHref == "reload") location.reload();
                });
            });
        });
    }
}]);
app.directive('dialogWidth', function () {
    return {
        restrict: 'A',
        link: function (scope, element, attr) {
            let values = attr.dialogWidth;
            element[0].style.width = values;
        }
    };
});
// 是否repeat 完成
app.directive('repeatFinish', function () {
    return {
        link: function (scope, element, attr) {
            if (scope.$last === true) {
                scope.$eval(attr.repeatFinish);
            }
        }
    }
})
// 自定义指令: 分页
app.directive('paging', ["$rootScope", function ($rootScope) {
    return {
        require: '?ngModel', // ?ngModel
        replace: true,
        restrict: 'E',
        templateUrl: '' + $rootScope.projectName + '/Scripts/app/templateUrl/pagingTem.html',
        scope: {
            selPage: "=",           // 选中的页数
            allCount: '=',          // 总页数
            changePage: "&",        // 页数发生变化反馈函数
            pageSize: "=",          // 条数
            selectList: "=",        // 下拉框选择的列表
            inputPage: "=",         // 是否开启输入跳转
            pageHint: "@",          // 加载时的显示文字
            isJsPaging: "=",        // 是否前端分页
            allList: "=",           // 总数据
        },
        link: function ($scope, element, attr, ngModel) {
            // 显示 hint
            $scope.isGetLoading = true;
            $scope.itemList = [];
            $scope.newPages = 0;
            $scope.allPage = 0;
            // 是否没有数据
            $scope.noDataTrue = false;
            // 是否显示多少条数据
            $scope.hasAllCount = true;
            var isClickPage = false;
            // 监听总页数做出对应的动作
            $scope.$watch("allCount", function (newValue) {
                if (!attr.hasOwnProperty('pageHint')) {
                    $scope.pageHint = "正在查询...";
                }
                if (newValue) {
                    // 有条数时
                    if ($scope.pageSize) {
                        $scope.isGetLoading = false;
                        $scope.noDataTrue = false;
                        $scope.hasAllCount = true;
                        $scope.reloadData();
                    }
                }
                // 传999999999 表示无总页数,  隐藏总页数, 最后一页
                if (newValue == 999999999) {
                    $scope.inputPage = false;
                    $scope.hasAllCount = false;
                }
                // 表示无数据
                if (newValue === 0) {
                    $scope.isGetLoading = true;
                    $scope.pageHint = "暂无记录";
                    $scope.noDataTrue = true;
                }
            })
            // 监听选中页数
            $scope.$watch("selPage", function (newValue) {
                if (newValue) {
                    // 第一次传的选中页数不等于1, 执行点击操作
                    if (newValue != 1 && !isClickPage) {
                        $scope.checkPage(newValue);
                    }
                    // 搜索时初始化
                    if (newValue === 1) $scope.reloadData();
                }
            })
            // 初始化
            $scope.reloadData = function () {
                var pageSize = parseInt($scope.pageSize);
                $scope.allPage = Math.ceil($scope.allCount / pageSize);
                $scope.newPages = $scope.allPage < 5 ? $scope.allPage : 5;
                if ($scope.isJsPaging) {
                    $scope.isJsPaging = $scope.allList.slice(0, $scope.pageSize);
                }
                var pageList = [];
                for (var i = 0; i < $scope.newPages; i++) {
                    pageList.push(i + 1);
                }
                $scope.itemList = pageList;
            }
            // 点击页数
            $scope.checkPage = function (page) {
                isClickPage = true;
                page = parseInt(page);
                if (page < 1 || page > $scope.allPage) return;
                var newpageList = [];
                // 判断选中页数时要显示的页数列表
                if ($scope.allPage < 6) {
                    for (var i = 0; i < $scope.allPage; i++) {
                        newpageList.push(i + 1);
                    }
                } else {
                    if (page == 1 || page == 2) {
                        for (var i = 0; i < $scope.newPages; i++) {
                            newpageList.push(i + 1);
                        }
                    }
                    //最多显示分页数5
                    if (page > 2 && page < ($scope.allPage - 1)) {
                        //因为只显示5个页数，大于2页开始分页转换
                        for (var i = (page - 3); i < ((page + 2) > $scope.allPage ? $scope.allPage : (page + 2)); i++) {
                            newpageList.push(i + 1);
                        }
                    }
                    if (page == ($scope.allPage - 1) || page == $scope.allPage) {
                        for (var i = ($scope.allPage - 5); i < $scope.allPage; i++) {
                            newpageList.push(i + 1);
                        }
                    }
                }
                $scope.itemList = newpageList;
                $scope.selPage = page;
                $scope.isActivePage(page);
                if ($scope.isJsPaging) {
                    $scope.setData();
                } else {
                    setTimeout(function () {
                        $scope.changePage({ selPage: $scope.selPage });
                    }, 0)
                }
            }
            $scope.setData = function () {
                $scope.isJsPaging = $scope.allList.slice(($scope.pageSize * ($scope.selPage - 1)), ($scope.selPage * $scope.pageSize));   //通过当前页数筛选出表格当前显示数据
            }
            // 选中样式
            $scope.isActivePage = function (page) {
                return $scope.selPage == page;
            }
            // 下一页
            $scope.nextPage = function () {
                $scope.checkPage($scope.selPage + 1);
            }
            // 上一页
            $scope.prevPage = function () {
                $scope.checkPage($scope.selPage - 1);
            }
            // 最后一页
            $scope.lastPage = function () {
                $scope.checkPage($scope.allPage);
            }
            // 第一页
            $scope.firstPage = function () {
                $scope.checkPage(1);
            }
            // 下拉框选择
            $scope.changePageSize = function () {
                var pageSize = parseInt($scope.pageSize);
                $scope.allPage = Math.ceil($scope.allCount / pageSize);
                $scope.newPages = $scope.allPage < 5 ? $scope.allPage : 5;
                if ($scope.selPage >= $scope.allPage) {
                    $scope.checkPage($scope.allPage);
                } else {
                    $scope.checkPage($scope.selPage);
                }
                if ($scope.isJsPaging) {
                    $scope.setData();
                }
            }
            // 输入input
            $scope.keyup = function (e) {
                var keycode = window.event ? e.keyCode : e.which;
                if (keycode == 13) {
                    $scope.checkPage($scope.pageInput);
                    $scope.pageInput = "";
                }
            }
        }
    }
}]);
// 自定义指令: 部门树
app.directive('tree', function ($location) {
    return {
        require: '?ngModel', // ?ngModel
        replace: true,
        restrict: 'E',
        template: '<div class="tree"> </div>',
        scope: { textFormatter: '=', data: '=' },
        link: function ($scope, element, attributes, ngModel, textFormat) {
            var NODE = "tree-node";
            var textField = attributes["text"],
                textFormatter = $scope.textFormatter;
            var dataSource = attributes["data"];
            var isSingleSelect = attributes.hasOwnProperty('singleSelect'), // 优先
                isCheck = attributes.hasOwnProperty('checkable');
            function clearSel() {
                var $old = element.find("li.active");
                $old.removeClass('active');
            }

            if ((isSingleSelect || isCheck) && ngModel) {
                if (isSingleSelect) {
                    ngModel.$render = function () {
                        var val = ngModel.$viewValue;
                        clearSel();
                        if (val) {
                            var $li = element.find('li[node-id="' + val.ORG_CODE + '"]');
                            $li.addClass("active");
                        }
                    }
                }
            }
            //当前点击的li
            element.on('click', '.item', function (e) {
                if (e.isDefaultPrevented()) return
                e.preventDefault();

                if (isSingleSelect) {
                    clearSel();
                }
                var $ele = $(e.target);
                var $li = $ele.parent("li");
                if (isSingleSelect) {
                    $li.addClass("active");
                }


                if ((isSingleSelect || isCheck) && ngModel) {
                    var selected = $li.data(NODE);
                    $scope.$apply(function () {
                        ngModel.$setViewValue(selected);
                    })
                }

            })
            element.on('click', '.fa-click', function (e) {
                e.stopPropagation();
                var $ele = $(e.target);
                var $li = $ele.parent("li");
                if ($ele.hasClass("fa-folder-o")) {
                    $ele.removeClass("fa-folder-o");
                    $ele.addClass("fa-folder-open-o");
                } else {
                    $ele.removeClass("fa-folder-open-o");
                    $ele.addClass("fa-folder-o");
                }
                $li.children("ul").slideToggle(500);

            })
            $scope.$watch("data", function (newValue) {
                var treeData = newValue;
                if (!treeData) {
                    return;
                }
                var first = true;
                function parseChildTree(level, trees) {
                    var $ul = $("<ul>"),
                        val;
                    if ((isSingleSelect || isCheck) && ngModel) {
                        val = ngModel.$viewValue
                    }

                    $ul.attr({
                        'data-level': level
                    })

                    trees.forEach(function (value) {
                        var text = textField ?
                            value[textField] : (textFormatter ? textFormatter(value) : ""),
                            $li = $("<li>"),
                            $i1 = $("<i>"),
                            $i2 = $("<i>"),
                            $i3 = $("<i>"),
                            $ul1 = $("<ul>"),
                            $li1 = $("<li>"),
                            $span = $("<span>");
                        $li.attr({
                            'node-id': value.ORG_CODE
                        });
                        $li.data("node", value);
                        $span.text(text || '');

                        $span.addClass('item');
                        $i1.addClass('fa fa-folder-o fa-click');
                        $i3.addClass('fa fa-folder-open-o fa-click');
                        $i3.attr('title', '展开/折叠');
                        $i1.attr('title', '展开/折叠');
                        $i2.addClass('fa fa-folder-open-o');
                        $li.append($span);
                        $li.data(NODE, value);
                        if (isSingleSelect) {
                            if (val && val.ORG_CODE == value.ORG_CODE) {
                                //$li.addClass('active');
                                $li.find("i").fadeToggle(300);
                            }
                        } else if (isCheck) {
                            $li.append(' <i class="check icon-check-empty"></i>');
                        }
                        // 判断是否还有子菜单
                        if (value.children && value.children.length > 0) {
                            if (first) {
                                $li.prepend($i3);
                                first = false;
                            } else {
                                $li.prepend($i1);
                            }
                            $li.append(parseChildTree(level + 1, value.children));
                        } else {
                            $li.prepend($i2);
                        }
                        $ul.append($li);
                    });
                    return $ul;
                }

                var $tree = parseChildTree(0, treeData);
                element.html($tree);
            });
        }
    }
});
// 自定义指令: 员工的部门树
app.directive('stafftree', function ($location) {
    return {
        require: '?ngModel', // ?ngModel
        replace: true,
        restrict: 'E',
        template: '<div class="tree"><div class="search-none-div" ng-show="isLoding">正在查询中...</div> </div>',
        scope: {
            textFormatter: '=',
            data: '='
        },
        link: function ($scope, element, attributes, ngModel, textFormat) {
            var NODE = "tree-node";
            var textField = attributes["text"],
                textFormatter = $scope.textFormatter;
            var dataSource = attributes["data"];
            var isSingleSelect = attributes.hasOwnProperty('singleSelect'), // 优先
                isCheck = attributes.hasOwnProperty('checkable');
            function clearSel() {
                var $old = element.find("li.active");
                $old.removeClass('active');
            }

            if ((isSingleSelect || isCheck) && ngModel) {
                if (isSingleSelect) {
                    ngModel.$render = function () {
                        var val = ngModel.$viewValue;
                        clearSel();
                        if (val) {
                            var $li = element.find('li[node-id="' + val.ORG_CODE + '"]');
                            $li.addClass("active");
                        }
                    }
                }
            }

            //当前点击的li
            element.on('click', 'li', function (e) {
                if (e.isDefaultPrevented()) return
                e.preventDefault();

                if (isSingleSelect) {
                    clearSel();
                }
                var $ele = $(e.target);
                var $li = $ele.parent("li");
                if (isSingleSelect) {
                    $li.addClass("active");
                }


                if ((isSingleSelect || isCheck) && ngModel) {
                    var selected = $li.data(NODE);
                    $scope.$apply(function () {
                        ngModel.$setViewValue(selected);
                    })
                }

            })
            element.on('click', '.fa-click', function (e) {
                e.stopPropagation();
                var $ele = $(e.target);
                var $li = $ele.parent("li");
                if ($ele.hasClass("fa-folder-o")) {
                    $ele.removeClass("fa-folder-o");
                    $ele.addClass("fa-folder-open-o");
                } else {
                    $ele.removeClass("fa-folder-open-o");
                    $ele.addClass("fa-folder-o");
                }
                $li.children("ul").slideToggle(500);

            })

            $scope.$watch("data", function (newValue) {
                var treeData = newValue;
                if (!treeData) {
                    $scope.isLoding = true;
                    return;
                } else {
                    $scope.isLoding = false;
                }
                var first = true;
                function parseChildTree(level, trees) {
                    var $ul = $("<ul>"),
                        val;
                    if ((isSingleSelect || isCheck) && ngModel) {
                        val = ngModel.$viewValue
                    }

                    $ul.attr({
                        'data-level': level
                    })

                    trees.forEach(function (value) {
                        var text = textField ?
                            value[textField] : (textFormatter ? textFormatter(value) : ""),
                            $li = $("<li>"),
                            $i1 = $("<i>"),
                            $i2 = $("<i>"),
                            $i3 = $("<i>"),
                            $span = $("<span>");
                        $li.attr({
                            'node-id': value.ORG_CODE
                        });
                        $li.data("node", value);
                        $span.text(text || '');

                        $span.addClass('item');
                        $i1.addClass('fa fa-folder-o fa-click');
                        $i1.attr('title', '展开/折叠');
                        $i3.addClass('fa fa-folder-open-o fa-click');
                        $i3.attr('title', '展开/折叠');
                        $i2.addClass('fa fa-folder-open-o');
                        $li.append($span);

                        $li.data(NODE, value);
                        if (isSingleSelect) {
                            if (val && val.ORG_CODE == value.ORG_CODE) {
                                //$li.addClass('active');
                                $li.find("i").fadeToggle(300);
                            }
                        } else if (isCheck) {
                            $li.append(' <i class="check icon-check-empty"></i>');
                        }
                        // 判断是否还有子菜单
                        if (value.children && value.children.length > 0) {
                            if (first) {
                                $li.prepend($i3);
                                first = false;
                            } else {
                                $li.prepend($i1);
                            }
                            $li.append(parseChildTree(level + 1, value.children));
                        } else {
                            $li.prepend($i2);
                        }
                        $ul.append($li);
                    });
                    return $ul;
                }

                var $tree = parseChildTree(0, treeData);
                element.html($tree);
            });

        }
    }
});
// 自定义指令: 下拉框的树
app.directive('chosentree', function ($location) {
    return {
        require: '?ngModel', //?ngModel
        replace: true,
        restrict: 'E',
        template: '<input  class="chosen-tree">',
        link: function ($scope, element, attributes, ngModel) {
            var textField = attributes["text"];
            var format = attributes["format"];
            element.chosentree({
                "textField": textField
            })
            ngModel.$render = function () {
                var val = ngModel.$viewValue;
                element.val(val || '');
                //这边刷新会导致 chosen:update  导致$scope.$apply 重复了 
                element.chosentree('refresh');
            };
            function read() {
                var val = element.val();
                ngModel.$setViewValue(val);
            }


            element.on("chosen:update", function (event, selected) {
                element.chosentree("optionHide");
                var val = format ? selected[format] : selected;
                if (ngModel.$viewValue == val) {
                    //此时在$apply 内   是refresh 中
                } else {
                    $scope.$apply(function () {
                        ngModel.$setViewValue(val);
                    });
                }
            });

            var dataSource = attributes["data"];
            $scope.$watch(dataSource, function () {
                if (typeof (dataSource) === 'undefined') {
                    return;
                }

                var optionsTree = $scope[dataSource];
                if (!optionsTree) {
                    return;
                }
                element.chosentree('load', optionsTree);
            });
        }
    }
});
// 自定义指令: Home页面的轮播图 
app.directive('swiperImg', ["$interval", function ($interval) {
    return {
        restrict: 'E',
        replace: true,
        scope: { imgList: "=", tabList: "=", autoplay: "=" },
        template: '<div class="swiper-container"><ul class="swiper-wrapper" >' +
        '<li class="swiper-wrapper-items" ng-repeat="item in imgList" ng-class="{ imgActive : isSelImg(item) }"><img ng-src="{{item.src}}" /></li>' +
        '</ul><ul class="swiper-pagination"><li class="pagination-item" ng-repeat="item in tabList" ng-mouseover="hoverTab($index)" repeat-finish="repeatFinish()" ng-mouseleave="leaveTab($index)" ng-class="{ imgActive : isSelImg(item) }">{{ item.name }}</li></ul></div>',
        link: function ($scope, elem, attr) {
            var i = 0;
            var imgInterval;
            $scope.hoverTab = function (index) {
                $scope.hoverImg = index;
                $scope.isSelImg(index);
                i = index;
                $interval.cancel(imgInterval);
            }
            $scope.leaveTab = function (index) {
                imgInterval = $interval(function () {
                    i++;
                    if (i == $scope.imgList.length) {
                        i = 0;
                    }
                    $scope.hoverImg = i;
                    $scope.isSelImg(i);
                }, $scope.autoplay);
            }
            imgInterval = $interval(function () {
                i++;
                if (i == $scope.imgList.length) {
                    i = 0;
                }
                $scope.hoverImg = i;
                $scope.isSelImg(i);
            }, $scope.autoplay);
            $scope.isSelImg = function (item) {
                return $scope.hoverImg == item.id;
            }
            $scope.hoverImg = i;
            $scope.isSelImg(i);
            $scope.repeatFinish = function () {
                var length = $scope.tabList.length;
                var width = (100 / length).toFixed(3) + "%";
                $(".swiper-pagination").find("li").css({
                    "width": width
                })
            }
        }
    };
}]);

// 自定义指令: 基础信息的表单处理
app.directive('requestInfo', ["allService", "$rootScope", "myService", function (allService, $rootScope, myService) {
    return {
        restrict: 'E',
        replace: true,
        scope: { data: "=", requestId: "@", reGetData: "&" },
        templateUrl: '' + $rootScope.projectName + '/Scripts/app/jianshe/requestInfo.html',
        link: function ($scope, elem, attr) {
            $scope.requestDxList = ["请选择", "中国移动", "中国电信", "中国联通", "公安窄带"];
            $scope.levelList = ["请选择", "高", "中", "低", "非难点"];
            $scope.yearList = [];
            //$scope.cityList = ["请选择", "福州市", "厦门市", "宁德市", "莆田市", "泉州市", "漳州市", "龙岩市", "三明市", "南平市",];
            $scope.requestTypeList = [];
            $scope.overallProgressStateList = [];
            $scope.isOutputList = [];
            $scope.countryList = [{ Text: "请选择地市", Value: "%" }];
            $scope.country = $scope.countryList[0].Value;
            $scope.yearList = $rootScope.getYearList();
            var ddlsList = ["city", "ddls_hard_station", "ddls_request_type", "ddls_overall_progress_state","ddls_is_output"];
            angular.forEach(ddlsList, function (elt, index) {
                getSelectList(elt, "");
            })
            dataTimes();

            // 选择了地市
            $scope.selCity = function (data) {
                if (data == "%") {
                    $scope.countryList = [{ Text: "请选择地市", Value: "%" }];
                    $scope.country = $scope.countryList[0].Value;
                } else {
                    getSelectList("area", data);
                }
            }
            //保存
            $scope.save = function () {
                var requestId = $scope.requestId;
                var city = $scope.city;
                var country = $scope.country;
                var requestName = $scope.requestName;
                var integrationSuggest = $scope.integrationSuggest;
                var requestDx = $scope.requestDx;
                var longitude = $scope.longitude;
                var latitude = $scope.latitude;
                var difficultyLevel = $scope.difficultyLevel;
                var requestCreateTime = $scope.requestCreateTime;
                var belongPrjYear = $scope.belongPrjYear;
                var yyPrjStage = $scope.yyPrjStage;
                var requestType = $scope.requestType;
                var siteRequestAttribute1 = $scope.siteRequestAttribute1;
                var siteRequestAttribute2 = $scope.siteRequestAttribute2;
                var siteRequestAttribute3 = $scope.siteRequestAttribute3;
                var planFinishedTime = $scope.planFinishedTime;
                var overallProgressState = $scope.overallProgressState;
                var operatorRequestCode = $scope.operatorRequestCode;     
                var isOutput = $scope.isOutput;
                /*
                if (requestType == null || !operatorRequestCode || !siteRequestAttribute1 || !siteRequestAttribute2 || !siteRequestAttribute3 || overallProgressState == "请选择" || isOutput == "请选择" || !requestId || !country || city == "请选择" || !requestName || !integrationSuggest || requestDx == "请选择" || !longitude || !latitude
                    || overallProgressState == "请选择" || difficultyLevel == "请选择" || requestType == "请选择" || !requestCreateTime || belongPrjYear == "请选择" || !yyPrjStage || !planFinishedTime) {
                    layer.msg("请填写完整");
                    return;
                }
                */
                var postData = $.param($.extend({ 'requestId': requestId }, { 'country': country }, { 'city': city }, { 'requestName': requestName },
                    { 'integrationSuggest': integrationSuggest }, { 'requestDx': requestDx }, { 'longitude': longitude }, { 'latitude': latitude },
                    { 'difficultyLevel': difficultyLevel }, { 'requestCreateTime': requestCreateTime },{ 'belongPrjYear': belongPrjYear },
                    { 'yyPrjStage': yyPrjStage }, { 'requestType': requestType }, { 'siteRequestAttribute1': siteRequestAttribute1 }, { 'siteRequestAttribute2': siteRequestAttribute2 }, { 'siteRequestAttribute3': siteRequestAttribute3 }, { 'overallProgressState': overallProgressState }, { 'isOutput': isOutput }, { 'operatorRequestCode': operatorRequestCode }, { 'planFinishedTime': planFinishedTime}));
                var url = "" + $rootScope.projectName + "/RequestInfo/updateRequestInfo";
                var state = myService.addOrEdit(url, postData);
                if (state) {
                    $scope.reGetData();
                }
            }

            // 监听数据
            $scope.$watch("data", function (newValue) {
                var data = newValue;
                if (!data) {
                    return;
                }
                if (data.REQUEST_CREATE_TIME != null) {
                    $scope.requestCreateTime = getFormatDateByLong(data.REQUEST_CREATE_TIME, "yyyy-MM-dd");
                } else {
                    $scope.requestCreateTime = "";
                }
                $scope.city = data.CITY;
                $scope.country = data.COUNTRY;
                $scope.requestName = data.REQUEST_NAME;
                $scope.integrationSuggest = data.INTEGRATION_SUGGEST;
                $scope.requestDx = data.REQUEST_DX;
                $scope.longitude = data.LONGITUDE;
                $scope.latitude = data.LATITUDE;
                $scope.difficultyLevel = data.DIFFICULTY_LEVEL;
                $scope.belongPrjYear = data.BELONG_PRJ_YEAR;
                $scope.yyPrjStage = data.YY_PRJ_STAGE;
                $scope.requestType = data.REQUEST_TYPE;
                $scope.siteRequestAttribute1 = data.SITE_REQUEST_ATTRIBUTE1;
                $scope.siteRequestAttribute2 = data.SITE_REQUEST_ATTRIBUTE2;
                $scope.siteRequestAttribute3 = data.SITE_REQUEST_ATTRIBUTE3;
                $scope.overallProgressState = data.OVERALL_PROGRESS_STATE;
                $scope.isOutput = data.IS_OUTPUT;
                $scope.operatorRequestCode = data.OPERATOR_REQUEST_CODE;
                if (data.PLAN_FINISHED_TIME != null) {
                    $scope.planFinishedTime = getFormatDateByLong(data.PLAN_FINISHED_TIME, "yyyy-MM-dd");
                } else {
                    $scope.planFinishedTime = "";
                }
            })

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

            // 获取下拉列表
            function getSelectList(fieldId, cityName) {
                var postData = $.param($.extend({ "fieldId": fieldId }, { "cityName": cityName }));
                allService.getSelectList(postData).then(function successCallback(response) {
                    var resp = response.data;
                    if (resp.ErrCode == "200") {
                        var data = resp.Data;
                        if (fieldId == "city") {
                            $scope.cityList = data;
                            if (!$scope.city) $scope.city = data[0].Value;
                            if ($scope.city && $scope.city != "%") {
                                getSelectList("area", $scope.city);
                            }
                        } else if (fieldId == "area") {
                            $scope.countryList = data;
                            if (!$scope.country || $scope.country == "%") $scope.country = data[0].Value;
                        } else if (fieldId == "ddls_hard_station") {
                            $scope.levelList = data;
                            if (!$scope.difficultyLevel) $scope.difficultyLevel = data[0].Value;
                        } else if (fieldId == "ddls_request_type"){
                            $scope.requestTypeList = data;
                            if (!$scope.requestType) $scope.requestType = data[0].Value;
                        } else if (fieldId == "ddls_overall_progress_state"){
                            $scope.overallProgressStateList = data;
                            if (!$scope.overallProgressState) $scope.overallProgressState = data[0].Value;
                        } else if (fieldId == "ddls_is_output") {
                            $scope.isOutputList = data;
                            if (!$scope.isOutput) $scope.isOutput = data[0].Value;
                        }
                    } else {
                        layer.msg(resp.ErrMsg);
                    }
                }, function errorCallback(status) {
                });
            }
        }
    }
}])

// 自定义指令: 谈点阶段的表单处理
app.directive('requestTalk', ["allService", "$rootScope", "myService", function (allService, $rootScope, myService) {
    return {
        restrict: 'E',
        replace: true,
        scope: { data: "=", requestId: "@" },
        templateUrl: "" + $rootScope.projectName + "/Scripts/app/jianshe/requestTalk.html",
        link: function ($scope, elem, attr) {
            dataTimes();
            var ddlsList = ["ddls_talk_duty", "ddls_selected_address", "ddl_site_selection", "ddls_talk_schedule","ddls_if_contract"];
            angular.forEach(ddlsList, function (elt, index) {
                getSelectList(elt);
            });
            //保存
            $scope.save = function () {
                var requestId = $scope.requestId;
                var talkDutyUnit = $scope.talkDutyUnit;
                var talkAddrStaff = $scope.talkAddrStaff;
                var talkAddrStaffTel = $scope.talkAddrStaffTel;
                var talkDate = $scope.talkDate;
                var stationTalkExplain = $scope.stationTalkExplain;
                var talkSelectionSite = $scope.talkSelectionSite;
                var selectionLate = $scope.selectionLate;
                var selectionNolate = $scope.selectionNolate;
                var selectionContractCode = $scope.selectionContractCode;
                var selectionContractName = $scope.selectionContractName;
                var selectionBillType = $scope.selectionBillType;
                var ifContract = $scope.ifContract;
                var stationRentYear = $scope.stationRentYear;
                var selectionChannel = $scope.selectionChannel;
                var siteSelectionAward = $scope.siteSelectionAward;
                var disposablePayRent = $scope.disposablePayRent;
                var locationFeePayment = $scope.locationFeePayment;
                var talkSchedule = $scope.talkSchedule;
                var aseAgreementCode = $scope.aseAgreementCode;
                /*
                if (talkDate) {
                    if (!requestId || !talkDutyUnit || !talkAddrStaff || !talkAddrStaffTel || !talkDate || !stationTalkExplain || !talkSelectionSite
                        || !selectionLate || !selectionNolate || !selectionContractCode || !selectionContractName || !selectionBillType || !ifContract || !selectionChannel || !siteSelectionAward || !locationFeePayment || talkSchedule == '请选择' || !aseAgreementCode ) {
                        layer.msg("请填写完整");
                        return;
                    }
                    if (!disposablePayRent && !stationRentYear) {
                        layer.msg("必须填写场地年租金(元/年)字段或者一次性场租赔补字段");
                        return;
                    }
                    if (disposablePayRent && stationRentYear) {
                        layer.msg("不可以同时填写场地年租金(元/年)字段和一次性场租赔补字段");
                        return;
                    }
                }
                */

                var postData = $.param($.extend({ 'requestId': requestId }, { 'talkDutyUnit': talkDutyUnit }, { 'talkAddrStaff': talkAddrStaff }, { 'talkAddrStaffTel': talkAddrStaffTel },
                    { 'talkDate': talkDate }, { 'stationTalkExplain': stationTalkExplain }, { 'talkSelectionSite': talkSelectionSite },
                    { 'selectionLate': selectionLate }, { 'selectionNolate': selectionNolate }, { 'selectionContractCode': selectionContractCode },
                    { 'selectionContractName': selectionContractName }, { 'selectionBillType': selectionBillType }, { 'ifContract': ifContract },
                    { 'stationRentYear': stationRentYear }, { 'selectionChannel': selectionChannel }, { 'siteSelectionAward': siteSelectionAward }, { 'disposablePayRent': disposablePayRent }, { 'locationFeePayment': locationFeePayment }, { 'talkSchedule': talkSchedule }, { 'aseAgreementCode': aseAgreementCode}));
                var url = "" + $rootScope.projectName + "/RequestTalk/addOrUpdateRequestInfo";
                myService.addOrEdit(url, postData);
            }

            // 监听数据
            $scope.$watch("data", function (newValue) {
                var data = newValue;
                if (!data) {
                    return;
                }
                if (data.TALK_DATE) data.TALK_DATE = $rootScope.getTimeStamp(data.TALK_DATE, false);
                if (data.TALK_DUTY_UNIT) $scope.talkDutyUnit = data.TALK_DUTY_UNIT;
                if (data.TALK_ADDR_STAFF) $scope.talkAddrStaff = data.TALK_ADDR_STAFF;
                if (data.TALK_ADDR_STAFF_TEL) $scope.talkAddrStaffTel = data.TALK_ADDR_STAFF_TEL;
                if (data.TALK_DATE) $scope.talkDate = data.TALK_DATE;
                if (data.STATION_TALK_EXPLAIN) $scope.stationTalkExplain = data.STATION_TALK_EXPLAIN;
                if (data.TALK_SELECTION_SITE) $scope.talkSelectionSite = data.TALK_SELECTION_SITE;
                if (data.SELECTION_LATE) $scope.selectionLate = data.SELECTION_LATE;
                if (data.SELECTION_NOLATE) $scope.selectionNolate = data.SELECTION_NOLATE;
                if (data.SELECTION_CONTRACT_CODE) $scope.selectionContractCode = data.SELECTION_CONTRACT_CODE;
                if (data.SELECTION_CONTRACT_NAME) $scope.selectionContractName = data.SELECTION_CONTRACT_NAME;
                if (data.SELECTION_BILL_TYPE) $scope.selectionBillType = data.SELECTION_BILL_TYPE;
                if (data.IF_CONTRACT) $scope.ifContract = data.IF_CONTRACT;
                if (data.STATION_RENT_YEAR) $scope.stationRentYear = data.STATION_RENT_YEAR;
                if (data.SELECTION_CHANNEL) $scope.selectionChannel = data.SELECTION_CHANNEL;
                if (data.SITE_SELECTION_AWARD) $scope.siteSelectionAward = data.SITE_SELECTION_AWARD;
                if (data.DISPOSABLE_PAY_RENT) $scope.disposablePayRent = data.DISPOSABLE_PAY_RENT;
                if (data.LOCATION_FEE_PAYMENT) $scope.locationFeePayment = data.LOCATION_FEE_PAYMENT;
                if (data.TALK_SCHEDULE) $scope.talkSchedule = data.TALK_SCHEDULE;
                if (data.ASE_AGREEMENT_CODE) $scope.aseAgreementCode = data.ASE_AGREEMENT_CODE;
            })

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
            // 获取下拉列表
            function getSelectList(fieldId) {
                var postData = $.param($.extend({ "fieldId": fieldId }, { "talkDutyUnit": "" }));
                allService.getSelectList(postData).then(function successCallback(response) {
                    var resp = response.data;
                    if (resp.ErrCode == "200") {
                        var data = resp.Data;
                        if (data.length > 0) {
                            if (fieldId == "ddls_talk_duty") {
                                $scope.talkDutyUnitList = data;
                                if (!$scope.talkDutyUnit) $scope.talkDutyUnit = data[0].Value;
                            } else if (fieldId == "ddls_selected_address") {
                                $scope.selectionBillTypeList = data;
                                if (!$scope.selectionBillType) $scope.selectionBillType = data[0].Value;
                            } else if (fieldId == "ddl_site_selection") {
                                $scope.selectionChannelList = data;
                                if (!$scope.selectionChannel) $scope.selectionChannel = data[0].Value;
                            } else if (fieldId == "ddls_talk_schedule") {
                                $scope.talkScheduleList = data;
                                if (!$scope.talkSchedule) $scope.talkSchedule = data[0].Value;
                            } else if (fieldId == "ddls_if_contract") {
                                $scope.ifContractList = data;
                                if (!$scope.ifContract) $scope.ifContract = data[0].Value;
                            }
                        }
                    } else {
                        layer.msg(resp.ErrMsg);
                    }
                }, function errorCallback(status) {
                });
            }
        }
    }
}])

// 自定义指令: 设计阶段的表单处理
app.directive('requestDesign', ["allService", "$rootScope", "myService", function (allService, $rootScope, myService) {
    return {
        restrict: 'E',
        replace: true,
        scope: { data: "=", requestId: "@" },
        templateUrl: "" + $rootScope.projectName + "/Scripts/app/jianshe/requestDesign.html",
        link: function ($scope, elem, attr) {
            dataTimes();
            var ddlsList = ["ddls_construction_mode", "ddls_ck_tower_xf_type", "ddls_ck_column_foot_type", "ddls_is_need_ldk", "ddls_ck_room_type", "ddls_elec_lead_way", "ddls_is_need_elec_design", "ddls_overproof_elec_approval", "ddls_is_check_sdzj_operator","ddls_prj_type"];
            angular.forEach(ddlsList, function (elt, index) {
                getSelectList(elt);
            });
            var ddlsList2 = ["ddl_ck_design_unit", "ddls_dk_design_institute","ddls_elec_design_institute" ];
            angular.forEach(ddlsList2, function (elt, index) {
                getSelectListByUser(elt);
            });

            // 选择初勘日期
            $scope.selCkDate = function () {
                if ($scope.ckDate) {
                    $(".chutu-date").datetimepicker({
                        format: 'Y-m-d',
                        timepicker: false,
                        timepickerScrollbar: false,
                        scrollMonth: false,
                        scrollTime: false,
                        scrollInput: false,
                        minDate: "" + $scope.ckDate + ""
                    });
                }
            }
            // 选择出图日期
            $scope.selCtDate = function () {
                if ($scope.ctDate) {
                    $(".huishen-date").datetimepicker({
                        format: 'Y-m-d',
                        timepicker: false,
                        timepickerScrollbar: false,
                        scrollMonth: false,
                        scrollTime: false,
                        scrollInput: false,
                        minDate: "" + $scope.ctDate + ""
                    });
                    $(".chukan-date").datetimepicker({
                        format: 'Y-m-d',
                        timepicker: false,
                        timepickerScrollbar: false,
                        scrollMonth: false,
                        scrollTime: false,
                        scrollInput: false,
                        maxDate: "" + $scope.ctDate + ""
                    });
                }
            }
            // 选择会审日期
            $scope.selHsDate = function () {
                if ($scope.hsDate) {
                    $(".chutu-date").datetimepicker({
                        format: 'Y-m-d',
                        timepicker: false,
                        timepickerScrollbar: false,
                        scrollMonth: false,
                        scrollTime: false,
                        scrollInput: false,
                        maxDate: "" + $scope.hsDate + ""
                    });
                }
            }

            //保存
            $scope.save = function () {
                var requestId = $scope.requestId;
                var buildType = $scope.buildType;
                var ckDesginUnit = $scope.ckDesginUnit;
                var ckDate = $scope.ckDate;
                var longitude = $scope.longitude;
                var latitude = $scope.latitude;
                var address = $scope.address;
                var ckTowerDetailType = $scope.ckTowerDetailType;
                var towerDetailType = $scope.towerDetailType;
                var towerDetailTypeDesc = $scope.towerDetailTypeDesc;
                var ckColumnFootType = $scope.ckColumnFootType;
                var ckColumnFootTypeDesc = $scope.ckColumnFootTypeDesc;
                var isNeedLdk = $scope.isNeedLdk;
                var dkDesignInstitute = $scope.dkDesignInstitute;
                var dkTimes = $scope.dkTimes;
                var ckRoomType = $scope.ckRoomType;
                var ckRoomTypeDesc = $scope.ckRoomTypeDesc;
                var ckPowerSsDesc = $scope.ckPowerSsDesc;
                var windPressure = $scope.windPressure;
                var designWindPressure = $scope.designWindPressure;
                var antennaHeight = $scope.antennaHeight;
                var antennaNum = $scope.antennaNum;
                var antennaSizeModelDesc = $scope.antennaSizeModelDesc;
                var elecLeadWay = $scope.elecLeadWay;
                var isNeedElecDesign = $scope.isNeedElecDesign;
                var elecDesignInstitute = $scope.elecDesignInstitute;
                var elecRouteWayDesc = $scope.elecRouteWayDesc;
                var elecTimatePay = $scope.elecTimatePay;
                var overproofElecApproval = $scope.overproofElecApproval;
                var isCheckSdzjOperator = $scope.isCheckSdzjOperator;
                var buildContent = $scope.buildContent;
                var requestCode = $scope.requestCode;
                var prjDate = $scope.prjDate;
                var prjType = $scope.prjType;
                var prjCode = $scope.prjCode;
                var prjName = $scope.prjName;
                var prjStationCode = $scope.prjStationCode;
                var ctDate = $scope.ctDate;
                var hsDate = $scope.hsDate;
                var hsSuggest = $scope.hsSuggest;
                var newTowerHeight = $scope.newTowerHeight;
                if (ckDate) {
                    var ckDateStamp = Date.parse($scope.ckDate);
                    var ctDateStamp = Date.parse($scope.ctDate);
                    var hsDateStamp = Date.parse($scope.hsDate);
                    if (hsDateStamp < ctDateStamp || ctDateStamp < ckDateStamp || hsDateStamp < ckDateStamp) {
                        layer.msg("初勘日期 <= 出图日期 <= 会审日期");
                        return;
                    }
                    /*
                    if (!requestId || !buildType || !ckDesginUnit || !ckDate || !ckTowerType || !ckTowerDetailType || !ckRoomType || !ckResult || !longitude || !latitude
                        || !buildContent || !address || !towerDetailType || !cabinetType || !backupPowerType || !windPressure || !designWindPressure || !antennaHeight
                        || !antennaNum || isNeedElecDesign == '请选择' || elecDesignInstitute == '请选择'
                        || elecLeadWay == '请选择' || !elecTimatePay || isCheckSdzjOperator == '请选择'
                        || dkDesignInstitute == '请选择' || isNeedLdk == '请选择' || !dkTimes) {
                        layer.msg("请填写完整");
                        return;
                    }
                    
                    if (!ctDate) ctDate = "";
                    if (!hsDate) hsDate = "";
                    if (!prjType) prjType = "";
                    if (!prjDate) prjDate = "";
                    if (!prjName) prjName = "";
                    if (!requestCode) requestCode = "";
                    if (!prjStationCode) prjStationCode = "";
                    if (!prjCode) prjCode = "";
                    */
                }

                var postData = $.param($.extend({ 'requestId': requestId }, { 'buildType': buildType }, { 'ckDesginUnit': ckDesginUnit }, { 'ckDate': ckDate },
                    { 'longitude': longitude }, { 'latitude': latitude }, { 'address': address }, { 'ckTowerDetailType': ckTowerDetailType }, { 'towerDetailTypeDesc': towerDetailTypeDesc},
                    { 'ckColumnFootType': ckColumnFootType }, { 'ckColumnFootTypeDesc': ckColumnFootTypeDesc }, { 'isNeedLdk': isNeedLdk },
                    { 'dkDesignInstitute': dkDesignInstitute }, { 'dkTimes': dkTimes }, { 'ckRoomType': ckRoomType }, { 'ckRoomTypeDesc': ckRoomTypeDesc },
                    { 'ckPowerSsDesc': ckPowerSsDesc }, { 'windPressure': windPressure }, { 'designWindPressure': designWindPressure }, { 'antennaHeight': antennaHeight }, { 'antennaNum': antennaNum }, 
                    { 'antennaSizeModelDesc': antennaSizeModelDesc }, { 'elecLeadWay': elecLeadWay },
                    { 'isNeedElecDesign': isNeedElecDesign }, { 'elecDesignInstitute': elecDesignInstitute },
                    { 'elecRouteWayDesc': elecRouteWayDesc }, { 'elecTimatePay': elecTimatePay },
                    { 'overproofElecApproval': overproofElecApproval }, { 'isCheckSdzjOperator': isCheckSdzjOperator }, { 'requestCode': requestCode },
                    { 'buildContent': buildContent }, { 'prjType': prjType }, { 'prjDate': prjDate }, { 'prjCode': prjCode },
                    { 'prjName': prjName }, { 'prjStationCode': prjStationCode }, { 'ctDate': ctDate }, { 'hsDate': hsDate }, 
                    { 'hsSuggest': hsSuggest }, { 'newTowerHeight': newTowerHeight} ));
                var url = "" + $rootScope.projectName + "/RequestDesign/addOrUpdateRequestDesign";
                myService.addOrEdit(url, postData);
            }

            // 监听数据
            $scope.$watch("data", function (newValue) {
                var data = newValue;
                if (!data) {
                    return;
                }
                if (data.BUILD_TYPE) $scope.buildType = data.BUILD_TYPE;
                if (data.CK_DESGIN_UNIT) $scope.ckDesginUnit = data.CK_DESGIN_UNIT;
                if (data.CK_DATE) $scope.ckDate = data.CK_DATE;
                if (data.LONGITUDE) $scope.longitude = data.LONGITUDE;
                if (data.LATITUDE) $scope.latitude = data.LATITUDE;
                if (data.ADDRESS) $scope.address = data.ADDRESS;
                if (data.CK_TOWER_DETAIL_TYPE) $scope.ckTowerDetailType = data.CK_TOWER_DETAIL_TYPE;
                if (data.TOWER_DETAIL_TYPE_DESC) $scope.towerDetailTypeDesc = data.TOWER_DETAIL_TYPE_DESC;
                if (data.CK_COLUMN_FOOT_TYPE) $scope.ckColumnFootType = data.CK_COLUMN_FOOT_TYPE;
                if (data.CK_COLUMN_FOOT_TYPE_DESC) $scope.ckColumnFootTypeDesc = data.CK_COLUMN_FOOT_TYPE_DESC;
                if (data.IS_NEED_LDK) $scope.isNeedLdk = data.IS_NEED_LDK;
                if (data.DK_DESIGN_INSTITUTE) $scope.dkDesignInstitute = data.DK_DESIGN_INSTITUTE;
                if (data.DK_TIMES) $scope.dkTimes = data.DK_TIMES;
                if (data.CK_ROOM_TYPE) $scope.ckRoomType = data.CK_ROOM_TYPE;
                if (data.CK_ROOM_TYPE_DESC) $scope.ckRoomTypeDesc = data.CK_ROOM_TYPE_DESC;
                if (data.CK_POWER_SS_DESC) $scope.ckPowerSsDesc = data.CK_POWER_SS_DESC;
                if (data.WIND_PRESSURE) $scope.windPressure = data.WIND_PRESSURE;
                if (data.DESIGN_WIND_PRESSURE) $scope.designWindPressure = data.DESIGN_WIND_PRESSURE;
                if (data.ANTENNA_HEIGHT) $scope.antennaHeight = data.ANTENNA_HEIGHT;
                if (data.ANTENNA_NUM) $scope.antennaNum = data.ANTENNA_NUM;
                if (data.ANTENNA_SIZE_MODEL_DESC) $scope.antennaSizeModelDesc = data.ANTENNA_SIZE_MODEL_DESC;
                if (data.ELEC_LEAD_WAY) $scope.elecLeadWay = data.ELEC_LEAD_WAY;
                if (data.IS_NEED_ELEC_DESIGN) $scope.isNeedElecDesign = data.IS_NEED_ELEC_DESIGN;
                if (data.ELEC_DESIGN_INSTITUTE) $scope.elecDesignInstitute = data.ELEC_DESIGN_INSTITUTE;
                if (data.ELEC_ROUTE_WAY_DESC) $scope.elecRouteWayDesc = data.ELEC_ROUTE_WAY_DESC;
                if (data.ELEC_TIMATE_PAY) $scope.elecTimatePay = data.ELEC_TIMATE_PAY;
                if (data.OVERPROOF_ELEC_APPROVAL) $scope.overproofElecApproval = data.OVERPROOF_ELEC_APPROVAL;
                if (data.IS_CHECK_SDZJ_OPERATOR) $scope.isCheckSdzjOperator = data.IS_CHECK_SDZJ_OPERATOR;
                if (data.BUILD_CONTENT) $scope.buildContent = data.BUILD_CONTENT;
                if (data.REQUEST_CODE) $scope.requestCode = data.REQUEST_CODE;
                if (data.PRJ_TYPE) $scope.prjType = data.PRJ_TYPE;
                if (data.PRJ_DATE) $scope.prjDate = data.PRJ_DATE;
                if (data.PRJ_NAME) $scope.prjName = data.PRJ_NAME;
                if (data.PRJ_STATION_CODE) $scope.prjStationCode = data.PRJ_STATION_CODE;
                if (data.PRJ_CODE) $scope.prjCode = data.PRJ_CODE;
                if (data.CT_DATE) $scope.ctDate = data.CT_DATE;
                if (data.HS_DATE) $scope.hsDate = data.HS_DATE;
                if (data.HS_SUGGEST) $scope.hsSuggest = data.HS_SUGGEST;
                if (data.NEW_TOWER_HEIGHT) $scope.newTowerHeight = data.NEW_TOWER_HEIGHT;
                /*
                if (data.CK_DATE) data.CK_DATE = $rootScope.getTimeStamp(data.CK_DATE, false);
                if (data.CT_DATE) data.CT_DATE = $rootScope.getTimeStamp(data.CT_DATE, false);
                if (data.HS_DATE) data.HS_DATE = $rootScope.getTimeStamp(data.HS_DATE, false);
                */
            })

            // 时间
            function dataTimes() {
                $.datetimepicker.setLocale('ch');
                $(".chukan-date").datetimepicker({
                    format: 'Y-m-d',
                    timepicker: false,
                    timepickerScrollbar: false,
                    scrollMonth: false,
                    scrollTime: false,
                    scrollInput: false
                });
            }
            // 获取下拉列表
            function getSelectList(fieldId) {
                var postData = $.param($.extend({ "fieldId": fieldId }, { "talkDutyUnit": "" }));
                allService.getSelectList(postData).then(function successCallback(response) {
                    var resp = response.data;
                    if (resp.ErrCode == "200") {
                        var data = resp.Data;
                        if (data.length > 0) {
                            if (fieldId == "ddls_ck_tower_xf_type") {
                                $scope.ckTowerDetailTypeList = data;
                                if (!$scope.ckTowerDetailType) $scope.ckTowerDetailType = data[0].Value;
                            } else if (fieldId == "ddls_ck_room_type") {
                                $scope.ckRoomTypeList = data;
                                if (!$scope.ckRoomType) $scope.ckRoomType = data[0].Value;
                            } else if (fieldId == "ddls_construction_mode") {
                                $scope.buildTypeList = data;
                                if (!$scope.buildType) $scope.buildType = data[0].Value;
                            } else if (fieldId == "ddls_is_need_elec_design") {
                                $scope.isNeedElecDesignList = data;
                                if (!$scope.isNeedElecDesign) $scope.isNeedElecDesign = data[0].Value;
                            } else if (fieldId == "ddls_elec_lead_way") {
                                $scope.elecLeadWayList = data;
                                if (!$scope.elecLeadWay) $scope.elecLeadWay = data[0].Value;
                            } else if (fieldId == "ddls_is_check_sdzj_operator") {
                                $scope.isCheckSdzjOperatorList = data;
                                if (!$scope.isCheckSdzjOperator) $scope.isCheckSdzjOperator = data[0].Value;
                            } else if (fieldId == "ddls_is_need_ldk") {
                                $scope.isNeedLdkList = data;
                                if (!$scope.isNeedLdk) $scope.isNeedLdk = data[0].Value;
                            } else if (fieldId == "ddls_ck_column_foot_type") {
                                $scope.ckColumnFootTypeList = data;
                                if (!$scope.ckColumnFootType) $scope.ckColumnFootType = data[0].Value;
                            } else if (fieldId == "ddls_overproof_elec_approval") {
                                $scope.overproofElecApprovalList = data;
                                if (!$scope.overproofElecApproval) $scope.overproofElecApproval = data[0].Value;
                            } else if (fieldId == "ddls_prj_type") {
                                $scope.prjTypeList = data;
                                if (!$scope.prjType) $scope.prjType = data[0].Value;
                            }
                            
                        }
                    } else {
                        layer.msg(resp.ErrMsg);
                    }
                }, function errorCallback(status) {
                });
            }

            // 获取下拉列表
            function getSelectListByUser(fieldId) {
                var postData = $.param($.extend({ "fieldId": fieldId }, { "talkDutyUnit": "" }));
                allService.getSelectListByOrgan(postData).then(function successCallback(response) {
                    var resp = response.data;
                    if (resp.ErrCode == "200") {
                        var data = resp.Data;
                        if (data.length > 0) {
                            if (fieldId == "ddl_ck_design_unit") {
                                $scope.ckDesginUnitList = data;
                                if (!$scope.ckDesginUnit) $scope.ckDesginUnit = data[0].Value;
                            } else if (fieldId == "ddls_elec_design_institute") {
                                $scope.elecDesignInstituteList = data;
                                if (!$scope.elecDesignInstitute) $scope.elecDesignInstitute = data[0].Value;
                            } else if (fieldId == "ddls_dk_design_institute") {
                                $scope.dkDesignInstituteList = data;
                                if (!$scope.dkDesignInstitute) $scope.dkDesignInstitute = data[0].Value;
                            }
                        }
                    } else {
                        layer.msg(resp.ErrMsg);
                    }
                }, function errorCallback(status) {
                });
            }
        }
    }
}])


// 自定义指令: 施工阶段的表单处理
app.directive('requestBuild', ["allService", "$rootScope", "myService", function (allService, $rootScope, myService) {
    return {
        restrict: 'E',
        replace: true,
        scope: { data: "=", requestId: "@" },
        templateUrl: "" + $rootScope.projectName + "/Scripts/app/jianshe/requestBuild.html",
        link: function ($scope, elem, attr) {
            dataTimes();
            var ddlsList = ["ddls_jl_entrust_unit", "ddls_tj_depute_unit", "ddls_tj_build_unit", "ddls_gt_depute_unit", "ddls_gt_builder", "ddls_pt_depute_unit", "ddls_pt_builder", "ddls_pw_depute_unit", "ddls_pw_builder", "ddls_elec_design_unit", "ddls_elec_supervision_unit", "ddls_fsu_entrust_vender", "ddls_fsu_build_factory"];
            angular.forEach(ddlsList, function (elt, index) {
                getSelectListByUser(elt);
            })
            var ddlsList2 = ["ddls_build_state", "ddls_is_delivered_gt", "ddls_is_finished_pt", "ddls_is_checked_cost", "ddls_is_add_transformer", "ddls_is_pick_fsu"];
            angular.forEach(ddlsList2, function (elt, index) {
                getSelectList(elt);
            })
            // 完工日期选择
            /*
            $scope.selEndDate = function () {
                if ($scope.endDate) {
                    $scope.buildState = "已完成";
                }
            }
            */
            //保存
            $scope.save = function () {
                var requestId = $scope.requestId;
                var buildState = $scope.buildState;
                var jlEntrustUnit = $scope.jlEntrustUnit;
                var prjWholePlanFinishedTime = $scope.prjWholePlanFinishedTime;
                var startDate = $scope.startDate;
                var endDate = $scope.endDate;
                var notStartRemark = $scope.notStartRemark;
                var tjDeputeUnit = $scope.tjDeputeUnit;
                var tjBuilder = $scope.tjBuilder;
                var tjDeputeDate = $scope.tjDeputeDate;
                var tjPlanFinishTime = $scope.tjPlanFinishTime;
                var tjEndDate = $scope.tjEndDate;
                var tjCompsPay = $scope.tjCompsPay;
                var tjCompsReason = $scope.tjCompsReason;
                var gtDeputeUnit = $scope.gtDeputeUnit;
                var gtBuilder = $scope.gtBuilder;
                var gtDeputeDate = $scope.gtDeputeDate;
                var gtPlanFinishTime = $scope.gtPlanFinishTime;
                var gtEndDate = $scope.gtEndDate;
                var gtCompsPay = $scope.gtCompsPay;
                var gtCompsReason = $scope.gtCompsReason;
                var isDeliveredGt = $scope.isDeliveredGt;
                var ptDeputeUnit = $scope.ptDeputeUnit;
                var ptBuilder = $scope.ptBuilder;
                var ptDeputeDate = $scope.ptDeputeDate;
                var ptPlanFinishTime = $scope.ptPlanFinishTime;
                var ptEndDate = $scope.ptEndDate;
                var ptCompsPay = $scope.ptCompsPay;
                var ptCompsReason = $scope.ptCompsReason;
                var isFinishedPt = $scope.isFinishedPt;
                var pwDeputeUnit = $scope.pwDeputeUnit;
                var pwBuilder = $scope.pwBuilder;
                var pwDeputeDate = $scope.pwDeputeDate;
                var pwPlanFinishTime = $scope.pwPlanFinishTime;
                var pwEndDate = $scope.pwEndDate;
                var pwCompsPay = $scope.pwCompsPay;
                var pwCompsReason = $scope.pwCompsReason;
                var elecDesignUnit = $scope.elecDesignUnit;
                var elecSupervisionUnit = $scope.elecSupervisionUnit;
                var actualElecBuildWay = $scope.actualElecBuildWay;
                var elecSettlementPrice = $scope.elecSettlementPrice;
                var isCheckedCost = $scope.isCheckedCost;
                var addElecSupportMeter = $scope.addElecSupportMeter;
                var isAddTransformer = $scope.isAddTransformer;
                var transformerCapacity = $scope.transformerCapacity;
                var transformerBudgetCost = $scope.transformerBudgetCost;
                var fsuEntrustVender = $scope.fsuEntrustVender;
                var fsuBuildFactory = $scope.fsuBuildFactory;
                var fsuInstallTime = $scope.fsuInstallTime;
                var fsuPlanFinishTime = $scope.fsuPlanFinishTime;
                var fsuFinishedTime = $scope.fsuFinishedTime;
                var isPickFsu = $scope.isPickFsu;
                /*
                if (endDate) {
                    if (!requestId || !startDate || !notStartRemark || !tjDeputeDate || !tjEndDate || !tjBuilder || !gtDeputeDate || !gtEndDate
                        || !gtBuilder || !powerType || !meterId || !pwDeputeDate || !pwEndDate || !pwBuilder || !ptDeputeDate || !ptEndDate || !ptBuilder || !buildState || !endDate || !elecCostPrediction || !buildCostIsCheck || !fsuEntrustVender || !fsuInstallTime || !fsuFinishedTime) {
                        layer.msg("请填写完整");
                        return;
                    }
                    buildState = "已完成";
                }
                */
                var postData = $.param($.extend({ 'requestId': requestId }, { 'buildState': buildState},
                    { 'jlEntrustUnit': jlEntrustUnit }, { 'prjWholePlanFinishedTime': prjWholePlanFinishedTime },
                    { 'startDate': startDate }, { 'endDate': endDate }, { 'notStartRemark': notStartRemark },
                    { 'tjDeputeUnit': tjDeputeUnit }, { 'tjBuilder': tjBuilder }, { 'tjDeputeDate': tjDeputeDate},
                    { 'tjPlanFinishTime': tjPlanFinishTime }, { 'tjEndDate': tjEndDate },
                    { 'tjCompsPay': tjCompsPay }, { 'tjCompsReason': tjCompsReason },
                    { 'gtDeputeUnit': gtDeputeUnit }, { 'gtBuilder': gtBuilder },
                    { 'gtDeputeDate': gtDeputeDate }, { 'gtPlanFinishTime': gtPlanFinishTime },
                    { 'gtEndDate': gtEndDate }, { 'gtCompsPay': gtCompsPay },
                    { 'gtCompsReason': gtCompsReason }, { 'isDeliveredGt': isDeliveredGt },
                    { 'ptDeputeUnit': ptDeputeUnit }, { 'ptBuilder': ptBuilder },
                    { 'ptDeputeDate': ptDeputeDate }, { 'ptPlanFinishTime': ptPlanFinishTime },
                    { 'ptEndDate': ptEndDate }, { 'ptCompsPay': ptCompsPay },
                    { 'ptCompsReason': ptCompsReason }, { 'isFinishedPt': isFinishedPt },
                    { 'pwDeputeUnit': pwDeputeUnit }, { 'pwBuilder': pwBuilder },
                    { 'pwDeputeDate': pwDeputeDate }, { 'pwPlanFinishTime': pwPlanFinishTime },
                    { 'pwEndDate': pwEndDate }, { 'pwCompsPay': pwCompsPay }, { 'pwCompsReason': pwCompsReason },
                    { 'elecDesignUnit': elecDesignUnit }, { 'elecSupervisionUnit': elecSupervisionUnit },
                    { 'actualElecBuildWay': actualElecBuildWay }, { 'elecSettlementPrice': elecSettlementPrice },
                    { 'isCheckedCost': isCheckedCost }, { 'addElecSupportMeter': addElecSupportMeter },
                    { 'isAddTransformer': isAddTransformer }, { 'transformerCapacity': transformerCapacity },
                    { 'transformerBudgetCost': transformerBudgetCost }, { 'fsuEntrustVender': fsuEntrustVender },
                    { 'fsuBuildFactory': fsuBuildFactory }, { 'fsuInstallTime': fsuInstallTime },
                    { 'fsuPlanFinishTime': fsuPlanFinishTime }, { 'fsuFinishedTime': fsuFinishedTime },
                    { 'isPickFsu': isPickFsu }
                ));
                var url = "" + $rootScope.projectName + "/RequestBuild/addOrUpdateRequestBuild";
                myService.addOrEdit(url, postData);
            }

            // 监听数据
            $scope.$watch("data", function (newValue) {
                var data = newValue;
                if (!data) {
                    return;
                }
                /*
                if (data.START_DATE) data.START_DATE = $rootScope.getTimeStamp(data.START_DATE, false);
                if (data.TJ_DEPUTE_DATE) data.TJ_DEPUTE_DATE = $rootScope.getTimeStamp(data.TJ_DEPUTE_DATE, false);
                if (data.TJ_END_DATE) data.TJ_END_DATE = $rootScope.getTimeStamp(data.TJ_END_DATE, false);
                if (data.GT_DEPUTE_DATE) data.GT_DEPUTE_DATE = $rootScope.getTimeStamp(data.GT_DEPUTE_DATE, false);
                if (data.GT_END_DATE) data.GT_END_DATE = $rootScope.getTimeStamp(data.GT_END_DATE, false);
                if (data.PW_DEPUTE_DATE) data.PW_DEPUTE_DATE = $rootScope.getTimeStamp(data.PW_DEPUTE_DATE, false);
                if (data.PW_END_DATE) data.PW_END_DATE = $rootScope.getTimeStamp(data.PW_END_DATE, false);
                if (data.PT_DEPUTE_DATE) data.PT_DEPUTE_DATE = $rootScope.getTimeStamp(data.PT_DEPUTE_DATE, false);
                if (data.PT_END_DATE) data.PT_END_DATE = $rootScope.getTimeStamp(data.PT_END_DATE, false);
                if (data.END_DATE) data.END_DATE = $rootScope.getTimeStamp(data.END_DATE, false);
                if (data.FSU_INSTALL_TIME) data.FSU_INSTALL_TIME = $rootScope.getTimeStamp(data.FSU_INSTALL_TIME, false);
                if (data.FSU_FINISHED_TIME) data.FSU_FINISHED_TIME = $rootScope.getTimeStamp(data.FSU_FINISHED_TIME, false);
                */
                if (data.BUILD_STATE) $scope.buildState = data.BUILD_STATE;
                if (data.JL_ENTRUST_UNIT) $scope.jlEntrustUnit = data.JL_ENTRUST_UNIT;
                if (data.PRJ_WHOLE_PLAN_FINISHED_TIME) $scope.prjWholePlanFinishedTime = data.PRJ_WHOLE_PLAN_FINISHED_TIME;
                if (data.START_DATE) $scope.startDate = data.START_DATE;
                if (data.END_DATE) $scope.endDate = data.END_DATE;
                if (data.NOT_START_REMARK) $scope.notStartRemark = data.NOT_START_REMARK;
                if (data.TJ_DEPUTE_UNIT) $scope.tjDeputeUnit = data.TJ_DEPUTE_UNIT;
                if (data.TJ_BUILDER) $scope.tjBuilder = data.TJ_BUILDER;
                if (data.TJ_DEPUTE_DATE) $scope.tjDeputeDate = data.TJ_DEPUTE_DATE;
                if (data.TJ_PLAN_FINISH_TIME) $scope.tjPlanFinishTime = data.TJ_PLAN_FINISH_TIME;
                if (data.TJ_END_DATE) $scope.tjEndDate = data.TJ_END_DATE;
                if (data.TJ_COMPS_PAY) $scope.tjCompsPay = data.TJ_COMPS_PAY;
                if (data.TJ_COMPS_REASON) $scope.tjCompsReason = data.TJ_COMPS_REASON;
                if (data.GT_DEPUTE_UNIT) $scope.gtDeputeUnit = data.GT_DEPUTE_UNIT;
                if (data.GT_BUILDER) $scope.gtBuilder = data.GT_BUILDER;
                if (data.GT_DEPUTE_DATE) $scope.gtDeputeDate = data.GT_DEPUTE_DATE;
                if (data.GT_PLAN_FINISH_TIME) $scope.gtPlanFinishTime = data.GT_PLAN_FINISH_TIME;
                if (data.GT_END_DATE) $scope.gtEndDate = data.GT_END_DATE;
                if (data.GT_COMPS_PAY) $scope.gtCompsPay = data.GT_COMPS_PAY;
                if (data.GT_COMPS_REASON) $scope.gtCompsReason = data.GT_COMPS_REASON;
                if (data.IS_DELIVERED_GT) $scope.isDeliveredGt = data.IS_DELIVERED_GT;
                if (data.PT_DEPUTE_UNIT) $scope.ptDeputeUnit = data.PT_DEPUTE_UNIT;
                if (data.PT_BUILDER) $scope.ptBuilder = data.PT_BUILDER;
                if (data.PT_DEPUTE_DATE) $scope.ptDeputeDate = data.PT_DEPUTE_DATE;
                if (data.PT_PLAN_FINISH_TIME) $scope.ptPlanFinishTime = data.PT_PLAN_FINISH_TIME;
                if (data.PT_END_DATE) $scope.ptEndDate = data.PT_END_DATE;
                if (data.PT_COMPS_PAY) $scope.ptCompsPay = data.PT_COMPS_PAY;
                if (data.PT_COMPS_REASON) $scope.ptCompsReason = data.PT_COMPS_REASON;
                if (data.IS_FINISHED_PT) $scope.isFinishedPt = data.IS_FINISHED_PT;
                if (data.PW_DEPUTE_UNIT) $scope.pwDeputeUnit = data.PW_DEPUTE_UNIT;
                if (data.PW_BUILDER) $scope.pwBuilder = data.PW_BUILDER;
                if (data.PW_DEPUTE_DATE) $scope.pwDeputeDate = data.PW_DEPUTE_DATE;
                if (data.PW_PLAN_FINISH_TIME) $scope.pwPlanFinishTime = data.PW_PLAN_FINISH_TIME;
                if (data.PW_END_DATE) $scope.pwEndDate = data.PW_END_DATE;
                if (data.PW_COMPS_PAY) $scope.pwCompsPay = data.PW_COMPS_PAY;
                if (data.PW_COMPS_REASON) $scope.pwCompsReason = data.PW_COMPS_REASON;
                if (data.ELEC_DESIGN_UNIT) $scope.elecDesignUnit = data.ELEC_DESIGN_UNIT;
                if (data.ELEC_SUPERVISION_UNIT) $scope.elecSupervisionUnit = data.ELEC_SUPERVISION_UNIT;
                if (data.ACTUAL_ELEC_BUILD_WAY) $scope.actualElecBuildWay = data.ACTUAL_ELEC_BUILD_WAY;
                if (data.ELEC_SETTLEMENT_PRICE) $scope.elecSettlementPrice = data.ELEC_SETTLEMENT_PRICE;
                if (data.IS_CHECKED_COST) $scope.isCheckedCost = data.IS_CHECKED_COST;
                if (data.ADD_ELEC_SUPPORT_METER) $scope.addElecSupportMeter = data.ADD_ELEC_SUPPORT_METER;
                if (data.IS_ADD_TRANSFORMER) $scope.isAddTransformer = data.IS_ADD_TRANSFORMER;
                if (data.TRANSFORMER_CAPACITY) $scope.transformerCapacity = data.TRANSFORMER_CAPACITY;
                if (data.TRANSFORMER_BUDGET_COST) $scope.transformerBudgetCost = data.TRANSFORMER_BUDGET_COST;
                if (data.FSU_ENTRUST_VENDER) $scope.fsuEntrustVender = data.FSU_ENTRUST_VENDER;
                if (data.FSU_BUILD_FACTORY) $scope.fsuBuildFactory = data.FSU_BUILD_FACTORY;
                if (data.FSU_INSTALL_TIME) $scope.fsuInstallTime = data.FSU_INSTALL_TIME;
                if (data.FSU_PLAN_FINISH_TIME) $scope.fsuPlanFinishTime = data.FSU_PLAN_FINISH_TIME;
                if (data.FSU_FINISHED_TIME) $scope.fsuFinishedTime = data.FSU_FINISHED_TIME;
                if (data.IS_PICK_FSU) $scope.isPickFsu = data.IS_PICK_FSU;               
            })

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
            // 获取下拉列表
            function getSelectListByUser(fieldId) {
                var postData = $.param($.extend({ "fieldId": fieldId }, { "talkDutyUnit": "" }));
                allService.getSelectListByOrgan(postData).then(function successCallback(response) {
                    var resp = response.data;
                    if (resp.ErrCode == "200") {
                        var data = resp.Data;
                        if (data.length > 0) {
                            if (fieldId == "ddls_jl_entrust_unit") {                           
                                $scope.jlEntrustUnitList = data;
                                if (!$scope.jlEntrustUnit) $scope.jlEntrustUnit = data[0].Value;
                            } else if (fieldId == "ddls_tj_depute_unit") {
                                $scope.tjDeputeUnitList = data;
                                if (!$scope.tjDeputeUnit) $scope.tjDeputeUnit = data[0].Value;
                            } else if (fieldId == "ddls_tj_build_unit") {
                                $scope.tjBuilderList = data;
                                if (!$scope.tjBuilder) $scope.tjBuilder = data[0].Value;
                            } else if (fieldId == "ddls_gt_depute_unit") {
                                $scope.gtDeputeUnitList = data;
                                if (!$scope.gtDeputeUnit) $scope.gtDeputeUnit = data[0].Value;
                            } else if (fieldId == "ddls_gt_builder") {
                                $scope.gtBuilderList = data;
                                if (!$scope.gtBuilder) $scope.gtBuilder = data[0].Value;
                            } else if (fieldId == "ddls_pt_depute_unit") {
                                $scope.ptDeputeUnitList = data;
                                if (!$scope.ptDeputeUnit) $scope.ptDeputeUnit = data[0].Value;
                            } else if (fieldId == "ddls_pt_builder") {
                                $scope.ptBuilderList = data;
                                if (!$scope.ptBuilder) $scope.ptBuilder = data[0].Value;
                            } else if (fieldId == "ddls_pw_depute_unit") {
                                $scope.pwDeputeUnitList = data;
                                if (!$scope.pwDeputeUnit) $scope.pwDeputeUnit = data[0].Value;
                            } else if (fieldId == "ddls_pw_builder") {
                                $scope.pwBuilderList = data;
                                if (!$scope.pwBuilder) $scope.pwBuilder = data[0].Value;
                            } else if (fieldId == "ddls_elec_design_unit") {
                                $scope.elecDesignUnitList = data;
                                if (!$scope.elecDesignUnit) $scope.elecDesignUnit = data[0].Value;
                            } else if (fieldId == "ddls_elec_supervision_unit") {
                                $scope.elecSupervisionUnitList = data;
                                if (!$scope.elecSupervisionUnit) $scope.elecSupervisionUnit = data[0].Value;
                            } else if (fieldId == "ddls_fsu_entrust_vender") {
                                $scope.fsuEntrustVenderList = data;
                                if (!$scope.fsuEntrustVender) $scope.fsuEntrustVender = data[0].Value;
                            } else if (fieldId == "ddls_fsu_build_factory") {
                                $scope.fsuBuildFactoryList = data;
                                if (!$scope.fsuBuildFactory) $scope.fsuBuildFactory = data[0].Value;
                            } 
                            
                        }
                    } else {
                        layer.msg(resp.ErrMsg);
                    }
                }, function errorCallback(status) {
                });
            }
            function getSelectList(fieldId) {
                var postData = $.param($.extend({ "fieldId": fieldId }, { "talkDutyUnit": "" }));
                allService.getSelectList(postData).then(function successCallback(response) {
                    var resp = response.data;
                    if (resp.ErrCode == "200") {
                        var data = resp.Data;
                        if (data.length > 0) {
                            if (fieldId == "ddls_build_state") {
                                $scope.buildStateList = data;
                                if (!$scope.buildState) $scope.buildState = data[0].Value;
                            } else if (fieldId == "ddls_is_delivered_gt") {                              
                                $scope.isDeliveredGtList = data;
                                if (!$scope.isDeliveredGt) $scope.isDeliveredGt = data[0].Value;
                            } else if (fieldId == "ddls_is_finished_pt") {
                                $scope.isFinishedPtList = data;
                                if (!$scope.isFinishedPt) $scope.isFinishedPt = data[0].Value;
                            } else if (fieldId == "ddls_is_checked_cost") {
                                $scope.isCheckedCostList = data;
                                if (!$scope.isCheckedCost) $scope.isCheckedCost = data[0].Value;
                            } else if (fieldId == "ddls_is_add_transformer") {
                                $scope.isAddTransformerList = data;
                                if (!$scope.isAddTransformer) $scope.isAddTransformer = data[0].Value;
                            } else if (fieldId == "ddls_is_pick_fsu") {
                                $scope.isPickFsuList = data;
                                if (!$scope.isPickFsu) $scope.isPickFsu = data[0].Value;
                            }
                            
                                
                            
                        }
                    } else {
                        layer.msg(resp.ErrMsg);
                    }
                }, function errorCallback(status) {
                });
            }
        }
    }
}])

// 自定义指令: 验收阶段的表单处理
app.directive('requestAccept', ["allService", "$rootScope", "myService", function (allService, $rootScope, myService) {
    return {
        restrict: 'E',
        replace: true,
        scope: { data: "=", requestId: "@" },
        templateUrl: "" + $rootScope.projectName + "/Scripts/app/jianshe/requestAccept.html",
        link: function ($scope, elem, attr) {
            dataTimes();
            var ddlsList = ["ddls_is_finished_tj_data", "ddls_is_finished_pt_data", "ddls_is_finished_sd_data","ddls_is_finished_assemble"];
            angular.forEach(ddlsList, function (elt, index) {
                getSelectList(elt);
            })
            //保存
            $scope.save = function () {
                var requestId = $scope.requestId;
                var acceptDate = $scope.acceptDate;
                var deliverSiteAcceptDate = $scope.deliverSiteAcceptDate;
                var notDeliverRemark = $scope.notDeliverRemark;
                var customerDeviceInstall = $scope.customerDeviceInstall;
                var deliverCertAcceptDate = $scope.deliverCertAcceptDate;
                var rentDate = $scope.rentDate;
                var isFinishedAssemble = $scope.isFinishedAssemble;
                var deliveredNoRentReason = $scope.deliveredNoRentReason;
                var isFinishedTjData = $scope.isFinishedTjData;
                var isFinishedPtData = $scope.isFinishedPtData;
                var isFinishedSdData = $scope.isFinishedSdData;
                var noAssembleReason = $scope.noAssembleReason;
                /*
                if (!requestId || !acceptDate || !deliverSiteAcceptDate || !notDeliverRemark || !customerDeviceInstall || !deliverCertAcceptDate || !rentDate||!isFinishedAssemble || !deliveredNoRentReason || isFinishedTjData == '请选择' || isFinishedPtData == '请选择' || isFinishedSdData == '请选择') {
                    layer.msg("请填写完整");
                    return;
                }
                */
                var postData = $.param($.extend({ 'requestId': requestId }, { 'acceptDate': acceptDate }, { 'deliverSiteAcceptDate': deliverSiteAcceptDate },
                    { 'notDeliverRemark': notDeliverRemark },
                    { 'customerDeviceInstall': customerDeviceInstall }, { 'deliverCertAcceptDate': deliverCertAcceptDate }, { 'rentDate': rentDate }, { 'isFinishedAssemble': isFinishedAssemble }, { 'deliveredNoRentReason': deliveredNoRentReason },
                    { 'isFinishedTjData': isFinishedTjData }, { 'isFinishedPtData': isFinishedPtData },
                    { 'isFinishedSdData': isFinishedSdData }, { 'noAssembleReason': noAssembleReason}));
                var url = "" + $rootScope.projectName + "/RequestAccept/addOrUpdateRequestAccept";
                myService.addOrEdit(url, postData);
            }

            // 监听数据
            $scope.$watch("data", function (newValue) {
                var data = newValue;
                if (!data) {
                    return;
                }
                if (data.ACCEPT_DATE) data.ACCEPT_DATE = $rootScope.getTimeStamp(data.ACCEPT_DATE, false);
                if (data.DELIVER_SITE_ACCEPT_DATE) data.DELIVER_SITE_ACCEPT_DATE = $rootScope.getTimeStamp(data.DELIVER_SITE_ACCEPT_DATE, false);
                if (data.DELIVER_CERT_ACCEPT_DATE) data.DELIVER_CERT_ACCEPT_DATE = $rootScope.getTimeStamp(data.DELIVER_CERT_ACCEPT_DATE, false);
                if (data.RENT_DATE) data.RENT_DATE = $rootScope.getTimeStamp(data.RENT_DATE, false);
                if (data.ACCEPT_DATE) $scope.acceptDate = data.ACCEPT_DATE;
                if (data.DELIVER_SITE_ACCEPT_DATE) $scope.deliverSiteAcceptDate = data.DELIVER_SITE_ACCEPT_DATE;
                if (data.NOT_DELIVER_REMARK) $scope.notDeliverRemark = data.NOT_DELIVER_REMARK;
                if (data.CUSTOMER_DEVICE_INSTALL) $scope.customerDeviceInstall = data.CUSTOMER_DEVICE_INSTALL;
                if (data.DELIVER_CERT_ACCEPT_DATE) $scope.deliverCertAcceptDate = data.DELIVER_CERT_ACCEPT_DATE;
                if (data.RENT_DATE) $scope.rentDate = data.RENT_DATE;
                if (data.IS_FINISHED_ASSEMBLE) $scope.isFinishedAssemble = data.IS_FINISHED_ASSEMBLE;
                if (data.DELIVERED_NO_RENT_REASON) $scope.deliveredNoRentReason = data.DELIVERED_NO_RENT_REASON;
                if (data.IS_FINISHED_TJ_DATA) $scope.isFinishedTjData = data.IS_FINISHED_TJ_DATA;
                if (data.IS_FINISHED_PT_DATA) $scope.isFinishedPtData = data.IS_FINISHED_PT_DATA;
                if (data.IS_FINISHED_SD_DATA) $scope.isFinishedSdData = data.IS_FINISHED_SD_DATA;
                if (data.NO_ASSEMBLE_REASON) $scope.noAssembleReason = data.NO_ASSEMBLE_REASON;
            })

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

            function getSelectList(fieldId) {
                var postData = $.param($.extend({ "fieldId": fieldId }, { "talkDutyUnit": "" }));
                allService.getSelectList(postData).then(function successCallback(response) {
                    var resp = response.data;
                    if (resp.ErrCode == "200") {
                        var data = resp.Data;
                        if (data.length > 0) {
                            if (fieldId == "ddls_is_finished_tj_data") {
                                $scope.isFinishedTjDataList = data;
                                if (!$scope.isFinishedTjData) $scope.isFinishedTjData = data[0].Value;
                            } else if (fieldId == "ddls_is_finished_pt_data") {
                                $scope.isFinishedPtDataList = data;
                                if (!$scope.isFinishedPtData) $scope.isFinishedPtData = data[0].Value;
                            } else if (fieldId == "ddls_is_finished_sd_data") {
                                $scope.isFinishedSdDataList = data;
                                if (!$scope.isFinishedSdData) $scope.isFinishedSdData = data[0].Value;
                            } else if (fieldId == "ddls_is_finished_assemble"){
                                $scope.isFinishedAssembleList = data;
                                if (!$scope.isFinishedAssemble) $scope.isFinishedAssemble = data[0].Value;
                            }

                        }
                    } else {
                        layer.msg(resp.ErrMsg);
                    }
                }, function errorCallback(status) {
                });
            }

        }
    }
}])

// 自定义指令: 系统项目信息的表单处理
app.directive('requestSysinfo', ["allService", "$rootScope", "myService", function (allService, $rootScope, myService) {
    return {
        restrict: 'E',
        replace: true,
        scope: { data: "=", requestId: "@", reGetData: "&" },
        templateUrl: "" + $rootScope.projectName + "/Scripts/app/jianshe/requestSysinfo.html",
        link: function ($scope, elem, attr) {
            dataTimes();
            //保存
            $scope.save = function () {
                var requestId = $scope.requestId;
                var crmRequestId = $scope.crmRequestId;
                var pmsPrjCode = $scope.pmsPrjCode;
                var crmBuildType = $scope.crmBuildType;
                var crmTowerType = $scope.crmTowerType;
                var crmTowerSpecType = $scope.crmTowerSpecType;
                var crmRoomType = $scope.crmRoomType;
                var pmsDesigner = $scope.pmsDesigner;
                var pmsSuperviser = $scope.pmsSuperviser;
                var pmsPrjApprovDate = $scope.pmsPrjApprovDate;
                var pmsDesignApprovDate = $scope.pmsDesignApprovDate;
                var pmsBuildStartDate = $scope.pmsBuildStartDate;
                var pmsBuildEndDate = $scope.pmsBuildEndDate;
                var pmsAcceptDate = $scope.pmsAcceptDate;
                var pmsPrjState = $scope.pmsPrjState;
                var crmDeliverDate = $scope.crmDeliverDate;
                var crmRentDate = $scope.crmRentDate;
                var pmsPrjNode = $scope.pmsPrjNode;
                var crmRequestState = $scope.crmRequestState;
                /*
                if (!requestId || !crmRequestId || !pmsPrjCode || !crmBuildType || !crmTowerType || !crmTowerSpecType || !crmRoomType || !pmsDesigner || !pmsSuperviser
                    || !pmsPrjApprovDate || !pmsDesignApprovDate || !pmsBuildStartDate || !pmsBuildEndDate || !pmsAcceptDate || !pmsPrjState || !crmDeliverDate
                    || !crmRentDate || !pmsPrjNode || !crmRequestState) {
                    layer.msg("请填写完整");
                    return;
                }
                */
                if (!requestId || !crmRequestId) {
                    layer.msg("请填写完整");
                    return;
                }
                var postData = $.param($.extend({ 'requestId': requestId }, { 'crmRequestId': crmRequestId }, { 'pmsPrjCode': pmsPrjCode },
                    { 'crmBuildType': crmBuildType }, { 'crmTowerType': crmTowerType }, { 'crmTowerSpecType': crmTowerSpecType }, { 'pmsPrjApprovDate': pmsPrjApprovDate },
                    { 'crmRoomType': crmRoomType }, { 'pmsDesigner': pmsDesigner }, { 'pmsSuperviser': pmsSuperviser }, { 'pmsDesignApprovDate': pmsDesignApprovDate },
                    { 'pmsBuildStartDate': pmsBuildStartDate }, { 'pmsBuildEndDate': pmsBuildEndDate }, { 'pmsAcceptDate': pmsAcceptDate }, { 'pmsPrjState': pmsPrjState },
                    { 'crmDeliverDate': crmDeliverDate }, { 'crmRentDate': crmRentDate }, { 'pmsPrjNode': pmsPrjNode }, { 'crmRequestState': crmRequestState }));
                var url = "" + $rootScope.projectName + "/RequestSysinfo/addOrUpdateRequestSysinfo";
                addOrEdit(url, postData);
            }

            // 监听数据
            $scope.$watch("data", function (newValue) {
                var data = newValue;
                if (!data) {
                    return;
                }
                if (data.PMS_PRJ_APPROV_DATE) data.PMS_PRJ_APPROV_DATE = $rootScope.getTimeStamp(data.PMS_PRJ_APPROV_DATE, false);
                if (data.PMS_DESIGN_APPROV_DATE) data.PMS_DESIGN_APPROV_DATE = $rootScope.getTimeStamp(data.PMS_DESIGN_APPROV_DATE, false);
                if (data.PMS_BUILD_START_DATE) data.PMS_BUILD_START_DATE = $rootScope.getTimeStamp(data.PMS_BUILD_START_DATE, false);
                if (data.PMS_BUILD_END_DATE) data.PMS_BUILD_END_DATE = $rootScope.getTimeStamp(data.PMS_BUILD_END_DATE, false);
                if (data.PMS_ACCEPT_DATE) data.PMS_ACCEPT_DATE = $rootScope.getTimeStamp(data.PMS_ACCEPT_DATE, false);
                if (data.CRM_DELIVER_DATE) data.CRM_DELIVER_DATE = $rootScope.getTimeStamp(data.CRM_DELIVER_DATE, false);
                if (data.CRM_RENT_DATE) data.CRM_RENT_DATE = $rootScope.getTimeStamp(data.CRM_RENT_DATE, false);
                if (data.CRM_REQUEST_ID) $scope.crmRequestId = data.CRM_REQUEST_ID;
                if (data.PMS_PRJ_CODE) $scope.pmsPrjCode = data.PMS_PRJ_CODE;
                if (data.CRM_BUILD_TYPE) $scope.crmBuildType = data.CRM_BUILD_TYPE;
                if (data.CRM_TOWER_TYPE) $scope.crmTowerType = data.CRM_TOWER_TYPE;
                if (data.CRM_TOWER_SPEC_TYPE) $scope.crmTowerSpecType = data.CRM_TOWER_SPEC_TYPE;
                if (data.CRM_ROOM_TYPE) $scope.crmRoomType = data.CRM_ROOM_TYPE;
                if (data.PMS_DESIGNER) $scope.pmsDesigner = data.PMS_DESIGNER;
                if (data.PMS_SUPERVISER) $scope.pmsSuperviser = data.PMS_SUPERVISER;
                if (data.PMS_PRJ_APPROV_DATE) $scope.pmsPrjApprovDate = data.PMS_PRJ_APPROV_DATE;
                if (data.PMS_DESIGN_APPROV_DATE) $scope.pmsDesignApprovDate = data.PMS_DESIGN_APPROV_DATE;
                if (data.PMS_BUILD_START_DATE) $scope.pmsBuildStartDate = data.PMS_BUILD_START_DATE;
                if (data.PMS_BUILD_END_DATE) $scope.pmsBuildEndDate = data.PMS_BUILD_END_DATE;
                if (data.PMS_ACCEPT_DATE) $scope.pmsAcceptDate = data.PMS_ACCEPT_DATE;
                if (data.PMS_PRJ_STATE) $scope.pmsPrjState = data.PMS_PRJ_STATE;
                if (data.CRM_DELIVER_DATE) $scope.crmDeliverDate = data.CRM_DELIVER_DATE;
                if (data.CRM_RENT_DATE) $scope.crmRentDate = data.CRM_RENT_DATE;
                if (data.PMS_PRJ_NODE) $scope.pmsPrjNode = data.PMS_PRJ_NODE;
                if (data.CRM_REQUEST_STATE) $scope.crmRequestState = data.CRM_REQUEST_STATE;
            })

            // 提交的请求
            function addOrEdit(url, postData) {
                allService.post(url, postData).then(function successCallback(resp) {
                    if (resp.ErrCode == "200") {
                        layer.alert('执行成功', {
                            title: "提示信息",
                            icon: 1,
                            skin: 'layer-ext-moon',
                            closeBtn: 0
                        }, function (index) {
                            layer.close(index);
                            $scope.$apply(function () {
                                $scope.reGetData();
                            })
                        });
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

// 自定义指令: 图片查看器
app.directive('imgView', ["$timeout", "$window", "$document", "$rootScope", "allService", function ($timeout, $window, $document, $rootScope, allService) {
    return {
        restrict: 'E',
        replace: true,
        scope: { fileList: "=", deleteUrl: "=", isDelete: "=" },
        templateUrl: "" + $rootScope.projectName + "/Scripts/app/templateUrl/imgView.html",
        link: function ($scope, elem, attr) {
            $scope.isPicture = false;
            var cameraList = [];
            $scope.imgList = [];
            $scope.otherList = [];
            $rootScope.imgWidth = 0;
            $rootScope.imgHeight = 0;
            $scope.contentStyle = {};
            var selPage = 1;
            var num = 0;
            $scope.$watch("fileList", function (newValue) {
                if (newValue) {
                    cameraList = [];
                    $scope.imgList = [];
                    $scope.otherList = [];
                    $scope.pdfList = [];
                    angular.forEach($scope.fileList, function (elt, index) {
                        var suffixList = elt.FILE_SUB_NAME.split(".");
                        elt.suffix = suffixList[suffixList.length - 1].toLowerCase();
                        if (elt.suffix == "jpg" || elt.suffix == "png" || elt.suffix == "jpeg" || elt.suffix == "gif" || elt.suffix == "bmp") {
                            cameraList.push(elt.src);
                            $scope.imgList.push(elt);
                        } else if (elt.suffix == "doc" || elt.suffix == "docx") {
                            elt.src = "" + $rootScope.projectName + "/Content/images/word_icon.jpg";
                            $scope.otherList.push(elt);
                        } else if (elt.suffix == "xls" || elt.suffix == "xlsx") {
                            elt.src = "" + $rootScope.projectName + "/Content/images/excel_icon.jpg";
                            $scope.otherList.push(elt);
                        } else if (elt.suffix == "pdf") {
                            elt.src = "" + $rootScope.projectName + "/Content/images/pdf_icon.png";
                            if (elt.MENU_MAIN_INFO) elt.MENU_MAIN_INFO = elt.MENU_MAIN_INFO.replace("..", "");
                            elt.dataUrl = "" + $rootScope.projectName + elt.MENU_MAIN_INFO + elt.MENU_SUB_INFO + elt.FILE_SUB_NAME;
                            $scope.pdfList.push(elt);
                        } else {
                            elt.src = "" + $rootScope.projectName + "/Content/images/file_icon.png";
                            $scope.otherList.push(elt);
                        }
                        try {
                            elt.createdDate = $rootScope.getTimeStamp(elt.CREAT_DATE, true);
                        } catch (e) {
                            console.log(e);
                        }
                    });
                }
            });
            // PDF查看
            $scope.checkPdf = function (item) {
                //var path = "" + $rootScope.projectName + "/Sub/downFile?subId=" + item.SUB_ID + "&" + "fileMainId=" + item.FILE_MAIN_ID;
                //console.log(path);
                //PDFObject.embed(path, "#pdfDiv");
                //window.location.href = path;
            };
            // 下载
            $scope.download = function (item) {
                var path = "" + $rootScope.projectName + "/Sub/downFile?subId=" + item.SUB_ID + "&" + "fileMainId=" + item.FILE_MAIN_ID;
                window.location.href = path;
            };
            // 删除
            $scope.delete = function (item, $index, fileType) {
                layer.confirm('确定删除该文件吗？', {
                    title: '温馨提示',
                    icon: 0,
                    btn: ['确定', '取消']
                }, function (index) {
                    delFiles(item, $index, fileType);
                });
            };
            // 删除文件请求方法
            function delFiles(item, $index, fileType) {
                var url = $scope.deleteUrl;
                if (url == "无法删除") {
                    layer.alert('该过程不能删除文件', {
                        title: "提示信息",
                        icon: 2,
                        skin: 'layer-ext-moon',
                        closeBtn: 0
                    }, function (index) {
                        layer.close(index);
                    });
                    return;
                }
                var postData = $.param($.extend({ "fileMainId": item.FILE_MAIN_ID }, { "subIdList": item.SUB_ID }));
                allService.post(url, postData).then(function successCallback(resp) {
                    if (resp.ErrCode == "200") {
                        layer.alert('删除成功', {
                            title: "提示信息",
                            icon: 1,
                            skin: 'layer-ext-moon',
                            closeBtn: 0
                        }, function (index) {
                            layer.close(index);
                            $scope.$apply(function () {
                                if (fileType == "img") {
                                    $scope.imgList.splice($index, 1);
                                } else if (fileType == "pdf") {
                                    $scope.pdfList.splice($index, 1);
                                } else {
                                    $scope.otherList.splice($index, 1);
                                }
                                angular.forEach($scope.fileList, function (elt, index) {
                                    if (elt.SUB_ID == item.SUB_ID) {
                                        $scope.fileList.splice(index, 1);
                                    }
                                })
                            })
                        });
                    }
                });
            }
            // =========================== 下面为图片的操作 =======================/
            var startX = 0, startY = 0, x = 0, y = 0;
            var position = 1;
            $rootScope.imgMarginLeft = 0;
            $rootScope.imgMarginTop = 0;
            var winWidth = 0, winHeight = 0;
            element = elem[0].lastElementChild.firstElementChild;
            // 鼠标按下事件
            $scope.mousedownFun = function (event) {
                event.preventDefault();
                var newImgWidth = event.target.width + 20;
                var newImgHeight = event.target.height + 20;
                var rotateNum = num * 90;
                console.log(num)
                if (num >= 0) {
                    if (rotateNum % 90 === 0 && rotateNum % 180 !== 0 && rotateNum % 270 !== 0 && rotateNum % 360 !== 0) {
                        startX = (newImgWidth - newImgHeight) / 2 + newImgHeight - event.offsetY;
                        startY = event.offsetX - (newImgWidth - newImgHeight) / 2;
                    } else if (rotateNum % 180 === 0 && rotateNum % 360 !== 0) {
                        startX = newImgWidth - event.offsetX;
                        startY = newImgHeight - event.offsetY;
                    } else if (rotateNum % 270 === 0 && rotateNum % 360 !== 0) {
                        startX = (newImgWidth - newImgHeight) / 2 + event.offsetY;
                        startY = newImgWidth - event.offsetX - (newImgWidth - newImgHeight) / 2;
                    } else {
                        startX = event.offsetX;
                        startY = event.offsetY;
                    }
                } else {
                    rotateNum = Math.abs(rotateNum);
                    if (rotateNum % 90 === 0 && rotateNum % 180 !== 0 && rotateNum % 270 !== 0 && rotateNum % 360 !== 0) {
                        startX = (newImgWidth - newImgHeight) / 2 + event.offsetY;
                        startY = newImgWidth - event.offsetX - (newImgWidth - newImgHeight) / 2;
                    } else if (rotateNum % 180 === 0 && rotateNum % 360 !== 0) {
                        startX = newImgWidth - event.offsetX;
                        startY = newImgHeight - event.offsetY;
                    } else if (rotateNum % 270 === 0 && rotateNum % 360 !== 0) {
                        startX = (newImgWidth - newImgHeight) / 2 + newImgHeight - event.offsetY;
                        startY = event.offsetX - (newImgWidth - newImgHeight) / 2;
                    } else {
                        startX = event.offsetX;
                        startY = event.offsetY;
                    }
                }
                $document.on('mousemove', mousemove);
                $document.on('mouseup', mouseup);
            };
            // 滚轮事件 放大、缩小
            element.addEventListener("mousewheel", function (event) {
                event.preventDefault();
                var delta = (event.wheelDelta && (event.wheelDelta > 0 ? 1 : -1)) ||  // chrome & ie
                    (event.detail !== 0 && (event.detail > 0 ? -1 : 1)) || (event.deltaY && (event.deltaY < 0 ? 1 : -1));
                if (delta > 0) {
                    // 向上滚
                    position = position + 0.1;
                    if (position > 4) {
                        position = 4;
                    }
                } else if (delta < 0) {
                    // 向下滚
                    position = position - 0.1;
                    if (position < 0.1) {
                        position = 0.1;
                    }
                }
                $scope.$apply(function () {
                    $scope.contentStyle["margin-top"] = $rootScope.imgMarginTop - ((position - 1) * $rootScope.imgHeight) / 2 + "px";
                    $scope.contentStyle["margin-left"] = $rootScope.imgMarginLeft - ((position - 1) * $rootScope.imgWidth) / 2 + "px";
                });
                angular.element(".dialog-img").css({ width: ($rootScope.imgWidth * position) + "px", height: ($rootScope.imgHeight * position) + "px" });
            });
            // 拖拽事件
            function mousemove(event) {
                y = event.clientY - startY;
                x = event.clientX - startX;
                $scope.$apply(function () {
                    $scope.contentStyle["margin-top"] = y + 'px';
                    $scope.contentStyle["margin-left"] = x + 'px';
                    $scope.contentStyle["transition"] = 'margin 0s';
                });
            }
            // 鼠标放开事件
            function mouseup(event) {
                $document.off('mousemove', mousemove);
                $document.off('mouseup', mouseup);
                $scope.contentStyle.transition =  'transform .6s, margin .6s';
            }
            // 下载
            $scope.downloadImg = function () {
                window.location.href = $scope.imgSrc;
            };

            /**
             * 返回
             */
            $scope.backoff = function () {
                $scope.isClose = true;
                $timeout(function () {
                    $scope.isClose = false;
                    $scope.isPicture = false;
                    num = 0;
                    position = 1;
                    $scope.contentStyle.transform = 'rotate(' + 90 * num + 'deg) scale(1, 1)';
                }, 400);
            };
            /**
             * 左翻转
             */
            $scope.rotate = function () {
                num--;
                $scope.contentStyle.transform = 'rotate(' + 90 * num + 'deg) scale(1, 1)';
            };

            /**
             * 右翻转
             */
            $scope.rotateRight = function () {
                num++;
                $scope.contentStyle.transform = 'rotate(' + 90 * num + 'deg) scale(1, 1)';
            };

            /**
             * 上一张
             */
            $scope.previous = function () {
                var index = selPage - 1;
                if (index < 0 || index > (cameraList.length - 1)) return;
                var data = cameraList[index];
                $scope.checkBigImg(index, data);

            };
            /**
             * 下一张
             */
            $scope.next = function () {
                var index = selPage + 1;
                if (index < 0 || index > (cameraList.length - 1)) return;
                var data = cameraList[index];
                $scope.checkBigImg(index, data);
            };

            // 点击图片时
            $scope.checkBigImg = function (index, data) {
                position = 1;
                num = 0;
                $scope.hasImg = false;
                $scope.contentStyle.transform = 'rotate(' + 90 * num + 'deg) scale(1, 1)';
                getWindowWH();
                if (index === 0) {
                    $scope.preTrue = false;
                } else {
                    $scope.preTrue = true;
                }
                if (index === (cameraList.length - 1)) {
                    $scope.nextTrue = false;
                } else {
                    $scope.nextTrue = true;
                }
                $scope.isPicture = true;
                selPage = index;
                var image = new Image();
                image.src = data;
                image.onload = function () {
                    var width = image.width;
                    var height = image.height;
                    winHeight = winHeight - 20;
                    var ww = 860;
                    var wh = winHeight;
                    if (width < ww && height < wh) {
                        width = width;
                        height = height;
                    } else {
                        var scale_x = width / ww;
                        var scale_y = height / wh;
                        if (scale_x > scale_y) {
                            width = ww;
                            height = parseInt(height / scale_x);
                        } else {
                            width = parseInt(width / scale_y);
                            height = wh;
                        }
                    }
                    var left = (winWidth - width) / 2;
                    var top = (winHeight - height) / 2;
                    $rootScope.imgWidth = width;
                    $rootScope.imgHeight = height;
                    $rootScope.imgMarginLeft = left;
                    $rootScope.imgMarginTop = top;
                    angular.element(".img-view-content").css({ "margin-top": top + "px", "margin-left": left + "px" });
                    angular.element(".dialog-img").css({ width: width + "px", height: height + "px" });
                    $timeout(function () {
                        $scope.imgSrc = data;
                    }, 500);
                    $timeout(function () {
                        $scope.hasImg = true;
                    }, 600);
                };
            };
            // 获取浏览器宽高
            function getWindowWH() {
                var _this = this;
                if (window.innerWidth)
                    winWidth = window.innerWidth;
                else if (document.body && document.body.clientWidth)
                    winWidth = document.body.clientWidth;
                // 获取窗口高度
                if (window.innerHeight)
                    winHeight = window.innerHeight;
                else if (document.body && document.body.clientHeight)
                    winHeight = document.body.clientHeight;
                // 通过深入 Document 内部对 body 进行检测，获取窗口大小
                if (document.documentElement && document.documentElement.clientHeight && document.documentElement.clientWidth) {
                    winHeight = document.documentElement.clientHeight;
                    winWidth = document.documentElement.clientWidth;
                }
            }
        }
    };
}]);
// 图片加载错误
app.directive('errSrc', function () {
    return {
        link: function (scope, element, attrs) {
            element.bind('error', function () {
                if (attrs.src != attrs.errSrc) {
                    attrs.$set('src', attrs.errSrc);
                }
            });
        }
    }
});
// 弹出框拖拽
app.directive('dialogDraggable', ["$document", function ($document) {
    return {
        link: function (scope, element, attrs) {
            var bodyHeight = document.body.clientHeight;
            var winWidth = window.innerWidth;
            var winHeight = window.innerHeight;
            var divWidth = 0;
            var divHeight = 0;
            // 鼠标按下事件
            element.find(".z-panel-heading").on('mousedown', function (event) {
                event.preventDefault();
                startX = event.offsetX;
                startY = event.offsetY;
                divWidth = event.currentTarget.offsetParent.clientWidth;
                divHeight = event.currentTarget.offsetParent.clientHeight;
                $document.on('mousemove', mousemove);
                $document.on('mouseup', mouseup);
            });
            // 拖拽事件
            function mousemove(event) {
                y = event.clientY - startY;
                x = event.clientX - startX;
                var left = winWidth - divWidth - 6;
                var top = winHeight - divHeight;
                if (x < 0) {
                    if (y >= 0 && y <= top) {
                        element.css({
                            "margin-top": y + 'px',
                            "margin-left": 0 + 'px',
                            transition: 'left 0s, top 0s'
                        });
                    } else if (y < 0) {
                        element.css({
                            "margin-top": 0 + 'px',
                            "margin-left": 0 + 'px',
                            transition: 'left 0s, top 0s'
                        });
                    } else {
                        element.css({
                            "margin-top": top + 'px',
                            "margin-left": 0 + 'px',
                            transition: 'left 0s, top 0s'
                        });
                    }
                } else if (x >= 0 && x <= left) {
                    if (y >= 0 && y <= top) {
                        element.css({
                            "margin-top": y + 'px',
                            "margin-left": x + 'px',
                            transition: 'left 0s, top 0s'
                        });
                    } else if (y < 0) {
                        element.css({
                            "margin-top": 0 + 'px',
                            "margin-left": x + 'px',
                            transition: 'left 0s, top 0s'
                        });
                    } else {
                        element.css({
                            "margin-top": top + 'px',
                            "margin-left": x + 'px',
                            transition: 'left 0s, top 0s'
                        });
                    }
                } else {
                    if (y >= 0 && y <= top) {
                        element.css({
                            "margin-top": y + 'px',
                            "margin-left": left + 'px',
                            transition: 'left 0s, top 0s'
                        });
                    } else if (y < 0) {
                        element.css({
                            "margin-top": 0 + 'px',
                            "margin-left": left + 'px',
                            transition: 'left 0s, top 0s'
                        });
                    } else {
                        element.css({
                            "margin-top": top + 'px',
                            "margin-left": left + 'px',
                            transition: 'left 0s, top 0s'
                        });
                    }
                }
            }
            // 鼠标放开事件
            function mouseup(event) {
                $document.off('mousemove', mousemove);
                $document.off('mouseup', mouseup);
                element.css({ transition: 'all .6s' });
            }
        }
    }
    // 监听input 时时搜索
    app.directive("ngInputs", function () {
        return {
            link: function (scope, element, attr) {
                element.on('input', function (e) {
                    e.preventDefault();
                    scope.$eval(attr.ngInputs);
                })
            }
        }
    })
}]);
app.directive('scrollLoading', function ($window, $document) {
    return {
        scope: { scrollLoading: '=' },
        link: function (scope, element, attrs) {
            angular.element($window).on('scroll', function () {
                var innerHeight = $($window).innerHeight();
                var scrollHeight = $(document.body).outerHeight();
                var hh = scrollHeight - innerHeight;
                var srollPos = $($window).scrollTop();
                if (srollPos >= (hh - 100) && srollPos <= hh) {
                    scope.scrollLoading = true;
                    scope.$apply();
                }
            })

        }
    }
});
// 自定义指令: 角色、作用域的列表
app.directive('directiveLeftList', ["$timeout", "$window", "$document", "$rootScope", "allService", function ($timeout, $window, $document, $rootScope, allService) {
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
        }
    }
}])
// ====================================================== 上传文件弹出框 ================================================= //
// 自定义组件: 上传文件弹出框
app.directive('uploadFileDialog', ["$timeout", "Upload", "$rootScope", "allService", function ($timeout, Upload, $rootScope, allService) {
    return {
        restrict: 'E',
        replace: true,
        scope: {
            uploadUrl: "=",                 // 上传文件路径  
            uploadPostData: "=",            // 上传所需参数json
            returnResp: '=',                // 上传成功返回的参数
            postState: "=",                 // 请求的状态(true false)
            isMultiple: "=",                // 是否可多选
            isShowDialog: "=",              // 是否弹出文件选择框(开始)
            dialogTitle: "=",               // 弹出框的标题名
            modelUrl: "=",                  // 是否显示模板(false 就是不显示, 其他的就直接文件路径)
            fileAccept: "=",                // 文件选择类型(.txt, .xls, .doc)之类的
            isHintSuccess: "="              // 成功是否弹出提醒框
        },
        templateUrl: "" + $rootScope.projectName + "/Scripts/app/templateUrl/uploadFileDialog.html",
        link: function ($scope, elem, attr) {
            $scope.fileList = [];
            $scope.modeHint = "请严格按照模板格式上传, ";
            //关闭上传文件的弹出框
            $scope.closeOff = function () {
                $scope.isClose = true;
                $timeout(function () {
                    $scope.isClose = false;
                    $scope.isShowDialog = false;
                }, 400);
            };
            // 删除已选择文件
            $scope.deleteFile = function (index) {
                $scope.fileList.splice(index, 1);
            }
            // 报账附件上传
            $scope.sureUpload = function () {
                $scope.isUploading = true;
                var postData = $scope.uploadPostData;
                var url = $scope.uploadUrl;
                postData.files = $scope.fileList;
                Upload.upload({ url: url, data: postData }).then(function (response) {
                    $timeout(function () {
                        var resp = response.data;
                        $scope.isUploading = false;
                        $scope.postState = true;
                        $scope.returnResp = resp;
                        if (resp == "<script> alert('你无此操作权限'); window.history.back();</script>") {
                            layer.alert("你无此操作权限", {
                                title: "提示信息",
                                icon: 2,
                                skin: 'layer-ext-moon',
                                closeBtn: 0
                            }, function (index) {
                                layer.close(index);
                                $scope.$apply(function () {
                                    $scope.closeOff();
                                    $scope.fileList = [];
                                    $scope.uploadFile = [];
                                })
                                });
                            return;
                        }
                        if (resp.ErrCode == 200) {
                            if ($scope.isHintSuccess) {
                                layer.alert('保存成功', {
                                    title: "提示信息",
                                    icon: 1,
                                    skin: 'layer-ext-moon',
                                    closeBtn: 0
                                }, function (index) {
                                    layer.close(index);
                                    $scope.$apply(function () {
                                        $scope.closeOff();
                                        $scope.fileList = [];
                                        $scope.uploadFile = [];
                                    })
                                });
                            } else {
                                $scope.closeOff();
                                $scope.fileList = [];
                                $scope.uploadFile = [];
                            }
                        } else if (resp.ErrCode == 240) {
                            layer.alert("导入错误清单为 <br /><a download href = '" + $rootScope.projectName + "/Sub/FilePathDownload?fileName=" + resp.Data + "'>错误清单文件</a>", {
                                title: "提示信息",
                                icon: 2,
                                skin: 'layer-ext-moon',
                                closeBtn: 0
                            }, function (index) {
                                layer.close(index);
                                $scope.$apply(function () {
                                    $scope.closeOff();
                                    $scope.fileList = [];
                                    $scope.uploadFile = [];
                                })
                            });
                        } else {
                            layer.alert(resp.ErrMsg, {
                                title: "提示信息",
                                icon: 2,
                                skin: 'layer-ext-moon',
                                closeBtn: 0
                            }, function (index) {
                                layer.close(index);
                                $scope.$apply(function () {
                                    $scope.closeOff();
                                    $scope.fileList = [];
                                    $scope.uploadFile = [];
                                })
                            });
                        }
                    });
                }, function (response) {
                    $scope.isUploading = false;
                    $scope.closeOff();
                }, function (evt) {
                    var progressPercentage = Math.min(100, parseInt(100.0 *
                        evt.loaded / evt.total));
                });
            }
            // 选择文件后执行的操作
            $scope.uploadExcelFile = function (files, errFiles) {
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
                }
            }
        }
    }
}])


// ==================================================== 修改密码弹出框 ================================================== //
app.directive('modifyPassword', ["$timeout", "$rootScope", "allService", function ($timeout, $rootScope, allService) {
    return {
        restrict: 'E',
        replace: true,
        scope: { isShowPwDialog : "=" },
        templateUrl: "" + $rootScope.projectName + "/Scripts/app/templateUrl/modifyPassword.html",
        link: function ($scope, elem, attr) {

            // 修改密码确定
            $scope.pwEdit = function () {
                var oldPassword = $scope.oldPassword;
                var newPassword = $scope.newPassword;
                if (!oldPassword || !newPassword) {
                    layer.msg("请填写完整");
                    return;
                }
                $scope.isModifyPWClick = true;
                var postData = $.param($.extend({ "oldPsw": oldPassword }, { "newPsw": newPassword }));
                allService.modefyPSW(postData).then(function successCallback(response) {
                    var resp = response.data;
                    if (resp.ErrCode == "200") {
                        layer.alert('修改密码成功', {
                            title: "提示信息",
                            icon: 1,
                            skin: 'layer-ext-moon',
                            closeBtn: 0
                        }, function (index) {
                            layer.close(index);
                            window.location.href = "" + $rootScope.projectName + "/Login/Login";
                        });
                    } else {
                        layer.msg(resp.ErrMsg);
                    }
                    $scope.isModifyPWClick = false;
                });
            }

            // 关闭弹出框
            $scope.backoff = function () {
                $scope.isClose = true;
                $timeout(function () {
                    $scope.isClose = false;
                    $scope.isShowPwDialog = false;
                }, 400);
            };
        }
    }
}])

// ======================================================= tree弹出框 ==================================================== //


app.directive('myTree', ["$rootScope", "allService", function ($rootScope, allService) {
    return {
        require: '?ngModel', // ?ngModel
        replace: true,
        restrict: 'E',
        templateUrl: "" + $rootScope.projectName + "/Scripts/app/templateUrl/tree.html",
        scope: { treeList: '=', clickItem: "&", ngModel: "=", oldList: "=", showCode: "=" },
        link: function ($scope, element, attr, ngModel) {
            var getLoading = true;
            /* 注释 item.isShowChilden 的状态
             * 0 => 未选择
             * 1 => 选中不展开
             * 2 => 展开不选中
             * 3 => 展开选中
            **/
            // 选择事件
            $scope.checkItem = function (item, e) {
                e.stopPropagation();
                if (item.children.length > 0) {
                    if (item.isShowChilden == 0) {
                        // 未选择状态
                        item.isShowChilden = 1;
                        $scope.oldList.forEach(function (elt, index) {
                            if ($rootScope.checkNum) {
                                if ($rootScope.checkNum.ORG_CODE == elt.ORG_CODE && $rootScope.checkNum.ORG_CODE != elt.F_ORG_CODE && item.ORG_CODE != $rootScope.checkNum.ORG_CODE) {
                                    if (elt.isShowChilden == 1) {
                                        elt.isShowChilden = 0;
                                    } else if (elt.isShowChilden == 3) {
                                        elt.isShowChilden = 2;
                                    }
                                }
                            }
                            if (elt.ORG_CODE == item.ORG_CODE) elt.isShowChilden = item.isShowChilden;
                        });
                    } else if (item.isShowChilden == 1) {
                        // 原选中不展开状态
                        item.isShowChilden = 2;
                        $scope.oldList.forEach(function (elt, index) {
                            if (elt.ORG_CODE == item.ORG_CODE) elt.isShowChilden = item.isShowChilden;
                        });
                    } else if (item.isShowChilden == 2) {
                        // 原展开不选中
                        item.isShowChilden = 3;
                        $scope.oldList.forEach(function (elt, index) {
                            if ($rootScope.checkNum) {
                                if ($rootScope.checkNum.ORG_CODE == elt.ORG_CODE && $rootScope.checkNum.ORG_CODE != elt.F_ORG_CODE && item.ORG_CODE != $rootScope.checkNum.ORG_CODE) {
                                    if (elt.isShowChilden == 1) {
                                        elt.isShowChilden = 0;
                                    } else if (elt.isShowChilden == 3) {
                                        elt.isShowChilden = 2;
                                    }
                                }
                            }
                            if (elt.ORG_CODE == item.ORG_CODE) elt.isShowChilden = item.isShowChilden;
                        });
                    } else if (item.isShowChilden == 3) {
                        // 原展开选中
                        item.isShowChilden = 0;
                        $scope.oldList.forEach(function (elt, index) {
                            if (elt.ORG_CODE == item.ORG_CODE) elt.isShowChilden = item.isShowChilden;
                        });
                    }
                } else {
                    // 无子菜单
                    if (item.isShowChilden == 0) {
                        item.isShowChilden = 1;
                        $scope.oldList.forEach(function (elt, index) {
                            if ($rootScope.checkNum) {
                                if ($rootScope.checkNum.ORG_CODE == elt.ORG_CODE && $rootScope.checkNum.ORG_CODE != elt.F_ORG_CODE && item.ORG_CODE != $rootScope.checkNum.ORG_CODE) {
                                    if (elt.isShowChilden == 1) {
                                        elt.isShowChilden = 0;
                                    } else if (elt.isShowChilden == 3) {
                                        elt.isShowChilden = 2;
                                    }
                                }
                            }
                            if (elt.ORG_CODE == item.ORG_CODE) elt.isShowChilden = item.isShowChilden;
                        });
                    } else if (item.isShowChilden == 1) {
                        if(getLoading) getChildList(item, "click");
                    }
                }
                // 重新赋值列表
                $scope.treeList = $rootScope.reformList($scope.oldList);
                $rootScope.checkNum = item;
                ngModel.$setViewValue(item);
                $scope.clickItem();
            }
            // 图标选择事件
            $scope.faClick = function (item, e) {
                e.stopPropagation();
                if (getLoading) getChildList(item, "icon");
            }
            $scope.isCheck = function (item) {
                if ($rootScope.checkNum) {
                    return item.ORG_CODE === $rootScope.checkNum.ORG_CODE;
                } else {
                    return null;
                }
            }
            // 下级的点击事件
            $scope.clickItems = function () {
                ngModel.$setViewValue(this.dataIds);
                $scope.clickItem();
            }

            // 获取子部门列表
            function getChildList(item, type) {
                getLoading = false;
                var url = "" + $rootScope.projectName + "/Department/getChildList";
                var postData = $.param($.extend({ "orgCode": item.ORG_CODE }, { "cityName": "" }));
                allService.post(url, postData).then(function successCallback(resp) {
                    if (resp.ErrCode == "200") {
                        var data = resp.Data;
                        if (!data || data.length == 0) {
                            item.isShowChilden = 0;
                            item.noSelectRecord = false;
                        }
                        data.forEach(function (elt) {
                            elt.children = [];
                            elt.isShowChilden = 0;
                            elt.noSelectRecord = true;
                            $scope.oldList.push(elt);
                        })
                        item.children = data;
                        if (data.length > 0) {
                            if (item.isShowChilden == 0) {
                                // 未选择时
                                item.isShowChilden = 2;
                            } else if (item.isShowChilden == 1) {
                                // 选择不展开时
                                item.isShowChilden = 3;
                            } else if (item.isShowChilden == 2) {
                                // 展开不选中时
                                item.isShowChilden = 0;
                            } else if (item.isShowChilden == 3) {
                                // 展开选中时
                                item.isShowChilden = 1;
                            }
                        } else {
                            if (item.isShowChilden == 0) {
                            }
                        }
                        $scope.isCheck(item);
                        // 重新赋值列表
                        if (type == "click") {
                            $scope.treeList = $rootScope.reformList($scope.oldList);
                            $rootScope.checkNum = item;
                            ngModel.$setViewValue(item);
                            $scope.clickItem();
                        }
                    }
                    getLoading = true;
                });
            }

        }
    }
}])

// ================================================= 流程进度条 ================================================== //

app.directive('myProgress', ["$rootScope", "allService", function ($rootScope, allService) {
    return {
        require: '', // ?ngModel
        replace: true,
        restrict: 'E',
        templateUrl: "" + $rootScope.projectName + "/Scripts/app/templateUrl/progress.html",
        scope: { stateList: '=', subscript: "=" },
        link: function ($scope, element, attr, ngModel) {
            
            $scope.getDivWidth = function () {
                var width = $(".process-icon-item").width();
                $(".processBackground").css({
                    left: (width / 2) + "px",
                    right: (width / 2 + 2) + "px"
                });
                $(".color-background").width($scope.subscript * width + "px");
            }
            // 屏幕宽度发生改变时调整
            window.onresize = function () {
                $scope.getDivWidth();
            };
        }
    };
}]);