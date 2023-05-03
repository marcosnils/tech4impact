import { connect } from "@dagger.io/dagger"

// initialize Dagger client
connect(async (client) => {

  const database = client.container().from("postgres:15")
    .withEnvVariable("POSTGRES_PASSWORD", "test")
    .withEnvVariable("POSTGRES_DB", "example_db")
    .withExec([])
    .withExposedPort(5432)
  // get reference to the local project
  const source = client.host().directory(".", { exclude: ["node_modules/"] })

  await client.container().from("node:18-alpine")
    .withServiceBinding("db", database) // bind database with the name db
    .withEnvVariable("DB_CONNECTION_STRING", "postgres://postgres:test@db:5432/example_db") // db refers to the service binding
    .withDirectory("/src", source)
    .withWorkdir("/src")
    .withExec(["npm", "install"])
    .withExec(["npm", "run", "test"]) // execute npm run test
    .stdout()

}, { LogOutput: process.stdout })
