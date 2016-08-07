function* twoWayGenerator() {
    var what = yield null;
    console.log('hello ' + what);
}
var twoWay = twoWayGenerator();
twoWay.next();
twoWay.next('world');