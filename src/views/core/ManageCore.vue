<template>
  <v-dialog v-model="isShow" persistent width="500">
    <v-card>
      <v-card-title class="headline grey lighten-2">
        添加核心
      </v-card-title>
      <v-card-text>
        <steps :step-titles="manageCoreSteps">
          <template v-slot:core>
            <v-select
              :items="coreTypes"
              :disabled="isFetchingGameVersion"
              v-model="coreType"
              label="选择一个服务端核心"
              dense
              outlined
              @change="fetchGameVersion"
            ></v-select>
          </template>
          <template v-slot:version>
            <v-select
              v-show="coreType"
              :items="gameVersions"
              v-model="gameVersion"
              item-text="version"
              item-value="version"
              :loading="isFetchingGameVersion"
              :disabled="isFetchingGameVersion"
              label="选择一个游戏版本"
              dense
              outlined
            ></v-select>
          </template>
          <template v-slot:path>
            <div v-show="gameVersion">
              <v-btn
                color="primary"
                text
                @click="selectDictionary"
                :disabled="gameVersion === ''"
                v-if="selectedDirName === ''"
              >
                选择文件下载路径
              </v-btn>
              <div v-else>
                <div class="dir-title">下载路径：</div>
                {{ selectedDirName }}
              </div>
            </div>
          </template>
        </steps>
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
import Steps from "../../components/core/Steps";
import { ipcRenderer } from "electron";
import { resolvePath } from "../../utils/path";

export default {
  name: "ManageCore",

  props: {
    isShow: Boolean
  },

  components: {
    Steps
  },

  created() {
    ipcRenderer.on("selected-dirname", (event, arg) => {
      if (arg.filePaths.length !== 0) {
        this.selectedDirName = arg.filePaths[0];
      }
    });
  },

  data: () => ({
    isFetchingGameVersion: false,
    coreType: "",
    coreTypes: ["Spigot", "Bukkit", "Paper", "Magma", "Mohist", "Vanilla"],
    gameVersion: "",
    gameVersions: [],
    selectedDirName: "",
    manageCoreSteps: ["core", "version", "path"]
  }),

  methods: {
    async startDownload() {
      const fileName =
        this.coreType.toLowerCase() + "-" + this.gameVersion + ".jar";
      const data = {
        type: this.coreType,
        version: this.gameVersion,
        file: fileName,
        dir: this.selectedDirName,
        completeDir: resolvePath(this.selectedDirName, fileName)
      };

      const repeatedDownloadItem = await this.$db.download.findOne(data);

      if (!repeatedDownloadItem) {
        await this.$db.download.insert(data);
      }
      //TODO 处理重名文件

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
          this.gameVersions = res.data.response;
        })
        .finally(() => {
          this.isFetchingGameVersion = false;
        });
    },
    selectDictionary() {
      ipcRenderer.send("open-directory-dialog");
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
