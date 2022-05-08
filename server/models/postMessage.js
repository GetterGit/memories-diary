import mongoose from "mongoose";

// creating a schema for posts
const postSchema = mongoose.Schema({
  title: String,
  message: String,
  // name will be the user name
  name: String,
  // creator will be the user id
  creator: String,
  // [String] - array of strings
  tags: [String],
  selectedFile: String,
  likes: {
    // type is array of strings (userIds)
    type: [String],
    default: [],
  },
  createdAt: {
    type: Date,
    default: new Date(),
  },
});

// turning the above schema into a model
const PostMessage = mongoose.model("PostMessage", postSchema);

// now we can run the CRUD commands on the PostMessage model
export default PostMessage;
