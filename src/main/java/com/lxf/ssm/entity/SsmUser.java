package com.lxf.ssm.entity;

import com.alibaba.excel.annotation.ExcelProperty;
import com.lxf.ssm.easyexcel.ExcelPatternMsg;
import lombok.Data;

import javax.validation.constraints.NotNull;
import javax.validation.constraints.Pattern;
import java.io.Serializable;

@Data
public class SsmUser implements Serializable {
    @ExcelProperty(index = 0,value = "ID")
//    @Pattern(regexp = "^[0-9]*$",message = "只能输入数字")
//    @NotNull
    private Integer uid;
    @ExcelProperty(index = 1,value = "姓名")
    private String name;
    @ExcelProperty(index = 2,value = "密码")
    private String password;

    private static final long serialVersionUID = 1L;

    public Integer getUid() {
        return uid;
    }

    public void setUid(Integer uid) {
        this.uid = uid;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name == null ? null : name.trim();
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password == null ? null : password.trim();
    }
}