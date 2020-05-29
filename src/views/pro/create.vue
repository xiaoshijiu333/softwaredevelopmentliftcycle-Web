<template>
  <div class="project-container" style="width: 50%;">
    <el-form
      :model="ruleForm"
      :rules="rules"
      ref="ruleForm"
      label-width="100px"
      class="demo-ruleForm"
    >
      <el-form-item label="域名" prop="deployDomin">
        <el-input v-model="ruleForm.deployDomin"></el-input>
      </el-form-item>
      <el-form-item label="服务器地址" prop="deployServerSite">
        <el-input v-model="ruleForm.deployServerSite"></el-input>
      </el-form-item>
      <el-form-item label="数据库地址" prop="deployDatabaseSite">
        <el-input v-model="ruleForm.deployDatabaseSite"></el-input>
      </el-form-item>
      <el-form-item style="float:right;margin-top:50px">
        <el-button type="primary" @click="submitForm('ruleForm')">立即发布</el-button>
        <el-button @click="resetForm('ruleForm')">重置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { create } from "@/api/deploy";
import { editState } from "@/api/project";
import { noticeByPro } from "@/api/msg";

export default {
  data() {
    return {
      ruleForm: {
        deployDomin: "",
        deployDatabaseSite: "",
        deployServerSite: "",
        projectId: 0
      },
      rules: {
        deployDomin: [
          { required: true, message: "请输入域名", trigger: "blur" }
        ],
        deployDatabaseSite: [
          { required: true, message: "请输入数据库地址", trigger: "blur" }
        ],
        deployServerSite: [
          { required: true, message: "请输入服务器地址", trigger: "blur" }
        ]
      }
    };
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.ruleForm.projectId = this.$route.params.pid;
          create(this.ruleForm).then(response => {
            const pid = this.$route.params.pid;
            const { data } = response;
            // 更新状态
            editState(pid, 3).then(() => {
              this.$message.success(`发布成功`);
              noticeByPro(pid, "《" + data + "》项目已经发布上线了");
              this.$router.push({ path: `/project/detail/${pid}` });
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

<style lang="scss">
.project {
  &-container {
    margin: 30px;
  }
}
</style>
