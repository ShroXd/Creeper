<template>
  <div>
    <v-card class="mx-auto" outlined>
      <Header title="服务器管理" subtitle="您可以在这里管理 Minecraft 服务器">
        <template v-slot:function-btn>
          <v-btn color="primary" outlined @click="showManageHostDialog">
            添加主机
            <v-icon right>mdi-server-plus</v-icon>
          </v-btn>
        </template>
      </Header>
      <v-divider></v-divider>
      <div class="hosts">
        <v-card v-for="(host, index) in hosts" :key="index" outlined hover>
          <div class="host">
            <div class="host__icon">
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
              <v-btn text @click="showConfirmDialog(host)"
                ><v-icon left>mdi-delete</v-icon>删除主机</v-btn
              >
              <v-btn text color="primary" @click="showManageHostDialog(host)"
                ><v-icon left>mdi-cog</v-icon>编辑主机</v-btn
              >
            </div>
          </div>
        </v-card>
      </div>
    </v-card>
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
      :isShow.sync="isConfirmDialogShow"
      :title="deleteConfirmTitle"
      v-on:agree="deleteHost(waitingForDelete)"
      v-on:disagree="cancelConfirm"
    ></Confirm>
  </div>
</template>

<script>
import { ipcRenderer } from "electron";
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
    ipcRenderer.on("connect", (event, arg) => {
      console.log(arg);
    });
  },

  data: () => ({
    isConfirmDialogShow: false,
    isManageHostDialogShow: false,
    isEditHostDialogShow: false,
    deleteConfirmTitle: "你真的要删除这个服务器吗",
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

<style scoped lang="scss">
.hosts {
  margin-top: 20px;
  padding-bottom: 20px;
  display: grid;
  grid-template-columns: repeat(4, 23%);
  grid-gap: 15px;
  place-content: center center;
}

.host__icon {
  text-align: center;
  padding: 15px 0;
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
