# react-nodebird

## 0526

_app.js 는 완전 공통에서 사용할것들

Layout은 컴포넌트끼리 공통으로 사용할것들

웹 head를 변경하려면 next/head 사용

반응형을 만들때 모바일 => 태블릿 => 데스크탑 순서로 만드는게 편함

xs: 모바일, sm: 태블릿, md: 작은 데스크탑

## 0527

컴포넌트안에 props로 넘겨주는 함수는 useCallback을 써주면 최적화에 도움이 된다 useCallback(()=>{},[])

함수를 캐싱하는것이 useCallback, 값을 캐싱하는게 useMemo

style에는 {{}} 객체형을 쓰면 안된다 => 객체끼리 비교하면 false이기 때문에, 리액트는 버추얼돔으로 검사를 하면서 어디가 달라졌는지 찾다가 다른객체로 인식하기 때문에 리랜더링함 (실제론 바뀐게 없음)

리랜더링될때 함수형을 다시 실행하는것은 맞지만 useCallback은 캐싱이라 이전것과 지금이 바뀌지 않으면 ([] <= 배열부분) 같은 걸로 판단함

## 0530

redux적용시 next에서는 _app 에 provider를 생략한다 => 알아서 감싸줌

next 개발 모드일때는 메모리정리를 안함 액션히스토리를 다 갖고있고 배포모드일때느 히스토리를 중간 중간 버림

reducer add같은거 만들때 [obj, ...state.~~~] 를 해야 가장 앞에 추가가 됨

styled Global을 사용하여 전역 스타일을 변경할 수 있음

## 0530

제네레이터 중단점이 있는 함수 function* , yield

all : 한번에 다 실행

fork : 함수를 실행

call fork 차이점 : fork 비동기 호출 ,call 동기 호출

put : 디스패치와 비슷

yield : await 과 비슷

take : 일회성 실행 이벤트 리스너 같은거 실행하고 없어짐 while(true) 와 조합하여 씀 ,while take 는 동기적으로 동작하지만 takeEvery 는 비동기로 동작한다

takeEvery : take 의 일회성을 보완

takeLatest : 가장 마지막것을 실행함 응답은 취소할 수 있지만 응답은 취소할 수 없다

dispatch 실행시 해당 saga와 reducer가 거의 동시 실행된다. 그 후 차례대로 실행