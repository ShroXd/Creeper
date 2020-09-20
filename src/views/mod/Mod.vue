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
        <v-btn color="error" outlined>
          删除
          <v-icon right>mdi-delete</v-icon>
        </v-btn>
      </template>
    </Header>
    <v-divider></v-divider>
    <v-container fluid>
      <v-data-table
        :headers="tableHeaders"
        :items="tableData"
        :items-per-page="5"
        show-select
      ></v-data-table>
    </v-container>
    <ManageMod
      v-model="selected"
      v-if="isManageModDialogShow"
      :isShow.sync="isManageModDialogShow"
      :v-on:refresh="fetchModData"
      title="添加模组"
    ></ManageMod>
  </div>
</template>

<script>
import Header from "../../components/core/Header";
import ManageMod from "./ManageMod";
export default {
  name: "Mod",

  components: {
    Header,
    ManageMod
  },

  created() {
    this.fetchModData();
  },

  data: () => ({
    isManageModDialogShow: false,
    tableHeaders: [
      {
        text: "名称",
        value: "name"
      },
      {
        text: "游戏版本",
        value: "gameVersion"
      },
      {
        text: "分类",
        value: "classification"
      },
      {
        text: "前置",
        value: "pre"
      }
    ],
    tableData: [
      {
        name: "拔刀剑",
        gameVersion: "1.12.2",
        pre: null,
        classification: "冒险"
      },
      {
        name: "拔刀剑",
        gameVersion: "1.12.2",
        pre: null,
        classification: "冒险"
      }
    ],
    selected: []
  }),

  methods: {
    async fetchModData() {
      await this.$db.mod.find({});
    },
    showManageModDialog() {
      this.isManageModDialogShow = true;
    }
  }
};
</script>

<style scoped></style>
