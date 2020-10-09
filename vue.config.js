module.exports = {
  transpileDependencies: ["vuetify"],
  publicPath: "./",
  configureWebpack: {
    resolve: {
      extensions: ["*", ".mjs", ".js", ".vue", ".json"]
    },
    module: {
      rules: [
        {
          test: /\.mjs$/,
          include: /node_modules/,
          type: "javascript/auto"
        }
      ]
    }
  },
  devServer: {
    proxy: {
      "/api": {
        target: "https://serverjars.com/api",
        changeOrigin: true,
        pathRewrite: {
          "^/api": ""
        }
      }
    }
  },
  pluginOptions: {
    electronBuilder: {
      nodeIntegration: true,
      builderOptions: {
        productName: "Creeper",
        appId: "com.bebopser.creeper",
        copyright: "Copyright © 2020",
        asar: true,
        nsis: {
          oneClick: false,
          perMachine: true,
          allowElevation: false,
          allowToChangeInstallationDirectory: true,
          displayLanguageSelector: true,
          language: 2052
        },
        dmg: {
          contents: [
            {
              x: 410,
              y: 150,
              type: "link",
              path: "/Applications"
            },
            {
              x: 130,
              y: 150,
              type: "file"
            }
          ]
        },
        mac: {
          icon: "./public/mac.icns"
        },
        win: {
          icon: "./public/win.ico",
          target: "nsis"
        },
        linux: {
          icon: "./public/win.ico"
        }
      }
    }
  }
};
