//
// Created by Miguel Ángel on 07/10/2019.
//

#include "Crypto/Ed25519.hpp"
#include "Crypto/Sha3.hpp"
#include "Size.hpp"

Ed25519::Seed Ed25519::CreateSeed() {
    Ed25519::Seed seed;

    ed25519_create_seed((unsigned char *)seed.data());

    return seed;
}

Ed25519::Seed Ed25519::CreateSeed(const std::string &phrase) {
    return static_cast<Ed25519::Seed>(Sha3::Sha3_256(phrase));
}

Ed25519::KeyPair Ed25519::CreateKeyPair() {
    return Ed25519::CreateKeyPair(std::move(Ed25519::CreateSeed()));
}

Ed25519::KeyPair Ed25519::CreateKeyPair(const Ed25519::Seed &seed) {
    Ed25519::PublicKey publicKey;
    Ed25519::PrivateKey privateKey;

    ed25519_create_keypair(
            (unsigned char *)publicKey.data(),
            (unsigned char *)privateKey.data(),
            (const unsigned char *)seed.data()
    );

    return std::make_pair(publicKey, privateKey);
}

Ed25519::Signature Ed25519::CreateSignature(const std::string &data, const Ed25519::KeyPair &pair) {
    Ed25519::Signature signature;

    ed25519_sign(
            (unsigned char *)signature.data(),
            (const unsigned char *)data.c_str(),
            data.length(),
            (const unsigned char *)pair.first.data(),
            (const unsigned char *)pair.second.data()
    );

    return signature;
}

bool Ed25519::VerifySignature(const std::string &data, const Ed25519::Signature &sign,
        const Ed25519::PublicKey &publicKey) {
    return ed25519_verify(
            (const unsigned char *)sign.data(),
            (const unsigned char *)data.c_str(),
            data.length(),
            (const unsigned char *)publicKey.data()
    );
}
