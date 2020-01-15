package com.lxf.ssm.service;

import com.lxf.ssm.entity.SsmUser;
import com.lxf.ssm.common.AjaxResult;

import javax.servlet.http.HttpServletRequest;
import java.util.List;

public interface LoginService {

    /**
     * 获取所有用户信息
     * @return
     */
    List<SsmUser> selectAll();

    /**
     * 通过uid获取用户信息
     * @param uid
     * @return
     */
    public SsmUser selectByPrimaryKey(int uid);

    /**
     * 判断登录
     * @param request
     * @return
     */
    AjaxResult singIn(HttpServletRequest request);
}
