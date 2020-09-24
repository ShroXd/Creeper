import { ipcRenderer } from "electron";

class AbstractHandler {
  constructor() {}

  setNext(next) {
    this.next = next;
  }

  handleRequest() {}
}

class initializeServerFile extends AbstractHandler {
  constructor() {
    super();
  }

  setNext(next) {
    super.setNext(next);
  }

  handleRequest(request) {
    if (request.type === "initialize-server-file") {
      ipcRenderer.send("initialize-server-file", request.param);
    } else {
      this.next.handleRequest(request);
    }
  }
}

class zipApplication extends AbstractHandler {
  constructor() {
    super();
  }

  setNext(next) {
    super.setNext(next);
  }

  handleRequest(request) {
    if (request.type === "zip-application") {
      ipcRenderer.send("zip-application", request.param);
    } else {
      this.next.handleRequest(request);
    }
  }
}

export const handler = {
  initializeServerFile: new initializeServerFile(),
  zipApplication: new zipApplication()
};
