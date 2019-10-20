//
// Created by Miguel Ángel on 07/10/2019.
//

#ifndef INNATE_BLOCKCHAIN_CXX_ED25519_H
#define INNATE_BLOCKCHAIN_CXX_ED25519_H

#include <array>
#include <cstddef>

#include <Size.hpp>

#include <ed25519/ed25519.h>

class Ed25519 {
public:
    typedef std::array<std::byte, Size::seed> Seed;
    typedef std::array<std::byte, Size::publickey> PublicKey;
    typedef std::array<std::byte, Size::privatekey> PrivateKey;
    typedef std::pair<PublicKey, PrivateKey> KeyPair;
    typedef std::array<std::byte, Size::signature> Signature;

    static Seed CreateSeed();
    static Seed CreateSeed(const std::string &phrase);

    static KeyPair CreateKeyPair();
    static KeyPair CreateKeyPair(const Seed &seed);

    static Signature CreateSignature(const std::string &data, const KeyPair &pair);
    static bool VerifySignature(const std::string &data, const Signature &sign, const PublicKey &publicKey);
};

#endif //INNATE_BLOCKCHAIN_CXX_ED25519_H
