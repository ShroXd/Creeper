<template>
  <div>
    <v-dialog v-model="isShow" persistent width="800">
      <v-card>
        <v-card-title class="headline grey lighten-2">
          创建应用
        </v-card-title>

        <v-card-text>
          <v-container>
            <v-col class="d-flex step" cols="12">
              <div class="text-h5 step__title">
                Step 1
              </div>
              <div class="subtitle-2">
                输入服务器应用名称
              </div>
            </v-col>
            <v-divider></v-divider>
            <v-row>
              <v-col class="d-flex" cols="12">
                <v-text-field
                  v-model="applicationName"
                  :rules="applicationNameRules"
                  label="应用名称"
                ></v-text-field>
              </v-col>
            </v-row>

            <v-col class="d-flex step" cols="12">
              <div class="text-h5 step__title">
                Step 2
              </div>
              <div class="subtitle-2">
                选择目标服务器
              </div>
            </v-col>
            <v-divider></v-divider>
            <v-row>
              <v-col class="d-flex" cols="12">
                <v-select
                  :items="hosts"
                  v-model="host"
                  item-text="hostName"
                  label="目标服务器"
                  dense
                  outlined
                  @change="fetchHosts"
                ></v-select>
              </v-col>
            </v-row>

            <v-col class="d-flex step" cols="12">
              <div class="text-h5 step__title">
                Step 3
              </div>
              <div class="subtitle-2">
                选择要部署的服务端核心
              </div>
            </v-col>
            <v-divider></v-divider>
            <v-row>
              <v-col class="d-flex" cols="12">
                <v-select
                  :items="cores"
                  v-model="core"
                  item-text="file"
                  label="服务端核心"
                  dense
                  outlined
                  @change="fetchCores"
                ></v-select>
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>

        <v-divider></v-divider>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" text @click="cancel">
            取消
          </v-btn>
          <v-btn color="primary" text @click="confirm">
            创建
          </v-btn>
          <v-btn color="primary" text @click="selectDirectory">
            选择目录
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import { ipcRenderer } from "electron";

export default {
  name: "CreateApplication",

  props: {
    isShow: Boolean,
    title: String
  },

  created() {
    this.fetchHosts();
    this.fetchCores();

    ipcRenderer.on("selected-dirname", (event, arg) => {
      if (arg.filePaths.length !== 0) {
        this.applicationPath = arg.filePaths[0];
      }
    });
  },

  data: () => ({
    applicationName: "",
    applicationNameRules: [
      v => !!v || "app name is required",
      v => (v && v.length <= 24) || "Name must be less than 24 characters"
    ],
    applicationPath: "",
    host: "",
    hosts: [],
    core: "",
    cores: []
  }),

  methods: {
    async selectDirectory() {
      await ipcRenderer.send("open-file-dialog");
    },
    async confirm() {
      //TODO: 目前 v-select 似乎不支持直接 v-model 写入一个对象

      const core = this.cores.filter(item => {
        return this.core === item.file;
      })[0];
      const host = this.hosts.filter(item => {
        return this.host === item.hostName;
      })[0];

      // 随机字符串以保证应用文件夹不相互覆盖
      const dir = this.applicationPath + "/myClient";

      ipcRenderer.send("mkdir", dir);

      ipcRenderer.send("move-file", {
        oldPath: core.completeDir,
        newPath: dir + "/" + core.file
      });

      const data = {
        name: this.applicationName,
        ip: host.hostIP,
        port: host.hostPort,
        user: host.hostUser,
        password: host.hostPassword,
        coreFile: core.file,
        applicationDir: dir
      };
      await this.$db.application.insert(data);
      this.hideDialog();
    },
    cancel() {
      this.hideDialog();
    },
    hideDialog() {
      this.$emit("update:isShow", false);
      this.$emit("refresh");
    },
    async fetchHosts() {
      this.hosts = await this.$db.hosts.find({});
    },
    async fetchCores() {
      this.cores = await this.$db.download.find({});
    }
  }
};
</script>

<style scoped>
.step {
  display: flex;
  align-items: flex-end;
}

.step__title {
  margin-right: 15px;
  color: #2196f3;
}
</style>
