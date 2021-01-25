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
- implement it: (see code)
- test it: (see code)

```

``` 
