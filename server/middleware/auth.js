import jwt from "jsonwebtoken";

// next prop means "do smth and then move to the next thing"
const auth = async (req, res, next) => {
  try {
    // checking if the user is the user he claims to be using JWT
    // e.g. if the user wants to delete, create or edit anything, we are checking if his token is valid
    // the token is in the first position of the array we split
    const token = req.headers.authorization.split(" ")[1];

    // we have 2 kinds of tokens: from google Auth and our own. Below ew are deciding on which one it is
    // length < 500 => own token, length > 500 => Google Auth
    const isCustomAuth = token.length < 500;

    // creating the variable for the data we want to get from the token itself
    let decodedData;

    if (token && isCustomAuth) {
      // fetching the data from a specific token including username and id of the user
      // again, pasting the same secret we used in the controller when creating that specific token
      decodedData = jwt.verify(token, "test");

      // storing the id of the user which we have verified
      req.userId = decodedData?.id;
    } else {
      // decoding the data by passing the token only as it's Google Auth
      decodedData = jwt.decode(token);

      // using 'sub' and not 'id' because 'sub' is used by Google for identifying a unqiue Google user
      req.userId = decodedData?.sub;

      // passing the action onto the next thing (e.g. post like or post delete)
    }
    next();
  } catch (error) {
    console.log(error);
  }
};

export default auth;
