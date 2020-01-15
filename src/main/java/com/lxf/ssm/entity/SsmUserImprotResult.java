package com.lxf.ssm.entity;

import com.alibaba.excel.annotation.ExcelProperty;
import com.alibaba.excel.annotation.write.style.ColumnWidth;
import lombok.Data;
import lombok.EqualsAndHashCode;

import java.io.Serializable;
/**
 * @author zhy
 * @title: CustomerCompleteDtoImprotResult
 * @projectName cec-moutai-bd-display
 * @description: 客户导入结果excel
 * @date 2019/12/1216:10
 */
@Data
@EqualsAndHashCode(callSuper=false)
public class SsmUserImprotResult extends SsmUser {

    @ExcelProperty(value = "错误信息")
    @ColumnWidth(80)
    private String errMsg;

    public String getErrMsg() {
        return errMsg;
    }

    public void setErrMsg(String errMsg) {
        this.errMsg = errMsg;
    }

}