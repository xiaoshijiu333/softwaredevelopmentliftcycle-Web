<template>
  <div class="project-container" style="width: 50%;">
    <el-form
      :model="ruleForm"
      :rules="rules"
      ref="ruleForm"
      label-width="150px"
      class="demo-ruleForm"
    >
      <el-form-item label="测试用例名称" prop="caseName">
        <el-input v-model="ruleForm.caseName"></el-input>
      </el-form-item>
      <el-form-item label="对应研发人员" prop="devName">
        <el-input v-model="ruleForm.devName" ref="peo"></el-input>
        <el-button type="text" @click="gotoselect()">去选择</el-button>
        <el-dialog title="所有研发人员" :visible.sync="dialogTableVisible" :close-on-click-modal="false">
          <el-table
            ref="multipleTable"
            :data="tableData"
            tooltip-effect="dark"
            style="width: 100%;margin-bottom:20px"
            @selection-change="handleSelectionChange"
          >
            <el-table-column type="selection" width="55"></el-table-column>
            <el-table-column prop="username" label="姓名" width="120"></el-table-column>
            <el-table-column label="角色" show-overflow-tooltip>开发</el-table-column>
          </el-table>
          <el-button type="primary" @click="closeDialog()">确定</el-button>
        </el-dialog>
      </el-form-item>
      <el-form-item label="开始时间" required style="width:50%" prop="createTime">
        <el-date-picker
          type="datetime"
          placeholder="选择日期和时间"
          v-model="ruleForm.createTime"
          style="width: 100%;"
        ></el-date-picker>
      </el-form-item>
      <el-form-item label="预计耗时" prop="preCost">
        <el-input v-model="ruleForm.preCost" placeholder="填写预计花费时间，单位分钟"></el-input>
      </el-form-item>
      <el-form-item label="测试用例说明说明" prop="caseDesc">
        <el-input type="textarea" v-model="ruleForm.caseDesc"></el-input>
      </el-form-item>
      <el-form-item style="float:right;margin-top:50px">
        <el-button type="primary" @click="submitForm('ruleForm')">立即创建</el-button>
        <el-button @click="resetForm('ruleForm')">重置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { create } from "@/api/case";
import { getProUser } from "@/api/user";

export default {
  data() {
    return {
      tableData: [],
      dialogTableVisible: false,
      ruleForm: {
        devName: "",
        caseName: "",
        createTime: "",
        caseDesc: "",
        preCost: "",
        testName: "",
        projectId: 0
      },
      rules: {
        caseName: [
          { required: true, message: "请输入测试用例名称", trigger: "blur" }
        ],
        preCost: [
          { required: true, message: "请输入预计花费时间", trigger: "blur" }
        ],
        createTime: [
          {
            required: true,
            message: "请选择时间",
            trigger: ["blur", "change"]
          }
        ],
        caseDesc: [
          { required: true, message: "请填写测试用例说明", trigger: "blur" }
        ],
        devName: [
          { required: true, message: "请填写相关研发人员", trigger: "blur" }
        ]
      }
    };
  },
  methods: {
    gotoselect() {
      this.dialogTableVisible = true;
      getProUser(this.$route.params.pid, "dev").then(response => {
        const { data } = response;
        this.tableData = data;
      });
    },
    closeDialog() {
      if (this.multipleSelection.length === 0) {
        this.$message.error(`你还没有选择！`);
        return false;
      }
      if (this.multipleSelection.length != 1) {
        this.$message.error(`只能选择一个研发人员`);
        return false;
      }
      this.dialogTableVisible = false;
      this.ruleForm.devName = this.multipleSelection[0].username;
      // 让people输入框自动获取焦点，方便即使去除对应规则
      this.$refs.peo.focus();
    },
    handleSelectionChange(val) {
      // val是选中行的数据，可以累加
      this.multipleSelection = val;
    },
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.ruleForm.testName = this.$store.getters.name;
          this.ruleForm.preCost = parseInt(this.ruleForm.preCost);
          this.ruleForm.projectId = this.$route.params.pid;
          create(this.ruleForm).then(() => {
            this.$message.success(`创建成功`);
            const pid = this.$route.params.pid;
            this.$router.push({ path: `/test/case/list/${pid}` });
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

<style lang="scss">
.project {
  &-container {
    margin: 30px;
  }
}
</style>
