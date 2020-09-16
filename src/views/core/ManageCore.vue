<template>
  <v-dialog v-model="isShow" persistent width="500">
    <v-card>
      <v-card-title class="headline grey lighten-2">
        添加核心
      </v-card-title>
      <v-card-text>
        <v-container>
          <v-col class="d-flex step" cols="12">
            <div class="text-h5 step__title">
              Step 1
            </div>
            <div class="subtitle-2">
              选择一个服务端核心
            </div>
          </v-col>
          <v-divider></v-divider>
          <v-row>
            <v-col class="d-flex" cols="12">
              <v-select
                :items="coreTypes"
                :disabled="isFetchingGameVersion"
                v-model="coreType"
                label="服务端核心"
                dense
                outlined
                @change="fetchGameVersion"
              ></v-select>
            </v-col>
          </v-row>
          <v-col class="d-flex step" cols="12" v-show="coreType">
            <div class="text-h5 step__title">
              Step 2
            </div>
            <div class="subtitle-2">
              选择游戏版本
            </div>
          </v-col>
          <v-divider></v-divider>
          <v-expand-transition>
            <v-row v-show="coreType">
              <v-col class="d-flex" cols="12">
                <v-select
                  :items="gameVersions"
                  v-model="gameVersion"
                  item-text="version"
                  item-value="version"
                  :loading="isFetchingGameVersion"
                  :disabled="isFetchingGameVersion"
                  label="游戏版本"
                  dense
                  outlined
                ></v-select>
              </v-col>
            </v-row>
          </v-expand-transition>

          <v-col class="d-flex step" cols="12" v-show="coreType">
            <div class="text-h5 step__title">
              Step 3
            </div>
            <div class="subtitle-2">
              选择下载路径
            </div>
          </v-col>
          <v-divider></v-divider>
          <v-expand-transition>
            <v-container>
              <v-row v-show="gameVersion">
                <v-btn
                  color="primary"
                  text
                  @click="selectDictionary"
                  :disabled="gameVersion === ''"
                  v-if="selectedDirName === ''"
                >
                  选取文件夹
                </v-btn>
                <div v-else>
                  <div class="dir-title">下载路径：</div>
                  {{ selectedDirName }}
                </div>
              </v-row>
            </v-container>
          </v-expand-transition>
        </v-container>
        <small class="ladder">*如获取失败请尝试科学上网</small>
      </v-card-text>
      <v-divider></v-divider>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="primary" text @click="cancel">
          取消
        </v-btn>
        <v-btn
          color="primary"
          text
          @click="startDownload"
          :disabled="selectedDirName === ''"
        >
          开始下载
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import servers from "../../api/servers";
import { ipcRenderer } from "electron";

export default {
  name: "ManageCore",

  props: {
    isShow: Boolean
  },

  created() {
    ipcRenderer.on("selected-dirname", (event, arg) => {
      if (arg.filePaths.length !== 0) {
        this.selectedDirName = arg.filePaths[0];
        console.log(this.selectedDirName);
      }
    });
  },

  data: () => ({
    isFetchingGameVersion: false,
    coreType: "",
    coreTypes: ["Spigot", "Bukkit", "Paper", "Magma", "Mohist", "Vanilla"],
    gameVersion: "",
    gameVersions: [],
    selectedDirName: ""
  }),

  methods: {
    async startDownload() {
      const data = {
        type: this.coreType,
        version: this.gameVersion,
        dir: this.selectedDirName
      };

      const repeatedDownloadItem = await this.$db.download.findOne(data);

      if (!repeatedDownloadItem) {
        await this.$db.download.insert(data);
      }

      this.$emit("startDownload", data);
      this.hideDialog();
    },
    cancel() {
      this.hideDialog();
    },
    hideDialog() {
      this.$emit("update:isShow", false);
      this.$emit("refresh");
    },
    fetchGameVersion() {
      if (!this.coreType) {
        return;
      }

      this.isFetchingGameVersion = true;
      this.gameVersions = [];

      servers
        .fetchAll({
          type: this.coreType
        })
        .then(res => {
          console.log(res.data.response);
          this.gameVersions = res.data.response;
        })
        .finally(() => {
          this.isFetchingGameVersion = false;
        });
    },
    selectDictionary() {
      ipcRenderer.send("open-file-dialog");
    }
  }
};
</script>

<style scoped>
.step {
  display: flex;
  align-items: flex-end;
}

.step__title {
  margin-right: 15px;
  color: #2196f3;
}

.dir-title {
  display: inline-block;
  margin-right: 10px;
}

.ladder {
  color: #616161;
  margin-left: 20px;
}
</style>
