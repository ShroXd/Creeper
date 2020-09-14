<template>
  <v-dialog v-model="dialog" persistent max-width="600px">
    <v-card>
      <v-card-title>
        <span class="headline">{{ title }}</span>
      </v-card-title>
      <v-card-text>
        <v-container>
          <v-row>
            <v-col cols="12">
              <v-text-field
                v-model="hostName"
                label="服务器名称*"
                required
              ></v-text-field>
            </v-col>
            <v-col cols="12" sm="6" md="6">
              <v-text-field label="服务器 IP*"></v-text-field>
            </v-col>
            <v-col cols="12" sm="6" md="6">
              <v-text-field
                label="服务器端口"
                hint="ssh 服务端口，默认 22"
                persistent-hint
              ></v-text-field>
            </v-col>
            <v-col cols="12" sm="6" md="6">
              <v-text-field label="登录用户*"></v-text-field>
            </v-col>
            <v-col cols="12" sm="6" md="6">
              <v-text-field label="登录密码*"></v-text-field>
            </v-col>
          </v-row>
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
export default {
  name: "AddHost",

  props: {
    dialog: Boolean,
    title: String
  },

  data: () => ({
    testLoading: false,
    hostName: ""
  }),
  methods: {
    testConnection() {
      // todo
      this.testLoading = true;
      setTimeout(() => (this.testLoading = false), 3000);
    },
    hideDialog() {
      this.$emit("update:dialog", false);
    },
    saveHostData() {
      console.log(this.hostName);
      this.hideDialog();
    }
  }
};
</script>

<style scoped></style>
