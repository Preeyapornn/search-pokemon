# 🔍 search-pokemon

`search-pokemon` is a full-stack web application built with [Next.js](https://nextjs.org), [TypeScript](https://www.typescriptlang.org), and [GraphQL](https://graphql.org) that allows users to search for Pokémon and view their details, including attacks and evolutions.

This project is part of the **Futuremakers Full Stack Evaluation**.

---

## 🚀 Features

- Search for Pokémon by name (supports query param syncing)
- Display Pokémon details: name, image, types, attacks, and evolutions
- Click evolution names to auto-navigate and view their details
- Handles "not found" state gracefully
- Apollo Client for GraphQL with caching and optimization
- Clean, readable UI (no specific design library required)
- Jest testing with mocked Pokémon data

---

## 🧪 Testing

Jest is used for unit testing.

To run tests:

```bash
npm run test
