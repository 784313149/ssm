var app = angular.module('myApp', ["ngFileUpload", "me-lazyload"]);
// angular启动时执行的一些操作、全局变量的定义
﻿app.run(['$rootScope', "$timeout", function ($rootScope, $timeout) {
    $rootScope.RequestInfo = [];
    $rootScope.projectName = getRootPath();
    // 获取url参数
    $rootScope.getQueryString = function(name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");   
        var r = window.location.search.substr(1).match(reg);   
        if (r != null) return decodeURI(r[2]); return null;
    }
    /**
    * 获取当前时间
    */
    $rootScope.getNowDate = function (type) {
        var timestamp = Date.parse(new Date());
        if (type == "notTime") {
            var nowDate = getFormatDateByLong(timestamp, 'yyyy-MM-dd');

        } else {
            var nowDate = getFormatDateByLong(timestamp, 'yyyy-MM-dd hh:mm');
        }
        return nowDate;
    }
    /**
     * 获取明天
     */
    $rootScope.getNextDate = function (type) {
        var timestamp = Date.parse(new Date());
        timestamp = timestamp + 24 * 3600 * 1000;
        if (type == "notTime") {
            var nowDate = getFormatDateByLong(timestamp, 'yyyy-MM-dd');

        } else {
            var nowDate = getFormatDateByLong(timestamp, 'yyyy-MM-dd hh:mm:ss');
        }
        return nowDate;
    }
    // 获取年份下拉框
    $rootScope.getYearList = function () {
        var date = new Date();
        var yearList = [{ Value: "", Text: "请选择" }];
        var year = date.getFullYear() + 2;
        for (var i = 0; i < year - 2015; i++) {
            yearList.push({ Value: "" + (2015 + i) + "", Text: "" + (2015 + i) + "年" });
        }
        return yearList;
    }
    // 获取年-月 模式的时间 
    $rootScope.getYearMonthList = function () {
        var date = new Date();
        var nowYear = date.getFullYear();
        var nowMonth = date.getMonth() + 1;
        var dateList = [];
        if (nowMonth == 12) {
            nowYear = nowYear + 1;
        }
        for (var i = 0; i < nowYear - 2015 + 1; i++) {
            for (var j = 1; j < 13; j++) {
                var year = 2015 + i;
                var month = j;
                if (j < 10) {
                    month = "0" + j;
                }
                if (nowYear == year) {
                    if (month <= nowMonth + 1) {
                        dateList.push(year+ "-" + month);
                    }
                } else {
                    dateList.push(year + "-" + month);
                }
            }
        }
        return dateList;
    }
    // 获取后台的时间戳
    $rootScope.getTimeStamp = function (data, time) {
        if (time) {
            data = getFormatDateByLong(data, "yyyy-MM-dd hh:mm:ss");
        } else {
            data = getFormatDateByLong(data, "yyyy-MM-dd");
        }
        return data;
    }
    // 获取网站路径
    function getRootPath() {
        //获取当前网址，如： http://localhost:8088/test/test.jsp
        var curPath = window.document.location.href;
        //获取主机地址之后的目录，如： test/test.jsp
        var pathName = window.document.location.pathname;
        var pos = curPath.indexOf(pathName);
        //获取主机地址，如： http://localhost:8088
        var localhostPath = curPath.substring(0, pos);
        //获取带"/"的项目名，如：/test
        if (localhostPath.indexOf("localhost") != -1) {
            var projectName = "";
        } else {
            var projectName = pathName.substring(0, pathName.substr(1).indexOf('/') + 1);
        }
        return (localhostPath + projectName);//发布前用此
    }
    /**
	 * 重组数组
	 */
    $rootScope.reformList = function (obj) {
        var gen = [];
        for (var i = 0; i < obj.length; i++) {
            var branch = obj[i];
            if (branch.F_ORG_CODE == null || branch.F_ORG_CODE == "") {
                gen.push(branch);
                branch["children"] = buildTree(branch);
            }
        }
        function buildTree(parentNode) {
            var tree = new Array();
            for (var i = 0; i < obj.length; i++) {
                var children = obj[i];
                if (children.F_ORG_CODE == parentNode.ORG_CODE) {
                    tree.push(children);
                    children["children"] = buildTree(children);
                }
            }
            return tree;
        }
        return gen;
    }
    $rootScope.$watch('$viewContentLoaded', function () {
        $timeout(function () {
            $.winLoad.close();
        }, 400);
    });

    /**
    * 判断b数组是否包含在a数组中
    */
    $rootScope.isContained = function (a, b) {
        if (!(a instanceof Array) || !(b instanceof Array)) return false;
        if (a.length < b.length) return false;
        var aStr = a.toString();
        for (var i = 0, len = b.length; i < len; i++) {
            if (aStr.indexOf(b[i]) == -1) return false;
        }
        return true;
    }
    // 排序数组或者对象

    $rootScope.sortObject = function (object, subkey, desc) {
        var is_array = false;
        if (Object.prototype.toString.call(object) === '[object Array]') {
            is_array = true;
        }
        if (is_array) {
            var keys = { length: object.length };
        } else {
            if (typeof (Object.keys) == 'function') {
                var keys = Object.keys(object);
            } else {
                var keys = [];
                for (var key in keys) {
                    keys.push(key);
                }
            }
        }
        for (var i = 0; i < keys.length; i++) {
            for (var j = i + 1; j < keys.length; j++) {
                if (is_array) {
                    //数组排序
                    if (Object.prototype.toString.call(subkey) === '[object Array]') {
                        var vali = object[i];
                        var valj = object[j];
                        for (var si = 0; si < subkey.length; si++) {
                            vali = vali[subkey[si]];
                            valj = valj[subkey[si]];
                        }
                    } else {
                        if ((!subkey && subkey !== "") || subkey == '' && object.sort) {
                            var vali = object[i];
                            var valj = object[j];
                        } else {
                            var vali = object[i][subkey];
                            var valj = object[j][subkey];
                        }
                    }
                    if (desc) {
                        if (valj > vali) {
                            var tmp = object[i];
                            object[i] = object[j];
                            object[j] = tmp;
                        }
                    } else {
                        if (valj < vali) {
                            var tmp = object[i];
                            object[i] = object[j];
                            object[j] = tmp;
                        }
                    }
                } else {
                    //对象排序
                    var obi = object[keys[i]];
                    var obj = object[keys[j]];
                    if (Object.prototype.toString.call(subkey) === '[object Array]') {
                        var vali = obi;
                        var valj = obj;
                        for (var si = 0; si < subkey.length; si++) {
                            vali = vali[subkey[si]];
                            valj = valj[subkey[si]];
                        }
                    } else {
                        if ((!subkey && subkey !== "") || subkey == '' && object.sort) {
                            var vali = obi;
                            var valj = obj;
                        } else {
                            var vali = obi[subkey];
                            var valj = obj[subkey];
                        }
                    }
                    if (desc) {
                        if (valj > vali) {
                            var tmp = keys[i];
                            keys[i] = keys[j];
                            keys[j] = tmp;
                        }
                    } else {
                        if (valj < vali) {
                            var tmp = keys[i];
                            keys[i] = keys[j];
                            keys[j] = tmp;
                        }
                    }
                }//is!array
            }
        }
        if (is_array) {
            return object;
        } else {
            var sorted = {};
            for (var i = 0; i < keys.length; i++) {
                sorted[keys[i]] = object[keys[i]];
            }
            return sorted;
        }
    }
}]);
