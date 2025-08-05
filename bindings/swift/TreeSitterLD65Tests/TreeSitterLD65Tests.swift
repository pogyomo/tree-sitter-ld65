import XCTest
import SwiftTreeSitter
import TreeSitterLd65

final class TreeSitterLd65Tests: XCTestCase {
    func testCanLoadGrammar() throws {
        let parser = Parser()
        let language = Language(language: tree_sitter_ld65())
        XCTAssertNoThrow(try parser.setLanguage(language),
                         "Error loading ld65 grammar")
    }
}
