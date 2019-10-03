cmake_minimum_required(VERSION 3.2)

project(innate-blockchain-cxx)

set(CMAKE_CXX_STANDARD 17)
set(CMAKE_CXX_STANDARD_REQUIRED ON)
set(CMAKE_CXX_EXTENSIONS OFF)

set(CMAKE_RUNTIME_OUTPUT_DIRECTORY         ${CMAKE_SOURCE_DIR}/Build                    )
set(CMAKE_RUNTIME_OUTPUT_DIRECTORY_RELEASE ${CMAKE_RUNTIME_OUTPUT_DIRECTORY}/Release/Bin)
set(CMAKE_RUNTIME_OUTPUT_DIRECTORY_DEBUG   ${CMAKE_RUNTIME_OUTPUT_DIRECTORY}/Debug/Bin  )

include_directories(${CMAKE_CURRENT_LIST_DIR}/Include)

# =============================================================================
# Dependencias
# =============================================================================

# Boost
find_package(Boost COMPONENTS system log thread program_options date_time REQUIRED)

add_library(boost INTERFACE IMPORTED)
set_property(TARGET boost PROPERTY
    INTERFACE_INCLUDE_DIRECTORIES ${Boost_INCLUDE_DIR}
)

add_library(boost-system SHARED IMPORTED)
set_property(TARGET boost-system PROPERTY INTERFACE_INCLUDE_DIRECTORIES ${Boost_INCLUDE_DIRS})
set_property(TARGET boost-system PROPERTY IMPORTED_LOCATION ${Boost_SYSTEM_LIBRARY})

add_library(boost-programoptions SHARED IMPORTED)
set_property(TARGET boost-programoptions PROPERTY INTERFACE_INCLUDE_DIRECTORIES ${Boost_INCLUDE_DIRS})
set_property(TARGET boost-programoptions PROPERTY IMPORTED_LOCATION ${Boost_PROGRAM_OPTIONS_LIBRARY})

# OpenSSL
find_package(OpenSSL)
add_library(openssl SHARED IMPORTED)
set_property(TARGET openssl PROPERTY INTERFACE_INCLUDE_DIRECTORIES ${OPENSSL_INCLUDE_DIR})
set_property(TARGET openssl PROPERTY IMPORTED_LOCATION ${OPENSSL_SSL_LIBRARY})

# Threads
set(THREADS_PREFER_PTHREAD_FLAG ON)
find_package(Threads REQUIRED)

# JSON CPP
find_package(jsoncpp)

# =============================================================================
# Subdirectorio de los módulos
# =============================================================================

add_subdirectory(Source)
