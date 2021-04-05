# Java 101

This document is to list Java basics in developing data intensive applications.

For each item, we will discuss the problem, the context, options, and the solution.

## Language 101

### Tenary operator vs switch
- Problem: Nested ternary operators

The ternary operator is a substitute for an if-else statement, in which the ternary operator shortens the if-else statement into a single line. 
However, we can nest ternary operators like if-else statements, which is overly used and becomes unreadable and difficult to understand.

Here is an example with nested ternary operators:
```java
int i = 5;
String result = i == 0 ? "a" : i == 1 ? "b" : i == 2 ? "c" : i == 3 ? "d" : "e";
```

- Options: use switch or if/else

While if/else is an option, switch/case is much easier to follow

What's more, switch (TableSwitch or LookupSwitch) are faster than if/else if there are more than 2 cases. While it isn't significant for most of applications, for data intensive application, it can become significant contributor to the latency. 

- Solution: prefer switch/case

Refactor with switch/case
```java
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

```java
String[] items = new String[]{"One", "Two", "Three", "Four", "Five"};
Set<String> mySet = Arrays.stream(items).collect(Collectors.toSet());
```

Usually, Collectors.toSet() returns HashSet, therefore mySet has O(1) complexity. However from Javadoc:
> Returns a Collector that accumulates the input elements into a new Set. 
> There are no guarantees on the type, mutability, serializability, or thread-safety of the Set returned; 
> if more control over the returned Set is required, use toCollection(java.util.function.Supplier).

- Solution: explicitly choose Set implementation

The safer bet is to change the above code to HashSet:

```java
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
```java
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
1. the strings are the same object; or
2. the object checking is not a string; or
3. the string lengths are different.

- Solution:
Customize class comparison functions to optimize the performance.

## Double checked locking is broken

For lazy initialization in a multithreaded environment, double-Checked Locking is widely cited and used as an efficient method.

Unfortunately, it did not work reliably in a platform independent way in Java without additional synchronization. C++ depends on the memory model of the processor, the reorderings performed by the compiler, and the interaction between the compiler and the synchronization library. Explicit memory barriers can be used to make it work in C++, but these barriers are not available in Java.

### Why doesn't it work?

Let's use Log as an example:
```java
public class Foo {
  private Logger logger = null;
  protected Logger getLog() {
    if (logger == null) {
      synchronized (this) {
        if (logger == null) logger = LoggerFactory.getLogger(getClass());
      }
    }
    return logger;
  }
}
```

When we build it, will get the following error:
> This method may contain an instance of double-checked locking.
> This idiom is not correct according to the semantics of the Java memory model.

There are many reasons this doesn't work. 

The most obvious reason it doesn't work is that the writes that initialize the Helper object and the write to the helper field can be done out of order. Thus, a thread which invokes getLog() could see a non-null reference to a logger object, but see the default values for fields of the logger object, rather than the values set in the function.

### How to fix it?

There are several ways to fix the problem in Java.
1. Use static singleton
2. Use Guice singleton
3. Use volatile keyword

In this document, we focus on option 3. In the new Java memory model(> Java 5), the system will not allow a write of a volatile to be reordered with respect to any previous read or write, and a read of a volatile cannot be reordered with respect to any following read or write

```java
public class Foo {
  private volatile Logger logger = null;
  protected Logger getLog() {
    if (logger == null) { 
      synchronized (this) { 
        if (logger == null) logger = LoggerFactory.getLogger(getClass());
      }
    }
    return logger;
  }
}
```

## Why can't we use String.hashCode to obfuscate Id?

- Problem

Hash codes can be thought of as pseudo-random numbers. Hashes are not unique, hence they are not apropriate for uniqueId, see [Birthday problem](https://en.wikipedia.org/wiki/Birthday_problem#Probability_table). The problem coming from hash code conflict is very hard to debug because it happens scarcely so hard to replicate. 

```java
String[] data = {"wws8vw", "wws8x9", "wmxy0", "wmxwn"};
Arrays.stream(data).forEach( one -> System.out.println(one + ": " + one.hashCode()) );
```
The output is: 
```
wws8vw: -774715770
wws8x9: -774715770
wmxy0: 113265337
wmxwn: 113265337
```

- Solution

A thorough solution to solve this problem is beyong a coding best practice. We may need to consider the use cases when evaluate any candidate. For example:
- Is it required to be unreversible?
- Does it have mechanism to detect conflicts?
- Can we use SHA1 or hashing methods with much less conflict probability?

Suggestions:
1. XOR
2. shuffle individual bits
3. convert to modular representation (D.Knuth, Vol. 2, Chapter 4.3.2)
4. choose 32 (or 64) overlapping subsets of bits and XOR bits in each subset (parity bits of subsets)
5. represent it in variable-length numberic system and shuffle digits
6. choose a pair of odd integers x and y that are multiplicative inverses of each other (modulo 232), then multiply by x to obfuscate and multiply by y to restore, all multiplications are modulo 232 (source: ["A practical use of multiplicative inverses" by Eric Lippert](http://ericlippert.com/2013/11/14/a-practical-use-of-multiplicative-inverses/))

### Reference
1. [The "Double-Checked Locking is Broken" Declaration](http://www.cs.umd.edu/~pugh/java/memoryModel/DoubleCheckedLocking.html) 
2. [more detailed description of compiler-based reorderings](http://gee.cs.oswego.edu/dl/cpj/jmm.html)
3. [A new Java Memory Model and Thread specification](http://www.cs.umd.edu/~pugh/java/memoryModel)

## Attaching Values to Java Enum

- Problem

Java enum type provides a type safer way to use constant values by defining a finite set of values. However, enum value alone is not suitable for human-readable strings or non-string values.

Our initial enum type Element is defined as follows, which is hard to read and understand what each enum value means.

```java
public enum Element {
    H, HE, C, O
}
```

- Solution
The enum type is a special class type in Java, we can add constructors, fields and methods as we do with other classes. Because of this, we can enhance our enum to include the values we need.

Although it's illegal to use the new operator for an enum, we can pass constructor arguments in the declaration list.

1. Enhance the enum type with readable labels

Enum supports constructor, we can achieve readability by adding a Constructor and a Final Field. With this functin, each enum value can be constructed with readonly label. We choose the label identifier instead of the name to avoid confusion with the predefined Enum.name() method.

```java
public enum Element {
    H("Hydrogen"), 
    HE("Helium"),
    C("Carbon"),
    O("Oxegen");

