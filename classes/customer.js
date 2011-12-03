exports.Customer = function () {
    this.color = '#ff0000';
};
exports.Customer.prototype = {
    isTasty: function () { return true }
};