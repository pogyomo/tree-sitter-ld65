// swift-tools-version:5.3

import Foundation
import PackageDescription

var sources = ["src/parser.c"]
if FileManager.default.fileExists(atPath: "src/scanner.c") {
    sources.append("src/scanner.c")
}

let package = Package(
    name: "TreeSitterLd65",
    products: [
        .library(name: "TreeSitterLd65", targets: ["TreeSitterLd65"]),
    ],
    dependencies: [
        .package(name: "SwiftTreeSitter", url: "https://github.com/tree-sitter/swift-tree-sitter", from: "0.9.0"),
    ],
    targets: [
        .target(
            name: "TreeSitterLd65",
            dependencies: [],
            path: ".",
            sources: sources,
            resources: [
                .copy("queries")
            ],
            publicHeadersPath: "bindings/swift",
            cSettings: [.headerSearchPath("src")]
        ),
        .testTarget(
            name: "TreeSitterLd65Tests",
            dependencies: [
                "SwiftTreeSitter",
                "TreeSitterLd65",
            ],
            path: "bindings/swift/TreeSitterLd65Tests"
        )
    ],
    cLanguageStandard: .c11
)
