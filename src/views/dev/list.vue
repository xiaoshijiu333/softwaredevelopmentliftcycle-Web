<template>
  <div class="project-container">
    <el-checkbox v-model="checked" class="showDoing" @change="ShowChange">只显示我的任务</el-checkbox>
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
      icon="el-icon-set-up"
      round
      plain
      @click="showGante"
      class="excel"
    >点击显示项目甘特图</el-button>
    <el-table :data="tableData" style="width: 100%;cursor: pointer;">
      <el-table-column label="标题" min-width="120">
        <template slot-scope="scope">
          <div slot="reference" class="name-wrapper">
            <el-tag size="mini" type="primary">task</el-tag>
            <span style="margin-left:10px">{{ scope.row.taskName }}</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="描述" min-width="120">
        <template slot-scope="scope">
          <span>{{ scope.row.taskDesc }}</span>
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
          <span style="margin-left: 10px">{{ scope.row.preCost }}h</span>
        </template>
      </el-table-column>
      <el-table-column label="负责人" min-width="80">
        <template slot-scope="scope">
          <i class="el-icon-user"></i>
          <span style="margin-left: 10px">{{ scope.row.devName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button
            size="mini"
            @click.native.stop="handleEdit(scope.row.id)"
            v-if="ifMy(scope.row.devName)"
          >编辑</el-button>
          <el-button
            size="mini"
            type="danger"
            @click.native.stop="handleDelete(scope.row.id)"
            v-if="ifMy(scope.row.devName)"
          >删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="showgt"></div>
  </div>
</template>

<script>
import { getList, deleteTask, gante } from "@/api/task";

export default {
  data() {
    return {
      checked: false,
      tableData: [],
      ganteTuData: [],
      th_data: {
        taskName: {
          value: "任务名称",
          width: 170,
          showToast: true,
          listen_click: true
        },
        devName: {
          value: "负责人姓名",
          width: 80,
          showToast: true
        },
        startTime: {
          value: "开始时间",
          width: 150,
          showToast: true,
          chooseTime: true,
          time_mode: 1
        },
        endTime: {
          value: "结束时间",
          width: 150,
          showToast: true,
          chooseTime: true,
          time_mode: 2
        }
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
    showGante() {
      gante(this.$route.params.pid).then(response => {
        const { data } = response;
        this.ganteTuData = data;
        this.$gante({
          container: ".showgt",
          ganteData: this.ganteTuData,
          start_time: new Date("2020/05/24").getTime(),
          end_time: new Date("2019/07/10").getTime(),
          // open: true,
          height: 400,
          time_mode: 1,
          th_data: this.th_data
        });
      });
    },
    ifMy(devName) {
      return devName === this.$store.getters.name;
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
      window.open("http://localhost:8088/task/excel?name=" + to + "&pid=" + p);
    },
    handleEdit(tid) {
      // 路由传参
      this.$router.push({
        path: `/dev/task/edit/${tid}`
      });
    },
    handleDelete(cid) {
      deleteTask(cid).then(response => {
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
.showgt {
  margin-top: 50px;
}
</style>
