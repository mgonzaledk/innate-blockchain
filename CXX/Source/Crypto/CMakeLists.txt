add_library(crypto STATIC
    Crypto.cpp
    Ed25519.cpp
)

set_target_properties(crypto PROPERTIES ARCHIVE_OUTPUT_DIRECTORY "${CMAKE_BINARY_DIR}/Obj")
