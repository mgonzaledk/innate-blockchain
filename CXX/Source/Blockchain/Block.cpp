//
// Created by Miguel Ángel on 04/10/2019.
//

#include <Blockchain/Block.hpp>
#include <Serialization/Serializer.hpp>
#include <Util/Time.hpp>

Block::Block(std::uint64_t index, std::string hash, std::string previousHash, Timestamp timestamp, std::string data,
     std::uint64_t difficulty, std::uint64_t nonce) :
     index(index), hash(hash), previousHash(previousHash), timestamp(timestamp), data(data), difficulty(difficulty),
     nonce(nonce) {}

Block Block::CreateGenesis() {
    Timestamp timestamp = Time::Parse("2019-10-01T20:00:00");
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
