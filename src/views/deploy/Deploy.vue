<template>
  <div class="about">
    <Header title="部署" subtitle="您可以在这里创建应用并部署"></Header>
    <v-divider></v-divider>
    <v-row>
      <v-col md="6">
        <v-container>
          <v-card-title
            >应用
            <v-spacer></v-spacer>
            <v-btn color="primary" outlined @click="showCreateApplicationDialog"
              >创建应用</v-btn
            >
          </v-card-title>
          <v-divider></v-divider>
          <v-card
            class="ma-4"
            min-height="200"
            v-for="(item, index) in applications"
            :key="index"
            outlined
            hover
          >
            <v-card-title>{{ item.applicationName }}</v-card-title>
            <v-divider></v-divider>
            <v-container class="body-2 font-weight-light">
              <v-row>
                <v-col cols="12">
                  <v-icon class="mr-3" color="blue" size="22">
                    mdi-server
                  </v-icon>
                  {{ item.hostName }} - {{ item.hostIP }}
                </v-col>
              </v-row>
              <v-row>
                <v-col cols="12">
                  <v-icon class="mr-3" color="blue" size="22">
                    mdi-cards-spade
                  </v-icon>
                  {{ item.applicationCorePath }}
                </v-col>
              </v-row>
            </v-container>
            <v-divider></v-divider>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="red darken-1" text @click="showConfirmDialog(item)"
                >删除</v-btn
              >
              <v-btn color="primary" text @click="startDeploy(item)"
                >开始部署</v-btn
              >
            </v-card-actions>
          </v-card>
        </v-container>
      </v-col>
      <v-divider vertical></v-divider>
      <v-col>
        <v-container>
          <v-card-title
            >部署日志 <v-spacer> </v-spacer
            ><v-btn color="primary" outlined>导出日志</v-btn>
          </v-card-title>
          <v-divider></v-divider>

          <v-timeline :reverse="reverse" dense>
            <v-timeline-item
              v-if="startDeployInformation.startTime"
              color="green lighten-1"
              fill-dot
              left
              small
            >
              <v-card>
                <v-card-title class="green lighten-1 justify-end">
                  <h2 class="display-1 mr-4 white--text font-weight-light">
                    开始部署应用
                  </h2>
                  <v-icon dark size="42">
                    mdi-minecraft
                  </v-icon>
                </v-card-title>
                <v-container>
                  <v-row>
                    <v-col class="hidden-sm-and-down" md="3">
                      <v-icon size="64">mdi-server-network</v-icon>
                    </v-col>
                    <v-col>
                      <v-row>
                        <v-col cols="12" sm="4" md="4">
                          <span class="text-body-1 font-weight-bold">
                            开始时间：
                          </span>
                        </v-col>
                        <v-col>
                          <span class="text-body-1 font-weight-regular">
                            {{ startDeployInformation.startTime }}
                          </span>
                        </v-col>
                      </v-row>
                      <v-row>
                        <v-col cols="12" sm="4" md="4">
                          <span class="text-body-1 font-weight-bold">
                            IP 地址：
                          </span>
                        </v-col>
                        <v-col>
                          <span class="text-body-1 font-weight-regular">
                            {{ startDeployInformation.hostIP }}
                          </span>
                        </v-col>
                      </v-row>
                      <v-row>
                        <v-col cols="12" sm="4" md="4">
                          <span class="text-body-1 font-weight-bold">
                            核心版本：
                          </span>
                        </v-col>
                        <v-col>
                          <span class="text-body-1 font-weight-regular">
                            {{ startDeployInformation.core }}
                          </span>
                        </v-col>
                      </v-row>
                    </v-col>
                  </v-row>
                </v-container>
              </v-card>
            </v-timeline-item>

            <v-timeline-item
              class="mb-4"
              color="green"
              icon-color="grey lighten-2"
              small
              v-for="(item, index) in deployLogs"
              :key="index"
            >
              <v-row justify="space-between">
                <v-col cols="7">{{ item.log }}</v-col>
                <v-col class="text-right" cols="5">{{ item.time }}</v-col>
              </v-row>
            </v-timeline-item>

            <v-timeline-item
              v-if="isNeedConfirmEula"
              color="green lighten-1"
              fill-dot
              left
              small
            >
              <v-card>
                <v-card-title class="lighten-1">
                  <h2 class="text-h5 mr-4 font-weight-light">
                    需要您确认 EULA
                  </h2>
                </v-card-title>
                <v-divider></v-divider>
                <v-card-text
                  >#By changing the setting below to TRUE you are indicating
                  your agreement to our EULA
                  (https://account.mojang.com/documents/minecraft_eula). #and
                  also agreeing that tacos are tasty. #Wed Sep 23 11:18:15 CST
                  2020
                </v-card-text>
                <v-divider></v-divider>
                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn depressed small color="error" @click="disagreeEula"
                    >不同意</v-btn
                  >
                  <v-btn depressed small @click="agreeEula">同意</v-btn>
                </v-card-actions>
              </v-card>
            </v-timeline-item>

            <v-timeline-item
              class="mb-4"
              icon-color="white"
              color="white"
              fill-dot
              large
            >
              <template v-slot:icon>
                <v-progress-circular
                  indeterminate
                  color="primary"
                ></v-progress-circular>
              </template>
              <v-row justify="space-between">
                <v-col cols="7">{{ currentStageDoing.log }}</v-col>
                <v-col class="text-right" cols="5">{{
                  currentStageDoing.time
                }}</v-col>
              </v-row>
            </v-timeline-item>

            <v-timeline-item
              v-if="finishDeployInformation.time"
              color="green lighten-1"
              fill-dot
              left
              small
            >
              <v-card>
                <v-card-title class="green lighten-1 justify-end">
                  <h2 class="display-1 mr-4 white--text font-weight-light">
                    部署完成
                  </h2>
                  <v-icon dark size="42">
                    mdi-minecraft
                  </v-icon>
                </v-card-title>
                <v-container>
                  <v-row>
                    <v-col class="hidden-sm-and-down" md="3">
                      <v-icon size="64">mdi-thumb-up</v-icon>
                    </v-col>
                    <v-col>
                      <v-row>
                        <v-col cols="12" sm="4" md="4">
                          <span class="text-body-1 font-weight-bold">
                            完成时间：
                          </span>
                        </v-col>
                        <v-col>
                          <span class="text-body-1 font-weight-regular">
                            {{ finishDeployInformation.time }}
                          </span>
                        </v-col>
                      </v-row>
                    </v-col>
                  </v-row>
                </v-container>
              </v-card>
            </v-timeline-item>

            <v-timeline-item
              v-if="failureDeployInformation.time"
              color="red lighten-1"
              fill-dot
              left
              small
            >
              <v-card>
                <v-card-title class="red lighten-1 justify-end">
                  <h2 class="display-1 mr-4 white--text font-weight-light">
                    部署失败
                  </h2>
                  <v-icon dark size="42">
                    mdi-minecraft
                  </v-icon>
                </v-card-title>
                <v-container>
                  <v-row>
                    <v-col class="hidden-sm-and-down" md="3">
                      <v-icon size="64">mdi-message-alert</v-icon>
                    </v-col>
                    <v-col>
                      <v-row>
                        <v-col cols="12" sm="4" md="4">
                          <span class="text-body-1 font-weight-bold">
                            完成时间：
                          </span>
                        </v-col>
                        <v-col>
                          <span class="text-body-1 font-weight-regular">
                            {{ failureDeployInformation.time }}
                          </span>
                        </v-col>
                      </v-row>
                      <v-row>
                        <v-col cols="12" sm="4" md="4">
                          <span class="text-body-1 font-weight-bold">
                            失败原因：
                          </span>
                        </v-col>
                        <v-col>
                          <span class="text-body-1 font-weight-regular">
                            {{ failureDeployInformation.reason }}
                          </span>
                        </v-col>
                      </v-row>
                    </v-col>
                  </v-row>
                </v-container>
              </v-card>
            </v-timeline-item>
          </v-timeline>
        </v-container>
      </v-col>
    </v-row>
    <create-application
      v-if="isCreateApplicationDialogShow"
      :is-show.sync="isCreateApplicationDialogShow"
      v-on:refresh="fetchApplication"
    ></create-application>
    <confirm
      v-if="isConfirmDialogShow"
      :is-show.sync="isConfirmDialogShow"
      title="你真的要删除这个应用吗"
      v-on:agree="deleteApplication(waitingForDelete)"
      v-on:disagree="cancelConfirm"
    ></confirm>
  </div>
</template>

<script>
import Header from "../../components/core/Header";
import Confirm from "../../components/core/Confirm";
import CreateApplication from "./CreateApplication";
import path from "path";
import { ipcRenderer } from "electron";

export default {
  name: "Deploy",

  components: { Header, Confirm, CreateApplication },

  created() {
    this.fetchApplication();
    this.initializeServerFileListener();
    this.doingLogsListener();
    this.finishedStageListener();
  },

  data: () => ({
    isCreateApplicationDialogShow: false,
    isConfirmDialogShow: false,
    isDeploying: false,
    reverse: true,
    isNeedConfirmEula: false,
    applications: [],
    waitingForDelete: {},
    deployingApp: {},
    execParams: {},
    zipResult: "",
    initializeServerFileLogs: "",
    startDeployInformation: {},
    deployLogs: [],
    // 正在进行
    currentStageDoing: {},
    finishDeployInformation: {},
    failureDeployInformation: {}
  }),

  methods: {
    showCreateApplicationDialog() {
      this.isCreateApplicationDialogShow = true;
    },
    showConfirmDialog(core) {
      this.waitingForDelete = core;
      this.isConfirmDialogShow = true;
    },
    cancelConfirm() {
      this.waitingForDelete = {};
    },
    async fetchApplication() {
      this.applications = await this.$db.application.find({});
    },
    async deleteApplication(app) {
      await this.$db.application.remove(
        {
          _id: app["_id"]
        },
        {}
      );
      this.waitingForDelete = {};
      await this.fetchApplication();
    },

    startDeploy(app) {
      this.isDeploying = true;

      // TODO 写入 Vuex
      this.deployingApp = app;

      // 写入开始部署信息
      this.startDeployInformation = {
        startTime: this.$day().format("YYYY-MM-DD HH:mm:ss"),
        hostIP: app.hostIP,
        core: path.basename(app.applicationCorePath)
      };
      this.currentStageDoing = {
        log: "正在初始化服务端文件",
        time: this.$day().format("YYYY-MM-DD HH:mm:ss")
      };

      // 缓存部署参数
      // TODO 可能会丢失，需要存储进 Vuex
      this.execParams = {
        minMemory: "1G",
        maxMemory: "1G",
        fileName: path.basename(app.applicationCorePath),
        applicationCorePath: path.dirname(app.applicationCorePath)
      };

      console.log(this.execParams);
      ipcRenderer.send("initialize-server-file", this.execParams);
    },
    agreeEula() {
      this.isNeedConfirmEula = false;

      // 压缩文件参数
      const dir = path.dirname(this.deployingApp.applicationCorePath);
      const zipFileName = dir.split("/").pop() + ".zip";
      const zipResult = path.join(path.resolve(dir, "../"), zipFileName);
      const data = {
        waitingForZip: dir,
        ZipResult: zipResult
      };

      console.log(data);
      ipcRenderer.on("zip-application", data);
    },
    disagreeEula() {},
    initializeServerFileListener() {
      ipcRenderer.on("initialize-finish", () => {
        this.currentStageDoing = {};
        this.deployLogs.push({
          log: "完成初始化服务端",
          time: this.$day().format("YYYY-MM-DD HH:mm:ss")
        });
        this.isNeedConfirmEula = true;
        // this.initializeServerFileLogs = arg;
      });
    },
    doingLogsListener() {
      ipcRenderer.on("deploy-current-stage", (event, arg) => {
        // 写入 currentStageDoing
        console.log(arg);
      });
    },
    finishedStageListener() {
      ipcRenderer.on("deploy-finished-stage", (event, arg) => {
        // push 进 deployLogs
        console.log(arg);
      });
    }
  }
};
</script>

<style scoped lang="scss"></style>
