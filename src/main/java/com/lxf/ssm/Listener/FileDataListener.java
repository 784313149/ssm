package com.lxf.ssm.Listener;

import com.alibaba.excel.context.AnalysisContext;
import com.alibaba.excel.event.AnalysisEventListener;
import com.alibaba.fastjson.JSONObject;
import com.lxf.ssm.dao.LoginMapper;
import com.lxf.ssm.entity.SsmUser;
import com.lxf.ssm.entity.ExpModel;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.ArrayList;
import java.util.List;

public class FileDataListener extends AnalysisEventListener<SsmUser> {
    /**
     * 每隔5条存储数据库，实际使用中可以3000条，然后清理list ，方便内存回收
     */
    private static final int BATCH_COUNT = 5;

    /**
     * 假设这个是一个DAO，当然有业务逻辑这个也可以是一个service。当然如果不用存储这个对象没用。
     */
    @Autowired
    LoginMapper loginMapper;

    public FileDataListener() {
        // 这里是demo，所以随便new一个。实际使用如果到了spring,请使用下面的有参构造函数
        //loginMapper = new LoginMapper();
    }

    /**
     * 如果使用了spring,请使用这个构造方法。每次创建Listener的时候需要把spring管理的类传进来
     *
     * @param loginMapper
     */
    public FileDataListener(LoginMapper loginMapper) {
        this.loginMapper = loginMapper;
    }
    List<SsmUser> list = new ArrayList<SsmUser>();
    List<SsmUser> list2 = new ArrayList<SsmUser>();
    List<ExpModel> expList = new ArrayList<ExpModel>();

    @Override
    public void invoke(SsmUser data, AnalysisContext context) {
        System.out.println("解析到一条数据:{"+ JSONObject.toJSONString(data) +"}");

        if(data.getUid() == null){
            ExpModel expModel =  new ExpModel();
            expModel.setObj(data);
            expModel.setErrorMsg("用户id不能为空");
            expList.add(expModel);
            return;
        }
        if(data.getName() == null){
            ExpModel expModel =  new ExpModel();
            expModel.setObj(data);
            expModel.setErrorMsg("用户名不能为空");
            expList.add(expModel);
            return;
        }
        if(data.getPassword() == null){
            ExpModel expModel =  new ExpModel();
            expModel.setObj(data);
            expModel.setErrorMsg("密码不能为空");
            expList.add(expModel);
            return;
        }

        list.add(data);
        if (list.size() >= BATCH_COUNT) {
            saveData();
            list.clear();
        }
    }

    @Override
    public void doAfterAllAnalysed(AnalysisContext context) {
        saveData();
        System.out.println("所有数据解析完成！");
        //将错误的Excel返回
        System.out.println(JSONObject.toJSONString(expList));
    }

    /**
     * 加上存储数据库
     */
    private void saveData() {
        System.out.println("{"+list.size()+"}条数据，开始存储数据库！");
        if(list.size()>0){
            loginMapper.saveUser(list);
        }
        System.out.println("存储数据库成功！");
    }
}
