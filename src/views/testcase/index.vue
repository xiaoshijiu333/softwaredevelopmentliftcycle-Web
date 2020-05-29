<template>
  <div class="project-container">
    <el-table :data="tableData" style="width: 100%;cursor: pointer;" @row-click="rowClick">
      <el-table-column label="标题" min-width="270">
        <template slot-scope="scope">
          <div slot="reference" class="name-wrapper">
            <el-tag size="mini" type="primary">project</el-tag>
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
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click.native.stop="handleEdit(scope.row.id)">创建测试用例</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { getList } from "@/api/project";

export default {
  data() {
    return {
      tableData: []
    };
  },
  created() {
    getList(this.$store.getters.token, false, 2).then(response => {
      const { data } = response;
      this.tableData = data;
    });
  },
  methods: {
    handleEdit(pid) {
      // 路由传参
      this.$router.push({
        path: `/test/create/${pid}`
      });
    },
    // 单击某一行的回调
    rowClick(row) {
      const pid = row.id;
      // 路由传参
      this.$router.push({
        path: `/test/case/list/${pid}`
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
</style>