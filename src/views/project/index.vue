<template>
  <div class="project-container">
    <el-checkbox v-model="checked" class="showDoing" @change="ShowChange">只显示正在进行的</el-checkbox>
    <el-table
      :data="tableData"
      style="width: 100%;cursor: pointer;"
      :row-class-name="tableRowClassName"
      @row-click="rowClick"
    >
      <el-table-column label="标题" min-width="270">
        <template slot-scope="scope">
          <!-- <el-popover trigger="hover" placement="top">
            <p>姓名: {{ scope.row.projectName }}</p>
            <p>住址: {{ scope.row.address }}</p>
            <div slot="reference" class="name-wrapper">
              <el-tag size="mini">project</el-tag>
              <span style="margin-left:10px">{{ scope.row.projectName }}</span>
            </div>
          </el-popover>-->
          <div slot="reference" class="name-wrapper">
            <el-tag size="mini" type="info" v-if="scope.row.projectStateDesc ==='已上线'">project</el-tag>
            <el-tag size="mini" type="primary" v-if="scope.row.projectStateDesc !=='已上线'">project</el-tag>
            <span style="margin-left:10px">{{ scope.row.projectName }}</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="状态" min-width="100">
        <template slot-scope="scope">
          <i class="el-icon-collection-tag"></i>
          <span style="margin-left: 10px">{{ scope.row.projectStateDesc }}</span>
        </template>
      </el-table-column>
      <el-table-column label="开始时间" min-width="100">
        <template slot-scope="scope">
          <i class="el-icon-time"></i>
          <span style="margin-left: 10px">{{ scope.row.createTime }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" v-if="ifManager">
        <template slot-scope="scope">
          <!-- 通过v-if控制组件按钮是否显示 -->
          <el-button
            size="mini"
            @click.native.stop="handleEdit(scope.row.id)"
            v-if="scope.row.projectStateDesc==='需求分析阶段'"
          >编辑</el-button>
          <el-button
            size="mini"
            type="danger"
            @click.native.stop="handleDelete(scope.row.id)"
            v-if="scope.row.projectStateDesc==='需求分析阶段'"
          >终止</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { getList, deletePro } from "@/api/project";

export default {
  data() {
    return {
      tableData: [],
      checked: false
    };
  },
  computed: {
    // 操作栏，只有产品经理有权限
    ifManager() {
      return this.$store.getters.roles.indexOf("manager") != -1;
    }
  },
  created() {
    getList(this.$store.getters.token, false).then(response => {
      const { data } = response;
      this.tableData = data;
    });
  },
  methods: {
    handleEdit(pid) {
      // 路由传参
      this.$router.push({
        path: `/project/edit/${pid}`
      });
    },
    handleDelete(pid) {
      deletePro(pid).then(response => {
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
        getList(this.$store.getters.token, this.checked).then(response => {
          const { data } = response;
          this.tableData = data;
        });
      });
    },
    tableRowClassName({ row }) {
      if (row.projectStateDesc === "已上线") {
        return "finash-row";
      }
      return "";
    },
    // checkbox组件改变时回调，会自动将改变的状态值传过来
    ShowChange(checkValue) {
      if (checkValue) {
        getList(this.$store.getters.token, true).then(response => {
          const { data } = response;
          this.tableData = data;
        });
      } else {
        getList(this.$store.getters.token, false).then(response => {
          const { data } = response;
          this.tableData = data;
        });
      }
    },
    // 单击某一行的回调
    rowClick(row) {
      const pid = row.id;
      // 路由传参
      this.$router.push({
        path: `/project/detail/${pid}`
      });
    }
  }
};
</script>

// 不能添加scope，要让.el-table .finash-row 显示的话
<style lang="scss">
.project {
  &-container {
    margin: 30px;
  }
}
.el-table .finash-row {
  color: rgb(216, 208, 208);
}
.showDoing {
  padding-left: 10px;
}
</style>
