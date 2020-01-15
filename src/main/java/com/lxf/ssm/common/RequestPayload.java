package com.lxf.ssm.common;

import com.alibaba.fastjson.JSONObject;

import javax.servlet.http.HttpServletRequest;
import java.io.BufferedReader;
import java.io.IOException;

/**
 * 解析前端Request Payload 中的Json参数
 */
public class RequestPayload {
    public JSONObject analysisJson(HttpServletRequest request){
        StringBuilder sb = new StringBuilder();
        try(BufferedReader reader = request.getReader()) {
            char[]buff = new char[1024];
            int len;
            while((len = reader.read(buff)) != -1) {
                sb.append(buff,0, len);
            }
        }catch (IOException e) {
            e.printStackTrace();
        }
        String s = sb.toString();
        JSONObject jb = JSONObject.parseObject(s);
        return jb;
    }
}
