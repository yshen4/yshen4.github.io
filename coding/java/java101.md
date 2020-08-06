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

Therefore the safer bet is to change the above code to HashSet:

```
String[] items = new String[]{"One", "Two", "Three", "Four", "Five"};
Set<String> mySet = Arrays.stream(items).collect(Collectors.toCollection(HashSet::new));
```

