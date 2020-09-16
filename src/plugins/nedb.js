import Vue from "vue";
import Datastore from "nedb-promises";
import { remote } from "electron";

const basePath = remote.app.getPath("userData");

const db = {};

db.hosts = new Datastore({
  autoload: true,
  timestampData: true,
  filename: basePath + "hosts"
});
db.download = new Datastore({
  autoload: true,
  timestampData: true,
  filename: basePath + "download"
});

Vue.prototype.$db = db;
