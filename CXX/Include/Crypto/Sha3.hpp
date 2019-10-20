//
// Created by Miguel Ángel on 07/10/2019.
//

#ifndef INNATE_BLOCKCHAIN_CXX_SHA3_H
#define INNATE_BLOCKCHAIN_CXX_SHA3_H

#include <array>
#include <cstddef>
#include <string>

#include <sha3/sha3.hpp>

class Sha3 {
public:
    typedef std::array<std::byte, 32> Sha3_256_Result;

    static Sha3_256_Result Sha3_256(const std::string &string);
};

#endif //INNATE_BLOCKCHAIN_CXX_SHA3_H
