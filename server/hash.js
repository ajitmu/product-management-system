import bcrypt from "bcrypt";
bcrypt.hash("ajit@123", 10).then((hash) => {
  console.log(hash);
});