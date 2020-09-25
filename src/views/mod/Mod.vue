<template>
  <div>
    <Header title="模组" subtitle="您可以在这里管理您的模组">
      <template v-slot:function-btn>
        <v-btn
          class="mr-3"
          color="primary"
          outlined
          @click="showManageModDialog"
        >
          导入模组
          <v-icon right>mdi-puzzle</v-icon>
        </v-btn>
        <v-btn
          color="error"
          outlined
          @click="showConfirmDialog"
          :disabled="selected.length === 0"
        >
          删除
          <v-icon right>mdi-delete</v-icon>
        </v-btn>
      </template>
    </Header>
    <v-divider></v-divider>
    <v-container fluid>
      <v-card-title>
        <v-text-field
          v-model="modSearch"
          append-icon="mdi-magnify"
          label="搜索模组"
          single-line
          hide-details
        ></v-text-field>
      </v-card-title>
      <v-divider></v-divider>
      <v-data-table
        v-model="selected"
        item-key="_id"
        :headers="tableHeaders"
        :search="modSearch"
        :items="mods"
        :items-per-page="10"
        show-select
        single-select
      ></v-data-table>
    </v-container>
    <Confirm
      title="你真的要删除模组吗"
      v-if="isConfirmDialogShow"
      :is-show.sync="isConfirmDialogShow"
      v-on:agree="deleteMod(waitingForDelete)"
      v-on:disagree="cancelConfirm"
    ></Confirm>
    <ManageMod
      v-if="isManageModDialogShow"
      :isShow.sync="isManageModDialogShow"
      v-on:refresh="fetchModData"
      title="导入模组"
    ></ManageMod>
  </div>
</template>

<script>
import Header from "../../components/core/Header";
import Confirm from "../../components/core/Confirm";
import ManageMod from "./ManageMod";
export default {
  name: "Mod",

  components: {
    Header,
    Confirm,
    ManageMod
  },

  created() {
    this.fetchModData();
  },

  data: () => ({
    isManageModDialogShow: false,
    isConfirmDialogShow: false,
    modSearch: "",
    tableHeaders: [
      {
        text: "名称",
        value: "modName"
      },
      {
        text: "游戏版本",
        value: "gameVersion"
      },
      {
        text: "分类",
        value: "modClass"
      },
      {
        text: "文件路径",
        value: "modFilePath"
      }
    ],
    mods: [],
    selected: [],
    waitingForDelete: []
  }),

  methods: {
    async fetchModData() {
      this.mods = await this.$db.mod.find({});
    },
    showManageModDialog() {
      this.isManageModDialogShow = true;
    },
    showConfirmDialog() {
      this.waitingForDelete = this.selected;
      this.isConfirmDialogShow = true;
    },
    async deleteMod() {
      const data = this.waitingForDelete[0]["_id"];
      await this.$db.mod.remove(
        {
          _id: data
        },
        {}
      );
      await this.fetchModData();
      this.selected = [];
    },
    cancelConfirm() {
      this.waitingForDelete = [];
    }
  }
};
</script>

<style scoped></style>
