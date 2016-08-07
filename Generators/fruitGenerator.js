function* fruitGenerator() {
    yield 'apple';
    yield 'orange';
    return 'watermelon';
}

var newFruitGenerator = fruitGenerator();
console.log(newFruitGenerator.next());    //[1]
console.log(newFruitGenerator.next());    //[2]
console.log(newFruitGenerator.next());    //[3]