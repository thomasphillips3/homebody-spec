import {
  type Event,
  type HomeRecord,
  validateHomeRecord,
} from "homebody-spec";

declare const candidate: unknown;

if (validateHomeRecord(candidate)) {
  const record: HomeRecord = candidate;
  void record;
}

const targetedEvent: Event = {
  attachment_ids: [],
  component_id: null,
  event_type: "inspection",
  home_id: "10000000-0000-4000-8000-000000000001",
  id: "10000000-0000-4000-8000-000000000002",
  occurred_at: "2026-01-01T00:00:00Z",
  system_id: "10000000-0000-4000-8000-000000000003",
};

void targetedEvent;
