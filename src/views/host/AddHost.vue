<template>
  <v-dialog v-model="isShow" persistent max-width="600px">
    <v-card>
      <v-card-title>
        <span class="headline">{{ title }}</span>
      </v-card-title>
      <v-card-text>
        <v-container>
          <v-form ref="form">
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
        <small>*注明的字段必填</small>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn
          color="green darken-2"
          text
          :loading="testLoading"
          @click="testConnection"
          >测试连接</v-btn
        >
        <v-btn color="blue darken-1" text @click="hideDialog">取消</v-btn>
        <v-btn color="blue darken-1" text @click="saveHostData">保存</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { regex } from "../../utils/regex";
export default {
  name: "AddHost",

  props: {
    isShow: Boolean,
    title: String
  },

  data: () => ({
    testLoading: false,
    isPasswordShow: false,
    hostName: "",
    hostNameRules: [
      v => !!v || "Host name is required",
      v => (v && v.length <= 24) || "Name must be less than 24 characters"
    ],
    hostIP: "",
    hostIPRules: [
      v => !!v || "Host IP is required",
      v => regex.ip.test(v) || "IP must be valid"
    ],
    hostPort: "22",
    hostPortRules: [v => regex.port.test(v) || "Port must be valid"],
    hostUser: "root",
    hostPassword: "",
    hostPasswordRules: [v => !!v || "Host password is required"]
  }),
  methods: {
    testConnection() {
      // todo
      this.testLoading = true;
      setTimeout(() => (this.testLoading = false), 3000);
    },
    hideDialog() {
      this.$emit("update:isShow", false);
      this.$emit("refresh");
    },
    saveHostData() {
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
      this.$db.hosts.insert(data);
      this.hideDialog();
    }
  }
};
</script>

<style scoped></style>
