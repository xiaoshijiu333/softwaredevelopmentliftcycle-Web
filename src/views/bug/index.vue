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
    <el-table :data="tableData" style="width: 100%;cursor: pointer;">
      <el-table-column label="标题" min-width="120">
        <template slot-scope="scope">
          <div slot="reference" class="name-wrapper">
            <el-tag size="mini" type="danger">bug</el-tag>
            <span style="margin-left:10px">{{ scope.row.bugName }}</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="描述" min-width="190">
        <template slot-scope="scope">
          <span>{{ scope.row.bugDesc }}</span>
        </template>
      </el-table-column>
      <el-table-column label="所属项目" min-width="150">
        <template slot-scope="scope">
          <span>{{ scope.row.projectName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="开始时间" min-width="100">
        <template slot-scope="scope">
          <i class="el-icon-time"></i>
          <span style="margin-left: 10px">{{ scope.row.createTime }}</span>
        </template>
      </el-table-column>
      <el-table-column label="开发负责人" min-width="80">
        <template slot-scope="scope">
          <i class="el-icon-user"></i>
          <span style="margin-left: 10px">{{ scope.row.devName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="测试负责人" min-width="80">
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
            v-if="scope.row.bugStatus==='关闭'"
          >{{ scope.row.bugStatus }}</span>
          <span
            style="margin-left: 10px;color:#F56C6C"
            v-if="scope.row.bugStatus==='不通过'||scope.row.bugStatus==='挂起'"
          >{{ scope.row.bugStatus }}</span>
          <span
            style="margin-left: 10px"
            v-if="scope.row.bugStatus==='待完成'"
          >{{ scope.row.bugStatus }}</span>
          <span
            style="margin-left: 10px;color:#e6a23c"
            v-if="scope.row.bugStatus==='待检查'"
          >{{ scope.row.bugStatus }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" min-width="200">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="primary"
            @click.native.stop="openDialog2(scope.row)"
            v-if="ifTest(scope.row.bugStatus)"
          >检查</el-button>
          <el-dialog
            title="缺陷状态管理"
            :visible.sync="dialogTableVisible2"
            :close-on-click-modal="false"
          >
            <el-button type="primary" @click="closeDialog2('关闭')">检查通过（关闭该缺陷）</el-button>
            <el-button type="primary" @click="closeDialog2('不通过')">检查不通过（返回对应开发人员）</el-button>
          </el-dialog>
          <el-button
            size="mini"
            type="primary"
            @click.native.stop="openDialog(scope.row)"
            v-if="ifDev(scope.row.bugStatus)"
          >状态管理</el-button>
          <el-dialog
            title="缺陷状态管理"
            :visible.sync="dialogTableVisible"
            :close-on-click-modal="false"
          >
            <el-button type="primary" @click="closeDialog1('待检查')">设为通过（并流转给对应测试人员）</el-button>
            <el-button type="primary" @click="closeDialog1('挂起')">设为挂起（未能解决）</el-button>
          </el-dialog>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { edit, getList } from "@/api/bug";
import { noticeByName } from "@/api/msg";

export default {
  data() {
    return {
      tableData: [],
      dialogTableVisible: false,
      dialogTableVisible2: false,
      rowDate1: {},
      rowDate2: {}
    };
  },
  created() {
    const roleNum = this.$store.getters.roles[0] === "test" ? 1 : 0;
    // 两个参数，区别是研发还是测试人员
    getList(this.$store.getters.name, roleNum).then(response => {
      const { data } = response;
      this.tableData = data;
    });
  },
  methods: {
    // 只有测试人员且是待检查状态，才显示
    ifTest(bugStatus) {
      return bugStatus === "待检查" && this.$store.getters.roles[0] === "test";
    },
    ifDev(bugStatus) {
      return (
        this.$store.getters.roles[0] === "dev" &&
        bugStatus !== "待检查" &&
        bugStatus !== "关闭"
      );
    },
    downExcel() {
      const to = this.$store.getters.name;
      const roleNum = this.$store.getters.roles[0] === "test" ? 1 : 0;
      window.open(
        "http://localhost:8088/bug/excel?name=" + to + "&roleNum=" + roleNum
      );
    },
    openDialog(row) {
      this.dialogTableVisible = true;
      this.rowDate1 = row;
    },
    openDialog2(row) {
      this.dialogTableVisible2 = true;
      this.rowDate2 = row;
    },
    closeDialog2(bugStatus) {
      edit({ id: this.rowDate2.id, bugStatus: bugStatus }).then(() => {
        this.dialogTableVisible = false;
        this.dialogTableVisible2 = false;
        const roleNum = this.$store.getters.roles[0] === "test" ? 1 : 0;
        getList(this.$store.getters.name, roleNum).then(response => {
          const { data } = response;
          this.tableData = data;
        });
        if (bugStatus === "不通过") {
          noticeByName(
            this.rowDate2.devName,
            "《" +
              this.rowDate2.testName +
              "》" +
              "检查并返回了缺陷《" +
              this.rowDate2.bugName +
              "》为不通过"
          );
        }
      });
    },
    closeDialog1(bugStatus) {
      edit({ id: this.rowDate1.id, bugStatus: bugStatus }).then(() => {
        this.dialogTableVisible = false;
        this.dialogTableVisible2 = false;
        const roleNum = this.$store.getters.roles[0] === "test" ? 1 : 0;
        getList(this.$store.getters.name, roleNum).then(response => {
          const { data } = response;
          this.tableData = data;
        });
        // 设置为但检查状态，通知关联的测试人员
        if (bugStatus === "待检查") {
          noticeByName(
            this.rowDate1.testName,
            "《" +
              this.rowDate1.devName +
              "》" +
              "返回了缺陷《" +
              this.rowDate1.bugName +
              "》待检查"
          );
        }
      });
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
