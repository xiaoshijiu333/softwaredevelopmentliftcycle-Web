<template>
  <div class="project-container">
    <p class="proName">{{projectName}}</p>
    <el-steps :space="230" :active="proActive" finish-status="success" process-status="finish">
      <el-step title="需求分析阶段"></el-step>
      <el-step title="研发阶段"></el-step>
      <el-step title="测试阶段"></el-step>
      <el-step title="发布阶段"></el-step>
      <el-step title="已上线"></el-step>
    </el-steps>
    <p class="proPeo">项目组人员</p>
    <el-table
      :data="tableData"
      border
      height="200"
      style="width: 45%;margin-top:10px;margin-bottom:20px"
    >
      <el-table-column prop="username" label="姓名"></el-table-column>
      <el-table-column prop="userRoles" label="角色"></el-table-column>
      <el-table-column prop="phone" label="手机号"></el-table-column>
    </el-table>
    <el-card class="box-card" v-if="ifPublish()">
      <div slot="header" class="clearfix">
        <span>部署数据</span>
      </div>
      <div class="text item">域名：{{deployModel.deployDomin}}</div>
      <div class="text item">数据库地址：{{deployModel.deployDatabaseSite}}</div>
      <div class="text item">服务器地址：{{deployModel.deployServerSite}}</div>
    </el-card>
    <span class="proPeo">附件&nbsp;&nbsp;</span>
    <div slot="tip" class="el-upload__tip" style="display:inline">点击即可下载</div>
    <el-upload
      style="width: 45%;margin-bottom:20px"
      action="http://localhost:8088/file/upload"
      class="upload-demo"
      name="file"
      :before-remove="beforeRemove"
      :file-list="fileList"
      :on-preview="preview"
    ></el-upload>
    <span style="margin-right:20px">评论</span>
    <i class="el-icon-edit" style="cursor: pointer;" @click="openDialog"></i>
    <el-dialog title="编写评论" :visible.sync="dialogVisible" :close-on-click-modal="false">
      <quill-editor
        v-model="content"
        ref="myQuillEditor"
        style="height: 300px;"
        :options="editorOption"
      ></quill-editor>
      <el-button type="primary" @click="closeDialog">发表</el-button>
    </el-dialog>
    <div class="commentOut">
      <div class="comment" v-for="c in comments" :key="c.id">
        <el-avatar
          size="medium"
          :src="require('@/assets/headphoto/'+c.headPhoto)"
          style="float:left;margin-left:46px;margin-top:15px"
        ></el-avatar>
        <div class="comment2">
          <div style="overflow: hidden">
            <span class="userName">{{c.username}}</span>
            <span class="commentTime">{{c.createTime}}</span>
          </div>
          <div style="overflow: hidden">
            <span class="commentDesc" v-html="c.commentContext"></span>
          </div>
        </div>
      </div>
    </div>
    <div style="width:45%">
      <el-button
        type="primary"
        style="float:right;margin-bottom:20px"
        @click="flow"
        v-if="ifManage()"
      >流转</el-button>
    </div>
  </div>
</template>

<script>
import { quillEditor } from "vue-quill-editor";
import { getById, editState } from "@/api/project";
import { getAll, create } from "@/api/comment";
import { getById2 } from "@/api/deploy";
import { notice } from "@/api/msg";
import "quill/dist/quill.core.css";
import "quill/dist/quill.snow.css";
import "quill/dist/quill.bubble.css";

export default {
  created() {
    getById(this.$route.params.pid).then(response => {
      const { data } = response;
      this.projectName = data.projectName;
      this.proActive = data.projectState === 4 ? 5 : data.projectState;
      this.fileList = data.projectFileUrls;
      this.tableData = data.projectPeoples;
      this.projectPeopleIds = data.projectPeopleIds;
      getAll(this.$route.params.pid).then(response => {
        const { data } = response;
        this.comments = data;
      });
      getById2(this.$route.params.pid).then(response => {
        const { data } = response;
        this.deployModel = data;
      });
    });
  },
  components: {
    quillEditor
  },
  data() {
    return {
      comments: [],
      content: null,
      editorOption: {},
      dialogVisible: false,
      projectName: "",
      proActive: 0,
      tableData: [],
      fileList: [],
      projectPeopleIds: [],
      deployModel: {
        projectName: "",
        deployDomin: "",
        deployDatabaseSite: "",
        deployServerSite: ""
      }
    };
  },
  methods: {
    ifPublish() {
      return this.proActive === 5;
    },
    ifManage() {
      return this.$store.getters.roles.indexOf("manager") != -1;
    },
    // 点击下载文件（需要另开一个窗口）
    preview(file) {
      window.open(
        "http://localhost:8088/file/download?filename=" +
          file.name +
          "&path=" +
          file.url
      );
    },
    beforeRemove() {
      this.$message.error(`不可操作`);
      return false;
    },
    openDialog() {
      this.dialogVisible = true;
    },
    closeDialog() {
      this.dialogVisible = false;
      create(
        this.$store.getters.token,
        this.$route.params.pid,
        this.content
      ).then(() => {
        getAll(this.$route.params.pid).then(response => {
          const { data } = response;
          this.comments = data;
        });
      });
    },
    flow() {
      if (this.proActive === 5) {
        this.$message.error(`项目已经上线，不可再流转`);
        return false;
      }
      if (this.proActive === 3) {
        this.$message.error(`最后的发布阶段，你没有权限操作`);
        return false;
      }
      editState(this.$route.params.pid, this.proActive).then(response => {
        this.$message.success(`流转成功`);
        // 通知项目组所有人员，该项目已经流转
        this.proActive = this.proActive === 3 ? 5 : this.proActive + 1;
        const { data } = response;
        notice({
          ids: this.projectPeopleIds,
          messageTitle:
            "《" + this.projectName + "》项目已经流转到了《" + data + "》"
        });
      });
    }
  }
};
</script>

<style>
/* 设置不可加scope */
.ql-container.ql-snow {
  height: 75%;
}
</style>


<style lang="scss" scoped>
.project {
  &-container {
    margin: 30px;
  }
}
.proName {
  margin-bottom: 30px;
  font-size: 20px;
}
.proPeo {
  margin-top: 20px;
}
.el-upload {
  display: none;
}
.ql-container {
  height: 80%;
}
.comment {
  overflow: hidden;
  margin-bottom: 10px;
}
.comment2 {
  overflow: hidden;
}
.userName {
  float: left;
  font-size: 8px;
  color: #606266;
  margin-top: 12px;
  margin-left: 10px;
}
.commentTime {
  float: left;
  font-size: 8px;
  margin-top: 14px;
  color: #606266;
  margin-left: 12px;
}
.commentDesc {
  float: left;
  margin-top: 10px;
  margin-left: 10px;
  color: #272b33;
  font-size: 15px;
}
.commentOut {
  width: 45%;
  height: 200px;
  overflow-x: hidden;
  overflow-y: auto;
}
.clearfix:before,
.clearfix:after {
  display: table;
  content: "";
}
.clearfix:after {
  clear: both;
}

.box-card {
  width: 45%;
  margin: 50px 0;
}
.text {
  font-size: 14px;
}

.item {
  margin-bottom: 18px;
}
</style>
