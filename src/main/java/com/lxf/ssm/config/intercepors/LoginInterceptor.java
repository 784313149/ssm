package com.lxf.ssm.config.intercepors;

import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;
import org.springframework.web.servlet.ModelAndView;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

@Component
public class LoginInterceptor implements HandlerInterceptor {

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {
        Object account = request.getSession().getAttribute("account");
        if (account == null){
            request.setAttribute("msg","请先登录");
            // 获取request返回页面到登录页
            // request.getRequestDispatcher("/Login").forward(request, response);
            response.sendRedirect("/Login");
            return false;
        }
        return true;
    }

    @Override
    public void postHandle(HttpServletRequest request, HttpServletResponse response, Object handler, ModelAndView modelAndView) throws Exception {
//        Object account = request.getSession().getAttribute("account");
//        System.out.println("postHandle----" + account + " ::: " + request.getRequestURL());
    }

    @Override
    public void afterCompletion(HttpServletRequest request, HttpServletResponse response, Object handler, Exception ex) throws Exception {
//        Object account = request.getSession().getAttribute("account");
//        System.out.println("afterCompletion----" + account + " ::: " + request.getRequestURL());
    }
}
