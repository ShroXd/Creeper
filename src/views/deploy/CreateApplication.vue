<template>
  <div>
    <v-dialog v-model="isShow" persistent width="500">
      <v-card>
        <v-card-title class="headline grey lighten-2">
          创建应用
        </v-card-title>

        <v-card-text>
          <steps :step-titles="createApplicationSteps">
            <template v-slot:name>
              <v-text-field
                v-model="applicationName"
                :rules="applicationNameRules"
                label="输入你的应用名称"
              ></v-text-field>
            </template>
            <template v-slot:host>
              <v-select
                v-show="applicationName"
                :items="hosts"
                v-model="host"
                item-text="hostName"
                label="选择部署的目标服务器"
                dense
                outlined
                @change="fetchHosts"
              ></v-select>
            </template>
            <template v-slot:core>
              <v-select
                v-show="host"
                :items="cores"
                v-model="core"
                item-text="file"
                label="选择一个服务端核心"
                dense
                outlined
                @change="fetchCores"
              ></v-select>
            </template>
          </steps>
        </v-card-text>

        <v-divider></v-divider>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" text @click="cancel">
            取消
          </v-btn>
          <v-btn v-show="applicationPath" color="primary" text @click="confirm">
            创建
          </v-btn>
          <v-btn
            :disabled="core === ''"
            color="primary"
            text
            @click="selectDirectory"
          >
            选择目录
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import { ipcRenderer } from "electron";
import Steps from "../../components/core/Steps";

export default {
  name: "CreateApplication",

  props: {
    isShow: Boolean,
    title: String
  },

  components: {
    Steps
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
    cores: [],
    createApplicationSteps: ["name", "host", "core"]
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
