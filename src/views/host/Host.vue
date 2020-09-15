<template>
  <div>
    <v-card class="mx-auto" outlined>
      <div class="card__header">
        <div class="header__title">
          <v-card-title>服务器管理</v-card-title>
          <v-card-subtitle class="pb-0"
            >您可以在这里管理 Minecraft 服务器</v-card-subtitle
          >
        </div>
        <v-btn color="primary" outlined @click="showAddHostDialog">
          添加主机
          <v-icon right>mdi-server-plus</v-icon>
        </v-btn>
      </div>
      <v-divider></v-divider>
      <div class="hosts">
        <v-card v-for="(host, index) in hosts" :key="index" outlined hover>
          <div class="host">
            <div class="host__icon">
              <v-btn
                class="host__config"
                tile
                large
                color="error"
                icon
                @click="showConfirmDialog(host)"
              >
                <v-icon>mdi-delete</v-icon>
              </v-btn>
              <v-icon size="128">mdi-server</v-icon>
            </div>
            <div class="host__information">
              <div class="information__item">
                <div class="text--secondary information__title">名称：</div>
                <div class="font-weight-medium">
                  {{ host.hostName ? host.hostName : "暂无" }}
                </div>
              </div>
              <div class="information__item">
                <div class="text--secondary information__title">ip：</div>
                <div class="font-weight-medium">
                  {{ host.hostIP ? host.hostIP : "暂无" }}
                </div>
              </div>
            </div>
            <div class="host__operation">
              <v-btn text color="primary" @click="showEditHostDialog(host)"
                ><v-icon left>mdi-cog</v-icon>编辑主机</v-btn
              >
              <v-btn text><v-icon left>mdi-login</v-icon>测试连接</v-btn>
            </div>
          </div>
        </v-card>
      </div>
    </v-card>
    <AddHost
      v-if="isAddHostDialogShow"
      :is-show.sync="isAddHostDialogShow"
      v-on:refresh="fetchHosts"
      title="新增服务器"
    ></AddHost>
    <EditHost
      v-if="isEditHostDialogShow"
      :is-show.sync="isEditHostDialogShow"
      :host-id="hostID"
      v-on:refresh="fetchHosts"
      title="服务器信息"
    ></EditHost>
    <Confirm
      v-if="isConfirmDialogShow"
      :isShow.sync="isConfirmDialogShow"
      :title="deleteConfirmTitle"
      v-on:agree="deleteHost(waitingForDelete)"
      v-on:disagree="cancelConfirm"
    ></Confirm>
  </div>
</template>

<script>
import { ipcRenderer } from "electron";
import AddHost from "./AddHost";
import EditHost from "./EditHost";
import Confirm from "../../components/core/Confirm";

export default {
  name: "Host",

  components: {
    AddHost,
    EditHost,
    Confirm
  },

  created() {
    this.fetchHosts();
  },

  data: () => ({
    isAddHostDialogShow: false,
    isConfirmDialogShow: false,
    isEditHostDialogShow: false,
    deleteConfirmTitle: "你真的要删除这个服务器吗",
    waitingForDelete: {},
    hostID: "",
    hosts: []
  }),

  methods: {
    showAddHostDialog() {
      // this.isAddHostDialogShow = true;
      ipcRenderer.send("hello");
    },
    showEditHostDialog(host) {
      this.hostID = host["_id"];
      this.isEditHostDialogShow = true;
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

<style scoped lang="scss">
.card__header {
  display: grid;
  grid-template-columns: 87% 10%;
  place-items: end start;
  margin-bottom: 20px;
}

.header__title {
  display: inline-block;
  width: 85%;
}

.hosts {
  margin-top: 20px;
  padding-bottom: 20px;
  display: grid;
  grid-template-columns: repeat(4, 23%);
  grid-gap: 15px;
  place-content: center center;
}

.host {
}

.host__icon {
  text-align: center;
  padding: 15px 0;
}

.host__config {
  position: absolute;
  left: 235px;
  top: 5px;
}

.host__information {
  border-bottom: 1px solid #e0e0e0;
  text-align: center;
  padding-bottom: 5px;
  font-size: 0.8rem;

  .information__item div {
    display: inline-block;
  }
}

.information__title {
  margin-right: 5px;
}

.host__operation {
  display: flex;
  margin: 5px 0;
  justify-content: space-around;
}
</style>
