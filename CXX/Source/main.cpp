#include <fstream>
#include <iostream>
#include <tuple>

#include <Blockchain/Block.hpp>
#include <Serialization/Serializer.hpp>
#include <Util/Time.hpp>

int main(int argc, char **argv) {
    Block block("Prueba 123", "Prueba 213", 100);

    std::ofstream fd("test.bin", std::ios::binary | std::ios::trunc);

    if(fd.is_open()) {
        Serializer<Block>::Serialize(fd, block);
        fd.close();
    }

    std::ifstream fi("test.bin", std::ios::binary);
    Block block2;

    if(fi.is_open()) {
        block2 = Serializer<Block>::Deserialize(fi);
        fi.close();
    }

    std::cout << block2.getHash() << std::endl;
    std::cout << block2.getPreviousHash() << std::endl;
    std::cout << block2.getDifficulty() << std::endl;

    return 0;
}
