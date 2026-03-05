import { addTodo, listTodos } from "./todos"
import { signUp, signIn } from "./auth"

export default {
  listTodos,
  addTodo,
  auth: {
    signUp,
    signIn,
  },
}
