// LazyMan('Hank')
// //Hi! This is Hank!
//
// LazyMan('Hank').sleep(10).eat('dinner')
// // Hi! This is Hank!
// // 等待10秒..
// // Wake up after 10
// // Eat dinner~
//
// LazyMan('Hank').eat('dinner').eat('supper')
// // Hi This is Hank!
// // Eat dinner~
// // Eat supper~
//
// LazyMan('Hank').sleepFirst(5).eat('supper')
// // 等待5秒
// // Wake up after 5
// // Hi This is Hank!
// // Eat supper

function LazyMan(name) {
    return new LazyManClass(name);
}

class LazyManClass {
    constructor(name) {
        this.timeout = 0;
        this.name = name;
        this.promise = new Promise((resolve, reject) => {
            this.resolveFn = () => {
                resolve();
                console.log('hi ' + name);
            };
            this.timer = setTimeout(this.resolveFn, this.timeout * 1000);
        });
    }


    eat(food) {
        this.promise = this.promise.then(() => {
            console.log('eat ' + food);
        });
        return this;
    }

    sleep(seconds) {
        console.log(`等待${seconds}秒`);

        this.promise = this.promise.then(() => {
            return new Promise((resolve, reject) => {
                setTimeout(() => {
                    console.log(`wake up after ${seconds}`);
                    resolve()
                }, seconds * 1000)
            });
        });
        return this;
    }

    sleepFirst(seconds) {
        console.log(`等待${seconds}秒`);
        clearTimeout(this.timer);
        this.timer = setTimeout(this.resolveFn, seconds * 1000);
        return this;
    }

}

// LazyMan('hank1');
// LazyMan('Hank2').eat('dinner').eat('supper')
// LazyMan('Hank3').sleep(10).eat('dinner')
LazyMan('Hank').sleepFirst(3).eat('supper').sleep(1).eat('dinner')

// class RealLazyMan {
//     constructor
// }
