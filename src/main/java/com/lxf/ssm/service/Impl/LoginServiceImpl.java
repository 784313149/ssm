package com.lxf.ssm.service.Impl;

import com.alibaba.fastjson.JSONObject;
import com.lxf.ssm.dao.LoginMapper;
import com.lxf.ssm.entity.SsmUser;
import com.lxf.ssm.service.LoginService;
import com.lxf.ssm.common.AjaxResult;
import com.lxf.ssm.common.RequestPayload;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.servlet.http.HttpServletRequest;
import java.util.List;

@Service
public class LoginServiceImpl implements LoginService {

    @Autowired
    LoginMapper loginMapper;

    /**
     * 查询所有用户
     * @return
     */
    @Override
    public List<SsmUser> selectAll() {
        return loginMapper.selectAll();
    }

    /**
     * 根据用户ID查询
     * @param uid
     * @return
     */
    @Override
    public SsmUser selectByPrimaryKey(int uid) {return loginMapper.selectByPrimaryKey(uid);}

    /**
     * 登录判断
     * @param request
     * @return
     */
    @Override
    public AjaxResult singIn(HttpServletRequest request) {
        //定义返回值
        AjaxResult ajaxResult = new AjaxResult();
        //获取参数
        RequestPayload rp = new RequestPayload();
        JSONObject params = rp.analysisJson(request);
        String name = params.getString("name");
        String password = params.getString("password");
        //调用dao
        int result = loginMapper.signIn(name,password);
        if(result <= 0){
            ajaxResult.setRetcode(500);
            ajaxResult.setRetmsg("账号或密码错误！");
            ajaxResult.setData(result);
        }else{
            ajaxResult.setData(name);
        }
        return ajaxResult;
    }
}
