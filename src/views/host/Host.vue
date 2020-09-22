<template>
  <div>
    <Header title="服务器管理" subtitle="您可以在这里管理 Minecraft 服务器">
      <template v-slot:function-btn>
        <v-btn color="primary" outlined @click="showManageHostDialog">
          添加主机
          <v-icon right>mdi-server-plus</v-icon>
        </v-btn>
      </template>
    </Header>
    <v-divider></v-divider>
    <v-container fluid>
      <v-row>
        <v-card
          class="mx-3 my-1"
          v-for="(host, index) in hosts"
          :key="index"
          outlined
          hover
          width="300"
        >
          <v-container class="text-body-2" fluid>
            <v-row justify="center">
              <v-icon size="128">mdi-server</v-icon>
            </v-row>
            <div class="my-4">
              <v-row justify="center">
                <span class="font-weight-light">名称：</span>
                <span>{{ host.hostName ? host.hostName : "暂无" }}</span>
              </v-row>
              <v-row justify="center">
                <span class="font-weight-light">IP：</span>
                <span>{{ host.hostIP ? host.hostIP : "暂无" }}</span>
              </v-row>
            </div>
            <v-spacer></v-spacer>
            <v-divider></v-divider>
            <v-row class="ma-1" justify="space-around" align="center">
              <v-btn text color="red" @click="showConfirmDialog(host)"
                ><v-icon left>mdi-delete</v-icon>删除主机</v-btn
              >
              <v-btn text color="primary" @click="showManageHostDialog(host)"
                ><v-icon left>mdi-cog</v-icon>编辑主机</v-btn
              >
            </v-row>
          </v-container>
        </v-card>
      </v-row>
    </v-container>
    <ManageHost
      v-if="isManageHostDialogShow"
      :is-show.sync="isManageHostDialogShow"
      v-on:refresh="fetchHosts"
      :host-id="hostID"
      :title="hostID ? '服务器信息' : '新增服务器'"
      :mode="hostID ? 'edit' : ''"
    ></ManageHost>
    <Confirm
      v-if="isConfirmDialogShow"
      :is-show.sync="isConfirmDialogShow"
      v-on:agree="deleteHost(waitingForDelete)"
      v-on:disagree="cancelConfirm"
      title="你真的要删除这个服务器吗"
    ></Confirm>
  </div>
</template>

<script>
import Header from "../../components/core/Header";
import Confirm from "../../components/core/Confirm";
import ManageHost from "./ManageHost";

export default {
  name: "Host",

  components: {
    Header,
    ManageHost,
    Confirm
  },

  created() {
    this.fetchHosts();
  },

  data: () => ({
    isConfirmDialogShow: false,
    isManageHostDialogShow: false,
    isEditHostDialogShow: false,
    waitingForDelete: {},
    hostID: "",
    hosts: []
  }),

  methods: {
    showManageHostDialog(host = null) {
      if (host) {
        this.hostID = host["_id"];
      }
      this.isManageHostDialogShow = true;
    },
    showConfirmDialog(host) {
      this.waitingForDelete = host;
      this.isConfirmDialogShow = true;
    },
    cancelConfirm() {
      this.waitingForDelete = {};
    },
    async fetchHosts() {
      this.hosts = await this.$db.hosts.find({});
    },
    async deleteHost(host) {
      await this.$db.hosts.remove({ _id: host["_id"] }, {});
      await this.fetchHosts();
    }
  }
};
</script>

<style scoped lang="scss"></style>
