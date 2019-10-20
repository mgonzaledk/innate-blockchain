add_subdirectory(Core)
add_subdirectory(Crypto)
add_subdirectory(Serialization)
add_subdirectory(Util)

add_executable(innate-blockchain main.cpp)

set_target_properties(innate-blockchain PROPERTIES RUNTIME_OUTPUT_DIRECTORY "${CMAKE_BINARY_DIR}/Bin")

target_link_libraries(innate-blockchain PRIVATE
    core
    crypto
    serialization
    util

    # External libraries.
    ed25519
    sha3
)
