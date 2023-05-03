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

  const base = client.container().from("node:18-alpine")
    .withDirectory("/src", source)
    .withWorkdir("/src")

  const test = base
    .withServiceBinding("db", database) // bind database with the name db
    .withEnvVariable("DB_CONNECTION_STRING", "postgres://postgres:test@db:5432/example_db") // db refers to the service binding
    .withExec(["npm", "ci"])
    .withExec(["npm", "run", "test"]) // execute npm run test

  console.log(await test.stdout())
  console.log(await test.stderr())

  //push the resulting image
  console.log("Tests succesfull, pushing docker image:")
  const imgRef = await base
    .withExec(["npm", "ci", "--production"])
    .withEntrypoint(["node", "server.js"])
    .publish("ttl.sh/tech4impact-dagger:1h")

  console.log(`image pused. ref: ${imgRef}`)

},
  //{ LogOutput: process.stdout }
)
