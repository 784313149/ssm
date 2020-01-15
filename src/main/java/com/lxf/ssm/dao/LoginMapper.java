package com.lxf.ssm.dao;

import com.lxf.ssm.entity.SsmUser;
import org.apache.ibatis.annotations.Param;

import java.util.List;

public interface LoginMapper {
    int deleteByPrimaryKey(Integer uid);

    int insert(SsmUser record);

    int insertSelective(SsmUser record);

    SsmUser selectByPrimaryKey(Integer uid);

    int updateByPrimaryKeySelective(SsmUser record);

    int updateByPrimaryKey(SsmUser record);

    List<SsmUser> selectAll();

    int signIn(@Param("name")String name, @Param("password")String password);

    void saveUser(List<SsmUser> list);

}