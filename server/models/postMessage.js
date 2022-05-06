import mongoose from "mongoose";

// creating a schema for posts
const postSchema = mongoose.Schema({
  title: String,
  message: String,
  creator: String,
  // [String] - array of strings
  tags: [String],
  selectedFile: String,
  likeCount: {
    type: Number,
    default: 0,
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
