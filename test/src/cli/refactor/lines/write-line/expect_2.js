const abc = 'abc';
const def = 'def';
const ggg = 'ggg';

export const z = 1;

let eiei = function(name, age) {
    this.name = name;
    this.age = age;
    this.about = function() {
        console.log(this.name +' is '+ this.age +' years old');
    };
};
