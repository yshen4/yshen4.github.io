# Dynamic programming

## Memoization

[Memoization](https://en.wikipedia.org/wiki/Memoization) is an optimization technique used primarily to speed up computer programs by storing the results of expensive function calls and returning the cached result when the same inputs occur again. It is an important technique used in dynamic programming.

## Recipe

Step 1: Make it work
- visualize it as a tree to show its recursive problem solving structure
- implement it with recursion
- test it

Step 2: Make it efficient
- add a memoization member
- implement the base case to return memoization values
- store return values in memoization member

## Example

- Count ways to reach the n’th stair

There are n stairs, a person standing at the bottom wants to reach the top. The person can climb either 1 stair or 2 stairs at a time. Count the number of ways, the person can reach the top.

This problem is similar to grid traveller problem.

Step 1: Make it work
- viualize it: count_stairs(n) = count_stairs(n-1) + count_stairs(n-2)

Step 2: Make it efficient
- add memo to countStairs: countStairsDP(int n, unordered_map<int, long>& memo)

```c++
#include <iostream>
#include <unordered_map>

using namespace std;

namespace dp {
    long countStairs(int n) {
        if (n <= 1) return 1;
        return countStairs(n-1) + countStairs(n-2);
    }

    long countStairsDP(int n, unordered_map<int, long>& memo) {
        if (n <= 1) return 1;
        auto count = memo.find(n);
        if (count != memo.end()) {
            //cout << "Find n=" << n << ": " << count->second << endl;
            return count->second;
        }
        memo[n] = countStairsDP(n-1, memo) + countStairsDP(n-2, memo);
        return memo[n];
    }
}

int main() {
    cout << "count stairs of 1:" << dp::countStairs(1) << endl;
    cout << "count stairs of 2:" << dp::countStairs(2) << endl;
    cout << "count stairs of 3:" << dp::countStairs(3) << endl;
    cout << "count stairs of 4:" << dp::countStairs(4) << endl;
    cout << "count stairs of 5:" << dp::countStairs(5) << endl;
    cout << "count stairs of 6:" << dp::countStairs(6) << endl;
    cout << "count stairs of 7:" << dp::countStairs(7) << endl;
    cout << "count stairs of 8:" << dp::countStairs(8) << endl;
    cout << "count stairs of 9:" << dp::countStairs(9) << endl;
    cout << "count stairs of 10:" << dp::countStairs(10) << endl;

    unordered_map<int, long> memo;
    cout << "count stairs of 48:" << dp::countStairsDP(48, memo) << endl;
    cout << "count stairs of 49:" << dp::countStairsDP(49, memo) << endl;
    cout << "count stairs of 50:" << dp::countStairsDP(50, memo) << endl;
}
``` 
