//
// Created by Miguel Ángel on 04/10/2019.
//

#ifndef INNATE_BLOCKCHAIN_CXX_BLOCK_H
#define INNATE_BLOCKCHAIN_CXX_BLOCK_H

#include <cstdint>
#include <iostream>

#include <Util/Time.hpp>

template<typename T> class Serializer;

class Block {
private:
    std::uint64_t index;
    std::string hash;
    std::string previousHash;
    Timestamp timestamp;
    std::string data;
    std::uint64_t difficulty;
    std::uint64_t nonce;

    Block(std::uint64_t index, std::string hash, std::string previousHash, Timestamp timestamp,
        std::string data, std::uint64_t difficulty, std::uint64_t nonce);

public:
    static Block Create(std::uint64_t index, const std::string &previousHash, const Timestamp &timestamp,
        const std::string &data, std::uint64_t difficulty, std::uint64_t nonce);
    static Block CreateGenesis();

    std::string getHash() const;
    std::string getPreviousHash() const;
    int getDifficulty() const;

    bool operator==(const Block &block) const {
        return hash == block.hash;
    }

    bool operator!=(const Block &block) const {
        return !(*this == block);
    }

    friend class Serializer<Block>;

    friend std::ostream &operator<<(std::ostream &os, const Block &obj) {
        os  << " Block " << obj.index << std::endl
            << "\tHash: " << obj.hash << std::endl
            << "\tPrev. hash: " << obj.previousHash << std::endl
            << "\tTimestamp: " << obj.timestamp << std::endl
            << "\tData: " << obj.data << std::endl
            << "\tDifficulty: " << obj.difficulty << std::endl
            << "\tNonce: " << obj.nonce;

        return os;
    }
};

#endif // INNATE_BLOCKCHAIN_CXX_BLOCK_H
