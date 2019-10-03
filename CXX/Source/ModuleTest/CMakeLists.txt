add_library (module-test STATIC
    test.cpp
)

set_target_properties(module-test PROPERTIES ARCHIVE_OUTPUT_DIRECTORY "${CMAKE_BINARY_DIR}/Obj")
