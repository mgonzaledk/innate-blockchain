add_subdirectory(Blockchain)
add_subdirectory(Crypto)
add_subdirectory(Serialization)
add_subdirectory(Util)

add_executable(innate-blockchain main.cpp Crypto/Crypto.cpp ../Include/Crypto/Crypto.hpp Crypto/Ed25519.cpp ../Include/Crypto/Ed25519.hpp)

set_target_properties(innate-blockchain PROPERTIES RUNTIME_OUTPUT_DIRECTORY "${CMAKE_BINARY_DIR}/Bin")

target_link_libraries(innate-blockchain PRIVATE
    blockchain
    crypto
    serialization
    util

    # External libraries.
    ed25519
)
