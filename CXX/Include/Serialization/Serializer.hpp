//
// Created by Miguel Ángel on 04/10/2019.
//

#ifndef INNATE_BLOCKCHAIN_CXX_SERIALIZER_H
#define INNATE_BLOCKCHAIN_CXX_SERIALIZER_H

#include <cassert>
#include <cstddef>
#include <fstream>
#include <memory>
#include <vector>

#include <Core/Block.hpp>
#include <Util/Time.hpp>

template<typename T>
struct Serializer {
    static void Serialize(std::ofstream &out, const T &object) {
        static_assert(std::is_trivially_copyable_v<T>, "Serialize::is_trivially_copyable_v");
        static_assert(!std::is_pointer_v<T>, "!Serialize::is_pointer_v");
        static_assert(!std::is_array_v<T>, "!Serialize::is_array_v");

        out.write(reinterpret_cast<const char *>(&object), sizeof(object));
    }

    static T Deserialize(std::ifstream &in) {
        static_assert(std::is_trivially_copyable_v<T>, "Serialize::is_trivially_copyable_v");

        T object;
        in.read(reinterpret_cast<char *>(&object), sizeof(object));

        return object;
    }
};

template<typename T>
struct Serializer<T *> {
    static void Serialize(std::ofstream &out, const T *const &object, std::size_t length) {
        static_assert(std::is_trivially_copyable_v<T>, "Serialize::is_trivially_copyable_v");

        out.write(reinterpret_cast<const char *>(object), sizeof(T) * length);
    }

    static T *Deserialize(std::ifstream &in, std::size_t length) {
        static_assert(std::is_trivially_copyable_v<T>, "Serialize::is_trivially_copyable_v");

        // TODO: This produces a leak.
        auto objects = std::make_unique<T[]>(length);
        
        T *object = objects.release();
        in.read(reinterpret_cast<char *>(object), sizeof(T) * length);
        
        return object;
    }
};

template<typename T>
struct Serializer<std::vector<T>> {
    static void Serialize(std::ofstream &out, const std::vector<T> &vector) {
        Serializer<unsigned int>::Serialize(out, vector.size());

        for(const T &object : vector) {
            Serializer<T>::Serialize(out, object);
        }
    }

    static std::vector<T> Deserialize(std::ifstream &in) {
        auto size = Serializer<unsigned int>::Deserialize(in);
        auto vector = std::vector<T>();
        vector.reserve(size);
        
        for(unsigned int i = 0; i < size; ++i) {
            vector.push_back(Serializer<T>::Deserialize(in));
        }
        
        return vector;
    }
};

template<>
struct Serializer<std::string> {
    static void Serialize(std::ofstream &out, const std::string &string) {
        Serializer<std::size_t>::Serialize(out, string.length());
        Serializer<const char *>::Serialize(out, string.data(), string.length());
    }

    static std::string Deserialize(std::ifstream &in) {
        std::size_t length = Serializer<std::size_t>::Deserialize(in);
        char *data = Serializer<char *>::Deserialize(in, length);

        return std::string(data, length);
    }
};

/*! ===========================================================================
 *  USER CLASSES.
 *  ======================================================================= !*/

template<>
class Serializer<Block> {
public:
    static void Serialize(std::ofstream &out, const Block &block) {
        Serializer<std::uint64_t>::Serialize(out, block.index);
        Serializer<std::string>::Serialize(out, block.hash);
        Serializer<std::string>::Serialize(out, block.previousHash);
        Serializer<Timestamp>::Serialize(out, block.timestamp);
        Serializer<std::string>::Serialize(out, block.data);
        Serializer<std::uint64_t>::Serialize(out, block.difficulty);
        Serializer<std::uint64_t>::Serialize(out, block.nonce);
    }

    static Block Deserialize(std::ifstream &in) {
        auto index = Serializer<std::uint64_t>::Deserialize(in);
        auto hash = Serializer<std::string>::Deserialize(in);
        auto previousHash = Serializer<std::string>::Deserialize(in);
        auto timestamp = Serializer<Timestamp>::Deserialize(in);
        auto data = Serializer<std::string>::Deserialize(in);
        auto difficulty = Serializer<std::uint64_t>::Deserialize(in);
        auto nonce = Serializer<std::uint64_t>::Deserialize(in);

        return Block(index, hash, previousHash, timestamp, data, difficulty, nonce);
    }
};

#endif //INNATE_BLOCKCHAIN_CXX_SERIALIZER_H
