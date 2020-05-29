<template>
  <div class="project-container">
    <el-checkbox v-model="checked" class="showDoing" @change="ShowChange">只显示我的测试用例</el-checkbox>
    <el-button
      type="primary"
      icon="el-icon-cloudy"
      round
      plain
      class="excel"
      @click="downExcel"
    >导出为Excel</el-button>
    <el-table :data="tableData" style="width: 100%;cursor: pointer;">
      <el-table-column label="标题" min-width="120">
        <template slot-scope="scope">
          <div slot="reference" class="name-wrapper">
            <el-tag size="mini" type="primary">case</el-tag>
            <span style="margin-left:10px">{{ scope.row.caseName }}</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="描述" min-width="190">
        <template slot-scope="scope">
          <span>{{ scope.row.caseDesc }}</span>
        </template>
      </el-table-column>
      <el-table-column label="开始时间" min-width="100">
        <template slot-scope="scope">
          <i class="el-icon-time"></i>
          <span style="margin-left: 10px">{{ scope.row.createTime }}</span>
        </template>
      </el-table-column>
      <el-table-column label="预计耗时" min-width="80">
        <template slot-scope="scope">
          <i class="el-icon-time"></i>
          <span style="margin-left: 10px">{{ scope.row.preCost }}min</span>
        </template>
      </el-table-column>
      <el-table-column label="负责人" min-width="80">
        <template slot-scope="scope">
          <i class="el-icon-user"></i>
          <span style="margin-left: 10px">{{ scope.row.testName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="状态" min-width="80">
        <template slot-scope="scope">
          <i class="el-icon-turn-off"></i>
          <span
            style="margin-left: 10px;color:#67c23a"
            v-if="scope.row.caseStatus==='通过'"
          >{{ scope.row.caseStatus }}</span>
          <span
            style="margin-left: 10px;color:#F56C6C"
            v-if="scope.row.caseStatus==='不通过'"
          >{{ scope.row.caseStatus }}</span>
          <span
            style="margin-left: 10px"
            v-if="scope.row.caseStatus==='待完成'"
          >{{ scope.row.caseStatus }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" min-width="200">
        <template slot-scope="scope">
          <el-button
            size="mini"
            @click.native.stop="handleEdit(scope.row.id)"
            v-if="ifMy(scope.row.testName)"
          >编辑</el-button>
          <el-button
            size="mini"
            type="danger"
            @click.native.stop="handleDelete(scope.row.id)"
            v-if="ifMy(scope.row.testName)"
          >删除</el-button>
          <el-button
            size="mini"
            type="primary"
            @click.native.stop="openDialog(scope.row)"
            v-if="ifMy(scope.row.testName)"
          >状态管理</el-button>
          <el-dialog
            title="测试用例状态管理"
            :visible.sync="dialogTableVisible"
            :close-on-click-modal="false"
            @close="closeDialog2"
          >
            <el-button type="primary" @click="closeDialog()">设为通过</el-button>
            <el-button type="primary" @click="openForm()">设为不通过并拉去一个bug</el-button>
            <el-form
              style="margin-top:30px ; overflow: hidden;"
              :model="ruleForm"
              :rules="rules"
              ref="ruleForm"
              label-width="150px"
              class="demo-ruleForm"
              v-show="showForm"
            >
              <el-form-item label="缺陷名称" prop="bugName">
                <el-input v-model="ruleForm.bugName"></el-input>
              </el-form-item>
              <el-form-item label="缺陷说明" prop="bugDesc">
                <el-input type="textarea" v-model="ruleForm.bugDesc"></el-input>
              </el-form-item>
              <el-form-item style="float:right;margin-top:20px">
                <el-button type="primary" @click="submitForm('ruleForm')">立即创建</el-button>
                <el-button @click="resetForm('ruleForm')">重置</el-button>
              </el-form-item>
            </el-form>
          </el-dialog>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { getList, deleteCase, edit } from "@/api/case";
import { create } from "@/api/bug";
import { noticeByName } from "@/api/msg";

export default {
  data() {
    return {
      showForm: false,
      rowData: {},
      dialogTableVisible: false,
      checked: false,
      tableData: [],
      ruleForm: {
        bugName: "",
        bugDesc: "",
        testName: "",
        projectId: 0,
        devName: ""
      },
      rules: {
        bugName: [
          { required: true, message: "请填写缺陷名称", trigger: "blur" }
        ],
        bugDesc: [
          { required: true, message: "请填写缺陷说明", trigger: "blur" }
        ]
      }
    };
  },
  created() {
    getList("", this.$route.params.pid).then(response => {
      const { data } = response;
      this.tableData = data;
    });
  },
  methods: {
    ifMy(testName) {
      return testName === this.$store.getters.name;
    },
    ShowChange() {
      if (this.checked) {
        getList(this.$store.getters.name, this.$route.params.pid).then(
          response => {
            const { data } = response;
            this.tableData = data;
          }
        );
      } else {
        getList("", this.$route.params.pid).then(response => {
          const { data } = response;
          this.tableData = data;
        });
      }
    },
    downExcel() {
      const to = this.checked ? this.$store.getters.name : "";
      const p = this.$route.params.pid;
      window.open("http://localhost:8088/case/excel?name=" + to + "&pid=" + p);
    },
    handleEdit(cid) {
      const pid = this.$route.params.pid;
      // 路由传参
      this.$router.push({
        path: `/test/case/edit/${pid}/${cid}`
      });
    },
    handleDelete(cid) {
      deleteCase(cid).then(response => {
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
        const name = this.checked ? this.$store.getters.name : "";
        getList(name, this.$route.params.pid).then(response => {
          const { data } = response;
          this.tableData = data;
        });
      });
    },
    openDialog(row) {
      this.dialogTableVisible = true;
      this.rowData = row;
    },
    closeDialog2() {
      this.showForm = false;
      this.rowData = {};
    },
    closeDialog() {
      console.log(this.rowData);
      edit({ id: this.rowData.id, caseStatus: "通过" }).then(() => {
        this.showForm = false;
        this.dialogTableVisible = false;
        this.rowData = {};
        const to = this.checked ? this.$store.getters.name : "";
        getList(to, this.$route.params.pid).then(response => {
          const { data } = response;
          this.tableData = data;
        });
      });
    },
    openForm() {
      this.ruleForm.devName = this.rowData.devName;
      this.showForm = !this.showForm;
    },
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.ruleForm.testName = this.$store.getters.name;
          this.ruleForm.projectId = this.$route.params.pid;
          // 更新状态为不通过
          edit({ id: this.rowData.id, caseStatus: "不通过" }).then(() => {
            create(this.ruleForm).then(() => {
              this.$message.success(`缺陷创建成功`);
              this.showForm = false;
              this.dialogTableVisible = false;
              this.rowData = {};
              // 重新加载数据
              const name = this.checked ? this.$store.getters.name : "";
              getList(name, this.$route.params.pid).then(response => {
                const { data } = response;
                this.tableData = data;
              });
              // 通知相关开发人员
              noticeByName(
                this.ruleForm.devName,
                "《" +
                  this.ruleForm.testName +
                  "》给你拉取了一个缺陷《" +
                  this.ruleForm.bugName +
                  "》"
              );
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
.excel {
  float: right;
  margin-right: 40px;
  margin-top: -10px;
}
</style>
