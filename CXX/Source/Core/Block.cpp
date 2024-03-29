//
// Created by Miguel Ángel on 04/10/2019.
//

#include <Core/Block.hpp>
#include <Serialization/Serializer.hpp>
#include <Util/Time.hpp>

Block::Block(std::uint64_t index, std::string hash, std::string previousHash, Timestamp timestamp, std::string data,
     std::uint64_t difficulty, std::uint64_t nonce) :
     index(index), hash(hash), previousHash(previousHash), timestamp(timestamp), data(data), difficulty(difficulty),
     nonce(nonce) {}

Block Block::CreateGenesis() {
    std::uint64_t index = 0;
    std::string hash;
    std::string previousHash("GENESIS");
    Timestamp timestamp = Time::Parse("2019-10-20T20:00:00");
    std::string data("GENESIS.BLOCK.0");
    std::uint64_t difficulty = 0;
    std::uint64_t nonce = 0;

    return Block(index, hash, previousHash, timestamp, data, difficulty, nonce);
}

Block Block::Create(std::uint64_t index, const std::string &previousHash, const Timestamp &timestamp,
    const std::string &data, std::uint64_t difficulty, std::uint64_t nonce) {

}

std::string Block::getHash() const {
    return this->hash;
}

std::string Block::getPreviousHash() const {
    return this->previousHash;
}

int Block::getDifficulty() const {
    return this->difficulty;
}
