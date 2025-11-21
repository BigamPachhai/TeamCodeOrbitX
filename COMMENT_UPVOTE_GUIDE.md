# Comment & Upvote Feature - Implementation Guide

## ✅ Features Implemented

### 1. **Upvote/Like System** (Similar to Reddit/Facebook)

- ❤️ Like/Unlike toggle functionality
- Real-time upvote counter
- Visual feedback (red heart when liked, white heart when not)
- User authentication required
- Prevents duplicate upvotes from same user

### 2. **Comment System**

- Add comments with authentication
- Display all comments with user names
- Real-time comment count
- Enhanced UI with timestamps
- Press Enter to post comment
- Comment validation (no empty comments)

---

## 🎯 Backend Implementation

### Files Created/Modified:

#### 1. **`server/controllers/upvoteController.js`** (NEW)

Functions:

- `toggleUpvote()` - Like/unlike an issue
- `getUpvoteStatus()` - Get upvote count and user's status
- `getBulkUpvotes()` - Get upvotes for multiple issues

#### 2. **`server/routes/upvoteRoutes.js`** (NEW)

Routes:

- `POST /api/upvotes/toggle` - Toggle upvote (requires auth)
- `GET /api/upvotes/status/:issueId` - Get upvote status
- `POST /api/upvotes/bulk` - Get bulk upvote data

#### 3. **`server/models/Issue.js`** (UPDATED)

Added:

- Virtual field `upvoteCount` - Auto-counts upvotes
- Virtual field `comments` - Auto-populates comments
- `toJSON` and `toObject` options for virtuals

#### 4. **`server/controllers/issueController.js`** (UPDATED)

Updated:

- `getAllIssues()` - Now populates upvote count and user info
- `getIssueById()` - Populates upvotes, comments, and user details

#### 5. **`server/server.js`** (UPDATED)

Added:

- Import `upvoteRoutes`
- Route: `app.use("/api/upvotes", upvoteRoutes)`

---

## 🎨 Frontend Implementation

### Files Created/Modified:

#### 1. **`client/src/components/IssueCard.jsx`** (UPDATED)

Features:

- Upvote button with heart icon
- Real-time upvote count
- Toggle state (liked/not liked)
- Fetch upvote status on mount
- Authentication check
- Loading states

#### 2. **`client/src/components/UpvoteButton.jsx`** (NEW - Reusable)

Standalone component for upvoting (can be used anywhere)

#### 3. **`client/src/pages/IssueDetails.jsx`** (UPDATED)

Features:

- Large upvote button at top
- Enhanced comment section
- Comment count display
- Textarea instead of input (multiline support)
- Enter to post, Shift+Enter for new line
- Timestamps for comments
- Better empty state UI
- User authentication checks

#### 4. **`client/src/pages/Feed.jsx`** (NO CHANGES NEEDED)

Uses updated IssueCard component automatically

---

## 🚀 How It Works

### Upvote Flow:

1. **User clicks heart icon**
2. Frontend checks authentication
3. Sends POST request to `/api/upvotes/toggle`
4. Backend checks if user already upvoted
5. If yes: Remove upvote (unlike)
6. If no: Add upvote (like)
7. Return new count and status
8. Frontend updates UI with new state

### Comment Flow:

1. **User types comment and presses Post/Enter**
2. Frontend validates (non-empty, authenticated)
3. Sends POST request to `/api/comments/add`
4. Backend creates comment with user ID
5. Frontend refetches issue data
6. Comments list updates automatically

---

## 💡 Key Features

### Upvote System:

- ✅ One upvote per user per issue
- ✅ Toggle on/off (like/unlike)
- ✅ Real-time counter
- ✅ Visual feedback (red ❤️ vs white 🤍)
- ✅ Requires authentication
- ✅ Works on both Feed and Details pages

### Comment System:

- ✅ Requires authentication
- ✅ Displays user name
- ✅ Shows timestamp
- ✅ Real-time updates
- ✅ Comment count badge
- ✅ Enter key to post
- ✅ Empty state message
- ✅ Better UI/UX

---

## 🎨 UI/UX Improvements

