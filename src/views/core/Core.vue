<template>
  <div>
    <Header title="核心管理" subtitle="您可以在这里管理 Minecraft 服务端核心">
      <template v-slot:function-btn>
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
      </template>
    </Header>
    <v-divider></v-divider>
    <v-container fluid>
      <v-row>
        <v-card
          class="mx-3 my-1"
          outlined
          hover
          v-for="(item, index) in cores"
          :key="index"
          width="300"
        >
          <v-container>
            <v-row justify="center">
              <v-img
                class="mt-6 mb-8"
                src="../../assets/img/box.png"
                width="150"
                height="150"
                contain
              ></v-img>
            </v-row>
            <v-divider></v-divider>
            <div class="mt-3 text-h6">{{ item.fileName }}</div>
            <v-row align="center">
              <v-chip class="ml-3" color="green" outlined label small>
                <v-icon small left>mdi-flash</v-icon>
                {{ item.totalSize | normalizeSize }} MB
              </v-chip>
              <v-spacer></v-spacer>
              <v-btn
                tile
                large
                icon
                color="red darken-1"
                @click="showConfirmDialog(item)"
              >
                <v-icon>mdi-delete</v-icon>
              </v-btn>
            </v-row>
            <v-expand-transition>
              <div class="mr-3 text-body-2">
                {{ item.filePath }}
              </div>
            </v-expand-transition>
          </v-container>
        </v-card>
        <v-expand-transition>
          <v-card
            class="mx-3 my-1"
            outlined
            hover
            width="300"
            v-if="downloadProcess.name"
          >
            <v-container>
              <v-row justify="center">
                <v-progress-circular
                  class="mt-6 mb-8"
                  :rotate="360"
                  :size="150"
                  :width="15"
                  :value="downloadProcess.progress"
                  color="primary"
                  :indeterminate="isDownloading"
                >
                  {{ downloadProcess.progress | normalizePercent }} %
                </v-progress-circular>
              </v-row>
              <v-divider></v-divider>
              <div class="mt-3 text-h6">{{ downloadProcess.name }}</div>
              <v-row align="center">
                <div class="ml-3 text-body-2">
                  {{ downloadProcess.downloaded | normalizeSize }} /
                  {{ downloadProcess.total | normalizeSize }} MB
                </div>
                <v-spacer></v-spacer>
                <v-chip class="mr-3" color="primary" outlined label small>
                  <v-icon small left>mdi-flash</v-icon>
                  {{ downloadProcess.speed | normalizeSize }} MB/s
                </v-chip>
              </v-row>
            </v-container>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn
                v-if="isDownloadPaused"
                tile
                large
                icon
                @click="downloadPlay"
              >
                <v-icon>mdi-play</v-icon>
              </v-btn>
              <v-btn v-else tile large icon @click="downloadPause">
                <v-icon>mdi-pause</v-icon>
              </v-btn>
              <v-btn
                tile
                large
                icon
                color="red darken-1"
                @click="downloadCancel"
              >
                <v-icon>mdi-delete</v-icon>
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-expand-transition>
      </v-row>
    </v-container>
    <ManageCore
      v-if="isManageCoreDialogShow"
      :is-show.sync="isManageCoreDialogShow"
      v-on:startDownload="startDownload"
    ></ManageCore>
    <Confirm
      v-if="isConfirmDialogShow"
      :isShow.sync="isConfirmDialogShow"
      title="你真的要删除这个核心吗"
      v-on:agree="deleteCore(waitingForDelete)"
      v-on:disagree="cancelConfirm"
    ></Confirm>
  </div>
</template>

<script>
import Header from "../../components/core/Header";
import Confirm from "../../components/core/Confirm";
import ManageCore from "./ManageCore";
import fs from "fs";
import path from "path";
import { DownloaderHelper } from "node-downloader-helper";
import { ipcRenderer } from "electron";
import { normalizeFileSize, normalizePercent } from "../../utils/utils";

export default {
  name: "Core",

  components: {
    Header,
    Confirm,
    ManageCore
  },

  created() {
    this.fetchCores();
    this.importCoreListener();
  },

  filters: {
    normalizeSize: size => {
      if (!size) return;
      return normalizeFileSize(size);
    },
    normalizePercent: percent => {
      if (!percent) return;
      return normalizePercent(percent);
    }
  },

  data: () => ({
    isManageCoreDialogShow: false,
    isConfirmDialogShow: false,
    isDownloading: false,
    isDownloadPaused: false,
    cores: [],
    downloadProcess: {},
    waitingForDelete: {}
  }),

  methods: {
    showManageCoreDialog() {
      this.isManageCoreDialogShow = true;
    },
    async fetchCores() {
      // 获取下载信息
      this.cores = await this.$db.cores.find({});
      console.log(this.cores);
    },
    async startDownload(param) {
      this.isDownloading = true;
      const url = `https://serverjars.com/api/fetchJar/${param.type}/${param.version}`;
      this.constructDownloadObject(url, param.dir);
    },
    constructDownloadObject(url, dir) {
      this.isDownloading = true;
      this.downloadProcess = {
        name: "...",
        total: "...",
        downloaded: "...",
        progress: 0,
        speed: 0
      };
      this.dl = new DownloaderHelper(url, dir);
      this.dl.on("start", () => {
        this.isDownloading = true;
      });
      this.dl.on("progress.throttled", res => {
        if (this.isDownloading) this.isDownloading = false;
        this.downloadProcess = res;
      });
      this.dl.on("pause", () => {
        this.isDownloadPaused = true;
      });
      this.dl.on("resume", () => {
        this.isDownloadPaused = false;
      });
      this.dl.on("end", async res => {
        const data = {
          fileName: res.fileName,
          filePath: res.filePath,
          totalSize: res.onDiskSize
        };
        await this.$db.cores.insert(data);
        await this.fetchCores();
        this.downloadProcess = {};
      });
      this.dl.start();
    },
    downloadPlay() {
      this.dl.start();
    },
    downloadPause() {
      this.dl.pause();
    },
    downloadCancel() {
      this.dl.stop();
      this.downloadProcess = {};
    },
    showConfirmDialog(core) {
      this.waitingForDelete = core;
      this.isConfirmDialogShow = true;
    },
    cancelConfirm() {
      this.waitingForDelete = {};
    },
    async deleteCore(core) {
      await this.$db.cores.remove(
        {
          fileName: core.fileName,
          filePath: core.filePath,
          totalSize: core.totalSize
        },
        {}
      );
      await this.fetchCores();
    },
    importCore() {
      ipcRenderer.send("open-jar-file-dialog");
    },
    importCoreListener() {
      ipcRenderer.on("selected-file", async (event, arg) => {
        const fileSize = fs.statSync(arg.filePaths[0]).size;
        const fileName = path.basename(arg.filePaths[0]);

        const data = {
          fileName: fileName,
          filePath: arg.filePaths[0],
          totalSize: fileSize
        };

        await this.$db.cores.insert(data);
        await this.fetchCores();
      });
    }
  }
};
</script>

<style scoped lang="scss"></style>
