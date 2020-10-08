<template>
  <v-dialog v-model="isShow" width="500" persistent>
    <v-card>
      <v-card-title class="headline lighten-2">
        {{ title }}
      </v-card-title>

      <v-card-text>
        <steps :step-titles="createScriptSteps">
          <template v-slot:name>
            <v-text-field
              v-model="scriptName"
              :rules="scriptNameRules"
              label="请输入脚本名称"
            ></v-text-field>
          </template>
          <template v-slot:note>
            <v-textarea
              v-model="scriptNote"
              label="输入备注"
              outlined
            ></v-textarea>
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
          :disabled="scriptName === ''"
          color="primary"
          text
          @click="selectPath"
        >
          {{ scriptPath === "" ? "选择路径" : "重新选择路径" }}
        </v-btn>
        <v-btn
          v-show="scriptPath !== ''"
          color="primary"
          text
          @click="createScript"
        >
          创建
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import Steps from "../../components/core/Steps";
import { ipcRenderer } from "electron";

export default {
  name: "CreateScript",

  props: {
    isShow: Boolean,
    title: String
  },

  created() {
    ipcRenderer.on("selected-dirname", (event, arg) => {
      if (arg) {
        this.scriptPath = arg.filePaths[0];
      }
    });
  },

  components: {
    Steps
  },

  data: () => ({
    scriptName: "",
    scriptNote: "",
    scriptPath: "",
    scriptNameRules: [
      v => !!v || "Script name is required",
      v => (v && v.length <= 24) || "Name must be less than 24 characters"
    ],
    createScriptSteps: ["name", "note"]
  }),

  methods: {
    hideDialog() {
      this.$emit("update:isShow", false);
      this.$emit("refresh");
    },
    async createScript() {
      const data = {
        scriptName: this.scriptName,
        scriptNote: this.scriptNote,
        scriptPath: this.scriptPath
      };

      await this.$db.script.insert(data);
      this.hideDialog();
    },
    selectPath() {
      ipcRenderer.send("open-directory-dialog");
    },
    cancel() {
      this.hideDialog();
    }
  }
};
</script>

<style scoped></style>