    public final String label;

    Element(String label) {
       this.label = label;
    }
}
```

2. Enhance the enum type with label lookup

Java provides a valueOf(String) method for all enum types, which maps the enum value string to enum value, for example "HE" to Element.HE.

To support enum lookup with label, we need to add hashMap:

```java
public enum Element {
    H("Hydrogen"), 
    HE("Helium"),
    C("Carbon"),
    O("Oxegen"),
    NIL("NoExists");

    public final String label;
    Element(String label) {
       this.label = label;
    }

    private static final Map<String, Element> mapByLabel = new HashMap<>();
    static {
        for (Element el: values()) {
            mapByLabel.put(el.label, el);
        }
    }

    Element valueOfLabel(String label) {
       if (mapByLabel.containsKey(label))
           return mapByLabel.get(label);
       else
           return NIL;
    }
}
```

3. Enhance the enum type with multiple fields

The Enum constructor can accept multiple values.

```java
public enum Element {
    H("Hydrogen", 1.0),
    HE("Helium", 4.0),
    C("Carbon", 12.0),
    O("Oxegen", 16.0),
    NIL("NoExists", 0);
    
    public final String label;
    public final double weight;
    Element(String label, double weight) {
       this.label = label;
       this.weight = weight;
    }
    
    private static final Map<String, Element> mapByLabel = new HashMap<>();
    static {
        for (Element el: values()) { 
            mapByLabel.put(el.label, el);
        }
    }
    
    public static Element valueOfLabel(String label) {
       if (mapByLabel.containsKey(label))
           return mapByLabel.get(label);
       else
           return NIL;
    }
}
```


