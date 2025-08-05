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
    memory: ($) => seq($.keyword_memory, "{", repeat($.memory_field), "}"),
    memory_field: ($) =>
      seq(
        field("name", $.symbol),
        ":",
        repeat(seq($.memory_field_attr, optional(","))),
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
      seq($.keyword_segments, "{", repeat($.segments_field), "}"),
    segments_field: ($) =>
      seq(
        field("name", $.symbol),
        ":",
        repeat(seq($.segments_field_attr, optional(","))),
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
    files: ($) => seq($.keyword_files, "{", repeat($.files_field), "}"),
    files_field: ($) =>
      seq(
        $.default_file,
        ":",
        repeat(seq($.files_field_attr, optional(","))),
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
    _formats_field: ($) => choice($.formats_o65, $.formats_atari),
    formats_o65: ($) =>
      seq(
        $.field_o65,
        ":",
        repeat(seq($.formats_o65_attr, optional(","))),
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
        $.field_atari,
        ":",
        repeat(seq($.formats_atari_attr, optional(","))),
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
    _features_field: ($) => choice($.features_condes, $.features_startaddress),
    features_condes: ($) =>
      seq(
        $.field_condes,
        ":",
        repeat(seq($.features_condes_attr, optional(","))),
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
        $.field_startaddress,
        ":",
        repeat(seq($.features_startaddress_attr, optional(","))),
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
    keyword_memory: (_) => /memory/i,
    keyword_segments: (_) => /segments/i,
    keyword_files: (_) => /files/i,
    keyword_formats: (_) => /formats/i,
    keyword_features: (_) => /features/i,
    keyword_symbols: (_) => /symbols/i,

    // Keywords in attribute
    keyword_ro: (_) => /ro/i,
    keyword_rw: (_) => /rw/i,
    keyword_zp: (_) => /zp/i,
    keyword_bss: (_) => /bss/i,
    keyword_yes: (_) => /yes/i,
    keyword_no: (_) => /no/i,
    keyword_overwrite: (_) => /overwrite/i,
    keyword_bin: (_) => /bin/i,
    keyword_o65: (_) => /o65/i,
    keyword_atari: (_) => /atari/i,
    keyword_small: (_) => /small/i,
    keyword_large: (_) => /large/i,
    keyword_linux: (_) => /linux/i,
    keyword_osa65: (_) => /osa65/i,
    keyword_cc65: (_) => /cc65/i,
    keyword_opencbm: (_) => /opencbm/i,
    keyword_constructor: (_) => /constructor/i,
    keyword_destructor: (_) => /destructor/i,
    keyword_interruptor: (_) => /interruptor/i,
    keyword_increasing: (_) => /increasing/i,
    keyword_decreasing: (_) => /decreasing/i,
    keyword_zeropage: (_) => /zeropage/i,
    keyword_direct: (_) => /direct/i,
    keyword_abs: (_) => /abs/i,
    keyword_absolute: (_) => /absolute/i,
    keyword_near: (_) => /near/i,
    keyword_far: (_) => /far/i,
    keyword_long: (_) => /long/i,
    keyword_dword: (_) => /dword/i,
    keyword_export: (_) => /export/i,
    keyword_import: (_) => /import/i,
    keyword_weak: (_) => /weak/i,

    // Fields
    field_o65: (_) => /o65/i,
    field_atari: (_) => /atari/i,
    field_condes: (_) => /condes/i,
    field_startaddress: (_) => /startaddress/i,

    // Attribute names
    attr_start: (_) => /start/i,
    attr_size: (_) => /size/i,
    attr_type: (_) => /type/i,
    attr_fill: (_) => /fill/i,
    attr_define: (_) => /define/i,
    attr_file: (_) => /file/i,
    attr_load: (_) => /load/i,
    attr_run: (_) => /run/i,
    attr_offset: (_) => /offset/i,
    attr_align: (_) => /align/i,
    attr_optional: (_) => /optional/i,
    attr_os: (_) => /os/i,
    attr_version: (_) => /version/i,
    attr_import: (_) => /import/i,
    attr_export: (_) => /export/i,
    attr_runad: (_) => /runad/i,
    attr_initad: (_) => /initad/i,
    attr_segment: (_) => /segment/i,
    attr_label: (_) => /label/i,
    attr_count: (_) => /count/i,
    attr_order: (_) => /order/i,
    attr_default: (_) => /default/i,
    attr_addrsize: (_) => /addrsize/i,
    attr_value: (_) => /value/i,
    attr_bank: (_) => /bank/i,

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
    comment: (_) => seq("#", /.*/),
  },
});
