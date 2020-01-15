package com.lxf.ssm.common;

import net.sf.json.JSONArray;
import net.sf.json.JSONObject;

import java.util.*;

/**
 * 解析json数据
 */
public class JsonHelper {
    /***
     * json字符串转java List
     * @param rsContent
     * @return
     * @throws Exception
     */
    static List<Map<String, String>> jsonStringToList(String rsContent)
    {
        JSONArray arry = JSONArray.fromObject(rsContent);
        System.out.println("json字符串内容如下");
        System.out.println(arry);
        List<Map<String, String>> rsList = new ArrayList<Map<String, String>>();
        for (int i = 0; i < arry.size(); i++)
        {
            JSONObject jsonObject = arry.getJSONObject(i);
            Map<String, String> map = new HashMap<String, String>();
            for (Iterator<?> iter = jsonObject.keys(); iter.hasNext();)
            {
                String key = (String) iter.next();
                String value = jsonObject.get(key).toString();
                map.put(key, value);
            }
            rsList.add(map);
        }
        return rsList;
    }
}
