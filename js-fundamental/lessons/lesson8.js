//Declarative function
helloOne(); //can be call here even before the function is declared
function helloOne(){
    console.log("Hello One!");
}
//helloOne();

//Anonymous function
var helloTwo = function(){
    console.log("Hello Two!");
}
helloTwo();

//ES6 function syntax (arrow function)
var helloThree = () => {
    console.log("Hello Three!");
}
helloThree();

//Function w arguments
function printName(name, lastName){
    console.log(`${name} ${lastName}`);
}
printName("Harry", "Potter");

//Function w return
function multiplyByTwo (number){
    var result = number * 2;
    return result;
}
var result = multiplyByTwo(4);
console.log(result);

//Import function
import {printAge} from '../helpers/printHelpers.js';
printAge(10);

//Import everything
import * as helper from '../helpers/printHelpers.js';
helper.printAge(15);