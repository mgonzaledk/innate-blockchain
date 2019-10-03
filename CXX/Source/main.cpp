#include <iostream>

#include <Util/Time.hpp>

int main(int argc, char **argv) {
    Timestamp now = Time::Now();
    std::string nowStr = Time::Format(now);
    Timestamp nowParsed = Time::Parse(nowStr);
    std::string nowParsedStr = Time::Format(nowParsed);

    std::cout << now << "\n";
    std::cout << nowStr << "\n";
    std::cout << nowParsed << "\n";
    std::cout << nowParsedStr << "\n";

    std::cout << Time::Difference(now, nowParsed) << "\n";
    std::cout << Time::Difference(nowStr, nowParsedStr) << "\n";

    return 0;
}
