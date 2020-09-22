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
            <v-card-title>{{ item.name }}</v-card-title>
            <v-divider></v-divider>
            <v-container class="body-2 font-weight-light">
              <v-row>
                <v-col cols="12">
                  <v-icon class="mr-3" color="blue" size="22">
                    mdi-server
                  </v-icon>
                  {{ item.ip }}
                </v-col>
              </v-row>
              <v-row>
                <v-col cols="12">
                  <v-icon class="mr-3" color="blue" size="22">
                    mdi-cards-spade
                  </v-icon>
                  {{ normalizePath(item.applicationDir, item.coreFile) }}
                </v-col>
              </v-row>
            </v-container>
            <v-divider></v-divider>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="primary" outlined @click="startDeploy"
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
              v-if="startDeployInformation.time"
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
                            {{ startDeployInformation.coreVersion }}
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
  </div>
</template>

<script>
import Header from "../../components/core/Header";
import CreateApplication from "./CreateApplication";
import { resolvePath } from "../../utils/path";

export default {
  name: "Deploy",

  components: { Header, CreateApplication },

  created() {
    this.fetchApplication();
  },

  data: () => ({
    isCreateApplicationDialogShow: false,
    isDeploying: false,
    reverse: true,
    applications: [],
    startDeployInformation: {
      time: "15:25 ET",
      hostIP: "127.0.0.1",
      coreVersion: "magma-1.12.2.jar"
    },
    finishDeployInformation: {
      time: "15:30 EDT"
    },
    failureDeployInformation: {
      time: "15.30 EDT",
      reason: "SSH 登录服务器失败"
    },
    deployLogs: [
      {
        log: "开始压缩文件",
        time: "15:26 EDT"
      },
      {
        log: "正在上传",
        time: "15:27 EDT"
      },
      {
        log: "在线解压",
        time: "15:27 EDT"
      },
      {
        log: "正在启动服务端",
        time: "15:27 EDT"
      }
    ]
  }),

  methods: {
    normalizePath(path, file) {
      return resolvePath(path, file);
    },
    showCreateApplicationDialog() {
      this.isCreateApplicationDialogShow = true;
    },
    async fetchApplication() {
      this.applications = await this.$db.application.find({});
    },
    startDeploy() {
      this.isDeploying = true;
    }
  }
};
</script>

<style scoped lang="scss"></style>
