//Objects
var customer = {
    firstName: "John",
    lastName: "Smith",
    cars: ["Volvo", "Toyota", "Tesla"]
}
console.log(customer.firstName);
console.log(customer['lastName']);
//dot notation
customer.firstName = "Mike";
//bracket notation
customer['lastName'] = "Tyson";
console.log(`${customer.firstName} ${customer.lastName}`);

//Arrays, 
var cars = ["Volvo", "Toyota", "Tesla"];
console.log(cars[1]);
cars[1] = "BMW";
console.log(cars[1]);
console.log(customer.cars[1]);
