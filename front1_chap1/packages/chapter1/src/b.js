/**
 * ## 문제 B
 *
 * <준비>
 * 1. npm run dev 로 개발서버를 실행합니다.
 * 2. http://localhost:8000/chapters/chapter1/b.html 로 접속하면 UI를 확인할 수 있어요.
 * 3. 버튼을 클릭 했을 때, 로딩이 멈추는 것을 볼 수 있습니다.
 *
 * <목표>
 * "b.js"의 [HardWork] 클래스의 do() 메서드를 개선하여
 * 버튼을 클릭 했을 때, 로딩이 멈추지 않도록 합니다.
 * 그리고 순차적으로 연산되는 결과가 지속적으로 화면에 노출됩니다.
 *
 * <조건>
 * 1. 정의된 메서드 중 do() 메서드만 수정가능 합니다. (추가적인 메서드를 정의하는 것도 가능)
 * 2. async/await 문법을 사용할 수 없습니다.
 * 3. task가 순차적으로 실행되어야 합니다. (반드시 이전 task가 완료되고 다음 task가 실행)
 *
 * <제출물>
 * 1. 코드를 확인할 수 있는 링크 또는 코드 캡쳐 이미지
 */

// 마이크로 task -> 애니메이션 프레임(Macro Task Queue에 속하지만 매크로 테스크와 다르게 브라우저 화면 갱신까지 대기함) -> 매크로 task

/**
 * @description
 * 고비용 연산을 하는 모듈입니다.
 * 삼만개의 _task를 순차적으로 연산합니다.
 */
class HardWork {
  constructor() {
    this._result = 0;
    this._tasks = this._initTasks();
  }

  do() {
    // console.log("do 확인");
    // for (let i = 0; i < this._tasks.length; i++) {
    //   setTimeout(() => {
    //     this._tasks[i]();
    //   }, 0);
    // }
    this._executeTasksSequentially(0);
  }

  // 해당 함수는 index = this._tasks.length가 같을 때 해당 함수가 종료되고 ui표시된 업무량과 task를 비우게됨
  // 결과적으로 this._tasks.length의 길이만큼 _tasks()를 실행하는 코드가됨.
  _executeTasksSequentially(index) {
    if (index >= this._tasks.length) {
      console.log(index, this._tasks.length, "result 확인");
      this.refresh();
      return;
    }

    setTimeout(() => {
      this._tasks[index]();
      this._executeTasksSequentially(index + 1);
    }, 0);
  }

  refresh() {
    this._result = 0;
    this._tasks = this._initTasks();
  }

  // do() 이외의 메서드는 수정하지마세요
  get result() {
    return this._result;
  }

  _initTasks() {
    const count = 3000;
    const tasks = new Array(count);

    for (let i = 0; i < count; i++) {
      tasks[i] = this._createTask(Math.floor(Math.random() * 3) + 1);
    }

    return tasks;
  }

  _createTask = (n) => () => {
    for (let i = 0; i < 1000; i++) {
      const randnum = Math.random();
      const alpha = Math.floor(randnum * 10) % n;

      if (alpha > 0) {
        this._result += alpha;
      }
    }

    this._sendLog();
  };

  //sendLog라는 비동기 함수는 1. Bolb을 생성하고 blob.text를 비동기로 읽어서 읽어드린 text를 JSON.parse를 적용하는 함수.
  // Bolb()은 생성자에 전달된 배열의 모든 데이터 연결을 포함하는 새로 생성된 객체를 반환함.
  async _sendLog() {
    const blob = new Blob(
      [
        JSON.stringify(
          {
            value: this._result.toFixed(2),
          },
          null,
          2
        ),
      ],
      {
        type: "application/json",
      }
    );

    const res = await blob.text();

    JSON.parse(res);
  }
  //- do() 이외의 메서드는 수정하지마세요
}

// 수정하지마세요
/**
 * @description
 * 로딩 애니메이션을 무한루프로 돌아가도록 합니다.
 */
class Dashboard {
  constructor(work) {
    this._indicatorElement = document.getElementById("indicator");
    this._descriptionElement = document.getElementById("desc");
    this._startTimestamp = 0;
    this._work = work;
  }

  start() {
    this._startTimestamp = Date.now();
    requestAnimationFrame(this._render);
  }

  _render = () => {
    const timestamp = Date.now();
    const percent = (((timestamp - this._startTimestamp) * 5) % 10000) / 100;

    this._indicatorElement.style.setProperty("width", `${percent}%`);
    this._descriptionElement.innerHTML = `업무량: ${this._work.result}`;

    requestAnimationFrame(this._render);
  };
}

async function main() {
  // hardWork을 상속한 변수 선언3
  const hardWork = new HardWork();
  const dashboard = new Dashboard(hardWork);

  dashboard.start();
  document.getElementById("btn").addEventListener("click", () => {
    hardWork.do();
  });
}

main();
//- 수정하지마세요
