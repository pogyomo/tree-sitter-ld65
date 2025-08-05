; Keywords
[
 (keyword_memory)
 (keyword_segments)
 (keyword_files)
 (keyword_formats)
 (keyword_features)
 (keyword_symbols)
] @keyword

; Keywrods in attribute
[
 (keyword_ro)
 (keyword_rw)
 (keyword_zp)
 (keyword_bss)
 (keyword_yes)
 (keyword_no)
 (keyword_overwrite)
 (keyword_bin)
 (keyword_o65)
 (keyword_atari)
 (keyword_small)
 (keyword_large)
 (keyword_linux)
 (keyword_osa65)
 (keyword_cc65)
 (keyword_opencbm)
 (keyword_constructor)
 (keyword_destructor)
 (keyword_interruptor)
 (keyword_increasing)
 (keyword_decreasing)
 (keyword_zeropage)
 (keyword_direct)
 (keyword_abs)
 (keyword_absolute)
 (keyword_near)
 (keyword_far)
 (keyword_long)
 (keyword_dword)
 (keyword_export)
 (keyword_import)
 (keyword_weak)
] @constant.builtin

[
 (field_o65)
 (field_atari)
 (field_condes)
 (field_startaddress)
] @variable.builtin

[
 (attr_start)
 (attr_size)
 (attr_type)
 (attr_fill)
 (attr_define)
 (attr_file)
 (attr_load)
 (attr_run)
 (attr_offset)
 (attr_align)
 (attr_optional)
 (attr_os)
 (attr_version)
 (attr_import)
 (attr_export)
 (attr_runad)
 (attr_initad)
 (attr_segment)
 (attr_label)
 (attr_count)
 (attr_order)
 (attr_default)
 (attr_addrsize)
 (attr_value)
 (attr_bank)
] @property

; Literals
(symbol) @variable
(number) @number
(string) @string
(default_file) @string.special
(default_start_address) @constant.builtin

; Comment
(comment) @comment

[
 "{"
 "}"
 "("
 ")"
] @punctuation.bracket

[
 ":"
 ";"
 ","
] @punctuation.delimiter

[
 "+"
 "-"
 "*"
 "/"
 "="
] @operator
