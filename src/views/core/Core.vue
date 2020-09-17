<template>
  <div>
    <v-card class="mx-auto" outlined>
      <div class="card__header">
        <div class="header__title">
          <v-card-title>核心管理</v-card-title>
          <v-card-subtitle class="pb-0"
            >您可以在这里管理 Minecraft 服务端核心
          </v-card-subtitle>
        </div>
        <div>
          <v-btn
            class="mr-4"
            color="primary"
            outlined
            :disabled="isDownloading"
            @click="showManageCoreDialog"
          >
            下载核心
            <v-icon right>mdi-cloud-download</v-icon>
          </v-btn>
          <v-btn
            color="primary"
            outlined
            :disabled="isDownloading"
            @click="importCore"
          >
            导入核心
            <v-icon right>mdi-plus-thick</v-icon>
          </v-btn>
        </div>
      </div>
      <v-divider></v-divider>
      <div class="download">
        <el-table
          :data="downloadItems"
          style="width: 100%"
          :row-style="{ height: '35px' }"
        >
          <el-table-column prop="date" label="文件名" width="180">
            <template slot-scope="scope">
              {{ scope.row.type + " - " + scope.row.version }}
            </template>
          </el-table-column>
          <el-table-column prop="date" label="大小" width="150">
            <template slot-scope="scope">
              {{ scope.row.total || receiveMB }} /
              {{ scope.row.total || totalMB }} MB</template
            >
          </el-table-column>
          <el-table-column prop="date" label="存储地址" width="200">
            <template slot-scope="scope">
              {{ scope.row.completeDir || downloadDir }}
            </template>
          </el-table-column>
          <el-table-column prop="name" label="进度" width="600">
            <template slot-scope="scope">
              <v-progress-linear
                :value="scope.row.percent || downloadPercent"
                height="20"
                striped
              >
                <strong
                  >{{
                    scope.row.percent || downloadPercent.toFixed(1)
                  }}
                  %</strong
                >
              </v-progress-linear></template
            >
          </el-table-column>
          <el-table-column prop="date" label="操作" width="100">
            <template slot-scope="scope">
              <el-button
                type="danger"
                icon="el-icon-delete"
                size="mini"
                circle
                :disabled="isDownloading"
                @click="showConfirmDialog(scope.row)"
              ></el-button
            ></template>
          </el-table-column>
        </el-table>
      </div>
    </v-card>
    <ManageCore
      v-if="isManageCoreDialogShow"
      :is-show.sync="isManageCoreDialogShow"
      v-on:refresh="fetchDownloadItems"
      v-on:startDownload="startDownload"
    ></ManageCore>
    <Confirm
      v-if="isConfirmDialogShow"
      :isShow.sync="isConfirmDialogShow"
      :title="deleteConfirmTitle"
      v-on:agree="deleteCore(waitingForDelete)"
      v-on:disagree="cancelConfirm"
    ></Confirm>
  </div>
</template>

<script>
import ManageCore from "./ManageCore";
import Confirm from "../../components/core/Confirm";
import { ipcRenderer } from "electron";
import { regex } from "../../utils/regex";

export default {
  name: "Core",

  components: {
    ManageCore,
    Confirm
  },

  created() {
    this.fetchDownloadItems();
    // 下载进程信息
    ipcRenderer.on("download-progress", (event, arg) => {
      this.downloadPercent = arg.percent * 100;
      this.receiveMB = (arg.transferredBytes / (1024 * 1024)).toFixed(1);
      this.totalMB = (arg.totalBytes / (1024 * 1024)).toFixed(1);
    });

    // 下载项完成
    ipcRenderer.on("download-finished", () => {
      this.$db.download.update(
        {
          dir: this.downloadDir
        },
        {
          $set: {
            total: this.totalMB,
            percent: 100
          }
        }
      );
      this.isDownloading = false;
    });

    // 导入核心
    ipcRenderer.on("selected-filename", (event, arg) => {
      const fileName = arg.filePaths[0].match(regex.file)[0];
      const type = fileName.match(regex.coreType)[0].slice(0, -1);
      const version = fileName.match(regex.coreVersion)[0].slice(1, -4);

      const data = {
        type: type,
        version: version,
        file: fileName,
        completeDir: arg.filePaths[0],
        total: "?",
        percent: 100
      };

      this.$db.download.insert(data);
      this.fetchDownloadItems();
    });
  },

  data: () => ({
    isManageCoreDialogShow: false,
    isConfirmDialogShow: false,
    isDownloading: false,
    deleteConfirmTitle: "你真的要删除这个核心吗",
    waitingForDelete: {},
    downloadItems: [],
    downloadPercent: 0,
    receiveMB: 0,
    totalMB: 0,
    downloadDir: ""
  }),

  methods: {
    showManageCoreDialog() {
      this.isManageCoreDialogShow = true;
    },
    async fetchDownloadItems() {
      // 获取下载信息
      this.downloadItems = await this.$db.download.find({});
    },
    startDownload(param) {
      this.isDownloading = true;
      this.downloadDir = param.dir;
      const url = `https://serverjars.com/api/fetchJar/${param.type}/${param.version}`;
      ipcRenderer.send("download", {
        url: url,
        dir: param.dir
      });
    },
    showConfirmDialog(core) {
      this.waitingForDelete = core;
      this.isConfirmDialogShow = true;
    },
    cancelConfirm() {
      this.waitingForDelete = {};
    },
    async deleteCore(core) {
      await this.$db.download.remove(
        {
          type: core.type,
          version: core.version,
          dir: core.dir
        },
        {}
      );
      await this.fetchDownloadItems();
    },
    importCore() {
      // TODO
      ipcRenderer.send("select-jar-file");
    }
  }
};
</script>

<style scoped lang="scss">
.card__header {
  display: grid;
  grid-template-columns: 75% 25%;
  place-items: end start;
  margin-bottom: 20px;
}

.header__title {
  display: inline-block;
  width: 85%;
}

.function-container {
}

.download {
  padding: 20px;
}

.download-control-btn {
  margin-right: 15px;
}
</style>
