import Foundation
import HomebodySpec

let json = """
{
  "schema_version": "0.2.0",
  "home": {
    "id": "10000000-0000-4000-8000-000000000001",
    "owner_user_id": "10000000-0000-4000-8000-000000000002",
    "name": "External Consumer Home",
    "address": "123 Consumer Lane",
    "created_at": "2026-01-01T00:00:00Z"
  },
  "levels": [],
  "rooms": [],
  "plan_elements": [],
  "systems": [],
  "components": [],
  "events": [],
  "attachments": [],
  "smart_home_readings": [],
  "utility_bills": []
}
"""

let record: HomeRecord = try HomeRecord(data: Data(json.utf8))
precondition(record.schemaVersion == "0.2.0")
let customField = JSONAny(Int64(42))
precondition(customField.value as? Int64 == 42)
print("Decoded HomeRecord \(record.home.name)")
