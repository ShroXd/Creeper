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
              :rules="modNameRules"
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
        <v-btn
          :disabled="modClass === ''"
          color="primary"
          text
          @click="addFile"
        >
          {{ modFilePath === "" ? "选择文件" : "重新选择文件" }}
        </v-btn>
        <v-expand-transition>
          <v-btn
            v-show="modFilePath !== ''"
            color="primary"
            text
            @click="addMod"
          >
            添加
          </v-btn>
        </v-expand-transition>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import Steps from "../../components/core/Steps";
import { ipcRenderer } from "electron";
import { gameVersions, modClasses } from "../../utils/static";

export default {
  name: "ManageMod",

  components: {
    Steps
  },

  created() {
    ipcRenderer.on("selected-file", (event, arg) => {
      if (arg) {
        this.modFilePath = arg.filePaths[0];
      }
    });
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
    gameVersions: gameVersions,
    modClass: "",
    modClasses: modClasses,
    modFilePath: "",
    manageModSteps: ["name", "version", "class"]
  }),

  methods: {
    hideDialog() {
      this.$emit("update:isShow", false);
      this.$emit("refresh");
    },
    addFile() {
      ipcRenderer.send("open-jar-file-dialog");
    },
    async addMod() {
      const data = {
        modName: this.modName,
        gameVersion: this.gameVersion,
        modClass: this.modClass,
        modFilePath: this.modFilePath
      };
      await this.$db.mod.insert(data);

      this.hideDialog();
    },
    cancel() {
      this.hideDialog();
    }
  }
};
</script>
