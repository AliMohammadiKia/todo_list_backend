require("dotenv").config();

const { createTestClient } = require("apollo-server-testing");
const { ApolloServer } = require("apollo-server");
const { generateToken } = require("../auth/auth");
const { v4: uuidv4 } = require("uuid");

const driver = require("../db/connection");
const typeDefs = require("../graphql/schema");
const resolvers = require("../graphql/resolvers");

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: () => {
    const user = { id: uuidv4() };
    const token = generateToken(user);
    return { user, token };
  },
});

const { query, mutate } = createTestClient(server);

describe("Todo App", () => {
  beforeAll(async () => {
    const session = driver.session();
    await session.run("MATCH (n) DETACH DELETE n");
    await session.close();
  });

  afterAll(async () => {
    await driver.close();
  });

  it("should retrieve all todos", async () => {
    const GET_TODOS = `
      query GetTodos {
        todos {
          id
          title
          completed
        }
      }
    `;
    const response = await query({ query: GET_TODOS });
    expect(response.data.todos).toHaveLength(0);
  });

  it("should create a new todo", async () => {
    const CREATE_TODO = `
      mutation CreateTodo {
        createTodo(title: "Todo #1") {
          id
          title
          completed
        }
      }
    `;
    const response = await mutate({ mutation: CREATE_TODO });
    expect(response.data.createTodo.title).toEqual("Todo #1");
    expect(response.data.createTodo.completed).toBe(false);
  });

  it("should update an existing todo", async () => {
    const session = driver.session();
    const result = await session.run("MATCH (t:Todo) RETURN t");
    const todoId = result.records[0].get("t").properties.id;
    session.close();

    const UPDATE_TODO = `
      mutation UpdateTodo {
        updateTodo(id: "${todoId}", title: "update todo", completed: true) {
          id
          title
          completed
        }
      }
    `;
    const response = await mutate({ mutation: UPDATE_TODO });
    expect(response.data.updateTodo.title).toEqual("update todo");
    expect(response.data.updateTodo.completed).toBe(true);
  });

  it("should delete a todo", async () => {
    const session = driver.session();
    const result = await session.run("MATCH (t:Todo) RETURN t");
    const todoId = result.records[0].get("t").properties.id;
    session.close();

    const DELETE_TODO = `
      mutation DeleteTodo {
        deleteTodo(id: "${todoId}")
      }
    `;
    const response = await mutate({ mutation: DELETE_TODO });
    expect(response.data.deleteTodo).toBe(true);
  });
});
