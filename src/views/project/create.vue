<template>
  <div class="project-container" style="width: 50%;">
    <el-form
      :model="ruleForm"
      :rules="rules"
      ref="ruleForm"
      label-width="100px"
      class="demo-ruleForm"
    >
      <el-form-item label="项目名称" prop="projectName">
        <el-input v-model="ruleForm.projectName"></el-input>
      </el-form-item>
      <el-form-item label="项目人员" prop="projectPeople">
        <el-input v-model="ruleForm.projectPeople" ref="peo"></el-input>
        <el-button type="text" @click="gotoselect()">去选择</el-button>
        <el-dialog title="所有人员" :visible.sync="dialogTableVisible" :close-on-click-modal="false">
          <el-table
            ref="multipleTable"
            :data="tableData"
            tooltip-effect="dark"
            style="width: 100%;margin-bottom:20px"
            @selection-change="handleSelectionChange"
          >
            <el-table-column type="selection" width="55"></el-table-column>
            <el-table-column prop="username" label="姓名" width="120"></el-table-column>
            <el-table-column prop="userRoles" label="角色" show-overflow-tooltip></el-table-column>
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
      <el-form-item label="项目说明" prop="projectDesc">
        <el-input type="textarea" v-model="ruleForm.projectDesc"></el-input>
      </el-form-item>
      <el-form-item label="需求文档">
        <el-upload
          class="upload-demo"
          name="file"
          action="http://localhost:8088/file/upload"
          :before-remove="beforeRemove"
          :on-success="succ"
          :on-exceed="handleExceed"
          :file-list="fileList"
        >
          <el-button size="small" type="primary">点击上传</el-button>
          <div slot="tip" class="el-upload__tip">支持pdf/word/zip等文件格式，文件大小不超过5m</div>
        </el-upload>
      </el-form-item>
      <el-form-item style="float:right;margin-top:50px">
        <el-button type="primary" @click="submitForm('ruleForm')">立即创建</el-button>
        <el-button @click="resetForm('ruleForm')">重置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { all } from "@/api/user";
import { create } from "@/api/project";

export default {
  data() {
    return {
      dialogTableVisible: false,
      tableData: [],
      multipleSelection: [],
      ruleForm: {
        projectName: "",
        createTime: "",
        projectDesc: "",
        projectPeople: "", // 用于显示，name
        projectPeopleIds: [], // 用于传输，id
        projectFileUrls: []
      },
      fileList: [],
      rules: {
        projectName: [
          { required: true, message: "请输入项目名称", trigger: "blur" }
        ],
        createTime: [
          {
            required: true,
            message: "请选择时间",
            trigger: ["blur", "change"]
          }
        ],
        projectDesc: [
          { required: true, message: "请填写项目说明", trigger: "blur" }
        ],
        projectPeople: [
          { required: true, message: "请输入项目人员", trigger: "blur" }
        ]
      }
    };
  },
  methods: {
    gotoselect() {
      this.dialogTableVisible = true;
      all("").then(response => {
        const { data } = response;
        this.tableData = data;
      });
    },
    closeDialog() {
      this.dialogTableVisible = false;
      this.multipleSelection.forEach(s => {
        if (this.ruleForm.projectPeople) {
          this.ruleForm.projectPeople =
            this.ruleForm.projectPeople + "，" + s.username;
        } else {
          this.ruleForm.projectPeople = s.username;
        }
        this.ruleForm.projectPeopleIds.push(s.id);
      });
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
          create(this.ruleForm).then(() => {
            this.$message.success(`创建成功`);
            this.$router.push({ path: "/project" });
          });
        } else {
          this.$message.error(`提交失败`);
          return false;
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    handleExceed(files) {
      this.$message.warning(
        `当前限制一次性只能选择 3 个文件，本次选择了 ${files.length} 个文件`
      );
    },
    beforeRemove(file) {
      return this.$confirm(`确定移除 ${file.name}？`);
    },
    succ(res) {
      this.ruleForm.projectFileUrls.push(res.data);
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
.el-dialog__body {
  padding-top: 0px;
}
</style>
