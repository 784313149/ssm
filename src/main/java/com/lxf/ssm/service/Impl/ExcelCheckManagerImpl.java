package com.lxf.ssm.service.Impl;

import com.lxf.ssm.easyexcel.ExcelCheckErrDto;
import com.lxf.ssm.easyexcel.ExcelCheckResult;
import com.lxf.ssm.easyexcel.ExcelCheckSucDto;
import com.lxf.ssm.entity.SsmUser;
import com.lxf.ssm.service.ExcelCheckManager;
import org.apache.commons.lang3.StringUtils;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

//业务类继承ExcelCheckManager，例子如下
@Service
public class ExcelCheckManagerImpl<T> implements ExcelCheckManager<T> {


    @Override
    public ExcelCheckResult checkImportExcel(List<T> objects) {
        //List<ExcelCheckSucDto> successDtos, List<ExcelCheckErrDto> errDtos
        List<ExcelCheckSucDto> successDtos = new ArrayList<>();
        List<ExcelCheckErrDto> errDtos = new ArrayList<>();

        for (T t : objects) {
            ExcelCheckSucDto excelCheckSucDto  = new ExcelCheckSucDto();
            ExcelCheckErrDto excelCheckErrDto  = new ExcelCheckErrDto();

            //业务判断，正确存入successDtos，错误存入errDtos
            //例如
            SsmUser ssmUser = (SsmUser) t;
            if(ssmUser.getUid() == null ||
                StringUtils.isBlank(ssmUser.getName()) ||
                StringUtils.isBlank(ssmUser.getPassword())){
                excelCheckErrDto.setObject(ssmUser);
                excelCheckErrDto.setErrMsg("关键字段不能为空");
                errDtos.add(excelCheckErrDto);
            }else {
                excelCheckSucDto.setObject(ssmUser);
                successDtos.add(excelCheckSucDto);
            }
        }
        //存入集合
        ExcelCheckResult excelCheckResult = new ExcelCheckResult(successDtos,errDtos);
        excelCheckResult.setSuccessDtos(successDtos);
        excelCheckResult.setErrDtos(errDtos);
        return excelCheckResult;
    }
}
