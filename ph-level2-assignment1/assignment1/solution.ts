const formatValue = (input: string | number | boolean): string | number | boolean => {
    if (typeof input === "string") {
        return input.toUpperCase();
    } else if (typeof input === "number") {
        return input * 10;
    } else {
        return !input;
    }
}



const getLength = (input: string | unknown[]): number => {
    if (typeof input === "string") {
        return input.length;
    }

    if (Array.isArray(input)) {
        return input.length;
    }

    throw new Error("Invalid type");
}



class Person {
    name: string;
    age: number;

    constructor(name: string, age: number) {
        this.name = name;
        this.age = age;
    }

    getDetails() {
        return `'Name: ${this.name}, Age: ${this.age}'`;
    }
}


type Item = {
    title: string;
    rating: number;
}
const filterByRating = (items: Item[]): Item[] => {
    const result: Item[] = [];

    for (let i = 0; i < items.length; i++) {
        const currentBook = items[i];

        if (currentBook.rating >= 4) {
            result[result.length] = currentBook;
        }
    }

    return result;
}


type User = {
    id: number;
    name: string;
    email: string;
    isActive: boolean;
}

const filterActiveUsers = (users: User[]): User[] => {
    const result: User[] = [];

    for (let i = 0; i < users.length; i++) {
        const currentUser = users[i];

        if (typeof currentUser.isActive === "boolean" && currentUser.isActive === true) {
            result[result.length] = currentUser;
        }
    }

    return result;
}


interface Book {
    title: string;
    author: string;
    publishedYear: number;
    isAvailable: boolean;
}
const printBookDetails = (book: Book): void => {
    const availableBook = book.isAvailable ? "Yes" : "No";

    console.log(`Title: ${book.title}, Author: ${book.author}, Published: ${book.publishedYear}, Available: ${book.isAvailable}`);
}


const getUniqueValues = <T extends string | number>(array1: T[], array2: T[]): T[] => {
    const result: T[] = [];

    // combine arrays manually
    const combined: T[] = [];
    for (let i = 0; i < array1.length; i++) {
        combined[combined.length] = array1[i];
    }
    for (let i = 0; i < array2.length; i++) {
        combined[combined.length] = array2[i];
    }

    // Loop through combined array and add unique elements
    for (let i = 0; i < combined.length; i++) {
        let exists = false;
        for (let j = 0; j < result.length; j++) {
            if (result[j] === combined[i]) exists = true;
        }
        if (!exists) {
            result[result.length] = combined[i];
        }
    }
    return result;
}


interface Product {
    name: string;
    price: number;
    quantity: number;
    discount?: number;
}

const calculateTotalPrice = (products: Product[]): number => {
    return products.reduce((sum, product) => {
        const productPrice = product.price * product.quantity;
        const discountPrice = product.discount ? productPrice * (1 - product.discount / 100) : productPrice;

        return sum + discountPrice;
    }, 0);
};