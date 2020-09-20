<template>
  <v-dialog v-model="isShow" width="500">
    <v-card>
      <v-card-title class="headline grey lighten-2">
        {{ title }}
      </v-card-title>

      <v-card-text>
        <steps :step-titles="manageModSteps">
          <template v-slot:name>
            <v-text-field
              v-model="modName"
              label="输入 Mod 名称"
            ></v-text-field>
          </template>
          <template v-slot:version>
            <v-select
              v-show="modName !== ''"
              :items="gameVersions"
              v-model="gameVersion"
              label="选择游戏版本"
              dense
              outlined
            ></v-select>
          </template>
          <template v-slot:class>
            <v-select
              v-show="gameVersion !== ''"
              :items="modClasses"
              v-model="modClass"
              label="选择 Mod 分类"
              dense
              outlined
            ></v-select>
          </template>
        </steps>
      </v-card-text>

      <v-divider></v-divider>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="primary" text @click="cancel">
          取消
        </v-btn>
        <v-btn color="primary" text @click="addMod">
          添加
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import Steps from "../../components/core/Steps";
export default {
  name: "ManageMod",

  components: {
    Steps
  },

  props: {
    title: String,
    isShow: Boolean
  },

  data: () => ({
    modName: "",
    modNameRules: [
      v => !!v || "Host name is required",
      v => (v && v.length <= 24) || "Name must be less than 24 characters"
    ],
    gameVersion: "",
    gameVersions: [
      "1.16.3",
      "1.16.2",
      "1.16.1",
      "1.16",
      "1.15.2",
      "1.15.1",
      "1.15",
      "1.14.4",
      "1.14.3",
      "1.14.2",
      "1.14.1",
      "1.14",
      "1.13.2",
      "1.13.1",
      "1.13",
      "1.12.2",
      "1.12.1",
      "1.12",
      "1.11.2",
      "1.11.1",
      "1.11",
      "1.10.2",
      "1.10.1",
      "1.10",
      "1.9.4",
      "1.9.3",
      "1.9.2",
      "1.9.1",
      "1.9",
      "1.8.9",
      "1.8.7"
    ],
    modClass: "",
    modClasses: [
      "科技",
      "魔法",
      "冒险",
      "农业",
      "装饰",
      "实用",
      "辅助",
      "魔改"
    ],
    manageModSteps: ["name", "version", "class"]
  }),

  methods: {
    hideDialog() {
      this.$emit("update:isShow", false);
    },
    addMod() {
      this.hideDialog();
    },
    cancel() {
      this.hideDialog();
    }
  }
};
</script>
