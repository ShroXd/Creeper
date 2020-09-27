import Vue from "vue";
import Datastore from "nedb-promises";
import { remote } from "electron";

const basePath = remote.app.getPath("userData");

const db = {};

db.hosts = new Datastore({
  autoload: true,
  timestampData: true,
  filename: basePath + "/" + "hosts"
});

db.cores = new Datastore({
  autoload: true,
  timestampData: true,
  filename: basePath + "/" + "cores"
});

db.download = new Datastore({
  autoload: true,
  timestampData: true,
  filename: basePath + "/" + "download"
});

db.mod = new Datastore({
  autoload: true,
  timestampData: true,
  filename: basePath + "/" + "mod"
});

db.script = new Datastore({
  autoload: true,
  timestampData: true,
  filename: basePath + "/" + "script"
});

db.application = new Datastore({
  autoload: true,
  timestampData: true,
  filename: basePath + "/" + "application"
});

db.appMods = new Datastore({
  autoload: true,
  timestampData: true,
  filename: basePath + "/" + "appMods"
});

Vue.prototype.$db = db;
