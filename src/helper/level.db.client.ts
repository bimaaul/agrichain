import { Level } from "level"

let stateDB: Level
let blockDB: Level
let bhashDB: Level
let txhashDB: Level

declare global {
  var __stateDb: Level | undefined
  var __blockDb: Level | undefined
  var __bhashDb: Level | undefined
  var __txhashDb: Level | undefined
}

const path = process.env.APP_ENV ? `log/${process.env.APP_ENV}` : "log"

if (!global.__stateDb)
  global.__stateDb = new Level(__dirname + `/../../${path}/stateStore`, {
    valueEncoding: "json",
  })

if (!global.__blockDb)
  global.__blockDb = new Level(__dirname + `/../../${path}/blockStore`, {
    valueEncoding: "json",
  })

if (!global.__bhashDb)
  global.__bhashDb = new Level(__dirname + `/../../${path}/bhashStore`, {
    valueEncoding: "json",
  })

if (!global.__txhashDb)
  global.__txhashDb = new Level(__dirname + `/../../${path}/txhashStore`)

stateDB = global.__stateDb
blockDB = global.__blockDb
bhashDB = global.__bhashDb
txhashDB = global.__txhashDb

export { stateDB, blockDB, bhashDB, txhashDB }
