package com.lxf.ssm.easyexcel;

import lombok.Data;

/**
 * @author lxf
 * @title: ExcelCheckErrDto
 * @projectName cec-moutai-bd-display
 * @description: excel单条数据导入结果
 * @date 2019/12/2318:23
 */
@Data
public class ExcelCheckErrDto {

    private Object object;

    private String errMsg;

    public ExcelCheckErrDto(){}

    public ExcelCheckErrDto(Object object, String errMsg){
        this.object = object;
        this.errMsg = errMsg;
    }

    public Object getObject() {
        return object;
    }

    public void setObject(Object object) {
        this.object = object;
    }

    public String getErrMsg() {
        return errMsg;
    }

    public void setErrMsg(String errMsg) {
        this.errMsg = errMsg;
    }
}
