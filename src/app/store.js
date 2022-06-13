import { configureStore } from '@reduxjs/toolkit'
import postsReducer from '../features/posts/postsSlice'
import userReducer from '../features/users/userSlice'
import notificationsReducer from '../features/notifications/notificationsSlice'

export default configureStore({
  reducer: {
    posts: postsReducer,
    users: userReducer,
    notifications: notificationsReducer,
  },
})
