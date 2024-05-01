import { generateKeyPair } from "../../utils/keypair"

const MINT_KEY_PAIR = generateKeyPair()
const MINT_PUBLIC_ADDRESS = MINT_KEY_PAIR.getPublic("hex")

const MINE_RATE = 1000
const INITIAL_DIFFICULTY = 3
const MINE_REWARD = 100

const GENESIS_DATA = {
  timestamp: 1,
  lastHash: "----",
  hash: "hash-one",
  difficulty: INITIAL_DIFFICULTY,
  nonce: 0,
  data: [],
  number: 1,
}

export {
  GENESIS_DATA,
  MINE_RATE,
  MINE_REWARD,
  MINT_KEY_PAIR,
  MINT_PUBLIC_ADDRESS,
}