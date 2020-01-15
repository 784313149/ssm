app.service('myService', ['$http', "$rootScope", function ($http, $rootScope) {
    this.addOrEdit = function (url, postData) {
        $http({ url: url, method: 'POST', data: postData, headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }).then(function successCallback(response) {
            var resp = response.data;
            if (!resp) {
                layer.alert('您暂无此权限', {
                    title: "提示信息",
                    icon: 2,
                    skin: 'layer-ext-moon',
                    closeBtn: 0
                }, function (index) {
                    layer.close(index);
                });
                return false;
            } else {
                if (resp.ErrCode == "200") {
                    layer.alert('保存成功', {
                        title: "提示信息",
                        icon: 1,
                        skin: 'layer-ext-moon'
                    }, function (index) {
                        layer.close(index);
                    });
                    return true;
                } else {
                    layer.msg(resp.ErrMsg);
                    return false;
                }
            }
        }, function errorCallback(status) {
            layer.alert('您暂无此权限', {
                title: "提示信息",
                icon: 2,
                skin: 'layer-ext-moon',
                closeBtn: 0
            }, function (index) {
                layer.close(index);
            });
            return false;
        });
    }
}])
app.factory('allService', ['$http', "$rootScope", function ($http, $rootScope) {
    // post请求
    var post = function (url, postData, isDialogError) {
        isDialogError = isDialogError ? isDialogError : false;
        return $http({ url: url, method: 'POST', data: postData, headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }).then(function successCallback(response) {
            var resp = response.data;
            if (!resp) {
                resp = { ErrCode: "500", ErrMsg: "暂无此权限" };
                return resp;
            } else {
                if (resp.ErrCode == "200") {

                } else {
                    if (resp == "<script> alert('你无此操作权限'); window.history.back();</script>") {
                        layer.msg("您无此操作权限");
                    } else {
                        if (isDialogError) {
                            layer.msg(resp.ErrMsg);
                        }
                    }
                }
                return resp;
            }
        }, function errorCallback(status) {
            var resp = { ErrCode: "500", ErrMsg: "暂无此权限" };
            return resp;
        });
    }
    // get请求
    var get = function (url) {
        return $http({ url: url, method: 'GET', headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }).then(function successCallback(response) {
            var resp = response.data;
            if (!resp) {
                resp = { ErrCode: "500", ErrMsg: "暂无此权限" };
                return resp;
            } else {
                if (resp.ErrCode == "200") {

                } else {
                    if (resp == "<script> alert('你无此操作权限'); window.history.back();</script>") {
                        layer.msg("您无此操作权限");
                    } else {
                        layer.msg(resp.ErrMsg);
                    }
                }
                return resp;
            }
        }, function errorCallback(status) {
            var resp = { ErrCode: "500", ErrMsg: "暂无此权限" };
            return resp;
        });
    }
    // 退出登录
    var logout = function (postData) {
        return $http({ url: "" + $rootScope.projectName + "/Login/Logout", method: 'POST', data: postData, headers: { 'Content-Type': 'application/x-www-form-urlencoded' } });
    }
    // 修改密码
    var modefyPSW = function (postData) {
        return $http({ url: "" + $rootScope.projectName + "/Staff/modefyPSW", method: 'POST', data: postData, headers: { 'Content-Type': 'application/x-www-form-urlencoded' } });
    }
    // 获取组织列表
    var getDepartmentList = function (postData) {
        return $http({ url: "" + $rootScope.projectName + "/Department/getDepartmentList", method: 'GET', headers: { 'Content-Type': 'application/x-www-form-urlencoded' } });
    }
    // 添加组织
    var addDepartment = function (postData) {
        return $http({ url: "" + $rootScope.projectName + "/Department/addDepartment", method: 'POST', data: postData, headers: { 'Content-Type': 'application/x-www-form-urlencoded' } });
    }
    // 更新某组织信息
    var updateDepartment = function (postData) {
        return $http({ url: "" + $rootScope.projectName + "/Department/updateDepartment", method: 'POST', data: postData, headers: { 'Content-Type': 'application/x-www-form-urlencoded' } });
    }
    // 获取某组织架构详情
    var getDepartment = function (postData) {
        return $http({ url: "" + $rootScope.projectName + "/Department/getDepartment", method: 'POST', data: postData, headers: { 'Content-Type': 'application/x-www-form-urlencoded' } });
    }
    // 删除某组织
    var delDepartment = function (postData) {
        return $http({ url: "" + $rootScope.projectName + "/Department/delDepartment", method: 'POST', data: postData, headers: { 'Content-Type': 'application/x-www-form-urlencoded' } });
    }
    // 获取员工列表
    var getStaffList = function (postData) {
        return $http({ url: "" + $rootScope.projectName + "/Staff/getStaffList", method: 'POST', data: postData, headers: { 'Content-Type': 'application/x-www-form-urlencoded' } });
    }
    // 更新员工信息
    var updateStaff = function (postData) {
        return $http({ url: "" + $rootScope.projectName + "/Staff/updateStaff", method: 'POST', data: postData, headers: { 'Content-Type': 'application/x-www-form-urlencoded' } });
    }
    // 保存员工信息
    var addStaff = function (postData) {
        return $http({ url: "" + $rootScope.projectName + "/Staff/addStaff", method: 'POST', data: postData, headers: { 'Content-Type': 'application/x-www-form-urlencoded' } });
    }
    // 获取员工信息
    var getStaff = function (postData) {
        return $http({ url: "" + $rootScope.projectName + "/Staff/getStaff", method: 'POST', data: postData, headers: { 'Content-Type': 'application/x-www-form-urlencoded' } });
    }
    // 删除员工信息
    var delStaff = function (postData) {
        return $http({ url: "" + $rootScope.projectName + "/Staff/delStaff", method: 'POST', data: postData, headers: { 'Content-Type': 'application/x-www-form-urlencoded' } });
    }
    // 获取需求列表
    var getRequestInfoListByPages = function (postData) {
        return $http({ url: "" + $rootScope.projectName + "/RequestInfo/getRequestInfoListByPages", method: 'POST', data: postData, headers: { 'Content-Type': 'application/x-www-form-urlencoded' } });
    }
    // 修改需求信息
    var updateRequestInfo = function (postData) {
        return $http({ url: "" + $rootScope.projectName + "/RequestInfo/updateRequestInfo", method: 'POST', data: postData, headers: { 'Content-Type': 'application/x-www-form-urlencoded' } });
    }
    // 获取基础信息详情
    var getRequestInfo = function (postData) {
        return $http({ url: "" + $rootScope.projectName + "/RequestInfo/getRequestInfo", method: 'POST', data: postData, headers: { 'Content-Type': 'application/x-www-form-urlencoded' } });
    }
    // 新增或更新设计阶段信息
    var addOrUpdateRequestDesign = function (postData) {
        return $http({ url: "" + $rootScope.projectName + "/RequestDesign/addOrUpdateRequestDesign", method: 'POST', data: postData, headers: { 'Content-Type': 'application/x-www-form-urlencoded' } });
    }
    // 根据需求编号获取设计阶段信息
    var getRequestDesign = function (postData) {
        return $http({ url: "" + $rootScope.projectName + "/RequestDesign/getRequestDesign", method: 'POST', data: postData, headers: { 'Content-Type': 'application/x-www-form-urlencoded' } });
    }
    // 添加或更新谈点
    var addOrUpdateRequestInfo = function (postData) {
        return $http({ url: "" + $rootScope.projectName + "/RequestTalk/addOrUpdateRequestInfo", method: 'POST', data: postData, headers: { 'Content-Type': 'application/x-www-form-urlencoded' } });
    }
    // 根据需求编码获取谈点详情
    var getRequestTalk = function (postData) {
        return $http({ url: "" + $rootScope.projectName + "/RequestTalk/getRequestTalk", method: 'POST', data: postData, headers: { 'Content-Type': 'application/x-www-form-urlencoded' } });
    }
    // 获取基站信息列表
    var getBaseStation = function (postData) {
        return $http({ url: "" + $rootScope.projectName + "/BaseStation/getBaseStation", method: 'POST', data: postData, headers: { 'Content-Type': 'application/x-www-form-urlencoded' } });
    }
    // 新增电表基础信息
    var addBaseMsg = function (postData) {
        return $http({ url: "" + $rootScope.projectName + "/BaseMsg/addBaseMsg", method: 'POST', data: postData, headers: { 'Content-Type': 'application/x-www-form-urlencoded' } });
    }
    // 更新电表信息
    var updateBaseMsg = function (postData) {
        return $http({ url: "" + $rootScope.projectName + "/BaseMsg/updateBaseMsg", method: 'POST', data: postData, headers: { 'Content-Type': 'application/x-www-form-urlencoded' } });
    }
    // 获取电费基础信息列表
    var getBaseMsgList = function (postData) {
        return $http({ url: "" + $rootScope.projectName + "/BaseMsg/getBaseMsgList", method: 'POST', data: postData, headers: { 'Content-Type': 'application/x-www-form-urlencoded' } });
    }
    // 获取下拉列表
    var getSelectList = function (postData) {
        return $http({ url: "" + $rootScope.projectName + "/Field/getSelectList", method: 'POST', data: postData, headers: { 'Content-Type': 'application/x-www-form-urlencoded' } });
    }
    // 获取某用户某时间段内的缴费记录
    var getBillMsgListByPages = function (postData) {
        return $http({ url: "" + $rootScope.projectName + "/BillMsg/getBillMsgListByPages", method: 'POST', data: postData, headers: { 'Content-Type': 'application/x-www-form-urlencoded' } });
    }
    // 保存缴费信息
    var addBillMsg = function (postData) {
        return $http({ url: "" + $rootScope.projectName + "/BillMsg/addBillMsg", method: 'POST', data: postData, headers: { 'Content-Type': 'application/x-www-form-urlencoded' } });
    }
    // 更新缴费信息
    var updateBillMsg = function (postData) {
        return $http({ url: "" + $rootScope.projectName + "/BillMsg/updateBillMsg", method: 'POST', data: postData, headers: { 'Content-Type': 'application/x-www-form-urlencoded' } });
    }
    // 根据ID获取缴费信息
    var getElectricityBillMsgById = function (postData) {
        return $http({ url: "" + $rootScope.projectName + "/BillMsg/getElectricityBillMsgById", method: 'POST', data: postData, headers: { 'Content-Type': 'application/x-www-form-urlencoded' } });
    }
    // 添加或更新施工阶段信息
    var addOrUpdateRequestBuild = function (postData) {
        return $http({ url: "" + $rootScope.projectName + "/RequestBuild/addOrUpdateRequestBuild", method: 'POST', data: postData, headers: { 'Content-Type': 'application/x-www-form-urlencoded' } });
    }
    // 根据需求编码获取施工信息
    var getRequestBuild = function (postData) {
        return $http({ url: "" + $rootScope.projectName + "/RequestBuild/getRequestBuild", method: 'POST', data: postData, headers: { 'Content-Type': 'application/x-www-form-urlencoded' } });
    }
    // 新增或更新验收阶段信息
    var addOrUpdateRequestAccept = function (postData) {
        return $http({ url: "" + $rootScope.projectName + "/RequestAccept/addOrUpdateRequestAccept", method: 'POST', data: postData, headers: { 'Content-Type': 'application/x-www-form-urlencoded' } });
    }
    // 根据需求编码获取验收阶段信息
    var getRequestAccept = function (postData) {
        return $http({ url: "" + $rootScope.projectName + "/RequestAccept/getRequestAccept", method: 'POST', data: postData, headers: { 'Content-Type': 'application/x-www-form-urlencoded' } });
    }
    // 根据需求编码获取系统项目信息详情
    var getPrjRequestSysinfo = function (postData) {
        return $http({ url: "" + $rootScope.projectName + "/RequestSysinfo/getPrjRequestSysinfo", method: 'POST', data: postData, headers: { 'Content-Type': 'application/x-www-form-urlencoded' } });
    }
    // 新增或更新系统项目信息
    var addOrUpdateRequestSysinfo = function (postData) {
        return $http({ url: "" + $rootScope.projectName + "/RequestSysinfo/addOrUpdateRequestSysinfo", method: 'POST', data: postData, headers: { 'Content-Type': 'application/x-www-form-urlencoded' } });
    }
    // 获取权限下拉框枚举值
    var getSelectListByUser = function (postData) {
        return $http({ url: "" + $rootScope.projectName + "/Field/getSelectListByUser", method: 'POST', data: postData, headers: { 'Content-Type': 'application/x-www-form-urlencoded' } });
    }
    // 删除电表信息
    var delBaseMsg = function (postData) {
        return $http({ url: "" + $rootScope.projectName + "/BaseMsg/delBaseMsg", method: 'POST', data: postData, headers: { 'Content-Type': 'application/x-www-form-urlencoded' } });
    }
    // 上传文件
    var upLoadFile = function (postData) {
        return $http({ url: "" + $rootScope.projectName + "/ExcelToData/upLoadFile", method: 'POST', data: postData, headers: { 'Content-Type': 'application/x-www-form-urlencoded' } });
    }
    // 上传自定义数据
    var importExcel = function (postData) {
        return $http({ url: "" + $rootScope.projectName + "/ExcelToData/importExcel", method: 'POST', data: postData, headers: { 'Content-Type': 'application/x-www-form-urlencoded' } });
    }
    // 获取分摊列表
    var getListByPages = function (postData) {
        return $http({ url: "" + $rootScope.projectName + "/BaseFTBL/getListByPages", method: 'POST', data: postData, headers: { 'Content-Type': 'application/x-www-form-urlencoded' } });
    }
    // 新增分摊比例
    var addBaseFTBL = function (postData) {
        return $http({ url: "" + $rootScope.projectName + "/BaseFTBL/addBaseFTBL", method: 'POST', data: postData, headers: { 'Content-Type': 'application/x-www-form-urlencoded' } });
    }
    // 编辑分摊比例
    var updateBaseFTBL = function (postData) {
        return $http({ url: "" + $rootScope.projectName + "/BaseFTBL/updateBaseFTBL", method: 'POST', data: postData, headers: { 'Content-Type': 'application/x-www-form-urlencoded' } });
    }
    // 取得分摊比例详情
    var getBaseFTBL = function (postData) {
        return $http({ url: "" + $rootScope.projectName + "/BaseFTBL/getBaseFTBL", method: 'POST', data: postData, headers: { 'Content-Type': 'application/x-www-form-urlencoded' } });
    }
    // 删除分摊比例
    var delBaseFTBL = function (postData) {
        return $http({ url: "" + $rootScope.projectName + "/BaseFTBL/delBaseFTBL", method: 'POST', data: postData, headers: { 'Content-Type': 'application/x-www-form-urlencoded' } });
    }
    // 分页获取文件管理列表
    var getSubListByPages = function (postData) {
        return $http({ url: "" + $rootScope.projectName + "/Sub/getSubListByPages", method: 'POST', data: postData, headers: { 'Content-Type': 'application/x-www-form-urlencoded' } });
    }
    // 获取公告列表
    var getNewsList = function (postData) {
        return $http({ url: "" + $rootScope.projectName + "/CompanyNews/getNewsList", method: 'POST', data: postData, headers: { 'Content-Type': 'application/x-www-form-urlencoded' } });
    }
    // 更新公告信息
    var updateNews = function (postData) {
        return $http({ url: "" + $rootScope.projectName + "/CompanyNews/UpdateNews", method: 'POST', data: postData, headers: { 'Content-Type': 'application/x-www-form-urlencoded' } });
    }
    // 保存公告信息
    var addNews = function (postData) {
        return $http({ url: "" + $rootScope.projectName + "/CompanyNews/AddNews", method: 'POST', data: postData, headers: { 'Content-Type': 'application/x-www-form-urlencoded' } });
    }
    // 获取公告信息
    var getNews = function (postData) {
        return $http({ url: "" + $rootScope.projectName + "/CompanyNews/getNewsById", method: 'POST', data: postData, headers: { 'Content-Type': 'application/x-www-form-urlencoded' } });
    }
    // 删除公告信息
    var delNews = function (postData) {
        return $http({ url: "" + $rootScope.projectName + "/CompanyNews/delNews", method: 'POST', data: postData, headers: { 'Content-Type': 'application/x-www-form-urlencoded' } });
    }
    // 重命名文件
    var renameSub = function (postData) {
        return $http({ url: "" + $rootScope.projectName + "/Sub/renameSub", method: 'POST', data: postData, headers: { 'Content-Type': 'application/x-www-form-urlencoded' } });
    }
    // 删除文件
    var delFiles = function (postData) {
        return $http({ url: "" + $rootScope.projectName + "/Sub/delFiles", method: 'POST', data: postData, headers: { 'Content-Type': 'application/x-www-form-urlencoded' } });
    }
    // 获取文件列表
    var getSubList = function (postData) {
        return $http({ url: "" + $rootScope.projectName + "/Sub/getSubList", method: 'POST', data: postData, headers: { 'Content-Type': 'application/x-www-form-urlencoded' } });
    }
    // 删除缴费信息
    var delElectricityBillMsg = function (postData) {
        return $http({ url: "" + $rootScope.projectName + "/BillMsg/delElectricityBillMsg", method: 'POST', data: postData, headers: { 'Content-Type': 'application/x-www-form-urlencoded' } });
    }
    // 新增角色
    var addRole = function (postData) {
        return $http({ url: "" + $rootScope.projectName + "/Jurisdiction/addRole", method: 'POST', data: postData, headers: { 'Content-Type': 'application/x-www-form-urlencoded' } });
    }
    // 更新角色信息
    var updateRole = function (postData) {
        return $http({ url: "" + $rootScope.projectName + "/Jurisdiction/updateRole", method: 'POST', data: postData, headers: { 'Content-Type': 'application/x-www-form-urlencoded' } });
    }
    // 删除角色
    var delRole = function (postData) {
        return $http({ url: "" + $rootScope.projectName + "/Jurisdiction/delRole", method: 'POST', data: postData, headers: { 'Content-Type': 'application/x-www-form-urlencoded' } });
    }
    // 获取角色列表
    var getPlatformRoleListByPages = function (postData) {
        return $http({ url: "" + $rootScope.projectName + "/Jurisdiction/getPlatformRoleListByPages", method: 'POST', data: postData, headers: { 'Content-Type': 'application/x-www-form-urlencoded' } });
    }
    // 获取功能列表
    var getPlatformFunctionsListByPages = function (postData) {
        return $http({ url: "" + $rootScope.projectName + "/Jurisdiction/getPlatformFunctionsListByPages", method: 'POST', data: postData, headers: { 'Content-Type': 'application/x-www-form-urlencoded' } });
    }
    // 获取作用域列表
    var getPlatformActionAreaListByPages = function (postData) {
        return $http({ url: "" + $rootScope.projectName + "/Jurisdiction/getPlatformActionAreaListByPages", method: 'POST', data: postData, headers: { 'Content-Type': 'application/x-www-form-urlencoded' } });
    }
    // 获取员工作用域列表
    var getPlatformActionStaffListByPages = function (postData) {
        return $http({ url: "" + $rootScope.projectName + "/Jurisdiction/getPlatformActionStaffListByPages", method: 'POST', data: postData, headers: { 'Content-Type': 'application/x-www-form-urlencoded' } });
    }
    // 获取角色功能列表
    var getPlatformRoleRelaListByPages = function (postData) {
        return $http({ url: "" + $rootScope.projectName + "/Jurisdiction/getPlatformRoleRelaListByPages", method: 'POST', data: postData, headers: { 'Content-Type': 'application/x-www-form-urlencoded' } });
    }
    // 获取员工角色列表
    var getPlatformRoleStaffListByPages = function (postData) {
        return $http({ url: "" + $rootScope.projectName + "/Jurisdiction/getPlatformRoleStaffListByPages", method: 'POST', data: postData, headers: { 'Content-Type': 'application/x-www-form-urlencoded' } });
    }
    // 添加新功能
    var addFunctions = function (postData) {
        return $http({ url: "" + $rootScope.projectName + "/Jurisdiction/addFunctions", method: 'POST', data: postData, headers: { 'Content-Type': 'application/x-www-form-urlencoded' } });
    }
    // 根据ID删除某功能权
    var delFunctions = function (postData) {
        return $http({ url: "" + $rootScope.projectName + "/Jurisdiction/delFunctions", method: 'POST', data: postData, headers: { 'Content-Type': 'application/x-www-form-urlencoded' } });
    }
    // 更新功能权信息
    var updateFunctions = function (postData) {
        return $http({ url: "" + $rootScope.projectName + "/Jurisdiction/updateFunctions", method: 'POST', data: postData, headers: { 'Content-Type': 'application/x-www-form-urlencoded' } });
    }
    // 新增作用域
    var addActionArea = function (postData) {
        return $http({ url: "" + $rootScope.projectName + "/Jurisdiction/addActionArea", method: 'POST', data: postData, headers: { 'Content-Type': 'application/x-www-form-urlencoded' } });
    }
    // 删除作用域
    var delActionArea = function (postData) {
        return $http({ url: "" + $rootScope.projectName + "/Jurisdiction/delActionArea", method: 'POST', data: postData, headers: { 'Content-Type': 'application/x-www-form-urlencoded' } });
    }
    // 修改作用域
    var updateActionArea = function (postData) {
        return $http({ url: "" + $rootScope.projectName + "/Jurisdiction/updateActionArea", method: 'POST', data: postData, headers: { 'Content-Type': 'application/x-www-form-urlencoded' } });
    }
    // 新增员工作用域
    var addActionStaff = function (postData) {
        return $http({ url: "" + $rootScope.projectName + "/Jurisdiction/addActionStaff", method: 'POST', data: postData, headers: { 'Content-Type': 'application/x-www-form-urlencoded' } });
    }
    // 删除员工作用域
    var delActionStaff = function (postData) {
        return $http({ url: "" + $rootScope.projectName + "/Jurisdiction/delActionStaff", method: 'POST', data: postData, headers: { 'Content-Type': 'application/x-www-form-urlencoded' } });
    }
    // 修改员工作用域
    var updateActionStaff = function (postData) {
        return $http({ url: "" + $rootScope.projectName + "/Jurisdiction/updateActionStaff", method: 'POST', data: postData, headers: { 'Content-Type': 'application/x-www-form-urlencoded' } });
    }
    // 新增角色功能
    var addRoleRela = function (postData) {
        return $http({ url: "" + $rootScope.projectName + "/Jurisdiction/addRoleRela", method: 'POST', data: postData, headers: { 'Content-Type': 'application/x-www-form-urlencoded' } });
    }
    // 删除角色功能
    var delRoleRela = function (postData) {
        return $http({ url: "" + $rootScope.projectName + "/Jurisdiction/delRoleRela", method: 'POST', data: postData, headers: { 'Content-Type': 'application/x-www-form-urlencoded' } });
    }
    // 修改角色功能信息
    var updateRoleRela = function (postData) {
        return $http({ url: "" + $rootScope.projectName + "/Jurisdiction/updateRoleRela", method: 'POST', data: postData, headers: { 'Content-Type': 'application/x-www-form-urlencoded' } });
    }
    // 新增员工角色
    var addRoleStaff = function (postData) {
        return $http({ url: "" + $rootScope.projectName + "/Jurisdiction/addRoleStaff", method: 'POST', data: postData, headers: { 'Content-Type': 'application/x-www-form-urlencoded' } });
    }
    // 删除角色员工信息
    var delRoleStaff = function (postData) {
        return $http({ url: "" + $rootScope.projectName + "/Jurisdiction/delRoleStaff", method: 'POST', data: postData, headers: { 'Content-Type': 'application/x-www-form-urlencoded' } });
    }
    // 更新员工角色信息
    var updateRoleStaff = function (postData) {
        return $http({ url: "" + $rootScope.projectName + "/Jurisdiction/updateRoleStaff", method: 'POST', data: postData, headers: { 'Content-Type': 'application/x-www-form-urlencoded' } });
    }
    // 导入历史报账
    var importReimbursement = function (postData) {
        return $http({ url: "" + $rootScope.projectName + "/ExcelToData/importReimbursement", method: 'POST', data: postData, headers: { 'Content-Type': 'application/x-www-form-urlencoded' } });
    }
    // 获取历史报账列表
    var getBillPayInfo = function (postData) {
        return $http({ url: "" + $rootScope.projectName + "/BillPayInfo/getBillPayInfo", method: 'POST', data: postData, headers: { 'Content-Type': 'application/x-www-form-urlencoded' } });
    }
    // 导出历史报账列表
    var Export = function (postData) {
        return $http({ url: "" + $rootScope.projectName + "/BillPayInfo/Export", method: 'POST', data: postData, headers: { 'Content-Type': 'application/x-www-form-urlencoded' } });
    }
    // 导入报账
    var importReimbursementAudit = function (postData) {
        return $http({ url: "" + $rootScope.projectName + "/ExcelToData/importReimbursementAudit", method: 'POST', data: postData, headers: { 'Content-Type': 'application/x-www-form-urlencoded' } });
    }
    // 获取工程报账列表
    var getReimbursementAuditListByPages = function (postData) {
        return $http({ url: "" + $rootScope.projectName + "/BillPayInfo/getReimbursementAuditListByPages", method: 'POST', data: postData, headers: { 'Content-Type': 'application/x-www-form-urlencoded' } });
    }
    // 获取数据词典列表
    var getProjectFieldLisyByPages = function (postData) {
        return $http({ url: "" + $rootScope.projectName + "/DdInfo/getProjectFieldLisyByPages", method: 'POST', data: postData, headers: { 'Content-Type': 'application/x-www-form-urlencoded' } });
    }
    // 更新数据词典信息
    var updateField = function (postData) {
        return $http({ url: "" + $rootScope.projectName + "/DdInfo/updateField", method: 'POST', data: postData, headers: { 'Content-Type': 'application/x-www-form-urlencoded' } });
    }
    // 删除数据词典
    var delField = function (postData) {
        return $http({ url: "" + $rootScope.projectName + "/DdInfo/delField", method: 'POST', data: postData, headers: { 'Content-Type': 'application/x-www-form-urlencoded' } });
    }
    // 新增数据词典
    var addField = function (postData) {
        return $http({ url: "" + $rootScope.projectName + "/DdInfo/addField", method: 'POST', data: postData, headers: { 'Content-Type': 'application/x-www-form-urlencoded' } });
    }
    // 获取数据词典列表
    var getDdInfoListByPages = function (postData) {
        return $http({ url: "" + $rootScope.projectName + "/DdInfo/getDdInfoListByPages", method: 'POST', data: postData, headers: { 'Content-Type': 'application/x-www-form-urlencoded' } });
    }
    // 更新数据词典信息
    var updateDdInfo = function (postData) {
        return $http({ url: "" + $rootScope.projectName + "/DdInfo/updateDdInfo", method: 'POST', data: postData, headers: { 'Content-Type': 'application/x-www-form-urlencoded' } });
    }
    // 删除数据词典
    var delDdInfo = function (postData) {
        return $http({ url: "" + $rootScope.projectName + "/DdInfo/delDdInfo", method: 'POST', data: postData, headers: { 'Content-Type': 'application/x-www-form-urlencoded' } });
    }
    // 新增数据词典
    var addDdInfo = function (postData) {
        return $http({ url: "" + $rootScope.projectName + "/DdInfo/addDdInfo", method: 'POST', data: postData, headers: { 'Content-Type': 'application/x-www-form-urlencoded' } });
    }
    // 根据词典编码获取数据词典详情
    var getField = function (postData) {
        return $http({ url: "" + $rootScope.projectName + "/DdInfo/getField", method: 'POST', data: postData, headers: { 'Content-Type': 'application/x-www-form-urlencoded' } });
    }
    // 获取数据字典
    var getDdInfo = function (postData) {
        return $http({ url: "" + $rootScope.projectName + "/DdInfo/getDdInfo", method: 'POST', data: postData, headers: { 'Content-Type': 'application/x-www-form-urlencoded' } });
    }
    // 导出excel
    var exportBillMsg = function (postData) {
        return $http({ url: "" + $rootScope.projectName + "/BillMsg/exportBillMsg", method: 'POST', data: postData, headers: { 'Content-Type': 'application/x-www-form-urlencoded' } });
    }
    // 获取分摊比例列表
    var getViewFtblListByPages = function (postData) {
        return $http({ url: "" + $rootScope.projectName + "/BaseFTBL/getViewFtblListByPages", method: 'POST', data: postData, headers: { 'Content-Type': 'application/x-www-form-urlencoded' } });
    }
    // 根据ID获取新闻信息
    var getNewsById = function (postData) {
        return $http({ url: "" + $rootScope.projectName + "/CompanyNews/getNewsById", method: 'POST', data: postData, headers: { 'Content-Type': 'application/x-www-form-urlencoded' } });
    }
    // 删除新闻信息
    var DelNews = function (postData) {
        return $http({ url: "" + $rootScope.projectName + "/CompanyNews/DelNews", method: 'POST', data: postData, headers: { 'Content-Type': 'application/x-www-form-urlencoded' } });
    }
    // 获取自增ID
    var getPkId = function (postData) {
        return $http({ url: "" + $rootScope.projectName + "/Sub/getPkId", method: 'POST', data: postData, headers: { 'Content-Type': 'application/x-www-form-urlencoded' } });
    }
    // 获取待处理工单列表
    var getBillStoreRequestListByPage = function (postData) {
        return $http({ url: "" + $rootScope.projectName + "/BillPayInfo/getBillStoreRequestListByPage", method: 'POST', data: postData, headers: { 'Content-Type': 'application/x-www-form-urlencoded' } });
    }
    // 获取财务物资列表
    var getBillStoreTbInfoListByPages = function (postData) {
        return $http({ url: "" + $rootScope.projectName + "/BillPayInfo/getBillStoreTbInfoListByPages", method: 'POST', data: postData, headers: { 'Content-Type': 'application/x-www-form-urlencoded' } });
    }
    // 提交物资申请
    var materialRequest = function (postData) {
        return $http({ url: "" + $rootScope.projectName + "/BillPayInfo/materialRequest", method: 'POST', data: postData, headers: { 'Content-Type': 'application/x-www-form-urlencoded' } });
    }
    // 获取待处理详情
    var getBillStoreRequestData = function (postData) {
        return $http({ url: "" + $rootScope.projectName + "/BillPayInfo/getBillStoreRequestData", method: 'POST', data: postData, headers: { 'Content-Type': 'application/x-www-form-urlencoded' } });
    }
    // 撤销待处理申请
    var revokeBillStoreRequest = function (postData) {
        return $http({ url: "" + $rootScope.projectName + "/BillPayInfo/revokeBillStoreRequest", method: 'POST', data: postData, headers: { 'Content-Type': 'application/x-www-form-urlencoded' } });
    }
    // 确认收货
    var goodsReceiptBillStoreRequest = function (postData) {
        return $http({ url: "" + $rootScope.projectName + "/BillPayInfo/goodsReceiptBillStoreRequest", method: 'POST', data: postData, headers: { 'Content-Type': 'application/x-www-form-urlencoded' } });
    }
    // 审批待处理申请
    var subjectBillStoreRequest = function (postData) {
        return $http({ url: "" + $rootScope.projectName + "/BillPayInfo/subjectBillStoreRequest", method: 'POST', data: postData, headers: { 'Content-Type': 'application/x-www-form-urlencoded' } });
    }
    // 根据站直编码获取电表基础信息
    var getBaseMsgByStationCode = function (postData) {
        return $http({ url: "" + $rootScope.projectName + "/BaseMsg/getBaseMsgByStationCode", method: 'POST', data: postData, headers: { 'Content-Type': 'application/x-www-form-urlencoded' } });
    }
    // 保存转供电报账申请
    var addBillApproval = function (postData) {
        return $http({ url: "" + $rootScope.projectName + "/BillApproval/addBillApproval", method: 'POST', data: postData, headers: { 'Content-Type': 'application/x-www-form-urlencoded' } });
    }
    // 获取CRM列表
    var getExcelCRMListByPage = function (postData) {
        return $http({ url: "" + $rootScope.projectName + "/BillMsg/getExcelCRMListByPage", method: 'POST', data: postData, headers: { 'Content-Type': 'application/x-www-form-urlencoded' } });
    }
    // 导出CRM
    var exportCRM = function (postData) {
        return $http({ url: "" + $rootScope.projectName + "/BillMsg/exportCRM", method: 'POST', data: postData, headers: { 'Content-Type': 'application/x-www-form-urlencoded' } });
    }
    // 获取电费异常报账列表
    var getDFAbnormalAllList = function (postData) {
        return $http({ url: "" + $rootScope.projectName + "/BillMsg/getDFAbnormalAllList", method: 'POST', data: postData, headers: { 'Content-Type': 'application/x-www-form-urlencoded' } });
    }
    // 导出电费异常报账列表
    var exportDFAbnormal = function (postData) {
        return $http({ url: "" + $rootScope.projectName + "/BillMsg/exportDFAbnormal", method: 'POST', data: postData, headers: { 'Content-Type': 'application/x-www-form-urlencoded' } });
    }
    // 获取角色获取功能列表
    var getPlatformRoleRelaByRole = function (postData) {
        return $http({ url: "" + $rootScope.projectName + "/Jurisdiction/getPlatformRoleRelaByRole", method: 'POST', data: postData, headers: { 'Content-Type': 'application/x-www-form-urlencoded' } });
    }
    // 获取员工获取作用域列表
    var getPlatformActionStaffByStaff = function (postData) {
        return $http({ url: "" + $rootScope.projectName + "/Jurisdiction/getPlatformActionStaffByStaff", method: 'POST', data: postData, headers: { 'Content-Type': 'application/x-www-form-urlencoded' } });
    }
    // 根据员工获取角色列表
    var getPlatformRoleStaffByStaff = function (postData) {
        return $http({ url: "" + $rootScope.projectName + "/Jurisdiction/getPlatformRoleStaffByStaff", method: 'POST', data: postData, headers: { 'Content-Type': 'application/x-www-form-urlencoded' } });
    }
    // 导入电费分摊比例
    var importFTBL = function (postData) {
        return $http({ url: "" + $rootScope.projectName + "/ExcelToData/importFTBL", method: 'POST', data: postData, headers: { 'Content-Type': 'application/x-www-form-urlencoded' } });
    }
    // 获取清单列表
    var getViewDfBzStationList = function (postData) {
        return $http({ url: "" + $rootScope.projectName + "/BillMsg/getViewDfBzStationList", method: 'POST', data: postData, headers: { 'Content-Type': 'application/x-www-form-urlencoded' } });
    }
    // 获取站点列表
    var getStationList = function (postData) {
        return $http({ url: "" + $rootScope.projectName + "/Station/getStationList", method: 'POST', data: postData, headers: { 'Content-Type': 'application/x-www-form-urlencoded' } });
    }
    // 导出清单
    var exportViewDfBzStation = function (postData) {
        return $http({ url: "" + $rootScope.projectName + "/BillMsg/exportViewDfBzStation", method: 'POST', data: postData, headers: { 'Content-Type': 'application/x-www-form-urlencoded' } });
    }
    // 获取全量站点电费报账
    var getFxEpmsPayElecMonthListByPages = function (postData) {
        return $http({ url: "" + $rootScope.projectName + "/BillMsg/getFxEpmsPayElecMonthListByPages", method: 'POST', data: postData, headers: { 'Content-Type': 'application/x-www-form-urlencoded' } });
    }
    // 获取运营商的获取起租订单数(占比图)
    var getRentInfo = function (postData) {
        return $http({ url: "" + $rootScope.projectName + "/Station/getRentInfo", method: 'POST', data: postData, headers: { 'Content-Type': 'application/x-www-form-urlencoded' } });
    }
    // 获取当前用户是否有审核权限
    var isNoJurisdiction = function (postData) {
        return $http({ url: "" + $rootScope.projectName + "/BillApproval/isNoJurisdiction", method: 'POST', data: postData, headers: { 'Content-Type': 'application/x-www-form-urlencoded' } });
    }
    // 获取月均，环比，上月截止度数
    var getElectricityBillApproval = function (postData) {
        return $http({ url: "" + $rootScope.projectName + "/BillApproval/getElectricityBillApproval", method: 'POST', data: postData, headers: { 'Content-Type': 'application/x-www-form-urlencoded' } });
    }
    // 删除转供电报账申请
    var delBillApproval = function (postData) {
        return $http({ url: "" + $rootScope.projectName + "/BillApproval/delBillApproval", method: 'POST', data: postData, headers: { 'Content-Type': 'application/x-www-form-urlencoded' } });
    }
    // 导入转供电报账申请
    var importBillApproval = function (postData) {
        return $http({ url: "" + $rootScope.projectName + "/ExcelToData/importBillApproval", method: 'POST', data: postData, headers: { 'Content-Type': 'application/x-www-form-urlencoded' } });
    }

    // 根据部门获取下拉框枚举值
    var getSelectListByOrgan = function (postData) {
        return $http({ url: "" + $rootScope.projectName + "/Field/getSelectListByOrgan", method: 'POST', data: postData, headers: { 'Content-Type': 'application/x-www-form-urlencoded' } });
    }
    return {
        post: function (url, postData, isDialogError) { return post(url, postData, isDialogError); },
        get: function (url) { return get(url); },
        getSelectListByOrgan: function (postData) { return getSelectListByOrgan(postData); },
        importBillApproval: function (postData) { return importBillApproval(postData); },
        delBillApproval: function (postData) { return delBillApproval(postData); },
        getElectricityBillApproval: function (postData) { return getElectricityBillApproval(postData); },
        isNoJurisdiction: function (postData) { return isNoJurisdiction(postData); },
        getRentInfo: function (postData) { return getRentInfo(postData); },
        getFxEpmsPayElecMonthListByPages: function (postData) { return getFxEpmsPayElecMonthListByPages(postData); },
        exportViewDfBzStation: function (postData) { return exportViewDfBzStation(postData); },
        getStationList: function (postData) { return getStationList(postData); },
        importFTBL: function (postData) { return importFTBL(postData); },
        getViewDfBzStationList: function (postData) { return getViewDfBzStationList(postData); },
        getPlatformRoleStaffByStaff: function (postData) { return getPlatformRoleStaffByStaff(postData); },
        getPlatformActionStaffByStaff: function (postData) { return getPlatformActionStaffByStaff(postData); },
        getPlatformRoleRelaByRole: function (postData) { return getPlatformRoleRelaByRole(postData); },
        modefyPSW: function (postData) { return modefyPSW(postData); },
        exportDFAbnormal: function (postData) { return exportDFAbnormal(postData); },
        getDFAbnormalAllList: function (postData) { return getDFAbnormalAllList(postData); },
        exportCRM: function (postData) { return exportCRM(postData); },
        getExcelCRMListByPage: function (postData) { return getExcelCRMListByPage(postData); },
        addBillApproval: function (postData) { return addBillApproval(postData); },
        getBaseMsgByStationCode: function (postData) { return getBaseMsgByStationCode(postData); },
        subjectBillStoreRequest: function (postData) { return subjectBillStoreRequest(postData); },
        goodsReceiptBillStoreRequest: function (postData) { return goodsReceiptBillStoreRequest(postData); },
        revokeBillStoreRequest: function (postData) { return revokeBillStoreRequest(postData); },
        getBillStoreRequestData: function (postData) { return getBillStoreRequestData(postData); },
        materialRequest: function (postData) { return materialRequest(postData); },
        getBillStoreTbInfoListByPages: function (postData) { return getBillStoreTbInfoListByPages(postData); },
        logout: function (postData) { return logout(postData); },
        getDepartmentList: function (postData) { return getDepartmentList(postData); },
        addDepartment: function (postData) { return addDepartment(postData); },
        updateDepartment: function (postData) { return updateDepartment(postData); },
        getDepartment: function (postData) { return getDepartment(postData); },
        delDepartment: function (postData) { return delDepartment(postData); },
        getStaffList: function (postData) { return getStaffList(postData); },
        updateStaff: function (postData) { return updateStaff(postData); },
        addStaff: function (postData) { return addStaff(postData); },
        getStaff: function (postData) { return getStaff(postData); },
        delStaff: function (postData) { return delStaff(postData); },
        getRequestInfoListByPages: function (postData) { return getRequestInfoListByPages(postData); },
        updateRequestInfo: function (postData) { return updateRequestInfo(postData); },
        getRequestInfo: function (postData) { return getRequestInfo(postData); },
        addOrUpdateRequestDesign: function (postData) { return addOrUpdateRequestDesign(postData); },
        getRequestDesign: function (postData) { return getRequestDesign(postData); },
        addOrUpdateRequestInfo: function (postData) { return addOrUpdateRequestInfo(postData); },
        getRequestTalk: function (postData) { return getRequestTalk(postData); },
        getBaseStation: function (postData) { return getBaseStation(postData); },
        addBaseMsg: function (postData) { return addBaseMsg(postData); },
        updateBaseMsg: function (postData) { return updateBaseMsg(postData); },
        getBaseMsgList: function (postData) { return getBaseMsgList(postData); },
        getSelectList: function (postData) { return getSelectList(postData); },
        getBillMsgListByPages: function (postData) { return getBillMsgListByPages(postData); },
        addBillMsg: function (postData) { return addBillMsg(postData); },
        updateBillMsg: function (postData) { return updateBillMsg(postData); },
        getElectricityBillMsgById: function (postData) { return getElectricityBillMsgById(postData); },
        addOrUpdateRequestBuild: function (postData) { return addOrUpdateRequestBuild(postData); },
        getRequestBuild: function (postData) { return getRequestBuild(postData); },
        addOrUpdateRequestAccept: function (postData) { return addOrUpdateRequestAccept(postData); },
        getRequestAccept: function (postData) { return getRequestAccept(postData); },
        getPrjRequestSysinfo: function (postData) { return getPrjRequestSysinfo(postData); },
        addOrUpdateRequestSysinfo: function (postData) { return addOrUpdateRequestSysinfo(postData); },
        getSelectListByUser: function (postData) { return getSelectListByUser(postData); },
        delBaseMsg: function (postData) { return delBaseMsg(postData); },
        upLoadFile: function (postData) { return upLoadFile(postData); },
        importExcel: function (postData) { return importExcel(postData); },
        getListByPages: function (postData) { return getListByPages(postData); },
        addBaseFTBL: function (postData) { return addBaseFTBL(postData); },
        updateBaseFTBL: function (postData) { return updateBaseFTBL(postData); },
        getBaseFTBL: function (postData) { return getBaseFTBL(postData); },
        delBaseFTBL: function (postData) { return delBaseFTBL(postData); },
        getSubListByPages: function (postData) { return getSubListByPages(postData); },
        renameSub: function (postData) { return renameSub(postData); },
        delFiles: function (postData) { return delFiles(postData); },
        getNewsList: function (postData) { return getNewsList(postData); },
        addNews: function (postData) { return addNews(postData); },
        updateNews: function (postData) { return updateNews(postData); },
        getNews: function (postData) { return getNews(postData); },
        delNews: function (postData) { return delNews(postData); },
        getSubList: function (postData) { return getSubList(postData); },
        delElectricityBillMsg: function (postData) { return delElectricityBillMsg(postData); },
        addRole: function (postData) { return addRole(postData); },
        updateRole: function (postData) { return updateRole(postData); },
        delRole: function (postData) { return delRole(postData); },
        getPlatformRoleListByPages: function (postData) { return getPlatformRoleListByPages(postData); },
        getPlatformFunctionsListByPages: function (postData) { return getPlatformFunctionsListByPages(postData); },
        getPlatformActionAreaListByPages: function (postData) { return getPlatformActionAreaListByPages(postData); },
        getPlatformActionStaffListByPages: function (postData) { return getPlatformActionStaffListByPages(postData); },
        getPlatformRoleRelaListByPages: function (postData) { return getPlatformRoleRelaListByPages(postData); },
        getPlatformRoleStaffListByPages: function (postData) { return getPlatformRoleStaffListByPages(postData); },
        addFunctions: function (postData) { return addFunctions(postData); },
        delFunctions: function (postData) { return delFunctions(postData); },
        updateFunctions: function (postData) { return updateFunctions(postData); },
        addActionArea: function (postData) { return addActionArea(postData); },
        delActionArea: function (postData) { return delActionArea(postData); },
        updateActionArea: function (postData) { return updateActionArea(postData); },
        addActionStaff: function (postData) { return addActionStaff(postData); },
        delActionStaff: function (postData) { return delActionStaff(postData); },
        updateActionStaff: function (postData) { return updateActionStaff(postData); },
        addRoleRela: function (postData) { return addRoleRela(postData); },
        delRoleRela: function (postData) { return delRoleRela(postData); },
        updateRoleRela: function (postData) { return updateRoleRela(postData); },
        addRoleStaff: function (postData) { return addRoleStaff(postData); },
        delRoleStaff: function (postData) { return delRoleStaff(postData); },
        updateRoleStaff: function (postData) { return updateRoleStaff(postData); },
        importReimbursement: function (postData) { return importReimbursement(postData); },
        getBillPayInfo: function (postData) { return getBillPayInfo(postData); },
        Export: function (postData) { return Export(postData); },
        importReimbursementAudit: function (postData) { return importReimbursementAudit(postData); },
        getReimbursementAuditListByPages: function (postData) { return getReimbursementAuditListByPages(postData); },
        getProjectFieldLisyByPages: function (postData) { return getProjectFieldLisyByPages(postData); },
        updateField: function (postData) { return updateField(postData); },
        delField: function (postData) { return delField(postData); },
        addField: function (postData) { return addField(postData); },
        getDdInfoListByPages: function (postData) { return getDdInfoListByPages(postData); },
        updateDdInfo: function (postData) { return updateDdInfo(postData); },
        delDdInfo: function (postData) { return delDdInfo(postData); },
        addDdInfo: function (postData) { return addDdInfo(postData); },
        getField: function (postData) { return getField(postData); },
        getDdInfo: function (postData) { return getDdInfo(postData); },
        exportBillMsg: function (postData) { return exportBillMsg(postData); },
        getViewFtblListByPages: function (postData) { return getViewFtblListByPages(postData); },
        getNewsById: function (postData) { return getNewsById(postData); },
        DelNews: function (postData) { return DelNews(postData); },
        getPkId: function (postData) { return getPkId(postData); },
        getBillStoreRequestListByPage: function (postData) { return getBillStoreRequestListByPage(postData); }
    }
}]);