const { v4: uuidv4 } = require("uuid");
const bcrypt = require("bcryptjs");
const { generateToken, hashPassword } = require("../auth/auth");
const driver = require("../db/connection");

const resolvers = {
  Query: {
    todos: async () => {
      const session = driver.session();
      try {
        const result = await session.run("MATCH (t:Todo) RETURN t");
        return result.records.map((record) => record.get("t").properties);
      } catch (err) {
        throw new Error(err.message);
      } finally {
        session.close();
      }
    },
    todo: async (_, { id }) => {
      const session = driver.session();
      try {
        const result = await session.run("MATCH (t:Todo {id: $id}) RETURN t", {
          id,
        });
        return result.records[0].get("t").properties;
      } catch (err) {
        throw new Error(err.message);
      } finally {
        session.close();
      }
    },
    users: async () => {
      const session = driver.session();
      try {
        const result = await session.run("MATCH (u:User) RETURN u");
        return result.records.map((record) => record.get("u").properties);
      } catch (err) {
        throw new Error(err.message);
      } finally {
        session.close();
      }
    },
    user: async (_, { id }) => {
      const session = driver.session();
      try {
        const result = await session.run("MATCH (u:User {id: $id}) RETURN u", {
          id,
        });
        return result.records[0].get("u").properties;
      } catch (err) {
        throw new Error(err.message);
      } finally {
        session.close();
      }
    },
  },
  Mutation: {
    createTodo: async (_, { title }) => {
      const session = driver.session();
      try {
        const id = uuidv4();
        const result = await session.run(
          "CREATE (t:Todo {id: $id, title: $title, completed: false}) RETURN t",
          { id, title }
        );
        session.close();
        return result.records[0].get("t").properties;
      } catch (err) {
        throw new Error(err.message);
      } finally {
        session.close();
      }
    },
    updateTodo: async (_, { id, title, completed }) => {
      const session = driver.session();
      try {
        let query = "MATCH (t:Todo {id: $id}) SET ";
        const params = { id };
        if (title) {
          query += "t.title = $title, ";
          params.title = title;
        }
        if (completed !== undefined) {
          query += "t.completed = $completed, ";
          params.completed = completed;
        }
        query = query.slice(0, -2); // remove space
        query += " RETURN t";
        const result = await session.run(query, params);
        return result.records[0].get("t").properties;
      } catch (err) {
        throw new Error(err.message);
      } finally {
        session.close();
      }
    },
    deleteTodo: async (_, { id }) => {
      const session = driver.session();
      try {
        await session.run("MATCH (t:Todo {id: $id}) DELETE t", { id });
        return true;
      } catch (err) {
        throw new Error(err.message);
      } finally {
        session.close();
      }
    },
    signUp: async (_, { username, password }) => {
      const session = driver.session();
      try {
        const id = uuidv4();
        const hashPass = hashPassword(password);
        const result = await session.run(
          "CREATE (u:User {id: $id, username: $username, password: $password}) RETURN u",
          { id, username, hashPass }
        );
        session.close();
        return result.records[0].get("t").properties;
      } catch (err) {
        throw new Error(err.message);
      } finally {
        session.close();
      }
    },
    singIn: async (_, { username, password }) => {
      const session = driver.session();
      try {
        const user = await session.run(
          "MATCH (u:User {username: $username}) RETURN u",
          { username }
        );
        if (!user) {
          throw new Error("Invalid username or password");
        }

        const passwordMatch = bcrypt.compareSync(password, user.password);
        if (!passwordMatch) {
          throw new Error("Invalid username or password");
        }

        const token = generateToken(user);
        session.close();
        return token;
      } catch (err) {
        throw new Error(err.message);
      } finally {
        session.close();
      }
    },
  },
};

module.exports = resolvers;
