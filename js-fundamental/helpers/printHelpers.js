export function printAge(age){
    console.log(age);
}

//Class & Methods
class CustomerDetails {
    printFirstName(firstName){
        console.log(firstName);
    }
    
    /**
     * This method will print lastname
     * @param {string} lastName
     */
    printLastName(lastName){
        console.log(lastName);
    }
}

export const customerDetails = new CustomerDetails();

