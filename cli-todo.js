import chalk from "chalk";
import Table from "cli-table3";
import fs from "fs";
import { Command } from "commander";
const program = new Command();

function readTodo() {
  const data = fs.readFileSync("todos.json", "utf-8");
  // parse -> string to array of objects
  let json_data = JSON.parse(data);
  return json_data;
}

function writeTodo(todos) {
  // stringify -> array of objects to string
  fs.writeFileSync("todos.json", JSON.stringify(todos, null, 2), "utf-8");
}

function displayTodos() {
  const todos = readTodo();
  if (todos.length === 0) {
    console.log(chalk.yellow("No todos found. Add some tasks!"));
    return;
  }
  const table = new Table({
    head: [
      chalk.bold.cyan("NO."),
      chalk.bold.cyan("TASK"),
      chalk.bold.cyan("STATUS"),
    ],
    colWidths: [5, 50, 15],
  });
  todos.forEach(function (todo, index) {
    const status = todo.done;
    if (status) {
      table.push([
        chalk.blue(index + 1),
        todo.task,
        chalk.green.bold("✓ Completed"),
      ]);
    } else {
      table.push([
        chalk.blue(index + 1),
        todo.task,
        chalk.yellow.bold("⧖ Pending"),
      ]);
    }
  });
  console.log(table.toString());
  console.log(chalk.dim(`Total tasks: ${todos.length}`));
}

function addTodo(todo) {
  const todos = readTodo();
  const todo_obj = {
    task: todo,
    done: false,
  };
  todos.push(todo_obj);
  writeTodo(todos);
}

function updateTodo(index) {
  const todos = readTodo();
  if (index >= 0 && index < todos.length) {
    todos[index].done = !todos[index].done;
    writeTodo(todos);
    let status = "";
    if (todos[index].done) status = "✓ Completed";
    else status = "⧖ Pending";
    let str = chalk.red.bold(`Updated Todo #${index + 1} status to: `);
    let str2 = chalk.cyan.underline(status);
    console.log(`${str}${str2}`);
  } else console.log(chalk.red("Invalid input."));
}

function editTodo(index, todo) {
  const todos = readTodo();
  if (index >= 0 && index < todos.length) {
    todos[index].task = todo;
    writeTodo(todos);
    let str = chalk.red.bold(`Edited Todo #${index + 1} to: `);
    let str2 = chalk.cyan.underline(todo);
    console.log(`${str}${str2}`);
  } else console.log(chalk.red("Invalid input."));
}

function deleteTodo(index) {
  const todos = readTodo();
  if (index >= 0 && index < todos.length) {
    const [deleted_obj] = todos.splice(index, 1);
    writeTodo(todos);
    let str = chalk.red.bold("Removed Todo: ");
    let str2 = chalk.cyan.underline(deleted_obj.task);
    console.log(`${str}${str2}`);
  } else console.log(chalk.red("Invalid input."));
}

program
  .name("todo")
  .description("CLI to show, add, update, edit and delete todos")
  .version("0.0.1");

program
  .command("show")
  .description("Display all the todos")
  .action(displayTodos);

program
  .command("add")
  .description("Add a todo")
  .argument("<todo>", "New todo (string)")
  .action((todo) => addTodo(todo));

program
  .command("update")
  .description("Update the status of a todo")
  .argument("<todo_num>", "Todo number")
  .action((todo_num) => updateTodo(parseInt(todo_num) - 1));

program
  .command("edit")
  .description("Edit a todo")
  .argument("<todo_num>", "Todo number")
  .argument("<new_todo>", "New todo (string)")
  .action((todo_num, new_todo) => editTodo(parseInt(todo_num) - 1, new_todo));

program
  .command("delete")
  .description("Delete a todo")
  .argument("<todo_num>", "Todo number")
  .action((todo_num) => deleteTodo(parseInt(todo_num) - 1));

program.parse();
