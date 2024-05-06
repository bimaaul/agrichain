import { Router } from "express"

import catcher from "../helper/handler"
import {
  getTransaction,
  signTransaction,
  createTransaction,
  getTransactionPool,
  transferCoin,
  stakeCoin,
} from "../controller/TransactionController"
import validate from "../middleware/validation"
import {
  transactionSchema,
  coinTransferSchema,
  coinStakeSchema,
} from "../validation/transactionSchema"

const router = Router()

router.post("/create", validate(transactionSchema), catcher(createTransaction))
router.post("/sign", validate(transactionSchema), catcher(signTransaction))
router.post(
  "/transfer-coin",
  validate(coinTransferSchema),
  catcher(transferCoin)
)
router.post("/stake", validate(coinStakeSchema), catcher(stakeCoin))

router.get("/pool", catcher(getTransactionPool))
router.get("/:hash", catcher(getTransaction))

export default router
