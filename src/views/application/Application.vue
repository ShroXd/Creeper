<template>
  <div class="about">
    <Header title="应用" subtitle="您可以在这里创建并管理应用"></Header>
    <v-divider></v-divider>
    <v-row>
      <v-col md="6">
        <v-container>
          <v-card-title
            >应用
            <v-spacer></v-spacer>
            <v-btn
              class="mr-3"
              color="primary"
              outlined
              @click="showManagePackageDialog"
              >导入整合包</v-btn
            >
            <v-btn color="primary" outlined @click="showManagePureCoreDialog"
              >创建应用</v-btn
            >
          </v-card-title>
          <v-divider></v-divider>
          <v-card
            class="ma-4"
            min-height="200"
            v-for="(item, index) in applications"
            :key="index"
            :elevation="item === currentApplication ? 14 : 0"
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
              <v-btn color="red darken-1" text @click="showConfirmDialog(item)"
                >删除</v-btn
              >
              <v-btn color="primary" text @click="showMod(item)"
                >查看模组</v-btn
              >
            </v-card-actions>
          </v-card>
        </v-container>
      </v-col>
      <v-divider vertical></v-divider>
      <v-col>
        <v-container>
          <v-row class="mb-1" align="center">
            <v-card-title>
              模组
            </v-card-title>
          </v-row>
          <v-divider></v-divider>
          <v-row class="ps-3">
            <v-chip
              v-for="(mod, index) in applicationMods"
              :key="index"
              class="ma-2"
              color="primary"
              text-color="white"
              label
              @click="deleteApplicationMod(mod)"
            >
              {{ mod.modName }} - {{ mod.gameVersion }}
              <v-icon right>mdi-delete</v-icon>
            </v-chip>
            <div class="my-5 ml-2" v-if="applicationMods.length === 0">
              暂无数据
            </div>
          </v-row>
          <v-divider></v-divider>

          <v-row class="ps-3">
            <v-chip
              v-for="(mod, index) in availableMods"
              :key="index"
              class="ma-2"
              color="gray"
              label
              @click="addMod(mod)"
              :disabled="!currentApplication['_id']"
            >
              {{ mod.modName }} - {{ mod.gameVersion }}
              <v-icon class="ml-2">mdi-plus</v-icon>
            </v-chip>
            <div class="my-5 ml-2" v-if="availableMods.length === 0">
              暂无数据
            </div>
          </v-row>
        </v-container>
      </v-col>
    </v-row>
    <manage-package
      v-if="isManagePackageDialogShow"
      :is-show.sync="isManagePackageDialogShow"
      v-on:refresh="fetchApplication"
    ></manage-package>
    <manage-pure-core
      v-if="isManagePureCoreDialogShow"
      :is-show.sync="isManagePureCoreDialogShow"
      v-on:refresh="fetchApplication"
      :title="managePureCoreTitle"
      :mode="managePureCoreMode"
    ></manage-pure-core>
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
import ManagePackage from "./ManagePackage";
import ManagePureCore from "./ManagePureCore";

export default {
  name: "Application",

  components: { Header, Confirm, ManagePackage, ManagePureCore },

  created() {
    this.fetchApplication();
    this.fetchAvailableMods();
    if (this.applications.length !== 0) {
      this.showMod(this.applications[0]);
    }
  },

  data: () => ({
    isModify: false,
    isManagePackageDialogShow: false,
    isManagePureCoreDialogShow: false,
    isConfirmDialogShow: false,
    applications: [],
    waitingForDelete: {},
    currentApplication: {},
    searchMods: "",
    availableMods: [],
    applicationMods: [],
    managePureCoreTitle: "创建应用",
    managePureCoreMode: "",
    managePackageTitle: "导入整合包",
    managePackageMode: ""
  }),

  methods: {
    showManagePackageDialog() {
      this.isManagePackageDialogShow = true;
    },
    showManagePureCoreDialog() {
      this.isManagePureCoreDialogShow = true;
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
    async fetchAvailableMods() {
      this.availableMods = await this.$db.mod.find({});
    },
    async fetchAppMods() {
      if (this.currentApplication["_id"]) {
        this.applicationMods = await this.$db.appMods.find({
          appId: this.currentApplication["_id"]
        });
      }
    },
    showMod(app) {
      console.log(app);
      this.currentApplication = app;
      this.fetchAppMods();
      this.fetchAvailableMods();
    },
    async addMod(mod) {
      const data = {
        appId: this.currentApplication["_id"],
        modName: mod.modName,
        gameVersion: mod.gameVersion,
        modFilePath: mod.modFilePath
      };
      await this.$db.appMods.insert(data);
      await this.fetchAppMods();
    },
    async deleteApplication(app) {
      this.currentApplication = {};
      this.applicationMods = [];
      await this.$db.application.remove(
        {
          _id: app["_id"]
        },
        {}
      );
      this.waitingForDelete = {};
      await this.fetchApplication();
    },
    async deleteApplicationMod(mod) {
      console.log(mod);
      await this.$db.appMods.remove(
        {
          _id: mod["_id"]
        },
        {}
      );
      await this.fetchAppMods();
    }
  }
};
</script>

<style scoped lang="scss"></style>
