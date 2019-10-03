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

    std::string jsonStr1 = Json::ToString<Block>(jsonBlock);
    std::string jsonStr2 = Json::ToString<Block>(jsonBlock);
    std::string jsonStr3 = Json::ToString<Block>(jsonBlock);
    std::string jsonStr4 = Json::ToString<Block>(jsonBlock);
    Block sameBlock2 = Json::FromJson<Block>(jsonBlock);
    Json::Value jsonBlock2 = Json::ToJson(sameBlock2);
    std::string jsonStr5 = Json::ToString<Block>(jsonBlock2);

    std::cout << jsonStr1 << "\n";
    std::cout << jsonStr2 << "\n";
    std::cout << jsonStr3 << "\n";
    std::cout << jsonStr4 << "\n";
    std::cout << jsonStr5 << "\n";

    return 0;
}
