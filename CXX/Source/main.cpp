#include <fstream>
#include <iostream>
#include <tuple>

#include <Blockchain/Block.hpp>
#include <Crypto/Ed25519.hpp>
#include <Serialization/Serializer.hpp>
#include <Util/Time.hpp>

int main(int argc, char **argv) {
    Ed25519::KeyPair pair = Ed25519::CreateKeyPair();
    Ed25519::Signature sign = Ed25519::CreateSignature("test", pair);

    if(Ed25519::VerifySignature("test", sign, pair.first)) {
        std::cout << "Firma correcta" << std::endl;
    } else {
        std::cout << "Firma incorrecta" << std::endl;
    }

    return 0;
}
