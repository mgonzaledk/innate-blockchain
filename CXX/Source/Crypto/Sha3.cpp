//
// Created by Miguel Ángel on 07/10/2019.
//

#include "Crypto/Sha3.hpp"

Sha3::Sha3_256_Result Sha3::Sha3_256(const std::string &string) {
    Sha3::Sha3_256_Result result;
    std::byte bytes[32];

    sha3_256(
            (const unsigned char *)string.c_str(),
            string.length(),
            (unsigned char *)bytes
    );

    std::move(std::begin(bytes), std::end(bytes), result.begin());
    return result;
}
