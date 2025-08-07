/**
 * @file ld65 grammer for tree-sitter
 * @author pogyomo <pogyomo@gmail.com>
 * @license MIT
 */

/// <reference types="tree-sitter-cli/dsl" />
// @ts-check

module.exports = grammar({
  name: "ld65",

  extras: ($) => [$.comment, /\s/],

  rules: {
    config: ($) =>
      repeat(
        choice($.memory, $.segments, $.files, $.formats, $.features, $.symbols),
      ),

    // Memory section
    memory: ($) =>
      seq($.keyword_memory, "{", repeat(field("field", $.memory_field)), "}"),
    memory_field: ($) =>
      seq(
        field("name", $.symbol),
        ":",
        repeat(seq(field("attr", $.memory_field_attr), optional(","))),
        ";",
      ),
    memory_field_attr: ($) =>
      choice(
        seq($.attr_start, optional("="), $._expression),
        seq($.attr_size, optional("="), $._expression),
        seq($.attr_type, optional("="), choice($.keyword_ro, $.keyword_rw)),
        seq($.attr_fill, optional("="), choice($.keyword_yes, $.keyword_no)),
        seq($.attr_define, optional("="), choice($.keyword_yes, $.keyword_no)),
        seq($.attr_file, optional("="), choice($.string, $.default_file)),
        seq($.attr_bank, optional("="), $._expression),
      ),

    // Segments section
    segments: ($) =>
      seq(
        $.keyword_segments,
        "{",
        repeat(field("field", $.segments_field)),
        "}",
      ),
    segments_field: ($) =>
      seq(
        field("name", $.symbol),
        ":",
        repeat(seq(field("attr", $.segments_field_attr), optional(","))),
        ";",
      ),
    segments_field_attr: ($) =>
      choice(
        seq($.attr_load, optional("="), $.symbol),
        seq($.attr_run, optional("="), $.symbol),
        seq(
          $.attr_type,
          optional("="),
          choice(
            $.keyword_ro,
            $.keyword_rw,
            $.keyword_zp,
            $.keyword_bss,
            $.keyword_overwrite,
          ),
        ),
        seq($.attr_define, optional("="), choice($.keyword_yes, $.keyword_no)),
        seq($.attr_start, optional("="), $._expression),
        seq($.attr_offset, optional("="), $._expression),
        seq($.attr_align, optional("="), $._expression),
        seq(
          $.attr_optional,
          optional("="),
          choice($.keyword_yes, $.keyword_no),
        ),
      ),

    // Files section
    files: ($) =>
      seq($.keyword_files, "{", repeat(field("field", $.files_field)), "}"),
    files_field: ($) =>
      seq(
        field("name", $.default_file),
        ":",
        repeat(seq(field("attr", $.files_field_attr), optional(","))),
        ";",
      ),
    files_field_attr: ($) =>
      seq(
        $.default_file,
        optional("="),
        choice($.keyword_bin, $.keyword_o65, $.keyword_atari),
      ),

    // Formats section
    formats: ($) => seq($.keyword_formats, "{", repeat($._formats_field), "}"),
    _formats_field: ($) =>
      choice(field("o65", $.formats_o65), field("atari", $.formats_atari)),
    formats_o65: ($) =>
      seq(
        field("name", $.field_o65),
        ":",
        repeat(seq(field("attr", $.formats_o65_attr), optional(","))),
        ";",
      ),
    formats_o65_attr: ($) =>
      choice(
        seq(
          $.attr_os,
          optional("="),
          choice(
            $.keyword_linux,
            $.keyword_osa65,
            $.keyword_cc65,
            $.keyword_opencbm,
          ),
        ),
        seq($.attr_version, optional("="), $._expression),
        seq(
          $.attr_type,
          optional("="),
          choice($.keyword_small, $.keyword_large),
        ),
        seq($.attr_import, optional("="), $.symbol),
        seq($.attr_export, optional("="), $.symbol),
      ),
    formats_atari: ($) =>
      seq(
        field("name", $.field_atari),
        ":",
        repeat(seq(field("attr", $.formats_atari_attr), optional(","))),
        ";",
      ),
    formats_atari_attr: ($) =>
      choice(
        seq($.attr_runad, optional("="), $.symbol),
        seq($.attr_initad, optional("="), $.symbol, ":", $.symbol),
      ),

    // Features
    features: ($) =>
      seq($.keyword_features, "{", repeat($._features_field), "}"),
    _features_field: ($) =>
      choice(
        field("condes", $.features_condes),
        field("startaddress", $.features_startaddress),
      ),
    features_condes: ($) =>
      seq(
        field("name", $.field_condes),
        ":",
        repeat(seq(field("attr", $.features_condes_attr), optional(","))),
        ";",
      ),
    features_condes_attr: ($) =>
      choice(
        seq($.attr_segment, optional("="), $.symbol),
        seq(
          $.attr_type,
          optional("="),
          choice(
            $.keyword_constructor,
            $.keyword_destructor,
            $.keyword_interruptor,
            $.number,
          ),
        ),
        seq($.attr_label, optional("="), $.symbol),
        seq($.attr_count, optional("="), $.symbol),
        seq(
          $.attr_order,
          optional("="),
          choice($.keyword_increasing, $.keyword_decreasing),
        ),
        seq($.attr_import, optional("="), $.symbol),
      ),
    features_startaddress: ($) =>
      seq(
        field("name", $.field_startaddress),
        ":",
        repeat(seq(field("attr", $.features_startaddress_attr), optional(","))),
        ";",
      ),
    features_startaddress_attr: ($) =>
      seq($.attr_default, optional("="), $._expression),

    // Symbols section
    symbols: ($) => seq($.keyword_symbols, "{", repeat($.symbols_field), "}"),
    symbols_field: ($) =>
      seq(
        field("name", $.symbol),
        ":",
        repeat(seq($.symbols_field_attr, optional(","))),
        ";",
      ),
    symbols_field_attr: ($) =>
      choice(
        seq(
          $.attr_addrsize,
          optional("="),
          choice(
            $.keyword_zp,
            $.keyword_zeropage,
            $.keyword_direct,
            $.keyword_abs,
            $.keyword_absolute,
            $.keyword_near,
            $.keyword_far,
            $.keyword_long,
            $.keyword_dword,
          ),
        ),
        seq(
          $.attr_type,
          optional("="),
          choice($.keyword_import, $.keyword_export, $.keyword_weak),
        ),
        seq($.attr_value, optional("="), $._expression),
      ),

    // Keywords
    keyword_memory: (_) => make_keyword("memory"),
    keyword_segments: (_) => make_keyword("segments"),
    keyword_files: (_) => make_keyword("files"),
    keyword_formats: (_) => make_keyword("formats"),
    keyword_features: (_) => make_keyword("features"),
    keyword_symbols: (_) => make_keyword("symbols"),

    // Keywords in attribute
    keyword_ro: (_) => make_keyword("ro"),
    keyword_rw: (_) => make_keyword("rw"),
    keyword_zp: (_) => make_keyword("zp"),
    keyword_bss: (_) => make_keyword("bss"),
    keyword_yes: (_) => make_keyword("yes"),
    keyword_no: (_) => make_keyword("no"),
    keyword_overwrite: (_) => make_keyword("overwrite"),
    keyword_bin: (_) => make_keyword("bin"),
    keyword_o65: (_) => make_keyword("o65"),
    keyword_atari: (_) => make_keyword("atari"),
    keyword_small: (_) => make_keyword("small"),
    keyword_large: (_) => make_keyword("large"),
    keyword_linux: (_) => make_keyword("linux"),
    keyword_osa65: (_) => make_keyword("osa65"),
    keyword_cc65: (_) => make_keyword("cc65"),
    keyword_opencbm: (_) => make_keyword("opencbm"),
    keyword_constructor: (_) => make_keyword("constructor"),
    keyword_destructor: (_) => make_keyword("destructor"),
    keyword_interruptor: (_) => make_keyword("interruptor"),
    keyword_increasing: (_) => make_keyword("increasing"),
    keyword_decreasing: (_) => make_keyword("decreasing"),
    keyword_zeropage: (_) => make_keyword("zeropage"),
    keyword_direct: (_) => make_keyword("direct"),
    keyword_abs: (_) => make_keyword("abs"),
    keyword_absolute: (_) => make_keyword("absolute"),
    keyword_near: (_) => make_keyword("near"),
    keyword_far: (_) => make_keyword("far"),
    keyword_long: (_) => make_keyword("long"),
    keyword_dword: (_) => make_keyword("dword"),
    keyword_export: (_) => make_keyword("export"),
    keyword_import: (_) => make_keyword("import"),
    keyword_weak: (_) => make_keyword("weak"),

    // Fields
    field_o65: (_) => make_field("o65"),
    field_atari: (_) => make_field("atari"),
    field_condes: (_) => make_field("condes"),
    field_startaddress: (_) => make_field("startaddress"),

    // Attribute names
    attr_start: (_) => make_attr("start"),
    attr_size: (_) => make_attr("size"),
    attr_type: (_) => make_attr("type"),
    attr_fill: (_) => make_attr("fill"),
    attr_define: (_) => make_attr("define"),
    attr_file: (_) => make_attr("file"),
    attr_load: (_) => make_attr("load"),
    attr_run: (_) => make_attr("run"),
    attr_offset: (_) => make_attr("offset"),
    attr_align: (_) => make_attr("align"),
    attr_optional: (_) => make_attr("optional"),
    attr_os: (_) => make_attr("os"),
    attr_version: (_) => make_attr("version"),
    attr_import: (_) => make_attr("import"),
    attr_export: (_) => make_attr("export"),
    attr_runad: (_) => make_attr("runad"),
    attr_initad: (_) => make_attr("initad"),
    attr_segment: (_) => make_attr("segment"),
    attr_label: (_) => make_attr("label"),
    attr_count: (_) => make_attr("count"),
    attr_order: (_) => make_attr("order"),
    attr_default: (_) => make_attr("default"),
    attr_addrsize: (_) => make_attr("addrsize"),
    attr_value: (_) => make_attr("value"),
    attr_bank: (_) => make_attr("bank"),

    // Expression
    _expression: ($) =>
      choice(
        seq("(", $._expression, ")"),
        $.binary_expression,
        $.symbol,
        $.number,
        $.default_start_address,
      ),
    binary_expression: ($) =>
      choice(
        prec.left(
          2,
          seq(
            field("lhs", $._expression),
            choice("*", "/"),
            field("rhs", $._expression),
          ),
        ),
        prec.left(
          1,
          seq(
            field("lhs", $._expression),
            choice("+", "-"),
            field("rhs", $._expression),
          ),
        ),
      ),

    // Literals
    symbol: (_) => /[a-zA-Z_][a-zA-Z_0-9]*/,
    number: ($) => choice($._number_bin, $._number_dec, $._number_hex),
    _number_hex: (_) => seq("$", /[a-fA-F0-9]+/),
    _number_dec: (_) => /[0-9]+/,
    _number_bin: (_) => seq("%", /[0-1]+/),
    string: (_) => seq('"', /[^"]*/, '"'),
    default_start_address: (_) => "%S",
    default_file: (_) => "%O",

    // Comment
    comment: (_) => token(seq("#", /.*/)),
  },
});

/**
 * Make keyword
 *
 * @param {string} name
 */
function make_keyword(name) {
  return new RegExp(name, "i");
}

/**
 * Make field name
 *
 * @param {string} name
 */
function make_field(name) {
  return new RegExp(name, "i");
}

/**
 * Make attribute name
 *
 * @param {string} name
 */
function make_attr(name) {
  return new RegExp(name, "i");
}
