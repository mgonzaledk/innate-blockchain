#include <iostream>
#include <tuple>

#include <Util/Time.hpp>
#include <Serialization/Json.hpp>

class Block {
private:
    std::string hash;
    std::string previousHash;
    int difficulty = 0;

public:
    Block() :
        hash("Prueba hash"), previousHash("Prueba previousHash"), difficulty(100) {}

    constexpr static auto properties = std::make_tuple(
            property(&Block::hash, "hash"),
            property(&Block::previousHash, "previousHash"),
            property(&Block::difficulty, "difficulty")
    );


};

int main(int argc, char **argv) {
    Block block;

    Json::Value jsonBlock = Json::ToJson(block);
    Block sameBlock = Json::FromJson<Block>(jsonBlock);

    std::cout << jsonBlock;

    return 0;
}
