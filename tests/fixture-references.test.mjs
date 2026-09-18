import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const testRoot = fileURLToPath(new URL(".", import.meta.url));
const fixtureRoot = join(testRoot, "..", "spec", "fixtures");

function ids(items) {
  return new Set(items.map(({ id }) => id));
}

function checkReference(targets, value, label) {
  if (value !== null && value !== undefined) {
    assert.ok(targets.has(value), `${label} references missing id ${value}`);
  }
}

for (const fixtureName of ["minimal-home.json", "maximal-home.json"]) {
  test(`${fixtureName} has valid entity references`, () => {
    const record = JSON.parse(
      readFileSync(join(fixtureRoot, fixtureName), "utf-8"),
    );
    const levelIDs = ids(record.levels);
    const roomIDs = ids(record.rooms);
    const planElementIDs = ids(record.plan_elements);
    const systemIDs = ids(record.systems);
    const componentIDs = ids(record.components);
    const eventIDs = ids(record.events);
    const attachmentIDs = ids(record.attachments);

    for (const level of record.levels) {
      assert.equal(level.home_id, record.home.id);
    }
    for (const room of record.rooms) {
      checkReference(levelIDs, room.level_id, "Room.level_id");
    }
    for (const element of record.plan_elements) {
      checkReference(levelIDs, element.level_id, "PlanElement.level_id");
      checkReference(
        planElementIDs,
        element.host_element_id,
        "PlanElement.host_element_id",
      );
    }
    for (const system of record.systems) {
      assert.equal(system.home_id, record.home.id);
    }
    for (const component of record.components) {
      checkReference(systemIDs, component.system_id, "Component.system_id");
      checkReference(levelIDs, component.level_id, "Component.level_id");
      checkReference(
        attachmentIDs,
        component.manual_attachment_id,
        "Component.manual_attachment_id",
      );
      checkReference(
        componentIDs,
        component.linked_component_id,
        "Component.linked_component_id",
      );
      for (const roomID of component.room_ids) {
        checkReference(roomIDs, roomID, "Component.room_ids");
      }
    }
    for (const event of record.events) {
      assert.equal(event.home_id, record.home.id);
      checkReference(systemIDs, event.system_id, "Event.system_id");
      checkReference(componentIDs, event.component_id, "Event.component_id");
      for (const attachmentID of event.attachment_ids) {
        checkReference(attachmentIDs, attachmentID, "Event.attachment_ids");
      }
    }
    for (const attachment of record.attachments) {
      assert.equal(attachment.home_id, record.home.id);
      checkReference(
        eventIDs,
        attachment.linked_event_id,
        "Attachment.linked_event_id",
      );
      checkReference(
        componentIDs,
        attachment.linked_component_id,
        "Attachment.linked_component_id",
      );
      assert.match(
        attachment.storage_path,
        new RegExp(
          `^${record.home.owner_user_id}/homes/${record.home.id}/attachments/${attachment.id}\\.[A-Za-z0-9]+$`,
        ),
      );
    }
    for (const reading of record.smart_home_readings) {
      checkReference(
        componentIDs,
        reading.component_id,
        "SmartHomeReading.component_id",
      );
    }
    for (const bill of record.utility_bills) {
      assert.equal(bill.home_id, record.home.id);
      checkReference(
        attachmentIDs,
        bill.attachment_id,
        "UtilityBill.attachment_id",
      );
    }
  });
}
