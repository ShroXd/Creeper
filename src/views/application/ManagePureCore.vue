<template>
  <div>
    <v-dialog v-model="isShow" persistent width="700">
      <v-card>
        <v-card-title class="headline grey lighten-2">
          {{ title }}
        </v-card-title>

        <v-card-text>
          <v-container>
            <v-form ref="form">
              <v-row align="center">
                <v-col cols="12">
                  <v-text-field
                    v-model="applicationName"
                    :rules="applicationNameRules"
                    label="请输入你的应用名称"
                  ></v-text-field>
                </v-col>
              </v-row>
              <v-row>
                <v-col cols="6">
                  <v-text-field
                    v-model="minMemory"
                    label="请分配运行最小内存，例如 1G"
                    required
                    clearable
                  ></v-text-field>
                </v-col>
                <v-col cols="6">
                  <v-text-field
                    v-model="maxMemory"
                    label="请分配运行最大内存，例如 1G"
                    required
                    clearable
                  ></v-text-field>
                </v-col>
              </v-row>
              <v-row>
                <v-col cols="6">
                  <v-select
                    :items="hosts"
                    v-model="host"
                    item-text="hostName"
                    label="选择部署的目标服务器"
                    dense
                    outlined
                    return-object
                    @change="fetchHosts"
                  ></v-select>
                </v-col>
                <v-col cols="6">
                  <v-select
                    :items="cores"
                    v-model="core"
                    item-text="fileName"
                    item-value="filePath"
                    label="选择一个服务端核心"
                    dense
                    outlined
                    @change="fetchCores"
                  ></v-select>
                </v-col>
              </v-row>
              <v-row>
                <v-col cols="12">
                  <v-btn
                    outlined
                    color="primary"
                    @click="selectDirectory"
                    v-if="selectedPath === ''"
                    >选择创建路径</v-btn
                  >
                  <div v-else class="dir-title">
                    应用创建路径： {{ selectedPath }}
                  </div>
                </v-col>
              </v-row>
            </v-form>
          </v-container>
        </v-card-text>

        <v-divider></v-divider>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn text @click="cancel">
            取消
          </v-btn>
          <v-btn color="primary" text @click="confirm">
            创建
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import { ipcRenderer } from "electron";
import cryptoRandomString from "crypto-random-string";
import path from "path";

export default {
  name: "ManagePureCore",

  props: {
    isShow: Boolean,
    title: String
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
    packagePath: "",
    minMemory: "",
    maxMemory: ""
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
        hostPassword: this.host.hostPassword,
        type: "core",
        minMemory: this.minMemory,
        maxMemory: this.maxMemory
      };
      await this.$db.application.insert(data);
      this.hideDialog();
    },
    normalizeData() {
      const coreFileName = path.basename(this.core);
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
