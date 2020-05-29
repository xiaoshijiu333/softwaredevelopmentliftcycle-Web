<template>
  <div class="project-container">
    <el-button
      type="primary"
      icon="el-icon-cloudy"
      round
      plain
      class="excel"
      @click="downExcel"
    >导出为Excel</el-button>
    <el-button
      type="primary"
      icon="el-icon-user"
      round
      plain
      @click="openAddDialog"
      class="addUser"
    >添加新人员</el-button>
    <el-dialog title="添加新人员" :visible.sync="dialogTableVisible2" :close-on-click-modal="false">
      <el-form
        style="margin-top:30px ; overflow: hidden;"
        :model="ruleForm"
        :rules="rules"
        ref="ruleForm"
        label-width="150px"
        class="demo-ruleForm"
      >
        <el-form-item label="姓名" prop="username">
          <el-input v-model="ruleForm.username"></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="phone">
          <el-input type="textarea" v-model="ruleForm.phone"></el-input>
        </el-form-item>
        <el-form-item label="角色" prop="roleId">
          <el-select v-model="ruleForm.roleId" @change="selectGet">
            <el-option
              v-for="item in options"
              :key="item.id"
              :label="item.roleName"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item style="float:right;margin-top:20px">
          <el-button type="primary" @click="submitForm('ruleForm')">立即创建</el-button>
          <el-button @click="resetForm('ruleForm')">重置</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <el-table :data="tableData" style="width: 100%;cursor: pointer;">
      <el-table-column label="姓名" min-width="120">
        <template slot-scope="scope">
          <div slot="reference" class="name-wrapper">
            <el-tag size="mini" type="primary">user</el-tag>
            <span style="margin-left:10px">{{ scope.row.username }}</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="手机号" min-width="120">
        <template slot-scope="scope">
          <span>{{ scope.row.phone }}</span>
        </template>
      </el-table-column>
      <el-table-column label="角色" min-width="80">
        <template slot-scope="scope">
          <i class="el-icon-user"></i>
          <span style="margin-left: 10px">{{ scope.row.userRoles[0] }}</span>
        </template>
      </el-table-column>
      <el-table-column label="性别" min-width="80">
        <template slot-scope="scope">
          <i class="el-icon-umbrella"></i>
          <span style="margin-left: 10px">{{ scope.row.sex}}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" min-width="200">
        <template slot-scope="scope">
          <el-button size="mini" @click.native.stop="openDialog(scope.row)">修改角色</el-button>
          <el-button size="mini" type="danger" @click.native.stop="handleDelete(scope.row.id)">删除</el-button>
          <el-dialog title="所有角色" :visible.sync="dialogTableVisible" :close-on-click-modal="false">
            <el-table
              ref="multipleTable"
              :data="tableData2"
              tooltip-effect="dark"
              style="width: 100%;margin-bottom:20px"
              @selection-change="handleSelectionChange"
            >
              <el-table-column type="selection" width="55"></el-table-column>
              <el-table-column prop="roleName" label="角色名" show-overflow-tooltip></el-table-column>
            </el-table>
            <el-button
              type="primary"
              @click="closeDialog()"
              style="float:right;margin-bottom:20px"
            >确定修改</el-button>
          </el-dialog>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { all, deleteUser, roles, edit, create } from "@/api/user";

export default {
  data() {
    return {
      rowData: {},
      dialogTableVisible: false,
      dialogTableVisible2: false,
      tableData: [],
      tableData2: [],
      options: [],
      multipleSelection: [],
      ruleForm: {
        username: "",
        phone: "",
        roleId: 1,
        roleName: "产品经理"
      },
      rules: {
        username: [{ required: true, message: "请填写姓名", trigger: "blur" }],
        phone: [{ required: true, message: "请填写手机号", trigger: "blur" }]
      }
    };
  },
  created() {
    all("").then(response => {
      const { data } = response;
      this.tableData = data;
    });
  },
  methods: {
    downExcel() {
      window.open("http://localhost:8088/user/excel");
    },
    handleDelete(uid) {
      deleteUser(uid).then(response => {
        const { data } = response;
        // 成功提示信息
        this.$notify({
          title: "成功",
          message: data,
          type: "success",
          // 控制通知消失时间
          duration: 1500
        });
        // 重新加载数据
        all("").then(response => {
          const { data } = response;
          this.tableData = data;
        });
      });
    },
    openDialog(row) {
      this.dialogTableVisible = true;
      this.rowData = row;
      roles().then(response => {
        const { data } = response;
        this.tableData2 = data;
      });
    },
    openAddDialog() {
      this.dialogTableVisible2 = true;
      roles().then(response => {
        const { data } = response;
        this.options = data;
      });
    },
    // 角色select的值改变事件
    selectGet(value) {
      let obj = {};
      obj = this.options.find(item => {
        //这里的options就是上面遍历的数据源
        return item.id === value; //筛选出匹配数据
      });
      this.ruleForm.roleName = obj.roleName;
    },
    handleSelectionChange(val) {
      // val是选中行的数据，可以累加
      this.multipleSelection = val;
    },
    closeDialog() {
      if (this.multipleSelection.length !== 1) {
        this.$message.error(`此情况下，只能选择一个`);
        return false;
      }
      edit({
        uid: this.rowData.id,
        id: this.multipleSelection[0].id,
        roleName: this.multipleSelection[0].roleName
      }).then(() => {
        this.dialogTableVisible = false;
        this.multipleSelection = [];
        all("").then(response => {
          const { data } = response;
          this.tableData = data;
        });
      });
    },
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          create(this.ruleForm).then(() => {
            this.$message.success(`新用户创建成功`);
            this.dialogTableVisible2 = false;
            // 重新加载数据
            all("").then(response => {
              const { data } = response;
              this.tableData = data;
            });
          });
        } else {
          this.$message.error(`提交失败`);
          return false;
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    }
  }
};
</script>

<style lang="scss" scope>
.project {
  &-container {
    margin: 30px;
  }
}
.excel {
  float: right;
  margin-right: 40px;
  margin-top: -10px;
}
.addUser {
  float: right;
  margin-right: 40px;
  margin-top: -10px;
}
.el-dialog {
  overflow: hidden;
}
</style>