### Feed Page (IssueCard):

```
┌─────────────────────────────────┐
│  [Issue Image]                  │
│                                 │
│  Category                       │
│  Description...                 │
│  Status: pending                │
├─────────────────────────────────┤
│  [❤️ 15 Liked] or [🤍 15 Like] │  ← New!
└─────────────────────────────────┘
```

### Issue Details Page:

```
┌─────────────────────────────────┐
│  [Large Issue Image]            │
│  Title & Description            │
│  Status, Location, Reporter     │
├─────────────────────────────────┤
│  [❤️ 42 You liked this]         │  ← New! Large button
├─────────────────────────────────┤
│  💬 Comments (5)                │  ← Shows count
│  ┌───────────────────────────┐ │
│  │ Write a comment...         │ │
│  │ (Press Enter to post)      │ │
│  └───────────────────────────┘ │
│  [Post]                         │
│                                 │
│  ┌───────────────────────────┐ │
│  │ John Doe        Today      │ │
│  │ Great work!                │ │
│  └───────────────────────────┘ │
└─────────────────────────────────┘
```

---

## 🔒 Authentication

Both features require user authentication:

### Upvote:

- Must be logged in
- Shows alert if not authenticated
- Redirects to login (can be added)

### Comments:

- Must be logged in
- Validation on both frontend and backend
- User info attached to comments

---

## 📊 Database Schema

### Upvote Model:

```javascript
{
  issue: ObjectId (ref: Issue),
  user: ObjectId (ref: User),
  timestamps: true
}
```

### Comment Model (existing):

```javascript
{
  issue: ObjectId (ref: Issue),
  user: ObjectId (ref: User),
  comment: String,
  timestamps: true
}
```

---

## 🧪 Testing Checklist

### Upvote Feature:

- [ ] Click heart icon when not authenticated → Shows alert
- [ ] Click heart when authenticated → Toggles to red
- [ ] Click again → Toggles to white (unlike)
- [ ] Counter updates correctly
- [ ] Upvote persists after page refresh
- [ ] Works on both Feed and Details pages

### Comment Feature:

- [ ] Try to comment without login → Shows alert
- [ ] Type comment and press Enter → Posts successfully
- [ ] Empty comment validation works
- [ ] Comments display with correct user name
- [ ] Timestamps show correctly
- [ ] Comment count updates
- [ ] Comments persist after refresh

---

## 🐛 Common Issues & Solutions

### Issue: Upvotes not showing

**Solution:** Check if user is authenticated and API endpoint is correct

### Issue: Comments not appearing

**Solution:** Make sure issue is being populated with comments virtual field

### Issue: "Cannot read property 'fullName' of undefined"

**Solution:** Ensure user is being populated in queries

### Issue: Upvote count not updating

**Solution:** Check that refetch() is called after toggling

---

## 🎯 API Endpoints Summary

### Upvotes:

- `POST /api/upvotes/toggle` - Toggle upvote
- `GET /api/upvotes/status/:issueId` - Get status
- `POST /api/upvotes/bulk` - Bulk fetch

### Comments:

- `POST /api/comments/add` - Add comment
- `GET /api/comments/:issueId` - Get comments

### Issues:

- `GET /api/issues/all` - Get all (with upvotes)
- `GET /api/issues/:id` - Get one (with upvotes & comments)

---

## ✨ Future Enhancements

Possible additions:

- Reply to comments (nested comments)
- Edit/delete own comments
- Downvote option
- Sort comments by date/popularity
- Emoji reactions (👍 👎 😂 😢 😡)
- Mention users with @username
- Real-time updates with WebSocket
- Notification when someone comments/upvotes

---

## 🎉 Summary

The comment and upvote features are now fully functional! Users can:

1. ❤️ **Like/Unlike issues** just like Facebook/Reddit
2. 💬 **Comment on issues** with full authentication
3. 👀 **See real-time counts** for both features
4. 🔐 **Authentication required** for both actions
5. 🎨 **Beautiful UI** with visual feedback

Both features work seamlessly together and provide a social media-like experience for reporting and discussing civic issues! 🚀
