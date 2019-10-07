add_library (blockchain STATIC
    Block.cpp
)

set_target_properties(blockchain PROPERTIES ARCHIVE_OUTPUT_DIRECTORY "${CMAKE_BINARY_DIR}/Obj")
