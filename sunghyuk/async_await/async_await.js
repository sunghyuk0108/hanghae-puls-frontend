function timer(time) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(time);
    }, time);
  });
}

async function run() {
  // console.log(timer(), "타이머 함수를 console로 확인해 보면 Promise를 반환함.");
  console.log("start");
  let time = await timer(1000);
  console.log("time: " + time);
  time = await timer(time + 1000);
  console.log("time: " + time);
  time = await timer(time + 1000);
  console.log("time: " + time);
  console.log("end");

  // time을 리턴하면 해당 함수가 호출될 때 time값을 리턴함.
  return time;
}

async function run2() {
  // console.log(run(), "run도 마찬가지로 Promise를 반환함.");
  console.log("parent start");
  // run에서 time을 리턴받음.
  const time = await run();
  console.log("return time:", time);
  console.log("parent end");
}

console.log("parent parent start");
run2().then(() => {
  console.log("parent parent end");
});
