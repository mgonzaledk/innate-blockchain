#include <iostream>
#include <boost/date_time/posix_time/posix_time.hpp>
#include <boost/date_time/date_facet.hpp>

#include <Util/Time.hpp>

constexpr const char *TIME_FORMAT = "%Y-%m-%dT%H:%M:%SZ";

Timestamp Time::Now() {
    boost::posix_time::ptime const now = boost::posix_time::second_clock::local_time();

    return now;
}

Timestamp Time::Parse(const std::string &date) {
    Timestamp timestamp;
    std::stringstream stream(date);

    boost::posix_time::time_input_facet *facet = new boost::posix_time::time_input_facet();
    facet->format(TIME_FORMAT);

    stream.imbue(std::locale(std::locale::classic(), facet));
    stream >> timestamp;

    return timestamp;
}

std::string Time::Format(const Timestamp &timestamp) {
    // Doc: https://stackoverflow.com/a/22990112

    std::stringstream stream;

    boost::posix_time::time_facet *facet = new boost::posix_time::time_facet();
    facet->format(TIME_FORMAT);

    stream.imbue(std::locale(std::locale::classic(), facet));
    stream << timestamp;

    return stream.str();
}

int Time::Difference(const boost::posix_time::ptime &first, const boost::posix_time::ptime &second) {
    return (second - first).total_seconds();
}

int Time::Difference(const std::string &first, const std::string &second) {
    Timestamp firstTimestamp, secondTimestamp;

    firstTimestamp = Time::Parse(first);
    secondTimestamp = Time::Parse(second);

    return Time::Difference(firstTimestamp, secondTimestamp);
}
