import React from 'react'
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from 'react-router-dom'

import { Navbar } from './app/Navbar'
import { AddPostForm } from './features/posts/AddPostForm'
import EditPostForm from './features/posts/EditPostForm'
import PostList from './features/posts/PostList'
import SinglePostPage from './features/posts/SinglePostPage'
import UserList from './features/users/UserList'
import UserPage from './features/users/UserPage'
import NotificationsList from './features/notifications/NotificationsList'
function App() {
  return (
    <Router>
      <Navbar />

      <div className="App">
        <Switch>
          <Route
            exact
            path="/"
            render={() => (
              <React.Fragment>
                <AddPostForm />
                <PostList />
              </React.Fragment>
            )}
          />
          <Route exact path="/posts/:postId" component={SinglePostPage} />
          <Route exact path="/editPost/:postId" component={EditPostForm} />
          <Route exact path="/users" component={UserList} />
          <Route exact path="/users/:userId" component={UserPage} />
          <Route exact path="/notification" component={NotificationsList} />
          <Redirect to="/" />
        </Switch>
      </div>
    </Router>
  )
}

export default App
