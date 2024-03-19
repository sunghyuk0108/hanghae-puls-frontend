console.log("promise1");

let isMove = false;
let companyRoll = [
  { isMove: false },
  { isMove: false },
  { isMove: false },
  { isMove: false },
];
let timeOutList = [];
const startBt = document.querySelector(".start-bt");

function job1() {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      // new Promise로 promise를 생성하면 어떤 코드를 실행하고 마지막에 resolve(); 입력해야함.
      // 2초 뒤 작업할 코드...
      isMove = true;
      resolve("job1 성공적으로 마침");
    }, 2000);
  });
}

function job2() {
  const testArray = [500, 1000, 1500, 2000];

  return new Promise((resolve, reject) => {
    if (!isMove) {
      reject("첫번째 움지여야될 company 롤의 상태가 변경되지 않았습니다.");
      return;
    }

    // Promise.all로 전달할 promises 배열을 생성
    const promises = testArray.map((time, index) => {
      return new Promise((innerResolve) => {
        const timer = setTimeout(() => {
          // new Promise로 promise를 생성하면 어떤 코드를 실행하고 마지막에 resolve(); 입력해야함.
          // 2초 뒤 작업할 코드...
          companyRoll[index] = { ...companyRoll[index], isMove: true };
          console.log("시간 별 실행할 코드를 주입");
          innerResolve(
            `job2 작업이 완료되기까지 소요된 시간은 ${time} 이며 ${
              index + 1
            } 번째 타이머가 완료되었습니다.`
          );
        }, time);
        timeOutList.push(timer);
      });
    });

    console.log(promises, "promises 배열 확인");

    // Promise.all() 내부에 배열을 아규먼트로 넣어야함.
    // promise.all은 모든 작업이 완료되고 그 다음 후속 작업을 처리할 때 쓴다고 생각하면됨.
    Promise.all(promises).then((result) => {
      console.log("promiseAll: ", result);
      resolve("job2 성공적으로 마침");
    });

    // race는 같은 작업하는 Promise를 모아서 가장 빨리 끝나는 값 받아서 그 다음 후속 작업을 처리할 때 쓴다고 생각하면됨.
    // result는 promises에서 제일 빨리 작업이 완료된 innerRsolve의 값을 전달 받게됨.
    // Promise.race(promises).then((result) => {
    //   console.log("promiseRace: ", result);
    //   resolve("job2 성공적으로 마침");
    // });
  });
}
// then내부 then을 사용하는 네이스팅 방식
// job1().then((data) => {
//   console.log("data", data);
//   job2().then((data) => {
//     console.log("data", data);
//   });
// });

// 체이닝 방식을 더 선호함
function allStart() {
  job1()
    .then((data) => {
      console.log("data1", data);
      // job2();를 리턴함 결과적으로 promise를 리턴하고 아래 .then문에서 처리함.
      return job2();
    })
    .then((data) => {
      console.log("data2", data);
      timeOutList.forEach((timeOut) => {
        console.log("메모리 누수 방지 클리어", timeOut);
        clearTimeout(timeOut);
      });
    })
    .then(() => {
      // refresh
      timeOutList = [];
      console.log(timeOutList);
      console.log(companyRoll, "company roll 확인");
    })
    //   reject을 반환하는 코드를 캐치로 잡음
    .catch((e) => {
      console.log("error : ", e);
    });
}

startBt.addEventListener("click", allStart);
// allStart();
