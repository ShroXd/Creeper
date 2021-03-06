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
            <v-row align="center">
              <v-card-title class="ml-3">{{
                item.applicationName
              }}</v-card-title>
              <v-spacer></v-spacer>
              <v-chip class="mr-7" color="primary" outlined pill>
                <v-icon left>mdi-beer</v-icon>
                {{ item.type }}
              </v-chip>
            </v-row>
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
                  {{ item.applicationCorePath || item.packageJarPath }}
                </v-col>
              </v-row>
            </v-container>
            <v-divider></v-divider>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn
                :disabled="isDeploying"
                color="primary"
                text
                @click="startDeploy(item)"
                >开始部署</v-btn
              >
            </v-card-actions>
          </v-card>
        </v-container>
      </v-col>
      <v-divider vertical></v-divider>
      <v-col>
        <v-container>
          <v-card-title>
            部署日志
            <v-spacer> </v-spacer>
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
              v-if="currentStageDoing.log"
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
                            {{ failureDeployInformation.log }}
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
import { ipcRenderer } from "electron";

export default {
  name: "Deploy",

  components: { Header, Confirm },

  activated() {
    this.fetchApplication();
  },

  mounted() {
    this.fetchApplication();
    this.doingLogsListener();
    this.finishedStageListener();
    this.failureListener();
    this.successListener();
    this.terminalLogsListener();
  },

  data: () => ({
    isConfirmDialogShow: false,
    isDeploying: false,
    reverse: true,
    applications: [],
    waitingForDelete: {},
    startDeployInformation: {},
    deployLogs: [],
    currentStageDoing: {},
    finishDeployInformation: {},
    failureDeployInformation: {},
    terminalLogs: []
  }),

  methods: {
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

    async startDeploy(app) {
      this.isDeploying = true;
      this.resetLogsHistory();
      app.remotePath = `/home/${app.hostUser}/Minecraft/application.zip`;

      const mods = await this.$db.appMods.find({
        appId: app["_id"]
      });

      // this.saveDeployInformation(app);
      ipcRenderer.send("run-handler", app, mods);
    },

    resetLogsHistory() {
      this.deployLogs = [];
      this.currentStageDoing = {};
      this.finishDeployInformation = {};
      this.failureDeployInformation = {};
    },
    async saveDeployInformation(app) {
      await this.$db.application.update(
        {
          _id: app["_id"]
        },
        {
          $set: {
            remotePath: app.remotePath
          }
        },
        {}
      );
    },
    doingLogsListener() {
      ipcRenderer.on("deploy-current-stage", (event, arg) => {
        this.currentStageDoing = arg;
      });
    },
    finishedStageListener() {
      ipcRenderer.on("deploy-finished-stage", (event, arg) => {
        this.deployLogs.push(arg);
      });
    },
    failureListener() {
      ipcRenderer.on("deploy-failure", (event, arg) => {
        this.failureDeployInformation = arg;
        this.currentStageDoing = {};
        this.isDeploying = false;
      });
    },
    successListener() {
      ipcRenderer.on("deploy-success", (event, arg) => {
        this.finishDeployInformation = arg;
        this.currentStageDoing = {};
        this.isDeploying = false;
      });
    },
    terminalLogsListener() {
      ipcRenderer.on("terminal-log", (event, arg) => {
        this.terminalLogs.push(arg);
        console.log(arg);
      });
    }
  }
};
</script>

<style scoped lang="scss"></style>
