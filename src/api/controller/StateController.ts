import type { Request, Response } from "express"

const getMiningState = async (_req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    data: {
      isMining: res.locals.mining,
    },
  })
}

const getStaker = async (_req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    data: {
      staker: res.locals.chainInfo.consensus.stakers,
    },
  })
}

export { getMiningState, getStaker }
