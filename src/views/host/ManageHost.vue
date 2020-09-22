<template>
  <v-dialog v-model="isShow" persistent max-width="600px">
    <v-card>
      <v-card-title class="headline grey lighten-2">
        <span class="headline">{{ title }}</span>
      </v-card-title>
      <v-card-text>
        <v-container>
          <v-form ref="form" :disabled="isLocked">
            <v-row>
              <v-col cols="12">
                <v-text-field
                  v-model="hostName"
                  :rules="hostNameRules"
                  label="服务器名称*"
                  required
                ></v-text-field>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12" sm="6" md="6">
                <v-text-field
                  v-model="hostIP"
                  :rules="hostIPRules"
                  label="服务器 IP*"
                  required
                ></v-text-field>
              </v-col>
              <v-col cols="12" sm="6" md="6">
                <v-text-field
                  v-model="hostPort"
                  :rules="hostPortRules"
                  label="服务器端口"
                  hint="ssh 服务端口，默认 22"
                  persistent-hint
                ></v-text-field>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12" sm="6" md="6">
                <v-text-field
                  v-model="hostUser"
                  label="登录用户"
                  hint="登录用户名，默认 root"
                ></v-text-field>
              </v-col>
              <v-col cols="12" sm="6" md="6">
                <v-text-field
                  v-model="hostPassword"
                  :rules="hostPasswordRules"
                  :type="isPasswordShow ? 'text' : 'password'"
                  :append-icon="isPasswordShow ? 'mdi-eye' : 'mdi-eye-off'"
                  @click:append="isPasswordShow = !isPasswordShow"
                  label="登录密码*"
                  required
                ></v-text-field>
              </v-col>
            </v-row>
          </v-form>
        </v-container>
        <v-alert v-if="isConnectError" type="error">
          连接失败
        </v-alert>
        <small>*注明的字段必填</small>
      </v-card-text>
      <v-divider></v-divider>
      <v-card-actions>
        <v-btn
          text
          @click="controlLock"
          :disabled="testLoading"
          v-if="mode === 'edit'"
        >
          <v-img
            v-show="isLocked"
            src="../../assets/img/lock.png"
            contain
            height="40"
          ></v-img>
          <v-img
            v-show="!isLocked"
            src="../../assets/img/unlock.png"
            contain
            height="40"
          ></v-img>
        </v-btn>
        <v-spacer></v-spacer>
        <v-btn text @click="hideDialog">取消</v-btn>
        <v-btn
          text
          :loading="testLoading"
          :disabled="isConnectTestPassed"
          @click="testConnection"
        >
          <v-icon v-if="isConnectTestPassed" left>mdi-check-bold</v-icon>
          {{ isConnectTestPassed ? "" : "测试连接" }}
        </v-btn>
        <v-btn
          color="primary"
          text
          :disabled="testLoading"
          @click="saveHostData"
          >保存</v-btn
        >
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { regex } from "../../utils/regex";
import { ipcRenderer } from "electron";

export default {
  name: "ManageHost",

  props: {
    isShow: Boolean,
    title: String,
    hostId: String,
    mode: String
  },

  created() {
    this.initializeConfig();
    this.checkConnectResult();
  },

  data: () => ({
    testLoading: false,
    isLocked: true,
    isPasswordShow: false,
    isConnectTestPassed: false,
    isConnectError: false,
    hostName: "",
    hostNameRules: [
      v => !!v || "给东西取名字然后去爱它，是成为变态的第一步",
      v => (v && v.length <= 24) || "名字需要少于 24 个字符"
    ],
    hostIP: "",
    hostIPRules: [
      v => !!v || "你需要输入服务器 IP 地址",
      v => regex.ip.test(v) || "IP 格式不正确"
    ],
    hostPort: "22",
    hostPortRules: [v => regex.port.test(v) || "Port 格式不正确"],
    hostUser: "root",
    hostPassword: "",
    hostPasswordRules: [v => !!v || "你需要输入登录密码"]
  }),

  methods: {
    checkConnectResult() {
      ipcRenderer.on("connect", (event, arg) => {
        if (arg === "连接服务器成功") {
          this.isConnectTestPassed = true;
          this.testLoading = false;
        } else if (arg === "连接服务器失败") {
          this.isConnectError = true;
          this.testLoading = false;
        }
      });
    },
    initializeConfig() {
      if (this.mode === "edit") {
        this.fetchHostInformation();
        return;
      }
      this.isLocked = false;
    },
    async fetchHostInformation() {
      const information = await this.$db.hosts.findOne({ _id: this.hostId });
      this.hostName = information.hostName;
      this.hostIP = information.hostIP;
      this.hostPort = information.hostPort;
      this.hostUser = information.hostUser;
      this.hostPassword = information.hostPassword;
    },
    controlLock() {
      this.isLocked = !this.isLocked;
    },
    hideDialog() {
      this.$emit("update:isShow", false);
      this.$emit("refresh");
    },
    async saveHostData() {
      if (!this.$refs.form.validate()) {
        return;
      }
      const data = {
        hostName: this.hostName,
        hostIP: this.hostIP,
        hostPort: this.hostPort || "22",
        hostUser: this.hostUser || "root",
        hostPassword: this.hostPassword
      };
      if (this.mode === "edit") {
        await this.$db.hosts.update({ _id: this.hostId }, { $set: data });
        this.hideDialog();
        return;
      }
      await this.$db.hosts.insert(data);
      this.hideDialog();
    },
    async testConnection() {
      this.testLoading = true;
      this.isLocked = true;
      this.isConnectError = false;
      const user = {
        hostIP: this.hostIP,
        hostPort: this.hostPort || "22",
        hostUser: this.hostUser || "root",
        hostPassword: this.hostPassword
      };
      await ipcRenderer.send("connect", user);
    }
  }
};
</script>

<style scoped></style>
