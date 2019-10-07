//
// Created by Miguel Ángel on 04/10/2019.
//

#include <Blockchain/Block.hpp>
#include <Serialization/Serializer.hpp>

Block::Block() :
    hash(""), previousHash(""), difficulty(0) {}

Block::Block(const std::string &hash, const std::string &previousHash, int difficulty) :
    hash(hash), previousHash(previousHash), difficulty(difficulty) {}

std::string Block::getHash() const {
    return this->hash;
}

std::string Block::getPreviousHash() const {
    return this->previousHash;
}

int Block::getDifficulty() const {
    return this->difficulty;
}
