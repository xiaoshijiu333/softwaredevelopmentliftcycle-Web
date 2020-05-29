<template>
  <div class="project-container" style="width: 50%;">
    <el-form
      :model="ruleForm"
      :rules="rules"
      ref="ruleForm"
      label-width="100px"
      class="demo-ruleForm"
    >
      <el-form-item label="任务名称" prop="taskName">
        <el-input v-model="ruleForm.taskName"></el-input>
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
        <el-input v-model="ruleForm.preCost" placeholder="填写预计花费时间，单位小时"></el-input>
      </el-form-item>
      <el-form-item label="任务说明" prop="taskDesc">
        <el-input type="textarea" v-model="ruleForm.taskDesc"></el-input>
      </el-form-item>
      <el-form-item style="float:right;margin-top:50px">
        <el-button type="primary" @click="submitForm('ruleForm')">更新</el-button>
        <el-button @click="resetForm('ruleForm')">重置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { edit, getById } from "@/api/task";

export default {
  created() {
    getById(this.$route.params.tid).then(response => {
      const { data } = response;
      this.ruleForm = data;
      this.ruleForm.createTime = new Date(
        Date.parse(this.ruleForm.createTime.replace(/-/g, "/"))
      );
    });
  },
  data() {
    return {
      ruleForm: {
        tid: 0,
        taskName: "",
        createTime: "",
        taskDesc: "",
        preCost: "",
        token: ""
      },
      rules: {
        taskName: [
          { required: true, message: "请输入任务名称", trigger: "blur" }
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
        taskDesc: [
          { required: true, message: "请填写任务说明", trigger: "blur" }
        ]
      }
    };
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.ruleForm.tid = this.$route.params.tid;
          edit(this.ruleForm).then(response => {
            const { data } = response;
            this.$message.success(`更新成功`);
            this.$router.push({ path: `/dev/task/list/${data}` });
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
</style>
