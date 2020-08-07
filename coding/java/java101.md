# Java 101

This document is to list Java basics in developing data intensive applications.

For each item, we will discuss the problem, the context, options, and the solution.

## Language 101

### Tenary operator vs switch
- Problem: Nested ternary operators

The ternary operator is a substitute for an if-else statement, in which the ternary operator shortens the if-else statement into a single line. 
However, we can nest ternary operators like if-else statements, which is overly used and becomes unreadable and difficult to understand.

Here is an example with nested ternary operators:
```
int i = 5;
String result = i == 0 ? "a" : i == 1 ? "b" : i == 2 ? "c" : i == 3 ? "d" : "e";
```

- Options: use switch or if/else

While if/else is an option, switch/case is much easier to follow

What's more, switch (TableSwitch or LookupSwitch) are faster than if/else if there are more than 2 cases. While it isn't significant for most of applications, for data intensive application, it can become significant contributor to the latency. 

- Solution: prefer switch/case

Refactor with switch/case
```
int i = 5;

String result = null;
switch(i) {
case 0:
  result = "a"; break;
case 1:
  result = "b"; break;
case 2:
  result = "c"; break;
case 3:
  result = "d"; break;
default:
  result = "e"; break;
}
```

### Reference

1. [Plantir Java coding standard](https://github.com/palantir/gradle-baseline/blob/develop/docs/best-practices/java-coding-guidelines/readme.md#use-ternary-operators-sparingly)
2. [Conditionals — If-Else vs Ternary Operator vs Switch-Case](https://medium.com/swlh/conditionals-if-else-vs-ternary-operator-vs-switch-case-b4f3ed08e1e3)
3. [Why switch is faster than if](https://stackoverflow.com/questions/6705955/why-switch-is-faster-than-if)

## Set complexity

- Problem: do Java Set operators have O(1) complexity? 

- Analysis:
Set provides interface for a collection of unique elements. Java provides 6 implmentations of Set: HashSet, LinkedHashSet, EnumSet, TreeSet, CopyOnWriteArraySet, and ConcurrentSkipListSet.

Implementation | add | remove | contains
-------------- | ---- | ------ | --------
HashSet        |O(1) |O(1)    |O(1)
LinkedHashSet  |O(1) |O(1)    |O(1)
EnumSet        |O(1) |O(1)    |O(1)
TreeSet        | O(logn) | O(logn) | O(logn)
ConcurrentSkipListSet | O(logn) | O(logn) | O(logn)
CopyOnWriteArraySet | O(n) | O(n) | O(n)

When selecting set for data intensive logic, the computing complexity matters. 

There are other sutle cases worthy attension:

```
String[] items = new String[]{"One", "Two", "Three", "Four", "Five"};
Set<String> mySet = Arrays.stream(items).collect(Collectors.toSet());
```

Usually, Collectors.toSet() returns HashSet, therefore mySet has O(1) complexity. However from Javadoc:
> Returns a Collector that accumulates the input elements into a new Set. 
> There are no guarantees on the type, mutability, serializability, or thread-safety of the Set returned; 
> if more control over the returned Set is required, use toCollection(java.util.function.Supplier).

- Solution: explicitly choose Set implementation

The safer bet is to change the above code to HashSet:

```
String[] items = new String[]{"One", "Two", "Three", "Four", "Five"};
Set<String> mySet = Arrays.stream(items).collect(Collectors.toCollection(HashSet::new));
```

### How is HashSet implemented?

HashSet is implemented with HashMap, in which add calls HashMap.put function, remove calls HashMap.remove function, and contains calls HashMap.containsKey function. In HashMap, put function calls key's hashCode() function. However, when the map has the key hashcode, it will call key's equals function to check if those 2 are equal. In the case of conflict, the data is saved in a linked list, in that case the complexity becomes O(n). For more details, refer to [1].

Here are a summary of hashCode() for common Java data types:

Data Type | Hashcode
--------- | --------
Integer   | value
Boolean   | value ? 1231 : 1237
Long      | (int)(value ^ (value >>> 32))
Float     | floatToRawIntBits
Double    | long bits = doubleToLongBits(value); (int)(bits ^ (bits >>> 32))
String    | h = 31 * h + val[i] for i from 0 to string length

### Reference
1. [OpenJDK hashmap implemention](http://hg.openjdk.java.net/jdk8/jdk8/jdk/file/687fd7c7986d/src/share/classes/java/util/HashMap.java)
2. [OpenJDK String](http://hg.openjdk.java.net/jdk8/jdk8/jdk/file/687fd7c7986d/src/share/classes/java/lang/String.java)


## String.equals complexity

- Problem: is String.equals complexity O(1) or O(n)?
Unlike C/C++ development, many Java developers use String.equals without thinking about its complexity. It is fine for normal applications, for data intensive applications, it can cause latency hard to identify. 

- Analysis:
OpenJDK has the following [implementation](http://hg.openjdk.java.net/jdk8/jdk8/jdk/file/687fd7c7986d/src/share/classes/java/lang/String.java)
```
public boolean equals(Object anObject) {
    if (this == anObject) {
         return true;
    }
    if (anObject instanceof String) {
        String anotherString = (String) anObject;
        int n = value.length;
        if (n == anotherString.value.length) {
            char v1[] = value;
            char v2[] = anotherString.value;
            int i = 0;
            while (n-- != 0) {
                if (v1[i] != v2[i])
                     return false;
                i++;
            }
            return true;
        }
    }
    return false;
}
```

From the implementation, the complexity is O(n) except the following, in which the complexity is O(1):
- the strings are the same object; or
- the object checking is not a string; or
- the string lengths are different.

- Solution:
Customize class comparison functions to optimize the performance.
