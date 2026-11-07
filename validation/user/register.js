import * as z from "zod";
import { usernameField, passwordField, fullnameField } from "./fields.js";

const schema = z.object({
  username: usernameField,
  password: passwordField,
  fullname: fullnameField,
});

export default schema;
