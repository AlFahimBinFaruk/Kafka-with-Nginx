import {
  Registered as RegisteredEvent,
  Removed as RemovedEvent,
  Updated as UpdatedEvent
} from "../generated/SimpleRegistry/SimpleRegistry"
import { Registered, Removed, Updated } from "../generated/schema"

export function handleRegistered(event: RegisteredEvent): void {
  let entity = new Registered(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.user = event.params.user
  entity.internal_id = event.params.id
  entity.metadata = event.params.metadata

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleRemoved(event: RemovedEvent): void {
  let entity = new Removed(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.internal_id = event.params.id
  entity.executor = event.params.executor

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleUpdated(event: UpdatedEvent): void {
  let entity = new Updated(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.internal_id = event.params.id
  entity.oldMeta = event.params.oldMeta
  entity.newMeta = event.params.newMeta

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}
