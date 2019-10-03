//
// Created by Miguel Ángel on 03/10/2019.
//

#ifndef INNATE_BLOCKCHAIN_CXX_PROPERTY_H
#define INNATE_BLOCKCHAIN_CXX_PROPERTY_H

template<typename Class, typename T>
struct PropertyImpl {
    constexpr PropertyImpl(T Class::*member, const char *name) :
        member {member}, name {name} {}

    using Type = T;

    T Class::*member;
    const char *name;
};

template<typename Class, typename T>
constexpr auto property(T Class::*member, const char *name) {
    return PropertyImpl<Class, T>{member, name};
}

#endif //INNATE_BLOCKCHAIN_CXX_PROPERTY_H
