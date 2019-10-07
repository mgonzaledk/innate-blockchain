//
// Created by Miguel Ángel on 03/10/2019.
//

#ifndef INNATE_BLOCKCHAIN_CXX_TIME_H
#define INNATE_BLOCKCHAIN_CXX_TIME_H

#include <ctime>
#include <string>

#include <boost/date_time/posix_time/posix_time.hpp>

typedef boost::posix_time::ptime Timestamp;

class Time {
private:
    Time() {}

public:
    static Timestamp Now();
    static Timestamp Parse(const std::string &text);
    static std::string Format(const Timestamp &timestamp);
    static int Difference(const Timestamp &first, const Timestamp &second);
    static int Difference(const std::string &first, const std::string &second);
};

#endif //INNATE_BLOCKCHAIN_CXX_TIME_H
