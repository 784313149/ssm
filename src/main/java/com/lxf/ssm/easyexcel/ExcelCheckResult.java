package com.lxf.ssm.easyexcel;
import lombok.Data;

import java.util.ArrayList;
import java.util.List;

/**
 * @author lxf
 * @title: ExcelCheckErrDto
 * @projectName cec-moutai-bd-display
 * @description: excel数据导入结果
 * @date 2019/12/2318:23
 */
@Data
public class ExcelCheckResult {
    private List<ExcelCheckSucDto> successDtos;

    private List<ExcelCheckErrDto> errDtos;

    public ExcelCheckResult(List<ExcelCheckSucDto> successDtos, List<ExcelCheckErrDto> errDtos){
        this.successDtos =successDtos;
        this.errDtos = errDtos;
    }

    public ExcelCheckResult(List<ExcelCheckErrDto> errDtos){
        this.successDtos =new ArrayList<>();
        this.errDtos = errDtos;
    }

    public List<ExcelCheckSucDto> getSuccessDtos() {
        return successDtos;
    }

    public void setSuccessDtos(List<ExcelCheckSucDto> successDtos) {
        this.successDtos = successDtos;
    }

    public List<ExcelCheckErrDto> getErrDtos() {
        return errDtos;
    }

    public void setErrDtos(List<ExcelCheckErrDto> errDtos) {
        this.errDtos = errDtos;
    }
}
