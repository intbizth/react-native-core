const abc = 'abc';

export const z = 1;

export function tester() {
    return false;
}

let eiei = function(name, age) {
    this.name = name;
    this.age = age;
    this.about = function() {
        console.log(this.name +' is '+ this.age +' years old');
    };
};
