import * as z from "zod";
import { usernameField, passwordField } from "./fields.js";

const schema = z.object({
  username: usernameField,
  password: passwordField,
});

export default schema;
