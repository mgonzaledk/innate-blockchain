file(GLOB ed25519_src
    "*.h"
    "*.c"
)

add_library(ed25519 STATIC
    ${ed25519_src}
)

set_target_properties(ed25519 PROPERTIES ARCHIVE_OUTPUT_DIRECTORY "${CMAKE_BINARY_DIR}/Obj")
