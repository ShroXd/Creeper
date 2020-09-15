<template>
  <div>
    <v-card outlined>
      <div class="card__header">
        <div class="header__title">
          <v-card-title>核心管理</v-card-title>
          <v-card-subtitle class="pb-0"
            >您可以在这里管理 Minecraft 服务端核心
          </v-card-subtitle>
        </div>
      </div>
    </v-card>
    <v-card class="download-container" outlined>
      <div class="function-container">
        <v-btn color="blue-grey" class="ma-2 white--text">
          下载
          <v-icon right dark>mdi-cloud-download</v-icon>
        </v-btn>
        <v-btn color="blue-grey" class="ma-2 white--text">
          设置
          <v-icon right dark>mdi-cog</v-icon>
        </v-btn>
      </div>
    </v-card>
    <v-card class="download-container" height="200" outlined>
      <v-card-title class="subtitle-2">正在下载</v-card-title>
      <el-table
        :data="downloadItems"
        style="width: 100%"
        :row-style="{ height: '35px' }"
      >
        <el-table-column prop="date" label="名称" width="180">
          水桶端
        </el-table-column>
        <el-table-column prop="name" label="进度" width="380">
          <v-progress-linear
            color="black accent-4"
            value="45"
          ></v-progress-linear>
          <span>45%</span>
        </el-table-column>
        <el-table-column prop="date" label="速度" width="180">
          1 MB/s
        </el-table-column>
        <el-table-column prop="date" label="大小" width="180">
          12 / 45 MB
        </el-table-column>
        <el-table-column prop="date" label="添加日期" width="180">
          2020.2.10 19:45
        </el-table-column>
        <el-table-column prop="address" label="操作">
          <el-button size="mini" circle><v-icon>mdi-pause</v-icon></el-button>
          <!--          <el-button size="mini" circle><v-icon>mdi-play</v-icon></el-button>-->
          <el-button size="mini" circle><v-icon>mdi-delete</v-icon></el-button>
        </el-table-column>
      </el-table>
    </v-card>
  </div>
</template>

<script>
export default {
  name: "Core",
  data: () => ({
    downloadItems: [
      {
        name: "123"
      }
    ]
  })
};
</script>

<style scoped lang="scss">
.card__header {
  display: grid;
  grid-template-columns: 87% 10%;
  place-items: end start;
  margin-bottom: 20px;
}

.header__title {
  display: inline-block;
  width: 85%;
}

.function-container {
  padding: 15px;
}

.download-control-btn {
  margin-right: 15px;
}
</style>
