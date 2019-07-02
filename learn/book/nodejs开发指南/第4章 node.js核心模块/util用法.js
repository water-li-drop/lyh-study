var util = require('util');

function Base() {
    this.name = 'lyh';
    this.age = 18;
}
Base.prototype.show = function() {
    console.log(this.name + '-----' + this.age + '-----' + this.sex);
}

function BaseChild() {
    this.sex = 'boy';
}
util.inherits(BaseChild, Base);
var baseChildObj = new BaseChild();
baseChildObj.show();