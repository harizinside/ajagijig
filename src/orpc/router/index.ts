import { addTodo, listTodos } from "./todos"
import { signUp } from "./auth"

export default {
  listTodos,
  addTodo,
  auth: {
    signUp,
  },
}
