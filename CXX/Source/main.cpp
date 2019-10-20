#include <fstream>
#include <iostream>
#include <tuple>

#include <Core/Block.hpp>
#include <Crypto/Ed25519.hpp>
#include <Serialization/Serializer.hpp>

int main(int argc, char **argv) {
    Ed25519::KeyPair pair = Ed25519::CreateKeyPair();
    Ed25519::Signature sign = Ed25519::CreateSignature("test", pair);

    if(Ed25519::VerifySignature("test", sign, pair.first)) {
        std::cout << "Firma correcta" << std::endl;
    } else {
        std::cout << "Firma incorrecta" << std::endl;
    }

    Block block0 = Block::CreateGenesis();
    std::ofstream out("block0.bin", std::ios::binary);

    if(out.is_open()) {
        Serializer<std::string>::Serialize(out, "HOLA");
        Serializer<Block>::Serialize(out, block0);
        out.close();
    }

    std::ifstream in("block0.bin", std::ios::binary);

    if(in.is_open()) {
        std::cout << Serializer<std::string>::Deserialize(in) << std::endl;
        std::cout << Serializer<Block>::Deserialize(in) << std::endl;
        in.close();
    }

    return 0;
}
