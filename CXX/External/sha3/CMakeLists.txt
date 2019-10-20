file(GLOB sha3_src
        "*.hpp"
        "*.cpp"
        )

add_library(sha3 STATIC
        ${sha3_src}
        )

set_target_properties(sha3 PROPERTIES ARCHIVE_OUTPUT_DIRECTORY "${CMAKE_BINARY_DIR}/Obj")
