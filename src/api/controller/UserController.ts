import type { Request, Response } from "express"
import { generateKeyPair } from "../../../utils/keypair"
import { stateDB } from "../../helper/level.db.client"

import { ec as EC } from "elliptic"

const generateWallet = async (_req: Request, res: Response) => {
  const existingKeys = await stateDB.keys().all()
  let keyPair: EC.KeyPair

  do {
    keyPair = generateKeyPair()
  } while (existingKeys.includes(keyPair.getPublic("hex")))

  await stateDB.put(
    keyPair.getPublic("hex"),
    JSON.stringify({
      name: "user",
    })
  )

  res.status(200).json({
    data: {
      publicKey: keyPair.getPublic("hex"),
      privateKey: keyPair.getPrivate("hex"),
    },
  })
}

const getUserList = async (_req: Request, res: Response) => {
  const users = await stateDB
    .values()
    .all()
    .then((data) => data.map((user) => JSON.parse(user)))

  res.json({
    data: {
      users,
    },
  })
}

export { generateWallet, getUserList }