import { createSlice, nanoid, createAsyncThunk } from '@reduxjs/toolkit'
import { client } from '../../api/client'

/**
 *
 * {
 *  status: 'idle' | 'loading' | 'succeeded' | 'failed',
 *  error: string | null
 * }
 *
 */

const initialState = {
  posts: [],
  status: 'idle', // 임의로 기입한 상태 이름
  error: null,
}

export const fetchPosts = createAsyncThunk('posts/fetchPosts', async () => {
  const response = await client.get('/fakeApi/posts')
  return response.data
})

export const addNewPost = createAsyncThunk(
  'posts/addNewPost',
  async (initalPost) => {
    const response = await client.post('/fakeApi/posts', initalPost)
    return response.data
  }
)

const postsSlice = createSlice({
  name: 'posts',
  initialState,
  reducers: {
    // postAdded: {
    //   reducer(state, action) {
    //     state.posts.push(action.payload)
    //   },
    //   prepare(title, content, userId) {
    //     return {
    //       payload: {
    //         id: nanoid(),
    //         date: new Date().toISOString(),
    //         title,
    //         content,
    //         user: userId,
    //         reactions: {
    //           thumbsUp: 0,
    //           hooray: 0,
    //           heart: 0,
    //           rocket: 0,
    //           eyes: 0,
    //         },
    //       },
    //     }
    //   },
    // },
    postUpdated(state, action) {
      const { id, title, content } = action.payload
      const existingPost = state.posts.find((post) => post.id === id)
      if (existingPost) existingPost.title = title
      existingPost.content = content
    },
    reactionAdded(state, action) {
      const { postId, reaction } = action.payload
      const existingPost = state.posts.find((post) => post.id === postId)
      if (existingPost) {
        existingPost.reactions[reaction]++
      }
    },
  },
  extraReducers: {
    [fetchPosts.pending]: (state, action) => {
      state.status = 'loading'
    },
    [fetchPosts.fulfilled]: (state, action) => {
      state.status = 'succeeded'
      // Add any fetched posts to the array
      state.posts = state.posts.concat(action.payload)
    },
    [fetchPosts.rejected]: (state, action) => {
      state.status = 'failed'
      state.error = action.error.message
    },
    [addNewPost.fulfilled]: (state, action) => {
      console.log(action.payload)
      state.posts.push(action.payload)
    },
  },
})

// postAdded reducer함수를 만들면 createSlice가 자동으로 같은 이름의 action creator 함수를 만들어줌.
// 이 action creator를 export하고 UI 컴포넌트에서 Save Post버튼을 클릭 할 때 디스패치 한다.
export const { postAdded, postUpdated, reactionAdded } = postsSlice.actions

export default postsSlice.reducer

export const selectAllPosts = (state) => state.posts.posts
export const selectPostById = (state, postId) =>
  state.posts.posts.find((post) => post.id === postId)
