package tree_sitter_ld65_test

import (
	"testing"

	tree_sitter "github.com/tree-sitter/go-tree-sitter"
	tree_sitter_ld65 "github.com/pogyomo/tree-sitter-ld65/bindings/go"
)

func TestCanLoadGrammar(t *testing.T) {
	language := tree_sitter.NewLanguage(tree_sitter_ld65.Language())
	if language == nil {
		t.Errorf("Error loading ld65 grammar")
	}
}
