package com.lxf.ssm.common;

import com.alibaba.fastjson.JSONObject;
import com.lxf.ssm.entity.SsmUserImprotResult;

/**
 * 实体类操作工具
 */
public class BeanUtils<T> {
    private Class<T> clzz;
    /**
     * 转换，通过JSON实现
     */
    public static<T> T convert(Object object, Class<T> clazz){
        String obj = JSONObject.toJSONString(object);
        T t = JSONObject.parseObject(obj,clazz);
        return t;
    }
}
