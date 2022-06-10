# Redux Essentials Tutorial Example

리덕스 공식 문서의 예제 프로젝트 실습하기

"Redux Essentials" tutorial in the Redux docs ( https://redux.js.org/tutorials/essentials/part-1-overview-concepts ).

# Redux 핵심 part3 : Basic Redux Data Flow

### Redux data flow cycle

- post 리스트는 store의 posts 의 초기값을 useSelector로 가져와서 UI를 초기화한다.
- 새로운 포스트를 등록하면 새 포스트의 데이터를 담은 action인 postAdded를 디스패치 한다.
- posts reducer는 postAdded 액션을 감지하고, posts배열(state)를 업데이트 한다.
- 리덕스 store는 UI에게 state가 변경 되었다고 알린다.
- post 리스트는 업데이트된 posts 배열을 읽고 리렌더링 한다.

## 정리

### 리덕스 state는 reducer 함수들로 업데이트 된다.

- Reducer는 항상 새로운 state를 immutalbly 하게 계산한다.
  - 기존의 state 값들을 복제하고 복제본을 수정하여서 새 state를 생성
- Redux Toolkit의 `createSlice` 함수는 slice reducer를 만든다.
  - slice reducer는 mutating 한 코드를 작성하면 알아서 안전하게 immutable한 업데이트로 바꿔준다.
- Slice Reducer 함수들은 `configureStore`의 reducer필드에 작성되어야 하고 ,name 필드에 작성된 이름은 리덕스 Store에서 사용할 이름을 작성한다.

### 리액트 컴포넌트는`useSelector`훅을 사용하여 store로부터 데이터를 읽는다.

- Selector 함수는 전체 state객체를 인자로 받고, 값을 리턴한다.
- Selector는 리덕스 store가 업데이트 될 때 마다 다시 실행 되어서 변경된 데이터 값을 리턴한다.

### 리액트 컴포넌트는 store의 값을 업데이트 하기 위해서 `useDispatch` 훅을 사용해서 action을 dispatch한다.

- `createSlice` 는 slice에 등록한 reducer마다 각각 action creator 함수를 만들어준다.
- action을 dispatch하기 위해서 `dispatch(someActionCreator())` 를 호출한다.
- Reducer가 실행 되면 해당 action을 처리 해야 하는지 체크하고, 처리해야 한다면 새로운 state를 반환한다.
- form 의 input value같은 임시적인 데이터는 컴포넌트 자체 state에서 보관한다.
  - 유저의 form 입력이 다 끝나고 해당 데이터를 store에 저장해야 할 때 action을 디스패치 해서 store에 업데이트 한다.

# Redux 핵심 part4 : Using Redux Data

## 정리

### 리액트 컴포넌트는 Redux store에서 데이터를 필요한 만큼 사용 가능하다.

- 어떠한 컴포넌트도 store의 데이터를 읽을 수 있음.
- 어떠한 컴포넌트도 action을 디스패치 해서 state를 업데이트 할 수 있다.
- 컴포넌트는 props,state, Redux store 값들을 결합해서 ui를 렌더링 하는데 사용할 수있다.
- 컴포넌트들은 렌더링 할 때 정말 필요한 만큼만 데이터를 추출해야 한다.

### Redux action creator는 action을 prepare 할 수 있다.

- `createSlice` 와 `createAction` 은 action payload를 리턴하는 "prepare callback"을 가질 수 있다.
- unique 한 id나 다른 랜덤 값들은 action에 저장되어야 한다( reducer에서 계산 X)

```jsx
//src/features/posts/AddPostForm.jsx
const onSavePostClicked = () => {
  if (title && content) {
    dispatch(postAdded(title, content, userId)) // action의 payload 전달
    setTitle('')
    setContent('')
  }
}
```

```jsx
// src/features/posts/postsSlice.js

const postsSlice = createSlice({
  name: 'posts',
  initialState,
  reducers: {
    postAdded: {
      reducer(state, action) {
        state.push(action.payload)
      },
      prepare(title, content, userId) { // 디스패치 할 때 action으로 넘겨주는 인자를 prepare에서 받을 수 있다. 유니크 id, 랜덤 값 등 계산은 리듀서에서 하지 말고 여기서 한다.
        return {
          payload: {
            id: nanoid(),
            date: new Date().toISOString(),
            title,
            content,
            user: userId,
          },
        }
      },
    },

    //...
```

### Reducer는 state update logic을 포함한다.

- 다음 state를 계산하기 위한 어떠한 로직이라면 Reducer에 포함 가능하다.
- action객체는 어떤 일이 일어났는지 잘 설명되는 이름으로 작성해야 한다.

# Redux 핵심 part5 : Async Logic 과 Data Fetching

### 재사용 가능한 Selector 작성이 가능하다

- Selector는 Redux `state` 를 인자로 받고 데이터를 리턴하는 함수

### 리덕스는 async 로직 처리를 위해서 미들웨어 플러그인을 사용한다.

- 리덕스에서 사용하는 표준 async 미들웨어는 `redux-thunk`이고 Redux Toolkit에 내장되어있다.
- Thunk 는 `dispatch` 와 `getState`를 인자로 받는 함수이고 async로직 처리할 때 이것들을 사용 가능하다.

### API call의 로딩 상태를 추가적인 action으로 디스패치 가능하다.

- 전형적인 패턴은 api call을 부르기 전을 "pending", 그리고 성공 유무에 따라 데이터를 가진 "success" 혹은 에러 정보를 가진 "faliure" 를 리턴하는 것이다.
- 로딩 상태는 대게 열거형(enum)으로 저장 된다 (idle | loading | succeeded | failed 와 같이)

### 리덕스 Toolkit은 액션을 디스패치 하는 `createAsyncThunk` 라는 함수를 갖고 있다.

- `createAsyncThunk` 는 프로미스를 리턴하는 "payload creator" 를 받아서 `pending/fulfilled/reject` 액션을 자동으로 만들어준다.
- `fetchPosts` 와 같이 생성된 action creator는 내가 리턴하는 프로미스에 기반해 액션을 디스패치 한다.

- `createSlice` 안의 `extraReducers` 필드에서 프로미스에서 생성된 action 을 듣고 state를 업데이트 할 수 있다.
- Action creator는 `extra Reducer`의 키로 자동적으로 사용된다.
- Thunk 는 프로미스를 리턴할 수도 있다. `createAsyncThunk`는 request의 성공 혹은 실패를 컴포넌트 레벨에서 다루기 위해 `await dispatch(someThunk()).unwrap()` 를 사용할 수 있다.
-
