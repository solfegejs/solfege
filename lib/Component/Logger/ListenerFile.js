

var ListenerFile = (function () {
    function ListenerFile(filePath) {
        this.filePath = filePath;
    }
    ListenerFile.prototype.getFilePath = function () {
        return this.filePath;
    };
    return ListenerFile;
})();


module.exports = ListenerFile;

