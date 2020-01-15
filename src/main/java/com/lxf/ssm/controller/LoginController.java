package com.lxf.ssm.controller;

import com.lxf.ssm.entity.SsmUser;
import com.lxf.ssm.service.LoginService;
import com.lxf.ssm.common.AjaxResult;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;
import java.util.List;

@Controller
//@RestController
public class LoginController {
    @Autowired
    private LoginService loginService;


    @RequestMapping("/Home")
    public String Home(){
        return "Home/Home";
    }

    @RequestMapping("/Login")
    public String Login(){
        return "Login/Login";
    }

    /**
     * 退出登录
     * @param session
     * @return
     */
    @ResponseBody
    @RequestMapping("/logout")
    public String logout(HttpSession session) {
        // 移除session
        session.removeAttribute("account");
        return "/Login";
    }

    @ResponseBody
    @RequestMapping("/selectByPrimaryKey")
    public AjaxResult selectByPrimaryKey(int uid){
        AjaxResult ajaxResult = new AjaxResult();
        SsmUser ssmUser = loginService.selectByPrimaryKey(uid);
        ajaxResult.setData(ssmUser);
        return ajaxResult;
    }

    @ResponseBody
    @RequestMapping("/selectAll")
    public AjaxResult selectAll(){
        AjaxResult ajaxResult = new AjaxResult();
        List<SsmUser> ssmUser = loginService.selectAll();
        ajaxResult.setData(ssmUser);
        return ajaxResult;
    }

    @ResponseBody
    @RequestMapping("/signIn")
    public AjaxResult signIn(HttpServletRequest request, HttpSession session){
        AjaxResult ajaxResult = loginService.singIn(request);

        //访问成功，保存用户名到session
        if(ajaxResult.getRetcode() == 200){
            session.setAttribute("account",ajaxResult.getData());
            ajaxResult.setData("/Home");
        }
        return ajaxResult;
    }
}
