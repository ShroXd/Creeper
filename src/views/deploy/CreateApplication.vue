<template>
  <div>
    <v-dialog v-model="isShow" persistent width="500">
      <v-card>
        <v-card-title class="headline grey lighten-2">
          {{ title }}
        </v-card-title>

        <v-card-text>
          <steps :step-titles="steps">
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
                return-object
                @change="fetchHosts"
              ></v-select>
            </template>
            <template v-if="mode === 'package'" v-slot:jar>
              <v-btn
                v-show="host.hostIP"
                color="primary"
                text
                @click="selectPackage"
                v-if="packagePath === ''"
                >选择整合包</v-btn
              >
              <div v-else>
                <div class="dir-title">整合包路径：</div>
                {{ packagePath }}
              </div>
            </template>
            <template v-else v-slot:core>
              <v-select
                v-show="host.hostIP"
                :items="cores"
                v-model="core"
                item-text="fileName"
                item-value="filePath"
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
          <v-btn text @click="cancel">
            取消
          </v-btn>
          <v-btn
            :disabled="core === '' && packagePath === ''"
            :color="selectedPath ? '' : 'primary'"
            text
            @click="selectDirectory"
          >
            {{ selectedPath === "" ? "选择目录" : "重新选择" }}
          </v-btn>
          <v-btn v-show="selectedPath" color="primary" text @click="confirm">
            创建
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import Steps from "../../components/core/Steps";
import { ipcRenderer } from "electron";
import cryptoRandomString from "crypto-random-string";
import path from "path";

export default {
  name: "CreateApplication",

  props: {
    isShow: Boolean,
    mode: String,
    title: String,
    steps: Array
  },

  components: {
    Steps
  },

  created() {
    this.fetchHosts();
    this.fetchCores();
    this.selectDirectoryListener();
    this.selectPackageListener();
  },

  data: () => ({
    createApplicationSteps: ["name", "host", "core"],
    applicationName: "",
    applicationNameRules: [
      v => !!v || "app name is required",
      v => (v && v.length <= 24) || "Name must be less than 24 characters"
    ],
    host: {},
    hosts: [],
    core: "",
    cores: [],
    selectedPath: "",
    packagePath: ""
  }),

  methods: {
    async selectDirectory() {
      await ipcRenderer.send("open-directory-dialog");
    },
    async selectPackage() {
      await ipcRenderer.send("open-zip-file-dialog");
    },
    async confirm() {
      const [applicationFolderPath, applicationCorePath] = this.normalizeData();
      this.makeApplicationFolder(applicationFolderPath, applicationCorePath);

      // 信息写入数据库
      const data = {
        applicationName: this.applicationName,
        applicationCorePath: applicationCorePath,
        hostName: this.host.hostName,
        hostIP: this.host.hostIP,
        hostPort: this.host.hostPort,
        hostUser: this.host.hostUser,
        hostPassword: this.host.hostPassword
      };
      this.mode === "package" ? (data.type = "package") : (data.type = "core");
      await this.$db.application.insert(data);
      this.hideDialog();
    },
    normalizeData() {
      const coreFileName =
        this.mode === "package"
          ? path.basename(this.packagePath)
          : path.basename(this.core);
      const applicationFolderPath = path.resolve(
        this.selectedPath,
        cryptoRandomString({ length: 10 })
      );
      const applicationCorePath = path.resolve(
        applicationFolderPath,
        coreFileName
      );

      return [applicationFolderPath, applicationCorePath];
    },
    makeApplicationFolder(applicationFolderPath, applicationCorePath) {
      ipcRenderer.send("mkdir", applicationFolderPath);
      ipcRenderer.send("move-file", {
        oldPath: this.core,
        newPath: applicationCorePath
      });
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
      this.cores = await this.$db.cores.find({});
    },
    selectDirectoryListener() {
      ipcRenderer.on("selected-dirname", (event, arg) => {
        if (arg.filePaths.length !== 0) {
          this.selectedPath = arg.filePaths[0];
        }
      });
    },
    selectPackageListener() {
      ipcRenderer.on("selected-zip", (event, arg) => {
        if (arg.filePaths.length !== 0) {
          this.packagePath = arg.filePaths[0];
        }
      });
    }
  }
};
</script>

<style scoped></style>
