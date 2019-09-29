# -----------------------------------------------------------------------------
# Proyecto: innate-blockchain.
# -----------------------------------------------------------------------------

cmake_minimum_required(VERSION 3.10.2)
project(innate-blockchain VERSION 1.0 LANGUAGES CXX)

# -----------------------------------------------------------------------------
# Dependencias.
# -----------------------------------------------------------------------------

include(GNUInstallDirs)

find_package(OpenSSL)
add_library(openssl SHARED IMPORTED)
set_property(TARGET openssl PROPERTY INTERFACE_INCLUDE_DIRECTORIES ${OPENSSL_INCLUDE_DIR})
set_property(TARGET openssl PROPERTY IMPORTED_LOCATION ${OPENSSL_SSL_LIBRARY})
