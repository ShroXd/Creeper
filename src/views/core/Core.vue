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
        <v-btn color="primary" outlined @click="showManageCoreDialog">
          添加核心
          <v-icon right>mdi-cloud-download</v-icon>
        </v-btn>
      </div>
      <v-divider></v-divider>
      <div class="download">
        <el-table
          :data="downloadItems"
          style="width: 100%"
          :row-style="{ height: '35px' }"
        >
          <el-table-column prop="date" label="名称" width="180">
            水桶端
          </el-table-column>
          <el-table-column prop="name" label="进度" width="380">
            <v-progress-linear
              color="black accent-4"
              value="45"
            ></v-progress-linear>
            <span>45%</span>
          </el-table-column>
          <el-table-column prop="date" label="速度" width="180">
            1 MB/s
          </el-table-column>
          <el-table-column prop="date" label="大小" width="180">
            12 / 45 MB
          </el-table-column>
          <el-table-column prop="date" label="添加日期" width="180">
            2020.2.10 19:45
          </el-table-column>
          <el-table-column prop="address" label="操作">
            <el-button size="mini" circle>
              <v-icon>mdi-pause</v-icon>
            </el-button>
            <el-button size="mini" circle>
              <v-icon>mdi-delete</v-icon>
            </el-button>
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
  </div>
</template>

<script>
import ManageCore from "./ManageCore";
import { ipcRenderer } from "electron";
// import servers from "../../api/servers";

export default {
  name: "Core",

  components: {
    ManageCore
  },

  created() {
    this.fetchDownloadItems();
    ipcRenderer.on("downloading-item", (event, arg) => {
      console.log("downloading-item");
      console.log(arg);
      console.log("=" * 20);
    });
  },

  data: () => ({
    isManageCoreDialogShow: false,
    downloadItems: [
      {
        name: "123"
      }
    ]
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
      const url = `https://serverjars.com/api/fetchJar/${param.type}/${param.version}`;
      console.log(url);
      ipcRenderer.send("download", {
        url: url,
        dir: param.dir
      });
    }
  }
};
</script>

<style scoped lang="scss">
.card__header {
  display: grid;
  grid-template-columns: 87% 10%;
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
