//
// Created by Miguel Ángel on 20/10/2019.
//

#ifndef CXX_SIZE_HPP
#define CXX_SIZE_HPP

namespace Size {
    constexpr const std::size_t hash = 32;
    constexpr const std::size_t digest = 32;
    constexpr const std::size_t seed = 32;
    constexpr const std::size_t publickey = 32;
    constexpr const std::size_t privatekey = 32 << 1;
    constexpr const std::size_t signature = 32 << 1;
};

#endif //CXX_SIZE_HPP
