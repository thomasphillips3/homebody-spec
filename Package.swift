// swift-tools-version:5.9
import PackageDescription

let package = Package(
    name: "HomebodySpec",
    platforms: [
        .iOS(.v17),
        .macOS(.v14),
    ],
    products: [
        .library(
            name: "HomebodySpec",
            targets: ["HomebodySpec"]
        )
    ],
    targets: [
        .target(
            name: "HomebodySpec",
            path: "generated/swift"
        )
    ]
)
