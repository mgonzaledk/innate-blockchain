//
// Created by Miguel Ángel on 04/10/2019.
//

#ifndef INNATE_BLOCKCHAIN_CXX_BLOCK_H
#define INNATE_BLOCKCHAIN_CXX_BLOCK_H

#include <iostream>

template<typename T> class Serializer;

class Block {
private:
    std::string hash;
    std::string previousHash;
    int difficulty = 0;

public:
    Block();
    Block(const std::string &hash, const std::string &previousHash, int difficulty);

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
};

#endif // INNATE_BLOCKCHAIN_CXX_BLOCK_H
