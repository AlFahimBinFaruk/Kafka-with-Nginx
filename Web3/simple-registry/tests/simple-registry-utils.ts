import { newMockEvent } from "matchstick-as"
import { ethereum, Address, BigInt } from "@graphprotocol/graph-ts"
import {
  Registered,
  Removed,
  Updated
} from "../generated/SimpleRegistry/SimpleRegistry"

export function createRegisteredEvent(
  user: Address,
  id: BigInt,
  metadata: string
): Registered {
  let registeredEvent = changetype<Registered>(newMockEvent())

  registeredEvent.parameters = new Array()

  registeredEvent.parameters.push(
    new ethereum.EventParam("user", ethereum.Value.fromAddress(user))
  )
  registeredEvent.parameters.push(
    new ethereum.EventParam("id", ethereum.Value.fromUnsignedBigInt(id))
  )
  registeredEvent.parameters.push(
    new ethereum.EventParam("metadata", ethereum.Value.fromString(metadata))
  )

  return registeredEvent
}

export function createRemovedEvent(id: BigInt, executor: Address): Removed {
  let removedEvent = changetype<Removed>(newMockEvent())

  removedEvent.parameters = new Array()

  removedEvent.parameters.push(
    new ethereum.EventParam("id", ethereum.Value.fromUnsignedBigInt(id))
  )
  removedEvent.parameters.push(
    new ethereum.EventParam("executor", ethereum.Value.fromAddress(executor))
  )

  return removedEvent
}

export function createUpdatedEvent(
  id: BigInt,
  oldMeta: string,
  newMeta: string
): Updated {
  let updatedEvent = changetype<Updated>(newMockEvent())

  updatedEvent.parameters = new Array()

  updatedEvent.parameters.push(
    new ethereum.EventParam("id", ethereum.Value.fromUnsignedBigInt(id))
  )
  updatedEvent.parameters.push(
    new ethereum.EventParam("oldMeta", ethereum.Value.fromString(oldMeta))
  )
  updatedEvent.parameters.push(
    new ethereum.EventParam("newMeta", ethereum.Value.fromString(newMeta))
  )

  return updatedEvent
}
