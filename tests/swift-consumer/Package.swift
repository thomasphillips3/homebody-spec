// swift-tools-version:5.9
import PackageDescription

let package = Package(
    name: "HomebodySpecExternalConsumer",
    platforms: [
        .macOS(.v14),
    ],
    dependencies: [
        .package(name: "homebody-spec", path: "../.."),
    ],
    targets: [
        .executableTarget(
            name: "HomebodySpecExternalConsumer",
            dependencies: [
                .product(name: "HomebodySpec", package: "homebody-spec"),
            ]
        ),
    ]
)
