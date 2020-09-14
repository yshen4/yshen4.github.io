# Java 0 to 1

This document is to help AP Computer science students practice and improve coding skills.

## Data types

### Primitive types

Java supports several primitive data types: byte (8 bits), short (16 bits), int (32 bits), long (64 bits), char (16 bits unicode), float (32 bits), double (64 bits), boolean (size isn't defined), 

Although String isn't primitive data type, it is supported as just like primitive.

Variables of primitive data types need to be initialized:
- class fields variables will be initialized to default values if not initialized;
- local variables have to be initialized before use, otherwise, it will throw compiler error. 

#### Check a number is odd, even, primary etc

Write a math class, which provide 3 static functions:
- isOdd(integer a);
- isEven(integer a);
- isPrimary(integer a);

Test:

```
Math.isOdd(5): true
Math.isEven(0): true
Math.isPrimary(2): true
```

### String types

### Tenary operator

### switch

## Array

### Iterator, for, and while

### Score increase

Given an array of scores, return true if each score is equal or greater than the one before. The array will be length 2 or more.

Test:

```
scoresIncreasing([1, 3, 4]) → true
scoresIncreasing([1, 3, 2]) → false
scoresIncreasing([1, 1, 4]) → true
```

Example:

<details><summary>CLICK ME</summary>
<p>

#### yes, even hidden code blocks!

```python
print("hello world!")
```

</p>
</details>

Solution:
<details>
<summary markdown='span'>
  Click to show code
</summary>

<p>

```java
class ArrayUtils {
  public static boolean scoresIncreasing(final List<int> data) {
    for(int i = 1; i < data.size(); ++i) {
      if (data[i] < data[i-1]) return false;
    }
    return true;
  }

  public static void main(String[] args) {
    System.out.printf("scoresIncreasing([%s]) -> %b", data, scoresIncreasing(data));
  }
}
```

</p>
</details>

### Score the same

Given an array of scores, return true if there are scores of X more than once in the array. 

Test:

```
scoresSame(null) → false
scoresSame([]) → false
scoresSame([1]) → false
scoresSame([1, 100, 101]) → falue
scoresSame([1, 5, 99, 5, 100, 8, 100]) → true
scoresSame([100, 1, 2, 3, 4, 5, 99, 100]) → false
```

## Score clump

Given an array of scores sorted in increasing order and step, return true if the array contains 3 adjacent scores that differ from each other <= step, such as with {3, 4, 5} or {3, 4, 4} for step = 1, {3, 5, 7} or {3, 5, 5} for step=2.

```
scoresClump([3, 4, 5], 1) → true
scoresClump([3, 4, 6], 1) → false
scoresClump([1, 3, 5, 5], 2) → true
```

## Class and interface

### Define and implement an interface

### Define and extend a class

### Abstract class

### Override a class method

## Reference
1. [Java for AP Computer Science A](https://secure-media.collegeboard.org/digitalServices/pdf/ap/ap-computer-science-a-java-subset.pdf) 
2. [Java bat](https://codingbat.com/java/AP-1)
3. [Jave review](https://runestone.academy/runestone/books/published/apcsareview/index.html)
4. [Collegeboard AP CSA](https://apstudents.collegeboard.org/courses/ap-computer-science-a/assessment)
