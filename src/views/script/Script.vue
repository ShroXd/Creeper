<template>
  <div>
    <Header title="脚本" subtitle="您可以在这里管理部署脚本"></Header>
    <v-divider></v-divider>
    <v-row>
      <v-col md="6">
        <v-container>
          <v-card-title>
            脚本
            <v-spacer></v-spacer>
            <v-btn
              class="mr-3"
              color="primary"
              outlined
              @click="showCreateScriptDialog"
              >创建脚本</v-btn
            >
            <v-btn color="primary" outlined>导入脚本</v-btn>
          </v-card-title>
          <v-divider></v-divider>
          <v-card
            class="mt-3"
            v-for="(script, index) in scripts"
            :key="index"
            outlined
            hover
          >
            <v-card-title>{{ script.scriptName }}</v-card-title>
            <v-card-subtitle>{{ script.scriptPath }}</v-card-subtitle>
            <v-card-text>备注：{{ script.scriptNote }}</v-card-text>
            <v-divider></v-divider>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn
                text
                color="red darken-1"
                @click="showConfirmDialog(script)"
              >
                删除
              </v-btn>
              <v-btn text color="teal darken-1" @click="editScript(script)">
                脚本编辑
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-container>
      </v-col>
      <v-divider vertical></v-divider>
      <v-col>
        <v-container>
          <v-card-title
            >编写脚本 <v-spacer></v-spacer>
            <v-btn color="primary" outlined @click="saveScript">保存</v-btn>
          </v-card-title>
          <v-divider></v-divider>
          <codemirror
            class="mt-3"
            v-model="code"
            :options="cmOptions"
          ></codemirror>
          <v-alert
            class="mt-5"
            dense
            text
            dismissible
            :type="alertInformation.type"
            v-if="alertInformation.info !== ''"
          >
            {{ alertInformation.info }}
          </v-alert>
        </v-container>
      </v-col>
    </v-row>
    <Confirm
      v-if="isConfirmDialogShow"
      title="你真的要删除这个脚本吗"
      :is-show.sync="isConfirmDialogShow"
      v-on:agree="deleteScript(waitingForDelete)"
      v-on:disagree="cancelConfirm"
    ></Confirm>
    <CreateScript
      v-if="isCreateScriptDialogShow"
      :is-show.sync="isCreateScriptDialogShow"
      v-on:refresh="fetchScriptData"
      title="创建脚本"
    ></CreateScript>
  </div>
</template>

<script>
import { ipcRenderer } from "electron";
import Header from "../../components/core/Header";
import Confirm from "../../components/core/Confirm";
import CreateScript from "./CreateScript";
import "codemirror/theme/base16-light.css"; // theme css
import "codemirror/mode/shell/shell.js"; // language
import "codemirror/addon/selection/active-line.js";

export default {
  name: "Script",

  components: {
    Header,
    Confirm,
    CreateScript
  },

  created() {
    this.fetchScriptData();

    ipcRenderer.on("openSuccess", (event, arg) => {
      this.code = arg || "";
    });

    ipcRenderer.on("saveSuccess", (event, arg) => {
      if (arg === "ok") {
        this.alertInformation.type = "success";
        this.alertInformation.info = "保存成功";
      }
    });
  },

  data() {
    return {
      isCreateScriptDialogShow: false,
      isConfirmDialogShow: false,
      scripts: [],
      waitingForDelete: {},
      editing: {},
      alertInformation: {
        info: "",
        type: ""
      },
      code: "",
      // codemirror options
      cmOptions: {
        tabSize: 4,
        mode: "text/x-sh",
        theme: "base16-light",
        styleActiveLine: true,
        line: true,
        lineNumbers: true
      }
    };
  },

  methods: {
    async fetchScriptData() {
      this.scripts = await this.$db.script.find({});
    },

    async deleteScript(script) {
      await this.$db.script.remove(
        {
          _id: script["_id"]
        },
        {}
      );
      await this.fetchScriptData();
    },

    editScript(script) {
      this.editing = script;
      ipcRenderer.send("open-file", script);
    },

    saveScript() {
      const param = {
        path: this.editing.scriptPath + "/" + this.editing.scriptName + ".sh",
        code: this.code
      };
      ipcRenderer.send("save-file", param);
    },

    cancelConfirm() {
      this.waitingForDelete = {};
    },

    showConfirmDialog(script) {
      this.waitingForDelete = script;
      this.isConfirmDialogShow = true;
    },

    showCreateScriptDialog() {
      this.isCreateScriptDialogShow = true;
    }
  }
};
</script>

<style scoped></style>
