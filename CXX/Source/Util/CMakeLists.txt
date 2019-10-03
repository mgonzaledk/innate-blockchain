add_library (util STATIC
    Time.cpp
)

set_target_properties(util PROPERTIES ARCHIVE_OUTPUT_DIRECTORY "${CMAKE_BINARY_DIR}/Obj")
