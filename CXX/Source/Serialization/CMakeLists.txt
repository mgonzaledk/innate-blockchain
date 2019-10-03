add_library (serialization STATIC
    Dummy.cpp
)

set_target_properties(serialization PROPERTIES ARCHIVE_OUTPUT_DIRECTORY "${CMAKE_BINARY_DIR}/Obj")
