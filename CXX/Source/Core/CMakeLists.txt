add_library (core STATIC
    Block.cpp
)

set_target_properties(core PROPERTIES ARCHIVE_OUTPUT_DIRECTORY "${CMAKE_BINARY_DIR}/Obj")
