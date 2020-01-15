package com.lxf.ssm;


import com.alibaba.excel.EasyExcel;
import com.alibaba.fastjson.JSONObject;
import com.lxf.ssm.Listener.EasyExcelListener;
import com.lxf.ssm.common.BeanUtils;
import com.lxf.ssm.easyexcel.EasyExcelUtils;
import com.lxf.ssm.service.Impl.ExcelCheckManagerImpl;
import com.lxf.ssm.easyexcel.ExcelCheckErrDto;
import com.lxf.ssm.dao.LoginMapper;
import com.lxf.ssm.entity.SsmUser;
import com.lxf.ssm.entity.SsmUserImprotResult;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.io.*;
import java.util.*;
import java.util.stream.Collectors;

@SpringBootTest
class SsmApplicationTests {

    @Autowired
    LoginMapper loginMapper;

    @Autowired
    ExcelCheckManagerImpl excelCheckManagerImpl;

    @Test
    void contextLoads() throws IOException {
        String fileName = "E:\\AAA\\Test\\abc.xlsx";
        String expFileName = "E:\\AAA\\Test\\"+System.currentTimeMillis()+".xlsx";
        //读取excel
        EasyExcelListener easyExcelListener = new EasyExcelListener(excelCheckManagerImpl, SsmUser.class);
        EasyExcel.read(fileName,SsmUser.class,easyExcelListener).sheet().doRead();
        //错误结果集
        List<ExcelCheckErrDto> errList = easyExcelListener.getErrList();
        //转换为错误错误excel实体，导出
        if (errList.size() > 0){
            List<SsmUserImprotResult> ssmUserImprotResults = errList.stream().map(excelImportErrObjectDto -> {
                SsmUserImprotResult ssmUserImprotResult = BeanUtils.convert(excelImportErrObjectDto.getObject(), SsmUserImprotResult.class);
                ssmUserImprotResult.setErrMsg(excelImportErrObjectDto.getErrMsg());
                return ssmUserImprotResult;
            }).collect(Collectors.toList());
            //导出excel
            //EasyExcelUtils.webWriteExcel(response,completeDtoImprotResults,SsmUserImprotResult.class,"错误客户信息");
            EasyExcelUtils.simpleWrite(expFileName,SsmUserImprotResult.class,ssmUserImprotResults,"sheet1");
        }
    }
}
