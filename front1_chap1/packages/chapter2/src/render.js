export function jsx(type, props, ...children) {
  return { type: type, props: { ...props }, children: [...children] };
}

export function createElement(node) {
  const { type, props, children } = node;

  const element = document.createElement(type);

  // props 처리
  if (props) {
    Object.entries(props).forEach(([key, value]) => {
      element.setAttribute(key, value);
    });
  }

  // children 처리
  if (children) {
    children.forEach((child) => {
      if (typeof child === "string") {
        element.append(child);
      } else {
        element.appendChild(createElement(child)); // 자식 요소 추가
      }
    });
  }

  return element;
}

function updateAttributes(target, newProps, oldProps) {
  console.log(target, "target");
  console.log(newProps, "newProps");
  console.log(oldProps, "old props");

  if (!target) {
    return;
  }

  console.log(target.id, target.class, "외부에서 target.class확인");
  // newProps들을 반복하여 각 속성과 값을 확인
  //   만약 oldProps에 같은 속성이 있고 값이 동일하다면
  //     다음 속성으로 넘어감 (변경 불필요)
  //   만약 위 조건에 해당하지 않는다면 (속성값이 다르거나 구속성에 없음)
  //     target에 해당 속성을 새 값으로 설정
  for (let [key, value] of Object.entries(newProps)) {
    if (key in oldProps && value === oldProps[key]) {
      continue;
    } else {
      target.setAttribute(key, value);
    }
  }

  // oldProps을 반복하여 각 속성 확인
  //   만약 newProps들에 해당 속성이 존재한다면
  //     다음 속성으로 넘어감 (속성 유지 필요)
  //   만약 newProps들에 해당 속성이 존재하지 않는다면
  //     target에서 해당 속성을 제거
  for (let [key, value] of Object.entries(oldProps)) {
    if (key in newProps) {
      continue;
    } else {
      target.removeAttribute(key);
    }
  }
}

export function render(parent, newNode, oldNode, index = 0) {
  // 1. 만약 newNode가 없고 oldNode만 있다면
  //   parent에서 oldNode를 제거
  //   종료
  console.log(oldNode, "renderd에서 oldNode 확인");
  if (!newNode && oldNode) {
    parent.removeChild(oldNode);
    return;
  }
  // 2. 만약 newNode가 있고 oldNode가 없다면
  //   newNode를 생성하여 parent에 추가
  //   종료
  if (newNode && !oldNode) {
    const appendNode = createElement(newNode);
    parent.appendChild(appendNode);
    return;
  }
  // 3. 만약 newNode와 oldNode 둘 다 문자열이고 서로 다르다면
  //   oldNode를 newNode로 교체
  //   종료
  if (typeof newNode === "string" && typeof oldNode === "string") {
    if (oldNode !== newNode) {
      oldNode = newNode;
      return;
    }
    // parent.innerHTML = "";
    // console.log(newNode, "3번 문제 확인");
    // const appendNode = createElement(newNode);
    // parent.appendChild(appendNode);
  }
  // 4. 만약 newNode와 oldNode의 타입이 다르다면
  //   oldNode를 newNode로 교체
  //   종료
  if (typeof oldNode !== typeof newNode) {
    oldNode = newNode;
    return;
  }
  // 5. newNode와 oldNode에 대해 updateAttributes 실행
  updateAttributes(parent.children[index], newNode.props, oldNode.props);

  // 6. newNode와 oldNode 자식노드들 중 더 긴 길이를 가진 것을 기준으로 반복
  //   각 자식노드에 대해 재귀적으로 render 함수 호출

  let newChildLength =
    typeof newNode !== "string" ? newNode.children.length : -1;
  let oldChildLength =
    typeof oldNode !== "string" ? oldNode.children.length : -1;
  const maxDepth = Math.max(newChildLength, oldChildLength);
  for (let i = maxDepth - 1; i >= 0; i--) {
    render(
      parent.children[index],
      newNode.children[i],
      oldNode.children[i],
      index + 1
    );
  }
}
