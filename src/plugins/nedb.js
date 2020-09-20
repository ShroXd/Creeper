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

db.cores = new Datastore({
  autoload: true,
  timestampData: true,
  filename: basePath + "cores"
});

db.application = new Datastore({
  autoload: true,
  timestampData: true,
  filename: basePath + "application"
});

db.mod = new Datastore({
  autoload: true,
  timestampData: true,
  filename: basePath + "mod"
});

Vue.prototype.$db = db;
