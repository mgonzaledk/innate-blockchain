#include <ModuleTest/test.hpp>

#include <main.hpp>

int main(int argc, char **argv) {
    ModuleTest testA;

    testA.foo();

    program::foo();

    return 0;
}
