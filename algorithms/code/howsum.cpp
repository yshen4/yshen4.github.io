#include <iostream>
#include <vector>
#include <unordered_map>
#include <iomanip>
#include <locale>

using namespace std;

namespace dp {
    /*
     Problem: check if any combination of numbers can sum up to target

     Brute force method (target: m, numbers: n):
     - Analysis: tree node is target, branch is one number, therefore tree height is m, for each node, the width is n
     - time complexity: O(n^m)
     - space complexity: O(m)
     */
    bool canSum(int target, const vector<unsigned int>& numbers) {
        if (target == 0) return true;
        if (target < 0) return false;

        for (auto num: numbers) {
            if (canSum(target - static_cast<int>(num), numbers)) return true; 
        }

        return false;
    }

    /*
     DP method (target: m, numbers: n):
     - Analysis: tree height is m, with memoization, possible width for the whole level is n 
     - time complexity: O(n*m)
     - space complexity: O(m)
     */
    bool canSumInDP(int target, const vector<unsigned int>& numbers, unordered_map<int, bool>& memo) {
        if (target == 0) return true;
        if (target < 0) return false;

        auto found = memo.find(target);
        if (found != memo.end()) return found->second;

        for (auto num: numbers) {
            int newTarget = target - static_cast<int>(num);
            if (canSumInDP(newTarget, numbers, memo)) { 
                memo[newTarget] = true;
                return memo[newTarget];
            }  
        }

        memo[target] = false;
        return memo[target];
    }

    /*
     Problem: get any combination of numbers can sum up to target

     DP method (target: m, numbers: n):
     - Analysis: tree height is m, with memoization, possible width for the whole level is n 
     - time complexity: O(n*m)
     - space complexity: O(m)
     */
    bool howSumInDP(int target, const vector<unsigned int>& numbers, unordered_map<int, bool>& memo, vector<unsigned int>& path) {
        if (target == 0) return true;
        if (target < 0) return false;

        auto found = memo.find(target);
        if (found != memo.end()) return found->second;

        for (auto num: numbers) {
            int newTarget = target - static_cast<int>(num);
            if (howSumInDP(newTarget, numbers, memo, path)) {
                path.push_back(num);
                memo[newTarget] = true;
                return memo[newTarget];
            }  
        }

        memo[target] = false;
        return memo[target];
    }

    /*
     Problem: get all combinations of numbers can sum up to target

     DP method (target: m, numbers: n):
     - Analysis: tree height is m, with memoization, possible width for the whole level is n 
     - time complexity: O(n*m)
     - space complexity: O(m)
     */
    bool allHowSumInDP(int target, const vector<unsigned int>& numbers, unordered_map<int, vector< vector<unsigned int> > >& memo) {
        if (target == 0) return true;
        if (target < 0) return false;

        auto found = memo.find(target);
        if (found != memo.end()) return !found->second.empty();

        for (auto num: numbers) {
	    vector< vector<unsigned int> > result;
            int newTarget = target - static_cast<int>(num);
            if (allHowSumInDP(newTarget, numbers, memo)) {
                auto foundNew = memo.find(newTarget);
                if (foundNew != memo.end()) {
		    for (vector<unsigned int> path: foundNew->second) {
                        vector<unsigned int> newPath(path);
			newPath.push_back(num);
		        result.push_back(newPath);
                    }
		} else {
                    result.push_back({num});
                }
            }  
            memo[target] = result;
        }
        return !memo[target].empty();
    }
}

int main() {
    cout << "can sum (7, [3, 4, 5, 7]? " << boolalpha << dp::canSum(7, {3, 4, 5, 7}) << endl;
    unordered_map<int, bool> memo7;
    cout << "can sum (300, [7, 14]? " << boolalpha << dp::canSumInDP(300, {7, 14}, memo7) << endl;
    vector<unsigned int> path7;
    cout << "can sum (7, [3, 4, 5, 7]? " << boolalpha << dp::howSumInDP(7, {3, 4, 5, 7}, memo7, path7) << endl;
    for_each(path7.rbegin(), path7.rend(), [](unsigned int n) { cout << n << ", "; } ); 
    cout << endl;

    unordered_map<int, bool> memo8;
    vector<unsigned int> path8;
    cout << "can sum (8, [3, 2, 5, 4]? " << boolalpha << dp::howSumInDP(8, {3, 2, 5, 4}, memo8, path8) << endl;
    for_each(path8.rbegin(), path8.rend(), [](unsigned int n) { cout << n << ", "; } ); 
    cout << endl;

    unordered_map<int, vector< vector<unsigned int> > > memoAll;
    cout << "can sum (8, [3, 2, 5, 4]? " << boolalpha << dp::allHowSumInDP(8, {3, 2, 5, 4}, memoAll) << endl;
    for (auto path: memoAll[8]) { 
        for_each(path.rbegin(), path.rend(), [](unsigned int n) { cout << n << ", "; } );
        cout << endl;
    } 
}
