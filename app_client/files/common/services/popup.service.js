angular.module('pm').service('popup', popup);

function popup() {
    var confirm = function (title, text, okText, callback) {
        return confirm(text);
    };
    
    return {
        confirm: confirm
    };

}