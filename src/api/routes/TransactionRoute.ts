import { Router } from "express"

import catcher from "../helper/handler"
import {
  getTransaction,
  signTransaction,
  createTransaction,
  getTransactionPool,
} from "../controller/TransactionController"
import validate from "../middleware/validation"
import {
  signtransactionSchema,
  transactionSchema,
} from "../validation/transactionSchema"

const router = Router()

router.post("/create", validate(transactionSchema), catcher(createTransaction))
router.post("/sign", validate(signtransactionSchema), catcher(signTransaction))

router.get("/pool", catcher(getTransactionPool))
router.get("/:hash", catcher(getTransaction))

export default router
