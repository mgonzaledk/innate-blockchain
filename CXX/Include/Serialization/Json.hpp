//
// Created by Miguel Ángel on 03/10/2019.
//

#ifndef INNATE_BLOCKCHAIN_CXX_JSON_H
#define INNATE_BLOCKCHAIN_CXX_JSON_H

#include <map>
#include <ostream>
#include <string>
#include <tuple>

#include <Serialization/Property.hpp>

template <typename T, T... S, typename F>
constexpr void for_sequence(std::integer_sequence<T, S...>, F &&f) {
    (static_cast<void>(f(std::integral_constant<T, S>{})), ...);
}

namespace Json {
    struct Value;

    struct ValueData {
        std::map<std::string, Value> subObject;
        std::string string;
        int number = 0;
    };

    struct Value {
        ValueData data;

        Value &operator[](std::string name) {
            return data.subObject[std::move(name)];
        }

        const Value &operator[](std::string name) const {
            auto it = data.subObject.find(std::move(name));

            if(it != data.subObject.end()) {
                return it->second;
            }

            throw;
        }

        Value &operator=(std::string value) {
            data.string = value;
            return *this;
        }

        Value &operator=(double value) {
            data.number = value;
            return *this;
        }
    };

    template<typename T> T &AsAny(Value &);
    template<typename T> const T &AsAny(const Value &);

    template<>
    int &AsAny<int>(Value &value) {
        return value.data.number;
    }

    template<>
    const int &AsAny<int>(const Value &value) {
        return value.data.number;
    }

    template<>
    const std::string &AsAny<std::string>(const Value &value) {
        return value.data.string;
    }

    template<>
    std::string &AsAny<std::string>(Value &value) {
        return value.data.string;
    }

    template<typename T> T AsString(Value &value) {
        return std::move(Json::AsAny<T>(value));
    }

    template<typename T> const T AsString(const Value &value) {
        return std::move(Json::AsAny<T>(value));
    }

    template<>
    std::string AsString(Value &value) {
        std::string str("\"" + value.data.string + "\"");
        return std::move(str);
    }

    template<>
    const std::string AsString(const Value &value) {
        std::string str("\"" + value.data.string + "\"");
        return std::move(str);
    }

    template<typename T>
    T FromJson(const Json::Value &data) {
        T object;

        // Obtener el número de propiedades.
        constexpr auto properties = std::tuple_size<decltype(T::properties)>::value;

        // Iterar en secuenta sobre el índice de las propiedades.
        for_sequence(std::make_index_sequence<properties>{}, [&](auto i){
            // Obtener la propiedad.
            constexpr auto property = std::get<i>(T::properties);

            // Obtener el tipo de la propiedad.
            using Type = typename decltype(property)::Type;

            // Establecer el valor al miembro del objeto.
            object.*(property.member) = Json::AsAny<Type>(data[property.name]);
        });

        return object;
    }

    template<typename T>
    Json::Value ToJson(const T &object) {
        Json::Value data;

        // Obtener el número de propiedades.
        constexpr auto properties = std::tuple_size<decltype(T::properties)>::value;

        // Iterar en secuenta sobre el índice de las propiedades.
        for_sequence(std::make_index_sequence<properties>{}, [&](auto i){
            // Obtener la propiedad.
            constexpr auto property = std::get<i>(T::properties);

            // Establecer valor de la propiedad como el valor del miembro del objeto.
            data[property.name] = object.*(property.member);
        });

        return data;
    }

    template<typename T>
    std::string ToString(const Json::Value &value) {
        std::stringstream stream;

        // Obtener el número de propiedades.
        constexpr auto properties = std::tuple_size<decltype(T::properties)>::value;

        stream << "{";

        // Iterar en secuencia sobre el índice de las propiedades.
        for_sequence(std::make_index_sequence<properties>{}, [&](auto i){
            // Obtener la propiedad.
            constexpr auto property = std::get<i>(T::properties);

            // Obtener el tipo de la propiedad.
            using Type = typename decltype(property)::Type;

            stream << "\"" << property.name << "\"";
            stream << ":" << Json::AsString<Type>(value[property.name]);
            stream << ",";
        });

        stream.seekp(-1, std::ios_base::end);
        stream << "}";

        return stream.str();
    }
}

#endif //INNATE_BLOCKCHAIN_CXX_JSON_H
