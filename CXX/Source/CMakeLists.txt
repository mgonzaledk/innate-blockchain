add_subdirectory(ModuleTest)

add_executable(innate-blockchain main.cpp)

set_target_properties(innate-blockchain PROPERTIES RUNTIME_OUTPUT_DIRECTORY "${CMAKE_BINARY_DIR}/Bin")

target_link_libraries(innate-blockchain PRIVATE
    module-test
)
