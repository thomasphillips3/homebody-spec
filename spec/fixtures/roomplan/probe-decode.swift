// Decode gate for the structure fixtures: decodes each given path into the real
// RoomPlan CapturedStructure type and exports a .usdz to a temp path.
// Prints "OK <name>" or "ERR <name>: <error>" per file. Exit status 1 on any ERR.
//
// Build:
//   xcrun --sdk iphonesimulator swiftc -target arm64-apple-ios26.0-simulator \
//     /abs/path/probe-decode.swift -o /abs/path/probe-decode
// Run (absolute paths only, the simulator cwd is the device data dir):
//   xcrun simctl spawn booted /abs/path/probe-decode /abs/path/box.structure.json ...
import Foundation
import RoomPlan

var failed = false
for path in CommandLine.arguments.dropFirst() {
    let name = URL(fileURLWithPath: path).lastPathComponent
    do {
        let data = try Data(contentsOf: URL(fileURLWithPath: path))
        let structure = try JSONDecoder().decode(CapturedStructure.self, from: data)
        let out = FileManager.default.temporaryDirectory
            .appendingPathComponent(UUID().uuidString + ".usdz")
        try structure.export(to: out, exportOptions: .mesh)
        try? FileManager.default.removeItem(at: out)
        print("OK \(name) walls=\(structure.walls.count) doors=\(structure.doors.count) windows=\(structure.windows.count) openings=\(structure.openings.count) floors=\(structure.floors.count) sections=\(structure.sections.count) rooms=\(structure.rooms.count)")
    } catch {
        print("ERR \(name): \(error)")
        failed = true
    }
}
exit(failed ? 1 : 0)
