# Modern C++ basics

C++ has undergone significant changes since 2011. Although it is still one of the most difficult language, it becomes more dynamic, user friendly, and rich with modern features.

## iterator

The Iterator is one of the twenty-three well-known GoF design patterns, which:
- access and traverse the elements of an aggregate object without exposing its representation
- define traversal operations for an aggregate object without changing its interface

Iterator plays a critical role in C++ STL and its [algorithm](http://www.cplusplus.com/reference/algorithm/) library.

```c++
//tested on cpp.sh
#include <iostream>
#include <array>
#include <algorithm>

using namespace std;

int main()
{
    std::array<long, 5> numbers = {2, 1, 4, 3, 5};

    cout << "Is it sorted? " << is_sorted(numbers.begin(), numbers.end()) << endl;

    // sort acending
    sort(numbers.begin(), numbers.end());
    /*
    // sort descending
    sort(numbers.begin(), numbers.end(), [](auto a, auto b) {
        return a > b;
    });
    */    
    for_each(numbers.begin(), numbers.end(), [](auto v) { 
        cout << v << endl; 
    });

    cout << "Is it sorted? " << is_sorted(numbers.begin(), numbers.end()) << endl;
    cout << "Total elements: " << distance(numbers.begin(), numbers.end()) << endl; 
}
```
Reference
- [Iterator pattern](https://en.wikipedia.org/wiki/Iterator_pattern)
- [C++ iterator](http://www.cplusplus.com/reference/iterator/)

## initialization

## auto

## Init statements inside if & switch

## smart pointers

## lambda expression

## C++ algorithm lib

## Reference
1. [Some awesome C++ features that every developer should know](https://www.freecodecamp.org/news/some-awesome-modern-c-features-that-every-developer-should-know-5e3bf6f79a3c/)
2. [Modern C++ features](https://github.com/AnthonyCalandra/modern-cpp-features)
