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
        appId: "com.bebopser.creeper",
        productName: "Creeper",
        copyright: "Copyright © 2020",
        files: ["**/*", "static/*"],
        asar: true,
        mac: {},
        win: {
          icon: "./public/win.ico",
          target: [
            {
              target: "nsis",
              arch: ["x64", "ia32"]
            }
          ]
        },
        nsis: {
          oneClick: false,
          allowElevation: true,
          allowToChangeInstallationDirectory: true,
          installerIcon: "./public/win.ico",
          uninstallerIcon: "./public/win.ico",
          installerHeaderIcon: "./public/win.ico",
          createDesktopShortcut: true
        }
      }
    }
  }
};
