package com.lxf.ssm.easyexcel;

import lombok.Data;

/**
 * @author lxf
 * @title: ExcelCheckErrDto
 * @projectName cec-moutai-bd-display
 * @description: excel
 * @date 2019/12/2318:23
 */
@Data
public class ExcelCheckSucDto {

    private Object object;

    public Object getObject() {
        return object;
    }

    public void setObject(Object object) {
        this.object = object;
    }
}
