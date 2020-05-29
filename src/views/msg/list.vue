<template>
  <div class="project-container">
    <el-button
      type="primary"
      icon="el-icon-reading"
      round
      plain
      class="excel"
      @click="allRead"
      v-if="this.notReadingNum !== 0"
    >全部标为已读</el-button>
    <el-table :data="tableData" style="width: 100%;cursor: pointer;">
      <el-table-column label="标题" min-width="250">
        <template slot-scope="scope">
          <div slot="reference" class="name-wrapper">
            <el-tag size="mini" type="primary">message</el-tag>
            <span style="margin-left:10px">{{ scope.row.messageTitle }}</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="状态" min-width="100">
        <template slot-scope="scope">
          <i class="el-icon-collection-tag"></i>
          <span
            style="margin-left: 10px;color:#F56C6C"
            v-if="scope.row.meaasgeStatus==='未读'"
          >{{ scope.row.meaasgeStatus }}</span>
          <span
            style="margin-left: 10px"
            v-if="scope.row.meaasgeStatus==='已读'"
          >{{ scope.row.meaasgeStatus }}</span>
        </template>
      </el-table-column>
      <el-table-column label="时间" min-width="100">
        <template slot-scope="scope">
          <i class="el-icon-time"></i>
          <span style="margin-left: 10px">{{ scope.row.createTime }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button
            size="mini"
            @click.native.stop="handleEdit(scope.row.id)"
            v-if="scope.row.meaasgeStatus==='未读'"
          >标为已读</el-button>
          <el-button size="mini" type="danger" @click.native.stop="handleDelete(scope.row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { getList, deleteMsg, read, allRead, notReadNum } from "@/api/msg";

export default {
  data() {
    return {
      tableData: [],
      notReadingNum: 0
    };
  },
  created() {
    getList(this.$store.getters.name).then(response => {
      const { data } = response;
      this.tableData = data;
    });
    notReadNum(this.$store.getters.name).then(response => {
      const { data } = response;
      this.notReadingNum = data;
    });
  },
  methods: {
    allRead() {
      allRead(this.$store.getters.name).then(() => {
        this.$message.success(`全部标为已读成功`);
        // 重新加载数据
        getList(this.$store.getters.name).then(response => {
          const { data } = response;
          this.tableData = data;
        });
        this.notReadingNum = 0;
      });
    },
    handleEdit(mid) {
      read(mid).then(() => {
        this.$message.success(`标为已读成功`);
        // 重新加载数据
        getList(this.$store.getters.name).then(response => {
          const { data } = response;
          this.tableData = data;
        });
        this.notReadingNum = this.notReadingNum - 1;
      });
    },
    handleDelete(mid) {
      deleteMsg(mid).then(response => {
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
        getList(this.$store.getters.name).then(response => {
          const { data } = response;
          this.tableData = data;
        });
        notReadNum(this.$store.getters.name).then(response => {
          const { data } = response;
          this.notReadingNum = data;
        });
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
