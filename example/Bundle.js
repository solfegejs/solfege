module.exports = class Bundle {
  getPath() {
    return __dirname;
  }

  initialize(app) {
    app.on("start", this.onStart);
  }

  onStart(app, parameters = []) {
    console.log("started");
  }
};
