import Block from "../../block"
import Transaction from "../../transaction"

import { blockDB, txhashDB } from "../../helper/level.db.client"
import { getKeyPair } from "../../../utils/keypair"
import type { Request, Response } from "express"
import type { ChainInfo } from "../../types"
import type {
  CoinStakeInterface,
  CoinTransferInterface,
  SignTransactionInterface,
  TransactionInterface,
} from "../validation/transactionSchema"
import { TransactionTypeEnum } from "../../enum"

const getTransaction = async (req: Request, res: Response) => {
  const { hash } = req.params

  try {
    const [blockNumber, txIndex] = await txhashDB
      .get(String(hash))
      .then((data) => {
        const [blockNumber, txIndex] = data.split(" ")
        return [Number(blockNumber), Number(txIndex)]
      })

    const block: Block = await blockDB
      .get(String(blockNumber))
      .then((data) => JSON.parse(data))

    const transaction = block.data.find((_tx, index) => index === txIndex)

    res.json({
      metadata: {
        blockNumber: blockNumber,
        transactionIndex: txIndex,
      },
      data: transaction,
    })
  } catch (err) {
    res.status(404).json({
      message: "Transaction not found",
    })
  }
}

const signTransaction = async (req: Request, res: Response) => {
  const { privateKey, data, from, to, lastTransactionHash } =
    req.body as SignTransactionInterface

  const keyPair = getKeyPair(privateKey)

  try {
    const transaction = new Transaction({
      data,
      from,
      to,
      lastTransactionHash,
    })
    transaction.sign(keyPair)

    res.json({
      data: transaction,
    })
  } catch (err) {
    res.status(400).json({
      message: err,
    })
  }
}

const createTransaction = async (req: Request, res: Response) => {
  const { data, from, to, privateKey, lastTransactionHash, signature } =
    req.body as TransactionInterface

  try {
    const transaction = new Transaction({
      data,
      from,
      to,
      signature,
      lastTransactionHash,
    })

    if (privateKey) {
      const keyPair = getKeyPair(privateKey)
      transaction.sign(keyPair)
    }

    const isValid = await res.locals.transactionHandler(transaction)

    if (isValid) {
      return res.status(201).json({
        message: "Transaction created successfully",
        hash: transaction.getHash(),
      })
    }
  } catch (err) {
    console.error("Invalid transaction data!")
  }

  res.status(400).json({
    message: "Invalid transaction",
  })
}

const getTransactionPool = async (req: Request, res: Response) => {
  const chainInfo = res.locals.chainInfo as ChainInfo

  res.json({
    data: {
      transactionPool: chainInfo.transactionPool,
    },
  })
}

const transferCoin = async (req: Request, res: Response) => {
  const { privateKey, address, amount } = req.body as CoinTransferInterface

  const keyPair = getKeyPair(privateKey)

  try {
    const transaction = new Transaction({
      from: keyPair.getPublic("hex"),
      to: address,
      data: {
        type: TransactionTypeEnum.COIN_PURCHASE,
        amount,
      },
    })
    transaction.sign(keyPair)

    const isValid = await res.locals.transactionHandler(transaction)

    if (isValid) {
      return res.status(201).json({
        message: `${amount} coin transfered to ${address}.`,
        hash: transaction.getHash(),
      })
    }
  } catch (err) {
    console.error(err)
  }

  res.status(400).json({
    message: "Can't transfer coin, please check your balance!",
  })
}

const stakeCoin = async (req: Request, res: Response) => {
  const { privateKey, amount } = req.body as CoinStakeInterface

  const keyPair = getKeyPair(privateKey)
  const publicKey = keyPair.getPublic("hex")

  try {
    const transaction = new Transaction({
      from: publicKey,
      to: publicKey,
      data: {
        type: TransactionTypeEnum.STAKE,
        amount,
      },
    })
    transaction.sign(keyPair)

    const isValid = await res.locals.transactionHandler(transaction)

    if (isValid) {
      return res.status(201).json({
        message: `${amount} coin staked to ${publicKey}`,
        hash: transaction.getHash(),
      })
    }
  } catch (err) {
    console.error(err)
  }

  res.status(400).json({
    message: "Can't stake coin, please check your balance!",
  })
}
export {
  getTransaction,
  signTransaction,
  createTransaction,
  getTransactionPool,
  transferCoin,
  stakeCoin,
}
